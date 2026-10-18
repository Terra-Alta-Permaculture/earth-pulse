import { ATROCITIES, ACCOUNTABILITY, DEADLIEST_SOURCES } from '../../data/deadliest'
import { InfoDot } from '../InfoDot'

export function Deadliest() {
  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🕯️ When power kills</h2>
          <InfoDot topic="deadliest" label="The deadliest regimes" />
        </div>
        <span className="text-xs text-sand-500">history</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        The far end of below the line: what happens when those in power stop
        feeling the consequences of their actions. Shown for remembrance and
        accountability — so we refuse to repeat it.
      </p>

      <div className="mt-4 space-y-2">
        {ATROCITIES.map((a) => (
          <div key={a.name} className="flex gap-3 rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-ember-500/70" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="text-sm font-medium text-sand-100">{a.name}</span>
                <span className="stat-num flex-shrink-0 text-[0.82rem] text-ember-200">{a.toll}</span>
              </div>
              <div className="text-[0.65rem] text-sand-600">{a.period}</div>
              <p className="mt-0.5 text-[0.78rem] leading-snug text-sand-400">
                {a.note}{' '}
                <a href={a.source.url} target="_blank" rel="noopener noreferrer"
                  className="text-moss-300 underline underline-offset-2 hover:text-moss-200">
                  {a.source.label} ↗
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[0.72rem] leading-snug text-sand-600">
        Estimates are contested and vary by source and definition (war vs. mass
        killing vs. famine vs. colonial policy), so they’re shown as ranges. The
        point isn’t a precise ranking — it’s that unchecked power, unaccountable
        to those it rules, is the deadliest force in human history.
      </p>

      {/* ↑ Above the line — accountability */}
      <h3 className="mt-5 text-[0.8rem] uppercase tracking-wide text-moss-300">↑ How we refuse to repeat it</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {ACCOUNTABILITY.map((a) => (
          <div key={a.title} className="rounded-lg border border-moss-800/40 bg-moss-950/20 p-3">
            <span className="text-sm font-medium text-sand-100">{a.title}</span>
            <p className="mt-0.5 text-[0.76rem] leading-snug text-sand-400">{a.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {DEADLIEST_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
