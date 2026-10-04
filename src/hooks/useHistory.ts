import { useCallback, useEffect, useRef, useState } from 'react'

const ENDPOINT =
  (import.meta.env.VITE_HISTORY_ENDPOINT as string | undefined) ?? '/api/history'

export interface HistoryPoint {
  date: string
  balance?: number
  score?: number
  co2?: number
  ch4?: number
  sea?: number
  renew?: number
  protland?: number
}

export interface HistoryState {
  points: HistoryPoint[]
  live: boolean
  loading: boolean
  /** Record today's snapshot (no-op if today is already stored). */
  record: (p: Omit<HistoryPoint, 'date'>) => void
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Loads the "planet over time" series from /api/history (Vercel Blob) and,
 * once per day, appends the headline numbers the dashboard just computed.
 * The record() call is idempotent per day — the server keeps the first
 * reading of each day, so repeat visits don't pile up or overwrite.
 */
export function useHistory(): HistoryState {
  const [points, setPoints] = useState<HistoryPoint[]>([])
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(true)
  const sent = useRef(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(ENDPOINT, { headers: { accept: 'application/json' } })
        if (cancelled) return
        if (res.ok && res.status !== 204) {
          const data = await res.json()
          if (Array.isArray(data?.points)) {
            setPoints(data.points)
            setLive(true)
          }
        }
      } catch {
        /* no history yet — fine */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const record = useCallback(
    (p: Omit<HistoryPoint, 'date'>) => {
      if (sent.current) return
      // Skip if today is already the newest stored point.
      const last = points[points.length - 1]
      if (last && last.date === todayStr()) return
      // Need at least one real value worth recording.
      const hasValue = Object.values(p).some((v) => typeof v === 'number' && isFinite(v))
      if (!hasValue) return
      sent.current = true
      ;(async () => {
        try {
          const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ point: p }),
          })
          const data = await res.json().catch(() => null)
          if (data?.recorded) {
            setPoints((prev) => [...prev, { date: todayStr(), ...p }])
            setLive(true)
          }
        } catch {
          /* best-effort; a failed record just means no point today */
        }
      })()
    },
    [points],
  )

  return { points, live, loading, record }
}
