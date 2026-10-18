import { INFO_STATS, TECHNIQUES, NARRATIVES, DEFENDERS, INFO_SOURCES } from '../../data/infoCommons'
import type { WorldHuman } from '../../hooks/useWorldPulse'
import { InfoDot } from '../InfoDot'

const S = INFO_STATS

export function InfoCommons({ live }: { live?: WorldHuman['culture'] }) {
  const note = live?.info_note
  const asOf = live?.as_of ?? S.asOf

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">📡 The information commons</h2>
          <InfoDot topic="info_commons" label="The information commons" />
        </div>
        <span className="text-xs text-sand-500">{note ? 'updated weekly · ' : ''}as of {asOf}</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        The shared, evidence-based reality everything else depends on — and the
        disinformation eroding it. We show false claims <em>debunk-first</em>, never
        neutrally: the point is to see the manipulation clearly, not spread it.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.trustPct}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.trustNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.disinfoCountries}+</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.disinfoNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="block text-[0.82rem] leading-snug text-sand-300">{S.deepfakeNote}</span>
        </div>
      </div>

      {/* Manipulation toolkit */}
      <h3 className="mt-5 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        The manipulation toolkit
        <InfoDot topic="manipulation" label="Manipulation techniques" />
      </h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {TECHNIQUES.map((t) => (
          <div key={t.name} className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span className="text-sm font-medium text-sand-100">{t.name}</span>
            <p className="mt-0.5 text-[0.74rem] leading-snug text-sand-400">{t.note}</p>
          </div>
        ))}
      </div>

      {/* Debunk-first watchlist */}
      <h3 className="mt-5 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        What’s circulating — and the reality
        <InfoDot topic="narratives" label="Debunked narratives" />
      </h3>
      <div className="mt-2 space-y-2">
        {NARRATIVES.map((n) => (
          <div key={n.claim} className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <div className="flex flex-wrap items-start gap-2">
              <span className="mt-0.5 flex-shrink-0 rounded-full border border-ember-700/60 bg-ember-700/15 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-ember-200">
                False
              </span>
              <span className="text-[0.85rem] italic text-sand-400">“{n.claim}”</span>
            </div>
            <p className="mt-1.5 text-[0.82rem] leading-snug text-sand-200">
              <span className="font-medium text-moss-300">Reality — </span>
              {n.reality}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="rounded border border-soil-700 bg-soil-800/60 px-1.5 py-0.5 text-[0.62rem] text-sand-500">
                technique: {n.technique}
              </span>
              <a href={n.source.url} target="_blank" rel="noopener noreferrer"
                className="text-[0.68rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
                {n.source.label} ↗
              </a>
            </div>
          </div>
        ))}
      </div>
      {note && (
        <p className="mt-3 text-[0.82rem] leading-snug text-sand-300">
          <span className="font-medium text-sand-100">Surging this week:</span> {note}
        </p>
      )}

      {/* Defenders — above the line */}
      <h3 className="mt-5 text-[0.8rem] uppercase tracking-wide text-moss-300">↑ The defenders of truth</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {DEFENDERS.map((d) => (
          <div key={d.title} className="rounded-lg border border-moss-800/40 bg-moss-950/20 p-3">
            <span className="text-sm font-medium text-sand-100">{d.title}</span>
            <p className="mt-0.5 text-[0.76rem] leading-snug text-sand-400">{d.note}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[0.72rem] leading-snug text-sand-600">
        EarthPulse’s stance: there is a shared, evidence-based reality, and it’s
        worth defending. This panel exists to strengthen your guard, not to spread doubt.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {INFO_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
