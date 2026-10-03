import type { LiveSignal } from '../data/liveSources'
import { compact, relativeTime } from '../lib/format'
import { Sparkline } from './Sparkline'
import { InfoDot } from './InfoDot'

const ACCENT = {
  crisis: { dot: 'bg-ember-400', num: 'text-ember-100', spark: '#d98f3a' },
  regeneration: { dot: 'bg-moss-400', num: 'text-moss-100', spark: '#6fae57' },
  neutral: { dot: 'bg-sand-300', num: 'text-sand-100', spark: '#b7a689' },
} as const

function fmt(v: number | string): string {
  return typeof v === 'number' ? compact(v) : v
}

/** Direction of change and whether it's good news, given the stream's meaning. */
function trend(s: LiveSignal) {
  const h = s.history
  if (!h || h.length < 3) return null
  const first = h[0]
  const last = h[h.length - 1]
  const abs = last - first
  if (first === 0 && abs === 0) return null
  const pct = first !== 0 ? (abs / Math.abs(first)) * 100 : 0
  const arrow = abs > 0 ? '↑' : abs < 0 ? '↓' : '→'
  // For crisis indicators, falling is good; for regeneration, rising is good.
  const improving =
    s.stream === 'crisis' ? abs < 0 : s.stream === 'regeneration' ? abs > 0 : null
  const magnitude = Math.abs(pct)
  const label = `${arrow} ${magnitude < 10 ? magnitude.toFixed(1) : Math.round(magnitude)}%`
  const cls =
    improving === null
      ? 'text-sand-400'
      : improving
      ? 'text-moss-300'
      : 'text-ember-300'
  return { label, cls, since: s.trendSpan?.[0] }
}

export function LiveCard({ s }: { s: LiveSignal }) {
  const a = ACCENT[s.stream]
  const isLive = !s.asOf // annual (World Bank) rows carry asOf; real-time feeds don't
  const t = trend(s)
  return (
    <a
      href={s.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl border border-soil-700/60 bg-soil-800/40 p-4 transition-colors hover:border-soil-600"
    >
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          {isLive && (
            <span className={`absolute inline-flex h-full w-full rounded-full ${a.dot} opacity-60 animate-pulse-ring`} />
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${a.dot} ${isLive ? '' : 'opacity-50'}`} />
        </span>
        <span className="truncate text-xs font-medium text-sand-300">{s.label}</span>
        <span className="ml-auto flex-none">
          <InfoDot topic={s.key} label={s.label} />
        </span>
      </div>

      <div className="mt-2 flex items-baseline gap-1">
        <span className={`stat-num text-2xl ${a.num}`}>{fmt(s.value)}</span>
        <span className="text-[0.65rem] text-sand-500">{s.unit}</span>
        {t && (
          <span className={`ml-auto stat-num text-[0.7rem] ${t.cls}`}>{t.label}</span>
        )}
      </div>

      {s.detail && (
        <p className="mt-1 text-[0.7rem] leading-snug text-sand-500">{s.detail}</p>
      )}

      {s.history && s.history.length >= 3 && (
        <div className="mt-2.5">
          <Sparkline
            values={s.history}
            color={a.spark}
            className="w-full"
            width={200}
            height={30}
          />
          {t?.since && (
            <div className="mt-0.5 text-[0.55rem] text-sand-700">since {t.since}</div>
          )}
        </div>
      )}

      <div className="mt-auto pt-2.5 text-[0.6rem] text-sand-700 group-hover:text-sand-500">
        {s.source} · {s.asOf ?? relativeTime(s.updatedAt)}
      </div>
    </a>
  )
}
