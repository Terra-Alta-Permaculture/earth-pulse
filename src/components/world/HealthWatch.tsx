import { useEffect, useState } from 'react'
import { HEALTH_STATS, HEALTH_OUTBREAKS, HEALTH_SOURCES, type Outbreak } from '../../data/health'
import type { WorldHuman } from '../../hooks/useWorldPulse'
import { InfoDot } from '../InfoDot'
import { ActOnThis } from '../ActOnThis'

const SEED = HEALTH_STATS

// One live World Bank metric: global life expectancy at birth (years).
const LE_FALLBACK = { v: 73.5, year: '2024' }

async function fetchLifeExpectancy(): Promise<{ v: number; year: string; live: boolean }> {
  try {
    const res = await fetch(
      'https://api.worldbank.org/v2/country/WLD/indicator/SP.DYN.LE00.IN?format=json&mrnev=1',
    )
    if (!res.ok) throw new Error()
    const d = await res.json()
    const row = d?.[1]?.[0]
    if (typeof row?.value === 'number') return { v: row.value, year: row.date, live: true }
  } catch {
    /* fall through */
  }
  return { ...LE_FALLBACK, live: false }
}

export function HealthWatch({ live }: { live?: WorldHuman['health'] }) {
  const [le, setLe] = useState<{ v: number; year: string; live: boolean }>({ ...LE_FALLBACK, live: false })
  useEffect(() => {
    let cancelled = false
    fetchLifeExpectancy().then((m) => {
      if (!cancelled) setLe(m)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const S = {
    pheics: live?.pheics ?? SEED.pheics,
    outbreaksTracked: live?.outbreaks_tracked ?? SEED.outbreaksTracked,
    topThreat: live?.top_threat ?? SEED.topThreat,
    asOf: live?.as_of ?? SEED.asOf,
  }
  const outbreaks: Outbreak[] =
    live?.outbreaks && live.outbreaks.length
      ? live.outbreaks.map((o) => ({
          name: o.name,
          place: o.place ?? '',
          note: o.note ?? '',
          concern: 'active' as const,
        }))
      : HEALTH_OUTBREAKS
  const isLive = Boolean(live && (live.pheics != null || live.top_threat || live.outbreaks?.length))

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🦠 Health &amp; outbreaks</h2>
          <InfoDot topic="health_watch" label="Health & outbreaks" />
        </div>
        <span className="text-xs text-sand-500">
          {isLive ? 'updated weekly · ' : ''}as of {S.asOf}
        </span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        What’s spreading now, what could become the next pandemic, and how long a
        life we can expect — the health of the human family.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {/* Live: life expectancy */}
        <div className="rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
          <span className="flex items-center gap-1.5">
            <span className="stat-num text-3xl text-moss-200">{le.v.toFixed(1)}</span>
            <InfoDot topic="health_life_expectancy" label="Life expectancy" />
          </span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">
            years — global life expectancy · {le.live ? `World Bank ${le.year}` : `~${le.year}`}
          </span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="flex items-center gap-1.5">
            <span className="stat-num text-3xl text-ember-200">{S.pheics}</span>
            <InfoDot topic="health_pheic" label="Health emergencies" />
          </span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{SEED.pheicsNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="flex items-center gap-1.5">
            <span className="stat-num text-3xl text-ember-200">{S.outbreaksTracked}</span>
            <InfoDot topic="health_outbreaks_tracked" label="Outbreaks tracked" />
          </span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{SEED.outbreaksNote}</span>
        </div>
      </div>

      <h3 className="mt-5 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        What’s spreading now
        <InfoDot topic="health_current" label="Current outbreaks" />
      </h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {outbreaks.map((o) => (
          <div key={o.name} className="flex gap-3 rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span
              className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                o.concern === 'watch' ? 'bg-ember-400' : 'bg-ember-600/60'
              }`}
            />
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-sm font-medium text-sand-100">{o.name}</span>
                {o.place && <span className="text-[0.65rem] text-sand-600">{o.place}</span>}
                {o.concern === 'watch' && (
                  <span className="rounded-full border border-ember-700/50 bg-ember-700/10 px-1.5 text-[0.6rem] font-medium text-ember-200">
                    pandemic watch
                  </span>
                )}
              </div>
              {o.note && <p className="mt-0.5 text-[0.78rem] leading-snug text-sand-400">{o.note}</p>}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[0.78rem] leading-snug text-sand-400">
        The next pandemic will likely come from a pathogen we haven’t named yet —
        what the WHO calls <em>“Disease X.”</em> The point isn’t to be afraid, but
        to notice the early signals clearly instead of through panic.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Check the latest:</span>
        {HEALTH_SOURCES.map((s) => (
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

      <div className="mt-4">
        <ActOnThis q="health resilience" label="health & resilience events" />
      </div>
    </section>
  )
}
