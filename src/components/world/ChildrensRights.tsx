import { useEffect, useState } from 'react'
import { CHILD_STATS, CHILD_SOURCES } from '../../data/childrensRights'
import { InfoDot } from '../InfoDot'

const S = CHILD_STATS

// One live World Bank metric: under-5 mortality (deaths per 1,000 live births).
const FALLBACK = { v: 37.4, year: '2024' }

async function fetchMortality(): Promise<{ v: number; year: string; live: boolean }> {
  try {
    const res = await fetch(
      'https://api.worldbank.org/v2/country/WLD/indicator/SH.DYN.MORT?format=json&mrnev=1',
    )
    if (!res.ok) throw new Error()
    const d = await res.json()
    const row = d?.[1]?.[0]
    if (typeof row?.value === 'number') return { v: row.value, year: row.date, live: true }
  } catch {
    /* fall through */
  }
  return { ...FALLBACK, live: false }
}

export function ChildrensRights() {
  const [mort, setMort] = useState<{ v: number; year: string; live: boolean }>({
    ...FALLBACK,
    live: false,
  })
  useEffect(() => {
    let cancelled = false
    fetchMortality().then((m) => {
      if (!cancelled) setMort(m)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🧒 Children’s rights</h2>
          <InfoDot topic="childrens_rights" label="Children's rights" />
        </div>
        <span className="text-xs text-sand-500">as of {S.asOf}</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        The Convention on the Rights of the Child is the most ratified treaty on
        Earth — yet for millions of children the promise is still unmet.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.childLabour}M</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.childLabourNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.outOfSchool}M</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.outOfSchoolNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.inConflict}M</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.inConflictNote}</span>
        </div>
        {/* Live: under-5 mortality */}
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="stat-num block text-3xl text-moss-200">{mort.v.toFixed(0)}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">
            under-5 deaths per 1,000 births · {mort.live ? `World Bank ${mort.year}` : `~${mort.year}`}
          </span>
        </div>
      </div>

      <p className="mt-3 text-[0.78rem] leading-snug text-sand-400">
        {S.childMarriageNote}. Child mortality is the one bright line: it has more
        than halved since 2000 — proof that progress for children is possible.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {CHILD_SOURCES.map((s) => (
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
