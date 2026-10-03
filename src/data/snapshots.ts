import type { EarthSnapshot, IndicatorReading, Stream } from '../lib/types'
import { INDICATORS } from './indicators'

const STALE_AFTER_MS = 1000 * 60 * 60 * 36 // 36h → flagged stale

/** Group raw snapshot rows into one reading per known indicator. */
export function toReadings(rows: EarthSnapshot[]): IndicatorReading[] {
  const byKey = new Map<string, EarthSnapshot[]>()
  for (const r of rows) {
    const arr = byKey.get(r.indicator_name) ?? []
    arr.push(r)
    byKey.set(r.indicator_name, arr)
  }

  return INDICATORS.map((meta) => {
    const series = (byKey.get(meta.key) ?? []).sort(
      (a, b) => +new Date(a.fetched_at) - +new Date(b.fetched_at),
    )
    const last = series[series.length - 1]
    const fetchedAt = last?.fetched_at ?? null
    const stale = fetchedAt
      ? Date.now() - +new Date(fetchedAt) > STALE_AFTER_MS
      : true
    return {
      meta,
      latest: last ? last.value : null,
      unit: meta.unit,
      fetchedAt,
      history: series.map((s) => ({ value: s.value, fetched_at: s.fetched_at })),
      stale,
    }
  })
}

/** Percent change first→last over the available window. */
export function trend(reading: IndicatorReading): number | null {
  const h = reading.history
  if (h.length < 2) return null
  const first = h[0].value
  const last = h[h.length - 1].value
  if (first === 0) return null
  return ((last - first) / Math.abs(first)) * 100
}

/**
 * A 0–100 "planetary balance" score. Each indicator's recent trend is scored as
 * favorable or unfavorable (accounting for higherIsBetter), then averaged and
 * mapped so 50 = equilibrium, >50 regeneration-leaning, <50 crisis-leaning.
 */
export function planetaryBalance(readings: IndicatorReading[]): number {
  const scores: number[] = []
  for (const r of readings) {
    const t = trend(r)
    if (t === null) continue
    // Favorable movement = positive contribution.
    const favorable = r.meta.higherIsBetter ? t : -t
    // Squash to [-1, 1] with a soft cap around ±20% change.
    scores.push(Math.max(-1, Math.min(1, favorable / 20)))
  }
  if (!scores.length) return 50
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.round((avg + 1) * 50)
}

export function streamReadings(
  readings: IndicatorReading[],
  stream: Stream,
): IndicatorReading[] {
  return readings.filter((r) => r.meta.stream === stream)
}
