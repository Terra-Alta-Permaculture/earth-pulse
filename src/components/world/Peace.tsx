import { PEACE_STATS, PEACE_METHODS, PEACE_SOURCES } from '../../data/peace'
import { InfoDot } from '../InfoDot'

const S = PEACE_STATS

export function Peace() {
  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🕊️ Peace &amp; nonviolence</h2>
          <InfoDot topic="peace" label="Peace & nonviolence" />
        </div>
        <span className="text-xs text-sand-500">as of {S.asOf}</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        The above-the-line answer to war: how change is actually won — and the
        evidence that <span className="text-moss-300">nonviolence works better</span>.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="stat-num block text-3xl text-moss-200">{S.successNonviolent}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.successNote}</span>
        </div>
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="stat-num block text-3xl text-moss-200">{S.tippingPct}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.tippingNote}</span>
        </div>
        <div className="rounded-xl border border-soil-700/50 bg-soil-900/40 p-4">
          <span className="stat-num block text-xl text-sand-100">{S.topPeace}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.topPeaceNote}</span>
        </div>
      </div>

      <h3 className="mt-5 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        How peace is won
        <InfoDot topic="peace_methods" label="How peace is built" />
      </h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {PEACE_METHODS.map((m) => (
          <div key={m.title} className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span className="text-sm font-medium text-sand-100">{m.title}</span>
            <p className="mt-0.5 text-[0.76rem] leading-snug text-sand-400">{m.note}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[0.72rem] leading-snug text-sand-600">
        Most wars end not in total victory but in negotiation — and the movements
        that changed history most durably (civil rights, anti-apartheid, people-power
        revolutions) did it without arms.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {PEACE_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
