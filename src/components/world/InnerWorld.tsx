import { INNER_STATS, INNER_STRAINS, INNER_HELPS, INNER_SOURCES } from '../../data/innerWorld'
import { InfoDot } from '../InfoDot'

const S = INNER_STATS

export function InnerWorld() {
  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🧠 The inner world</h2>
          <InfoDot topic="inner_world" label="Wellbeing & mental health" />
        </div>
        <span className="text-xs text-sand-500">as of {S.asOf}</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        The missing half of the map. NOVA’s diagnosis is that we are technically
        brilliant and <em>humanly impoverished</em> — so here is the state of the
        human heart: wellbeing, mental health and meaning.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.mentalHealth}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.mentalHealthNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.loneliness}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.lonelinessNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">${S.costTrillion}T</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.costNote}</span>
        </div>
      </div>

      <h3 className="mt-5 text-[0.8rem] uppercase tracking-wide text-sand-500">The strains</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {INNER_STRAINS.map((x) => (
          <div key={x.title} className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span className="text-sm font-medium text-sand-100">{x.title}</span>
            <p className="mt-0.5 text-[0.76rem] leading-snug text-sand-400">{x.note}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-5 text-[0.8rem] uppercase tracking-wide text-moss-300">↑ What actually helps</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {INNER_HELPS.map((x) => (
          <div key={x.title} className="rounded-lg border border-moss-800/40 bg-moss-950/20 p-3">
            <span className="text-sm font-medium text-sand-100">{x.title}</span>
            <p className="mt-0.5 text-[0.76rem] leading-snug text-sand-400">{x.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {INNER_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
