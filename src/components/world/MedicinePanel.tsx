import { MED_STATS, MED_SYSTEMS, MED_INNOVATIONS, MED_SOURCES } from '../../data/medicine'
import type { WorldHuman } from '../../hooks/useWorldPulse'
import { InfoDot } from '../InfoDot'

const S = MED_STATS

export function MedicinePanel({ live }: { live?: WorldHuman['culture'] }) {
  const note = live?.medicine_note
  const asOf = live?.as_of ?? S.asOf

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">⚕️ Medicine &amp; healing</h2>
          <InfoDot topic="medicine" label="Medicine & healing" />
        </div>
        <span className="text-xs text-sand-500">{note ? 'updated weekly · ' : ''}as of {asOf}</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        How the world heals — the many systems of medicine still practiced, and the
        frontier of what’s newly possible.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="stat-num block text-3xl text-moss-200">{S.traditionalPct}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.traditionalNote}</span>
        </div>
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="stat-num block text-3xl text-moss-200">{S.countriesTradMed}+</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.countriesNote}</span>
        </div>
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="stat-num block text-3xl text-moss-200">{S.naturalDerivedPct}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.naturalNote}</span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
            Systems practiced
            <InfoDot topic="med_systems" label="Systems of medicine" />
          </h3>
          <div className="mt-2 space-y-2">
            {MED_SYSTEMS.map((m) => (
              <div key={m.name} className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
                <span className="text-sm font-medium text-sand-100">{m.name}</span>
                <p className="mt-0.5 text-[0.76rem] leading-snug text-sand-400">{m.note}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
            Frontiers
            <InfoDot topic="med_innovation" label="Medical innovations" />
          </h3>
          <div className="mt-2 space-y-2">
            {MED_INNOVATIONS.map((m) => (
              <div key={m.name} className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
                <span className="text-sm font-medium text-sand-100">{m.name}</span>
                <p className="mt-0.5 text-[0.76rem] leading-snug text-sand-400">{m.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {note && (
        <p className="mt-3 text-[0.82rem] leading-snug text-sand-300">
          <span className="font-medium text-sand-100">This week:</span> {note}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {MED_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
