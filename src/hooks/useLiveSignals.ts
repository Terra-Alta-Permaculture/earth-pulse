import { useEffect, useState } from 'react'
import { LIVE_FETCHERS, type LiveSignal } from '../data/liveSources'

export interface LiveState {
  signals: LiveSignal[]
  loading: boolean
  lastUpdated: string | null
  refresh: () => void
}

const REFRESH_MS = 60_000 // re-pull the live feeds every minute

/**
 * Pulls all real-time signals in parallel, tolerating per-source failure, and
 * refreshes on an interval so the "live" band actually stays live.
 */
export function useLiveSignals(): LiveState {
  const [signals, setSignals] = useState<LiveSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const results = await Promise.allSettled(LIVE_FETCHERS.map((f) => f()))
      if (cancelled) return
      const ok = results
        .filter(
          (r): r is PromiseFulfilledResult<LiveSignal> =>
            r.status === 'fulfilled',
        )
        .map((r) => r.value)
      setSignals(ok)
      setLoading(false)
      setLastUpdated(new Date().toISOString())
    }

    load()
    const id = setInterval(load, REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [nonce])

  return { signals, loading, lastUpdated, refresh: () => setNonce((n) => n + 1) }
}
