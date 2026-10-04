import { useEffect, useMemo } from 'react'
import type { LiveSignal } from '../data/liveSources'
import { resolveBoundaries } from '../data/planetaryBoundaries'
import { useSocialFoundation } from '../data/socialFoundation'
import { doughnutScore } from '../lib/doughnutScore'
import { useHistory } from '../hooks/useHistory'
import { Sparkline } from './Sparkline'
import { InfoDot } from './InfoDot'

const num = (v: unknown): number | undefined =>
  typeof v === 'number' && isFinite(v) ? v : undefined

function signalValue(signals: LiveSignal[], key: string): number | undefined {
  const s = signals.find((x) => x.key === key)
  return s ? num(s.value) : undefined
}

type MetricKey = 'balance' | 'score' | 'co2' | 'sea'

interface Metric {
  key: MetricKey
  label: string
  unit: string
  color: string
  /** Which direction counts as improvement, for the delta colour. */
  good: 'up' | 'down'
  digits: number
}

const METRICS: Metric[] = [
  { key: 'balance', label: 'Ecological balance', unit: '/100', color: '#79b568', good: 'up', digits: 0 },
  { key: 'score', label: 'Safe & just space', unit: '/100', color: '#5fa8d3', good: 'up', digits: 0 },
  { key: 'co2', label: 'CO₂', unit: 'ppm', color: '#e0a852', good: 'down', digits: 1 },
  { key: 'sea', label: 'Sea level', unit: 'cm', color: '#c98b6b', good: 'down', digits: 1 },
]

export function PlanetHistory({ signals, balance }: { signals: LiveSignal[]; balance: number }) {
  const { dims } = useSocialFoundation()
  const { points, live, loading, record } = useHistory()

  const dough = useMemo(
    () => doughnutScore(dims, resolveBoundaries(signals)),
    [dims, signals],
  )

  // Today's snapshot, drawn from the exact numbers the dashboard shows.
  const snapshot = useMemo(
    () => ({
      balance: num(balance),
      score: dough ? dough.score : undefined,
      co2: signalValue(signals, 'co2'),
      ch4: signalValue(signals, 'methane'),
      sea: signalValue(signals, 'sea_level'),
      renew: signalValue(signals, 'renewable_electricity'),
      protland: signalValue(signals, 'protected_land'),
    }),
    [balance, dough, signals],
  )

  // Record once the core numbers are ready (the hook guards against dupes/day).
  useEffect(() => {
    if (!loading && snapshot.balance != null && snapshot.co2 != null) record(snapshot)
  }, [loading, snapshot, record])

  const rows = METRICS.map((m) => {
    const series = points
      .map((p) => p[m.key])
      .filter((v): v is number => typeof v === 'number')
    const live0 = snapshot[m.key]
    const current = series.length ? series[series.length - 1] : num(live0)
    return { m, series, current }
  }).filter((r) => r.current != null)

  const haveTrend = rows.some((r) => r.series.length >= 2)

  return (
    <section className="mt-5 rounded-2xl border border-soil-700/60 bg-soil-900/40 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-xl text-sand-100">The planet over time</h2>
        <InfoDot topic="planet_history" label="The planet over time" />
      </div>
      <p className="mt-1 text-[0.85rem] text-sand-400">
        EarthPulse keeps a quiet daily record of its headline readings, so the
        direction of travel becomes visible. {live && points.length > 0
          ? `Recording since ${points[0].date}.`
          : 'Recording starts today.'}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {rows.map(({ m, series, current }) => {
          const first = series.length ? series[0] : undefined
          const delta =
            first != null && current != null && series.length >= 2 ? current - first : null
          const improving =
            delta == null ? null : m.good === 'up' ? delta >= 0 : delta <= 0
          const deltaColor = improving == null ? '#8a8f86' : improving ? '#79b568' : '#d98b6b'
          return (
            <div
              key={m.key as string}
              className="rounded-xl border border-soil-800 bg-soil-900/50 p-4"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[0.8rem] uppercase tracking-wide text-sand-500">
                  {m.label}
                </span>
                {delta != null && (
                  <span className="stat-num text-xs" style={{ color: deltaColor }}>
                    {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(m.digits)} since start
                  </span>
                )}
              </div>
              <div className="mt-1 flex items-end justify-between gap-3">
                <span className="stat-num text-2xl text-sand-100">
                  {current!.toFixed(m.digits)}
                  <span className="ml-1 text-sm text-sand-500">{m.unit}</span>
                </span>
                {series.length >= 2 ? (
                  <Sparkline values={series} color={m.color} width={130} height={32} />
                ) : (
                  <span className="text-[0.7rem] text-sand-700">building…</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {!haveTrend && (
        <p className="mt-3 text-[0.7rem] leading-snug text-sand-700">
          Trend lines appear as days accumulate — one point is saved per day the
          site is visited. Come back over the weeks to watch the lines grow. No
          database, no tracking: just these few planetary numbers, stored over time.
        </p>
      )}
    </section>
  )
}
