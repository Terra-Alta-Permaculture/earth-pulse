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

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/**
 * A warm, plain-language reading of the planet today. It is still built from the
 * live signals — but the numbers are translated into human words ("about a
 * quarter", "dozens of places") so it reads like a person, not a dashboard.
 */
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
  // direction only — we drop the exact magnitude on purpose
  const trendDir = (k: string): 'up' | 'down' | 'flat' | null => {
    const s = by.get(k)
    if (!s?.history || s.history.length < 2) return null
    const a = s.history[0]
    const b = s.history[s.history.length - 1]
    if (a == null) return null
    const p = ((b - a) / Math.abs(a)) * 100
    if (Math.abs(p) < 0.5) return 'flat'
    return p > 0 ? 'up' : 'down'
  }
  // soft quantity words for "how many, right now"
  const qty = (n: number) =>
    n < 5 ? 'a few' : n < 15 ? 'several' : n < 40 ? 'dozens of' : 'many'

  const sentences: string[] = []

  // 1 — the overall mood of the planet (no number)
  if (balance >= 60) {
    sentences.push('The planet is leaning toward recovery today — the repair is, for now, outpacing the harm.')
  } else if (balance >= 45) {
    sentences.push('The planet is holding a fragile balance today — strain and repair are running side by side.')
  } else {
    sentences.push("The planet is under real strain today, though it hasn't stopped healing itself.")
  }

  // 2 — the Doughnut, told in plain words
  if (doughnut) {
    const inWord = doughnut.fullyIn <= 3 ? 'only a few' : doughnut.fullyIn <= 7 ? 'some' : 'many'
    const beyWord = doughnut.beyond <= 3 ? 'a few' : doughnut.beyond <= 8 ? 'several' : 'many'
    sentences.push(
      `Weighed against both what people need and what the Earth can take, we're living within safe, fair limits in ${inWord} areas of life — and overshooting in ${beyWord} others.`,
    )
  }

  // 3 — the slow pressures: atmosphere & seas
  const climate: string[] = []
  if (val('co2') != null || val('methane') != null) {
    const easing = trendDir('co2') === 'down'
    climate.push(
      `the air keeps thickening with the gases that trap heat${easing ? ', though the rise is at last easing' : ', a little more each year'}`,
    )
  }
  if (val('sea_level') != null) climate.push('the seas are quietly creeping higher')
  if (climate.length) sentences.push(cap(climate.join(', and ')) + '.')

  // 4 — what's stirring right now (live feeds, in words)
  const eq = val('earthquakes')
  const ne = val('natural_events')
  const wf = val('wildfires')
  if (eq != null || ne != null) {
    const parts: string[] = []
    if (eq != null) parts.push(`the ground stirred in ${qty(eq)} places`)
    if (ne != null)
      parts.push(`${qty(ne)} natural events — storms, floods, eruptions, fires — are unfolding somewhere`)
    let s = `In just the last day, ${parts.join(', and ')}`
    if (wf != null && wf > 0) s += ', major wildfires among them'
    sentences.push(s + '.')
  }

  // 5 — the repair, also in words
  const hope: string[] = []
  const reElec = val('renewable_electricity')
  if (reElec != null) {
    const frac =
      reElec < 15
        ? 'a small but fast-growing share'
        : reElec < 28
        ? 'about a quarter'
        : reElec < 40
        ? 'roughly a third'
        : reElec < 55
        ? 'nearly half'
        : 'more than half'
    const fast = trendDir('renewable_electricity') === 'up' ? ', and climbing fast' : ''
    hope.push(`clean power now runs ${frac} of the world's electricity${fast}`)
  }
  if (val('protected_land') != null) hope.push('more land and sea is being set aside for nature')
  if (by.has('ozone_recovery')) hope.push('the ozone layer, once torn open, has nearly fully healed')
  if (hope.length) sentences.push(`And the repair is real too: ${hope.join('; ')}.`)

  // 6 — honest closing, rotated daily
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
