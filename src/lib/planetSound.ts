import type { LiveSignal } from '../data/liveSources'

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

interface Mapping {
  brightness: number // 0..1  → filter cutoff (balance)
  tension: number //    0..1  → dissonant beating (low balance)
  greenhouse: number //  0..1  → low pad depth (CO₂ + methane)
  regeneration: number //0..1  → bright shimmer (renewables + protected land)
  hazard: number //      0..1  → noise crackle (wildfires + events)
  quakeRateMs: number // interval between seismic pulses
  quakeVol: number //    0..1  → pulse volume
}

function readMapping(signals: LiveSignal[], balance: number): Mapping {
  const by = new Map(signals.map((s) => [s.key, s]))
  const num = (k: string): number | null => {
    const s = by.get(k)
    if (!s) return null
    const n = typeof s.value === 'number' ? s.value : parseFloat(String(s.value).replace(/,/g, ''))
    return Number.isNaN(n) ? null : n
  }
  const b = clamp01(balance / 100)
  const co2 = num('co2') ?? 420
  const methane = num('methane') ?? 1900
  const greenhouse = clamp01(((co2 - 380) / (450 - 380)) * 0.6 + ((methane - 1600) / (2000 - 1600)) * 0.4)
  const reElec = num('renewable_electricity') ?? 0
  const prot = num('protected_land') ?? 0
  const regeneration = clamp01((reElec / 60) * 0.6 + (prot / 30) * 0.4)
  const fires = num('wildfires') ?? 0
  const events = num('natural_events') ?? 0
  const hazard = clamp01((fires + events) / 160)
  const quakes = num('earthquakes') ?? 0
  const quakeVol = clamp01(quakes / 60)
  const quakeRateMs = Math.round(lerp(4200, 900, clamp01(quakes / 50)))
  return {
    brightness: b,
    tension: 1 - b,
    greenhouse,
    regeneration,
    hazard,
    quakeRateMs,
    quakeVol,
  }
}

/**
 * Ambient sonification of the live planet signals — pure Web Audio synthesis.
 * Warm & consonant when Earth is near balance; darker, denser and busier under
 * strain. An artistic rendering of the data, not a measurement.
 */
export class PlanetSoundEngine {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private filter!: BiquadFilterNode
  private tensionGain!: GainNode
  private padGain!: GainNode
  private shimmerGain!: GainNode
  private noiseGain!: GainNode
  private oscillators: OscillatorNode[] = []
  private noise: AudioBufferSourceNode | null = null
  private quakeTimer: number | null = null
  private map: Mapping
  private built = false
  private ROOT = 110 // A2

  constructor(signals: LiveSignal[] = [], balance = 50) {
    this.map = readMapping(signals, balance)
  }

