import type { EarthSnapshot } from '../lib/types'
import { INDICATORS } from './indicators'

/**
 * Deterministic 30-day sample history for each indicator. Used as a fallback
 * when Supabase is not configured yet, or before the daily cron has populated
 * real data — so the dashboard is never empty. Values are plausible real-world
 * magnitudes but are clearly synthetic (seeded, smooth).
 */

// Baselines + a gentle trend so trajectories look alive but not alarmist.
const PROFILE: Record<string, { base: number; drift: number; noise: number }> = {
  forest_loss_alerts: { base: 128000, drift: 900, noise: 9000 },
  air_pm25: { base: 32, drift: 0.15, noise: 4 },
  natural_events: { base: 108, drift: 0.4, noise: 8 },
  biodiversity_obs: { base: 240000, drift: 1400, noise: 22000 },
  species_richness: { base: 41000, drift: 180, noise: 2600 },
  clean_air_sites: { base: 860, drift: 6, noise: 60 },
  forest_restoration: { base: 210, drift: 0.35, noise: 3 },
}

// Simple seeded pseudo-random so output is stable across reloads.
function seeded(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function buildSampleSnapshots(days = 30): EarthSnapshot[] {
  const rows: EarthSnapshot[] = []
  const now = Date.now()
  const dayMs = 86_400_000

  for (const ind of INDICATORS) {
    const p = PROFILE[ind.key] ?? { base: 100, drift: 0, noise: 10 }
    const rand = seeded(
      ind.key.split('').reduce((a, c) => a + c.charCodeAt(0), 7),
    )
    for (let d = days - 1; d >= 0; d--) {
      const t = days - 1 - d
      const wobble = (rand() - 0.5) * 2 * p.noise
      const raw = p.base + p.drift * t + wobble
      const value = ind.unit === 'µg/m³' || ind.unit === 'Mha'
        ? Math.max(0, Number(raw.toFixed(1)))
        : Math.max(0, Math.round(raw))
      rows.push({
        indicator_name: ind.key,
        value,
        unit: ind.unit,
        source: ind.source,
        stream: ind.stream,
        region: ind.region,
        fetched_at: new Date(now - d * dayMs).toISOString(),
      })
    }
  }
  return rows
}
