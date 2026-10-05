import { NATURE_STATS, NATURE_PERSONHOOD, NATURE_SOURCES } from '../../data/natureRights'
import type { WorldHuman } from '../../hooks/useWorldPulse'
import { InfoDot } from '../InfoDot'

const SEED = NATURE_STATS

export function NatureRights({ live }: { live?: WorldHuman['nature'] }) {
  const S = {
    initiatives: live?.initiatives ?? SEED.initiatives,
    countries: live?.countries ?? SEED.countries,
    asOf: live?.as_of ?? SEED.asOf,
  }
  const isLive = Boolean(live && (live.initiatives || live.countries))

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🌍 Rights of Nature</h2>
          <InfoDot topic="nature_rights" label="Rights of Nature" />
        </div>
        <span className="text-xs text-sand-500">
          {isLive ? 'updated weekly · ' : ''}as of {S.asOf}
        </span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        Law is starting to treat rivers, forests and ecosystems as living subjects
        with rights — not property. The circle of who counts is widening.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="stat-num block text-3xl text-moss-200">{S.initiatives}+</span>
          <span className="mt-1 block text-[0.8rem] leading-snug text-sand-400">{SEED.initiativesNote}</span>
        </div>
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="stat-num block text-3xl text-moss-200">{S.countries}</span>
          <span className="mt-1 block text-[0.8rem] leading-snug text-sand-400">{SEED.countriesNote}</span>
        </div>
      </div>

      <h3 className="mt-5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        Ecosystems granted legal rights
      </h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {NATURE_PERSONHOOD.map((c) => (
          <div key={c.name} className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-sand-100">{c.name}</span>
              <span className="text-[0.65rem] text-sand-600">{c.place} · {c.year}</span>
            </div>
            <p className="mt-0.5 text-[0.78rem] leading-snug text-sand-400">{c.note}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[0.78rem] leading-snug text-sand-400">
        {SEED.ecocideNote} The full Rights-of-Nature &amp; ecocide timeline lives in
        the{' '}
        <a href="/" className="text-moss-300 underline underline-offset-2 hover:text-moss-200">
          Law Tracker on the Planet tab
        </a>
        .
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {NATURE_SOURCES.map((s) => (
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
