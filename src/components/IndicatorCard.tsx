import type { IndicatorReading } from '../lib/types'
import { trend } from '../data/snapshots'
import { compact, signedPct, relativeTime } from '../lib/format'
import { Sparkline } from './Sparkline'

interface Props {
  reading: IndicatorReading
}

const THEME = {
  crisis: { line: '#e0a852', chip: 'text-ember-200', dot: 'bg-ember-400' },
  regeneration: { line: '#79b568', chip: 'text-moss-200', dot: 'bg-moss-400' },
} as const

export function IndicatorCard({ reading }: Props) {
  const { meta, latest, unit, fetchedAt, history } = reading
  const theme = THEME[meta.stream]
  const t = trend(reading)

  // Is the movement good or bad for the planet?
  const favorable = t === null ? null : meta.higherIsBetter ? t >= 0 : t <= 0
  const trendColor =
    favorable === null
      ? 'text-sand-500'
      : favorable
        ? 'text-moss-400'
        : 'text-ember-400'

  return (
    <div className="rounded-xl border border-soil-700/60 bg-soil-800/40 p-4 transition-colors hover:border-soil-600">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-sm font-medium leading-tight text-sand-100">{meta.label}</h4>
          <p className="mt-0.5 text-[0.7rem] text-sand-500">{meta.source}</p>
        </div>
        <Sparkline
          values={history.map((h) => h.value)}
          color={theme.line}
          width={84}
          height={30}
          className="mt-0.5 flex-none"
        />
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="stat-num text-2xl text-sand-100">{compact(latest)}</span>
          <span className="text-xs text-sand-500">{unit}</span>
        </div>
        <span className={`text-xs font-medium ${trendColor}`}>
          {signedPct(t)}
          <span className="ml-1 text-[0.65rem] text-sand-700">30d</span>
        </span>
      </div>

      <p className="mt-2 text-[0.72rem] leading-snug text-sand-500">{meta.blurb}</p>

      <div className="mt-2 flex items-center gap-1.5 text-[0.65rem] text-sand-700">
        <span className={`h-1.5 w-1.5 rounded-full ${theme.dot} ${reading.stale ? 'opacity-40' : ''}`} />
        {reading.stale ? 'awaiting fresh data' : relativeTime(fetchedAt)}
      </div>
    </div>
  )
}
