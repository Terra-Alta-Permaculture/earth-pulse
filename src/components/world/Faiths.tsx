import { FAITH_SHARES, FAITH_STATS, FAITH_SOURCES } from '../../data/faiths'
import type { WorldHuman } from '../../hooks/useWorldPulse'
import { InfoDot } from '../InfoDot'

const S = FAITH_STATS

export function Faiths({ live }: { live?: WorldHuman['culture'] }) {
  const note = live?.religion_note
  const asOf = live?.as_of ?? S.asOf

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🕊️ Faiths &amp; beliefs</h2>
          <InfoDot topic="faiths" label="Faiths & beliefs" />
        </div>
        <span className="text-xs text-sand-500">{note ? 'updated weekly · ' : ''}as of {asOf}</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        What the world believes — and how faith still shapes law, identity and
        conflict across the planet.
      </p>

      {/* Stacked share bar */}
      <div className="mt-4 flex h-5 w-full overflow-hidden rounded-full">
        {FAITH_SHARES.map((f) => (
          <div key={f.name} style={{ width: `${f.pct}%`, background: f.color }} title={`${f.name} ${f.pct}%`} />
        ))}
      </div>
      <div className="mt-3 grid gap-x-4 gap-y-1 sm:grid-cols-2">
        {FAITH_SHARES.map((f) => (
          <div key={f.name} className="flex items-center gap-2 text-[0.82rem]">
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-sm" style={{ background: f.color }} />
            <span className="text-sand-200">{f.name}</span>
            <span className="stat-num ml-auto text-sand-500">{f.pct}%</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-soil-700/50 bg-soil-900/40 p-4">
          <span className="stat-num block text-3xl text-sand-100">{S.religiousPct}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.religiousNote}</span>
        </div>
        <div className="rounded-xl border border-soil-700/50 bg-soil-900/40 p-4">
          <span className="stat-num block text-xl text-sand-100">{S.fastestGrowing}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.fastestNote}</span>
        </div>
      </div>

      <p className="mt-3 text-[0.82rem] leading-snug text-sand-300">{S.restrictionsNote}</p>

      {note && (
        <p className="mt-3 text-[0.82rem] leading-snug text-sand-300">
          <span className="font-medium text-sand-100">This week:</span> {note}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {FAITH_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
