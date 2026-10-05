import { ANIMAL_STATS, ANIMAL_PROGRESS, ANIMAL_SOURCES } from '../../data/animalRights'
import type { WorldHuman } from '../../hooks/useWorldPulse'
import { InfoDot } from '../InfoDot'

const SEED = ANIMAL_STATS

export function AnimalRights({ live }: { live?: WorldHuman['animals'] }) {
  const S = {
    landAnimalsBn: live?.land_animals_bn ?? SEED.landAnimalsBn,
    wildlifeDeclinePct: live?.wildlife_decline_pct ?? SEED.wildlifeDeclinePct,
    sentienceJurisdictions: live?.sentience_jurisdictions ?? SEED.sentienceJurisdictions,
    asOf: live?.as_of ?? SEED.asOf,
  }
  const isLive = Boolean(
    live && (live.land_animals_bn || live.wildlife_decline_pct || live.sentience_jurisdictions),
  )

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🐾 Animal rights &amp; welfare</h2>
          <InfoDot topic="animal_rights" label="Animal rights" />
        </div>
        <span className="text-xs text-sand-500">
          {isLive ? 'updated weekly · ' : ''}as of {S.asOf}
        </span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        The other animals we share the planet with — the scale of their use, the
        collapse of the wild, and the slow legal recognition that they can suffer.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="flex items-center gap-1.5">
            <span className="stat-num text-3xl text-ember-200">{S.landAnimalsBn}bn</span>
            <InfoDot topic="animals_farmed" label="Animals farmed" />
          </span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{SEED.landAnimalsNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="flex items-center gap-1.5">
            <span className="stat-num text-3xl text-ember-200">−{S.wildlifeDeclinePct}%</span>
            <InfoDot topic="wildlife_decline" label="Wildlife decline" />
          </span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{SEED.wildlifeDeclineNote}</span>
        </div>
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="flex items-center gap-1.5">
            <span className="stat-num text-3xl text-moss-200">{S.sentienceJurisdictions}</span>
            <InfoDot topic="sentience_law" label="Sentience in law" />
          </span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{SEED.sentienceNote}</span>
        </div>
      </div>

      <h3 className="mt-5 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        Where it stands
        <InfoDot topic="animals_progress" label="Where it stands" />
      </h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {ANIMAL_PROGRESS.map((p) => (
          <div key={p.title} className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span className="text-sm font-medium text-sand-100">{p.title}</span>
            <p className="mt-0.5 text-[0.78rem] leading-snug text-sand-400">{p.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {ANIMAL_SOURCES.map((s) => (
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
