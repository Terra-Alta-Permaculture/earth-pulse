import type { LiveSignal } from '../data/liveSources'
import { relativeTime } from '../lib/format'
import { LiveCard } from './LiveCard'

interface Props {
  signals: LiveSignal[]
  lastUpdated: string | null
  loading: boolean
}

/** Whole-earth, real-time readings that aren't neatly crisis or regeneration. */
export function VitalsStrip({ signals, lastUpdated, loading }: Props) {
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-moss-400 opacity-70 animate-pulse-ring" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-moss-400" />
          </span>
          <h2 className="font-display text-lg text-sand-100">Planetary vitals</h2>
        </div>
        <span className="text-[0.65rem] text-sand-600">
          {lastUpdated ? `live · updated ${relativeTime(lastUpdated)}` : 'connecting…'}
        </span>
      </div>

      {loading && signals.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-soil-800/40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {signals.map((s) => (
            <LiveCard key={s.key} s={s} />
          ))}
        </div>
      )}
    </section>
  )
}
