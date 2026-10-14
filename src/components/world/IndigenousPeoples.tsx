import { INDIG_STATS, INDIG_RIGHTS, INDIG_PEOPLES, INDIG_SOURCES } from '../../data/indigenous'
import type { WorldHuman } from '../../hooks/useWorldPulse'
import { InfoDot } from '../InfoDot'
import { ActOnThis } from '../ActOnThis'
import { MiniMap, type MapPoint } from '../MiniMap'

const S = INDIG_STATS

const POINTS: MapPoint[] = INDIG_PEOPLES.map((p) => ({
  lon: p.lon,
  lat: p.lat,
  r: 2.2,
  color: '#e0a852',
  title: `${p.name} — ${p.place}: ${p.note}`,
}))

export function IndigenousPeoples({ live }: { live?: WorldHuman['culture'] }) {
  const note = live?.indigenous_note
  const asOf = live?.as_of ?? S.asOf

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🪶 Indigenous peoples</h2>
          <InfoDot topic="indigenous" label="Indigenous peoples" />
        </div>
        <span className="text-xs text-sand-500">{note ? 'updated weekly · ' : ''}as of {asOf}</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        The first peoples — ~6% of humanity who steward most of the living world’s
        diversity, and whose land and knowledge are the front line of Earth Democracy.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="stat-num block text-3xl text-moss-200">{S.peopleM}M</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.peopleMNote}</span>
        </div>
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="stat-num block text-3xl text-moss-200">{S.biodiversityPct}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.biodiversityNote}</span>
        </div>
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="stat-num block text-3xl text-moss-200">{S.countries}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.countriesNote}</span>
        </div>
      </div>

      <h3 className="mt-5 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        Peoples around the world
        <InfoDot topic="indigenous_map" label="Indigenous peoples map" />
      </h3>
      <div className="mt-2">
        <MiniMap points={POINTS} />
        <p className="mt-1.5 text-[0.68rem] text-sand-600">
          A curated sample of {INDIG_PEOPLES.length} peoples — hover a dot for who they are. Thousands more exist.
        </p>
      </div>

      <h3 className="mt-5 text-[0.8rem] uppercase tracking-wide text-sand-500">Rights &amp; losses</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {INDIG_RIGHTS.map((r) => (
          <div key={r.title} className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span className="text-sm font-medium text-sand-100">{r.title}</span>
            <p className="mt-0.5 text-[0.78rem] leading-snug text-sand-400">{r.note}</p>
          </div>
        ))}
      </div>

      {note && (
        <p className="mt-3 text-[0.82rem] leading-snug text-sand-300">
          <span className="font-medium text-sand-100">This week:</span> {note}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {INDIG_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>

      <div className="mt-4">
        <ActOnThis q="indigenous rights" label="Indigenous & land-rights events" />
      </div>
    </section>
  )
}
