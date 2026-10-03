import type { LiveSignal } from '../data/liveSources'
import type { DoughnutScore } from './doughnutScore'

export interface Briefing {
  greeting: string
  date: string
  sentences: string[]
}

/** Non-alarmist, non-naive closing lines, rotated by day for slight variety. */
const CLOSERS = [
  'Neither collapse nor cure — strain and repair are running at the same time, and which one wins is still being decided.',
  'The planet is not beyond saving, nor is it safe. Both things are true today.',
  'Damage and recovery are unfolding together; the gap between them is where this century turns.',
  'No single number tells the story — the honest read is a planet under pressure that is also, in places, healing.',
]

export function buildBriefing(
  signals: LiveSignal[],
  balance: number,
  doughnut?: DoughnutScore | null,
): Briefing | null {
  if (!signals.length) return null
  const by = new Map(signals.map((s) => [s.key, s]))
  const num = (v: unknown) =>
    typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, ''))
  const val = (k: string): number | null => {
    const s = by.get(k)
    if (!s) return null
    const n = num(s.value)
    return Number.isNaN(n) ? null : n
  }
  const trendWord = (k: string): string | null => {
    const s = by.get(k)
    if (!s?.history || s.history.length < 2) return null
    const a = s.history[0]
    const b = s.history[s.history.length - 1]
    if (!a) return null
    const p = ((b - a) / Math.abs(a)) * 100
    if (Math.abs(p) < 0.5) return 'roughly flat'
    const mag = Math.abs(p) < 10 ? Math.abs(p).toFixed(1) : String(Math.round(Math.abs(p)))
    return `${p > 0 ? 'up' : 'down'} ${mag}%`
  }

  const sentences: string[] = []

  // 1 — planetary balance
  const bWord =
    balance >= 60 ? 'leaning toward recovery' : balance >= 45 ? 'near equilibrium' : 'under strain'
  sentences.push(`Earth's ecological balance sits at ${balance}/100 — ${bWord}.`)

  // Doughnut: the safe & just space score, when the social data has loaded.
  if (doughnut) {
    sentences.push(
      `On the Doughnut, the world scores ${doughnut.score}/100 for a safe and just space — within ${doughnut.fullyIn} of ${doughnut.total} dimensions, and past a limit on ${doughnut.beyond}.`,
    )
  }

  // 2 — the atmosphere / greenhouse strain
  const co2 = val('co2')
  const methane = val('methane')
  const strain: string[] = []
  if (co2 != null) strain.push(`CO₂ at ${co2} ppm`)
  if (methane != null) strain.push(`methane ${methane.toLocaleString()} ppb`)
  if (strain.length) {
    const co2t = trendWord('co2')
    sentences.push(
      `The atmosphere keeps loading up — ${strain.join(' and ')}${co2t ? `, ${co2t} over ~15 years` : ''}.`,
    )
  }
  const sea = val('sea_level')
  if (sea != null) {
    const st = trendWord('sea_level')
    sentences.push(`Global sea level is ${sea} cm above the 1880 line${st ? ` and ${st}` : ' and rising'}.`)
  }

  // 3 — what's happening right now (real-time feeds)
  const eq = val('earthquakes')
  const ne = val('natural_events')
  const wf = val('wildfires')
  if (eq != null || ne != null) {
    const bits: string[] = []
    if (eq != null) bits.push(`${eq} earthquakes above M2.5 in 24 hours`)
    if (ne != null) bits.push(`${ne} active natural hazards worldwide`)
    let s = `Right now: ${bits.join(' and ')}`
    if (wf != null) s += `, including ${wf} large wildfires`
    sentences.push(s + '.')
  }

  // 4 — repair & recovery
  const hope: string[] = []
  const reElec = val('renewable_electricity')
  if (reElec != null) {
    const t = trendWord('renewable_electricity')
    hope.push(`renewables now supply ${reElec}% of the world's electricity${t ? ` (${t} in a decade)` : ''}`)
  }
  const prot = val('protected_land')
  if (prot != null) hope.push(`${prot}% of land is under protection`)
  if (by.has('ozone_recovery')) hope.push('the ozone layer is ~99% healed and on track to fully recover')
  if (hope.length) {
    sentences.push(`But repair is real too — ${hope.join('; ')}.`)
  }

  // 5 — honest closing, rotated daily
  const now = new Date()
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000,
  )
  sentences.push(CLOSERS[dayOfYear % CLOSERS.length])

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const date = now.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return { greeting, date, sentences }
}
