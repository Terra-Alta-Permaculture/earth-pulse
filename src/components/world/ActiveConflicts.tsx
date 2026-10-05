import { ACTIVE_CONFLICTS, CONFLICT_STATS, CONFLICT_SOURCES } from '../../data/conflicts'
import { InfoDot } from '../InfoDot'

const S = CONFLICT_STATS

export function ActiveConflicts() {
  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">⚔ Wars &amp; armed conflicts</h2>
          <InfoDot topic="active_conflicts" label="Active conflicts" />
        </div>
        <span className="text-xs text-sand-500">as of {S.asOf}</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        How much of the world is at war right now — the human cost behind the
        geopolitical forces below.
      </p>

      {/* Headline numbers */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.allConflicts}+</span>
          <span className="mt-1 block text-[0.8rem] leading-snug text-sand-400">
            {S.allConflictsNote}
          </span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.stateBasedConflicts}</span>
          <span className="mt-1 block text-[0.8rem] leading-snug text-sand-400">
            {S.stateBasedNote}
          </span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.displacement}M</span>
          <span className="mt-1 block text-[0.8rem] leading-snug text-sand-400">
            {S.displacementNote}
          </span>
        </div>
      </div>

      {/* Major active wars */}
      <h3 className="mt-5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        The largest active wars
      </h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {ACTIVE_CONFLICTS.map((c) => (
          <div
            key={c.name}
            className="flex gap-3 rounded-lg border border-soil-800 bg-soil-900/40 p-3"
          >
            <span
              className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                c.intensity === 'war' ? 'bg-ember-400' : 'bg-ember-600/60'
              }`}
            />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-sand-100">{c.name}</span>
                <span className="text-[0.65rem] text-sand-600">
                  {c.region} · since {c.since}
                </span>
              </div>
              <p className="mt-0.5 text-[0.78rem] leading-snug text-sand-400">{c.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Check the latest:</span>
        {CONFLICT_SOURCES.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200"
          >
            {s.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