  private build() {
    const AC: typeof AudioContext =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AC()
    this.ctx = ctx
    const now = ctx.currentTime

    this.master = ctx.createGain()
    this.master.gain.value = 0
    this.master.connect(ctx.destination)

    // Warm bus with a lowpass whose cutoff tracks planetary "brightness".
    this.filter = ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.value = lerp(500, 2600, this.map.brightness)
    this.filter.Q.value = 0.7
    this.filter.connect(this.master)

    const osc = (freq: number, type: OscillatorType, gain: number) => {
      const o = ctx.createOscillator()
      o.type = type
      o.frequency.value = freq
      const g = ctx.createGain()
      g.gain.value = gain
      o.connect(g)
      o.start(now)
      this.oscillators.push(o)
      return { o, g }
    }

    // Drone: root + fifth + octave (consonant bed).
    osc(this.ROOT, 'sine', 0.12).g.connect(this.filter)
    osc(this.ROOT * 1.5, 'sine', 0.08).g.connect(this.filter)
    osc(this.ROOT * 2, 'triangle', 0.05).g.connect(this.filter)

    // Tension: a slightly detuned root that beats against it when strained.
    const tension = osc(this.ROOT * 1.055, 'sine', 1)
    this.tensionGain = tension.g
    this.tensionGain.gain.value = this.map.tension * 0.07
    this.tensionGain.connect(this.filter)

    // Low pad: greenhouse load thickens the bottom end.
    const pad = osc(this.ROOT / 2, 'sawtooth', 1)
    this.padGain = pad.g
    this.padGain.gain.value = 0.03 + this.map.greenhouse * 0.12
    const padFilter = ctx.createBiquadFilter()
    padFilter.type = 'lowpass'
    padFilter.frequency.value = 220
    this.padGain.disconnect()
    this.padGain.connect(padFilter)
    padFilter.connect(this.master)

    // Shimmer: regeneration adds high harmonics — "light" in the sound.
    const sh1 = osc(this.ROOT * 3, 'sine', 1)
    const sh2 = osc(this.ROOT * 4.02, 'sine', 1)
    this.shimmerGain = ctx.createGain()
    this.shimmerGain.gain.value = this.map.regeneration * 0.05
    sh1.g.gain.value = 0.5
    sh2.g.gain.value = 0.35
    sh1.g.connect(this.shimmerGain)
    sh2.g.connect(this.shimmerGain)
    this.shimmerGain.connect(this.master)

    // Noise crackle: active fires & hazards.
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    noise.loop = true
    const nf = ctx.createBiquadFilter()
    nf.type = 'bandpass'
    nf.frequency.value = 1400
    nf.Q.value = 0.8
    this.noiseGain = ctx.createGain()
    this.noiseGain.gain.value = this.map.hazard * 0.05
    noise.connect(nf)
    nf.connect(this.noiseGain)
    this.noiseGain.connect(this.master)
    noise.start(now)
    this.noise = noise

    this.built = true
    this.scheduleQuake()
  }

  private scheduleQuake() {
    if (!this.ctx) return
    const tick = () => {
      if (!this.ctx) return
      if (this.map.quakeVol > 0.01) this.thud(this.map.quakeVol)
      this.quakeTimer = window.setTimeout(tick, this.map.quakeRateMs)
    }
    this.quakeTimer = window.setTimeout(tick, this.map.quakeRateMs)
  }

  /** A soft low seismic pulse. */
  private thud(vol: number) {
    const ctx = this.ctx!
    const now = ctx.currentTime
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(70, now)
    o.frequency.exponentialRampToValueAtTime(38, now + 0.5)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.18 * vol + 0.02, now + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9)
    o.connect(g)
    g.connect(this.master)
    o.start(now)
    o.stop(now + 1)
  }

  async start(volume: number) {
    if (!this.built) this.build()
    await this.ctx!.resume()
    const t = this.ctx!.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setValueAtTime(Math.max(0.0001, this.master.gain.value), t)
    this.master.gain.linearRampToValueAtTime(volume, t + 1.2)
  }

  async pause() {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.setValueAtTime(this.master.gain.value, t)
    this.master.gain.linearRampToValueAtTime(0.0001, t + 0.6)
    await new Promise((r) => setTimeout(r, 650))
    await this.ctx.suspend()
  }

  setVolume(volume: number) {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(t)
    this.master.gain.linearRampToValueAtTime(volume, t + 0.2)
  }

  update(signals: LiveSignal[], balance: number) {
    this.map = readMapping(signals, balance)
    if (!this.ctx || !this.built) return
    const t = this.ctx.currentTime
    const ramp = (p: AudioParam, v: number) => {
      p.cancelScheduledValues(t)
      p.linearRampToValueAtTime(v, t + 2)
    }
    ramp(this.filter.frequency, lerp(500, 2600, this.map.brightness))
    ramp(this.tensionGain.gain, this.map.tension * 0.07)
    ramp(this.padGain.gain, 0.03 + this.map.greenhouse * 0.12)
    ramp(this.shimmerGain.gain, this.map.regeneration * 0.05)
    ramp(this.noiseGain.gain, this.map.hazard * 0.05)
  }

  dispose() {
    if (this.quakeTimer) window.clearTimeout(this.quakeTimer)
    this.quakeTimer = null
    try {
      this.oscillators.forEach((o) => o.stop())
      this.noise?.stop()
    } catch {
      /* already stopped */
    }
    this.ctx?.close()
    this.ctx = null
    this.built = false
  }
}
