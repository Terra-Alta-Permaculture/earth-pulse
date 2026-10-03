import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { EarthSnapshot, IndicatorReading } from '../lib/types'
import { toReadings } from '../data/snapshots'
import { buildSampleSnapshots } from '../data/sampleData'

export interface SnapshotState {
  readings: IndicatorReading[]
  rows: EarthSnapshot[]
  loading: boolean
  usingSample: boolean
  error: string | null
  refresh: () => void
}

const WINDOW_DAYS = 30

/**
 * Loads the last 30 days of snapshots from Supabase and shapes them into
 * per-indicator readings. Falls back to deterministic sample data when Supabase
 * is unconfigured or empty, so the dashboard always has something to show.
 */
export function useSnapshots(): SnapshotState {
  const [rows, setRows] = useState<EarthSnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [usingSample, setUsingSample] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      if (!supabase) {
        if (!cancelled) {
          setRows(buildSampleSnapshots(WINDOW_DAYS))
          setUsingSample(true)
          setLoading(false)
        }
        return
      }

      const since = new Date(
        Date.now() - WINDOW_DAYS * 86_400_000,
      ).toISOString()

      const { data, error: err } = await supabase
        .from('earth_snapshots')
        .select('*')
        .gte('fetched_at', since)
        .order('fetched_at', { ascending: true })

      if (cancelled) return

      if (err) {
        // Network / table-missing → degrade gracefully to sample data.
        setRows(buildSampleSnapshots(WINDOW_DAYS))
        setUsingSample(true)
        setError(err.message)
      } else if (!data || data.length === 0) {
        setRows(buildSampleSnapshots(WINDOW_DAYS))
        setUsingSample(true)
      } else {
        setRows(data as EarthSnapshot[])
        setUsingSample(false)
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [nonce])

  return {
    rows,
    readings: toReadings(rows),
    loading,
    usingSample,
    error,
    refresh: () => setNonce((n) => n + 1),
  }
}
