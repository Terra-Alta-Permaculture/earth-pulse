import { useEffect, useState } from 'react'
import type { ForceKey, WorldReading, WorldSignpost, WorldWeekly } from '../lib/types'
import { FORCES } from '../data/forces'
import {
  worldWeeklySeed,
  worldReadingsSeed,
  worldSignpostsSeed,
} from '../data/worldSeed'

export interface WorldPulseState {
  weekly: WorldWeekly | null
  latestByForce: Record<ForceKey, WorldReading | undefined>
  historyByForce: Record<ForceKey, WorldReading[]>
  signposts: WorldSignpost[]
  loading: boolean
  isSample: boolean
}

// The read endpoint backed by Vercel Blob (weekly job writes it). Overridable
// for other hosts via env.
const WORLD_ENDPOINT =
  (import.meta.env.VITE_WORLD_ENDPOINT as string | undefined) ?? '/api/world'

function group(readings: WorldReading[]) {
  const history: Record<ForceKey, WorldReading[]> = {} as Record<ForceKey, WorldReading[]>
  const latest: Record<ForceKey, WorldReading | undefined> = {} as Record<ForceKey, WorldReading | undefined>
  for (const f of FORCES) {
    history[f.key] = []
    latest[f.key] = undefined
  }
  const sorted = [...readings].sort(
    (a, b) => +new Date(a.week_start) - +new Date(b.week_start),
  )
  for (const r of sorted) {
    if (!history[r.force_key]) continue
    history[r.force_key].push(r)
    latest[r.force_key] = r
  }
  return { history, latest }
}

function seedState(): WorldPulseState {
  const { history, latest } = group(worldReadingsSeed)
  return {
    weekly: worldWeeklySeed,
    latestByForce: latest,
    historyByForce: history,
    signposts: worldSignpostsSeed,
    loading: false,
    isSample: true,
  }
}

/**
 * Loads World Pulse from /api/world (Vercel Blob, written weekly by the cron
 * job). Falls back to bundled seed data when the endpoint is unavailable, empty,
 * or errors — so the World tab always renders.
 */
export function useWorldPulse(): WorldPulseState {
  const [state, setState] = useState<WorldPulseState>(() => ({
    ...seedState(),
    loading: true,
  }))

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(WORLD_ENDPOINT, { headers: { accept: 'application/json' } })
        if (cancelled) return
        if (!res.ok || res.status === 204) {
          setState(seedState())
          return
        }
        const data = await res.json()
        const readings = (data?.readings ?? []) as WorldReading[]
        if (!Array.isArray(readings) || readings.length === 0) {
          setState(seedState())
          return
        }
        const { history, latest } = group(readings)
        // Keep the curated signpost timeline, overlaying any live additions.
        const liveSp = (data.signposts ?? []) as WorldSignpost[]
        const liveTitles = new Set(liveSp.map((s) => s.title))
        const signposts = [
          ...liveSp,
          ...worldSignpostsSeed.filter((s) => !liveTitles.has(s.title)),
        ]
        setState({
          weekly: (data.weekly ?? worldWeeklySeed) as WorldWeekly,
          latestByForce: latest,
          historyByForce: history,
          signposts,
          loading: false,
          isSample: false,
        })
      } catch {
        if (!cancelled) setState(seedState())
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
