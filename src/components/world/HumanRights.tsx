import { HR_STATS, HR_CONCERNS, HR_SOURCES } from '../../data/humanRights'
import type { WorldHuman } from '../../hooks/useWorldPulse'
import { InfoDot } from '../InfoDot'

const SEED = HR_STATS

export function HumanRights({ live }: { live?: WorldHuman['human_rights'] }) {
  const S = {
    declineYears: live?.decline_years ?? SEED.declineYears,
    declineNote: SEED.declineNote,
    notFreePct: live?.not_free_pct ?? SEED.notFreePct,
    notFreeNote: SEED.notFreeNote,
    autocracyPct: live?.autocracy_pct ?? SEED.autocracyPct,
    autocracyNote: SEED.autocracyNote,
    openCivicPct: live?.open_civic_pct ?? SEED.openCivicPct,
    openCivicNote: SEED.openCivicNote,
    asOf: live?.as_of ?? SEED.asOf,
  }
  const isLive = Boolean(
    live && (live.decline_years || live.not_free_pct || live.autocracy_pct || live.open_civic_pct),
  )

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">✊ Human rights &amp; freedom</h2>
          <InfoDot topic="human_rights" label="Human rights" />
        </div>
        <span className="text-xs text-sand-500">
          {isLive ? 'updated weekly · ' : ''}as of {S.asOf}
        </span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        Whether people can speak, gather, vote and live free from repression —
        and which way the trend is pointing.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.declineYears}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.declineNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.notFreePct}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.notFreeNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.autocracyPct}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.autocracyNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.openCivicPct}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.openCivicNote}</span>
        </div>
      </div>

      <h3 className="mt-5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        What monitors are flagging
      </h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {HR_CONCERNS.map((c) => (
          <div key={c.title} className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span className="text-sm font-medium text-sand-100">{c.title}</span>
            <p className="mt-0.5 text-[0.78rem] leading-snug text-sand-400">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Check the latest:</span>
        {HR_SOURCES.map((s) => (
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
