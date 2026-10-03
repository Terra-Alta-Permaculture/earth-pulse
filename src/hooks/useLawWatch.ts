import { useEffect, useState } from 'react'
import { LAW_MILESTONES, type LawMilestone } from '../data/lawTracker'

const ENDPOINT =
  (import.meta.env.VITE_LAW_ENDPOINT as string | undefined) ?? '/api/law'

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

export interface LawWatchState {
  milestones: LawMilestone[]
  live: boolean
  updated: string | null
}

/**
 * Loads the weekly "law watch" from /api/law (Vercel Blob, written by the cron)
 * and merges it over the bundled curated milestones — live entries win on a
 * title clash, so the list stays fresh without ever going empty.
 */
export function useLawWatch(): LawWatchState {
  const [state, setState] = useState<LawWatchState>({
    milestones: LAW_MILESTONES,
    live: false,
    updated: null,
  })

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(ENDPOINT, { headers: { accept: 'application/json' } })
        if (cancelled) return
        if (!res.ok || res.status === 204) return
        const data = await res.json()
        const liveItems = (data?.milestones ?? []) as LawMilestone[]
        if (!Array.isArray(liveItems) || liveItems.length === 0) return
        const byTitle = new Map<string, LawMilestone>()
        for (const m of LAW_MILESTONES) byTitle.set(norm(m.title), m)
        for (const m of liveItems) byTitle.set(norm(m.title), m) // live wins
        const milestones = [...byTitle.values()].sort((a, b) =>
          String(b.year).localeCompare(String(a.year)),
        )
        setState({ milestones, live: true, updated: data?.week_start ?? null })
      } catch {
        /* keep the curated seed */
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
