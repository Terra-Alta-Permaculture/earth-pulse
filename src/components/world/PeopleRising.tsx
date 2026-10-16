import {
  MOVEMENT_STATS,
  PROTESTS_ABOVE,
  PROTESTS_BELOW,
  PETITIONS,
  MOVEMENT_SOURCES,
  type Movement,
} from '../../data/movements'
import type { WorldHuman } from '../../hooks/useWorldPulse'
import { InfoDot } from '../InfoDot'
import { ActOnThis } from '../ActOnThis'

const S = MOVEMENT_STATS

function MoveList({ items, tone }: { items: Movement[]; tone: 'above' | 'below' }) {
  const dot = tone === 'above' ? 'bg-moss-400' : 'bg-ember-500/70'
  return (
    <div className="space-y-2">
      {items.map((m) => (
        <div key={m.name} className="flex gap-2.5 rounded-lg border border-soil-800 bg-soil-900/40 p-3">
          <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-medium text-sand-100">{m.name}</span>
              {m.place && <span className="text-[0.65rem] text-sand-600">{m.place}</span>}
            </div>
            {m.note && <p className="mt-0.5 text-[0.76rem] leading-snug text-sand-400">{m.note}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export function PeopleRising({ live }: { live?: WorldHuman['movements'] }) {
  const above = live?.protests_above?.length ? (live.protests_above as Movement[]) : PROTESTS_ABOVE
  const below = live?.protests_below?.length ? (live.protests_below as Movement[]) : PROTESTS_BELOW
  const petitionNote = live?.petitions_note
  const asOf = live?.as_of ?? S.asOf
  const isLive = Boolean(live && (live.protests_above?.length || live.petitions_note))

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">✊ People rising</h2>
          <InfoDot topic="people_rising" label="Protests & petitions" />
        </div>
        <span className="text-xs text-sand-500">{isLive ? 'updated weekly · ' : ''}as of {asOf}</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        Protests, demonstrations and petitions — people power. The test isn’t left
        or right: does a movement <span className="text-moss-300">widen rights &amp; share power</span>{' '}
        (above the line) or <span className="text-ember-300">concentrate it &amp; roll rights back</span> (below)?
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-soil-700/50 bg-soil-900/40 p-4">
          <p className="text-[0.82rem] leading-snug text-sand-300">{S.recordNote}</p>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.openCivicPct}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.openCivicNote}</span>
        </div>
      </div>

      {/* Protests: above / below */}
      <h3 className="mt-5 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        Active protests &amp; movements
        <InfoDot topic="protests" label="Protests & movements" />
      </h3>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wide text-moss-300">
            ↑ Above the line
          </div>
          <MoveList items={above} tone="above" />
        </div>
        <div>
          <div className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wide text-ember-300">
            ↓ Below the line
          </div>
          <MoveList items={below} tone="below" />
        </div>
      </div>

      {/* Petitions */}
      <h3 className="mt-5 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        Biggest petitions
        <InfoDot topic="petitions" label="Biggest petitions" />
      </h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {PETITIONS.map((p) => (
          <div key={p.name} className="flex gap-2.5 rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span
              className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${p.side === 'above' ? 'bg-moss-400' : 'bg-ember-500/70'}`}
            />
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-medium text-sand-100">{p.name}</span>
                <span className="stat-num text-[0.65rem] text-sand-500">{p.signatures}</span>
              </div>
              <p className="mt-0.5 text-[0.76rem] leading-snug text-sand-400">{p.note}</p>
            </div>
          </div>
        ))}
      </div>
      {petitionNote && (
        <p className="mt-3 text-[0.82rem] leading-snug text-sand-300">
          <span className="font-medium text-sand-100">This week:</span> {petitionNote}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {MOVEMENT_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>

      <div className="mt-4">
        <ActOnThis q="protest activism" label="actions & movements near you" />
      </div>
    </section>
  )
}
