import { SURVEIL_STATS, SURVEIL_TOOLS, SURVEIL_DEFENDERS, SURVEIL_SOURCES } from '../../data/surveillance'
import { InfoDot } from '../InfoDot'

const S = SURVEIL_STATS

export function Surveillance() {
  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🛰️ Surveillance &amp; digital control</h2>
          <InfoDot topic="surveillance" label="Surveillance & digital control" />
        </div>
        <span className="text-xs text-sand-500">as of {S.asOf}</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        Power concentrated through watching. The eye in the pocket and on the
        pole — and the shrinking space to think, speak and gather unseen.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.declineYears}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.declineNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.shutdowns}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.shutdownsNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.aiSurveilCountries}+</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.aiSurveilNote}</span>
        </div>
      </div>

      <h3 className="mt-5 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        The toolkit of control
        <InfoDot topic="surveil_tools" label="Surveillance tools" />
      </h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {SURVEIL_TOOLS.map((x) => (
          <div key={x.title} className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span className="text-sm font-medium text-sand-100">{x.title}</span>
            <p className="mt-0.5 text-[0.76rem] leading-snug text-sand-400">{x.note}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-5 text-[0.8rem] uppercase tracking-wide text-moss-300">↑ Defenders of digital freedom</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {SURVEIL_DEFENDERS.map((x) => (
          <div key={x.title} className="rounded-lg border border-moss-800/40 bg-moss-950/20 p-3">
            <span className="text-sm font-medium text-sand-100">{x.title}</span>
            <p className="mt-0.5 text-[0.76rem] leading-snug text-sand-400">{x.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {SURVEIL_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
