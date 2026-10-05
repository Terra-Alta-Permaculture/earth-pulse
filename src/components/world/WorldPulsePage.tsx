import { useState } from 'react'
import { format } from 'date-fns'
import { FORCES } from '../../data/forces'
import { useWorldPulse } from '../../hooks/useWorldPulse'
import { ForceCard } from './ForceCard'
import { ScenarioLean } from './ScenarioLean'
import { SignpostTimeline } from './SignpostTimeline'
import { ActiveConflicts } from './ActiveConflicts'
import { GenderEquality } from './GenderEquality'
import { HumanRights } from './HumanRights'
import { ChildrensRights } from './ChildrensRights'
import { NatureRights } from './NatureRights'
import { AnimalRights } from './AnimalRights'

const reportUrl = import.meta.env.VITE_WORLD_REPORT_URL as string | undefined

export function WorldPulsePage() {
  const { weekly, latestByForce, historyByForce, signposts, human, loading, isSample } = useWorldPulse()
  const [sortByTension, setSortByTension] = useState(false)

  const readings = FORCES.map((f) => latestByForce[f.key]).filter(
    (r): r is NonNullable<typeof r> => Boolean(r),
  )
  const avg = readings.length
    ? readings.reduce((a, r) => a + r.tension, 0) / readings.length
    : 0
  const rising = readings.filter((r) => r.direction === 'up').length
  const falling = readings.filter((r) => r.direction === 'down').length

  const ordered = sortByTension
    ? [...readings].sort((a, b) => b.tension - a.tension)
    : readings

  const weekLabel = weekly?.week_start
    ? `Week of ${format(new Date(weekly.week_start), 'd MMM yyyy')}`
    : ''

  if (loading) {
    return (
      <div className="grid gap-4">
        <div className="h-32 animate-pulse rounded-2xl bg-soil-900/60" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-soil-800/40" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Weekly brief */}
      <section className="card mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="eyebrow">World Pulse · weekly</span>
          <div className="flex items-center gap-2">
            {isSample && (
              <span className="rounded-full border border-ember-700/50 bg-ember-700/10 px-2.5 py-1 text-[0.65rem] font-medium text-ember-200">
                sample data
              </span>
            )}
            <span className="text-xs text-sand-500">{weekLabel}</span>
          </div>
        </div>
        <h2 className="mt-2 font-display text-xl text-sand-100">The pressures on the planet</h2>
        <p className="mt-2 text-sm leading-relaxed text-sand-300">{weekly?.summary}</p>
        {reportUrl && (
          <a
            href={reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-xs text-moss-300 underline underline-offset-2 hover:text-moss-200"
          >
            Read the full State of the World report →
          </a>
        )}
      </section>

      {/* World tension meter */}
      <div className="card mb-6 px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="eyebrow">World tension</span>
          <span className="text-xs text-sand-400">
            <span className="text-ember-300">{rising} rising</span>
            {' · '}
            <span className="text-moss-300">{falling} easing</span>
          </span>
        </div>
        <div className="relative mt-3 h-2.5 overflow-hidden rounded-full bg-gradient-to-r from-moss-600 via-ember-600 to-ember-700">
          <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-sand-100/20" />
        </div>
        <div className="relative mt-1 h-4">
          <div className="absolute top-0 -translate-x-1/2 transition-all duration-700" style={{ left: `${(avg / 10) * 100}%` }}>
            <div className="mx-auto h-0 w-0 border-x-[5px] border-b-[7px] border-x-transparent border-b-sand-100" />
          </div>
        </div>
        <div className="mt-1 flex justify-between text-[0.65rem] text-sand-700">
          <span>Calm</span>
          <span className="stat-num text-sand-300">{avg.toFixed(1)} / 10 average</span>
          <span>Systemic crisis</span>
        </div>
      </div>

      {/* Force grid */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-xl text-sand-100">The {FORCES.length} forces</h2>
        <button
          onClick={() => setSortByTension((v) => !v)}
          className="rounded-lg border border-soil-600 bg-soil-800 px-3 py-1.5 text-xs font-medium text-sand-300 transition-colors hover:bg-soil-700"
        >
          {sortByTension ? 'Default order' : 'Highest tension first'}
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.map((r) => (
          <ForceCard key={r.force_key} reading={r} history={historyByForce[r.force_key] ?? [r]} />
        ))}
      </div>

      {/* The widening circle of rights — wars, equality, people, nature, animals */}
      <ActiveConflicts live={human?.conflicts} />
      <GenderEquality />
      <HumanRights live={human?.human_rights} />
      <ChildrensRights live={human?.children} />
      <NatureRights live={human?.nature} />
      <AnimalRights live={human?.animals} />

      {/* Scenario lean */}
      {weekly && <ScenarioLean lean={weekly.scenario_lean} rationale={weekly.lean_rationale} />}

      {/* Signposts */}
      {signposts.length > 0 && <SignpostTimeline signposts={signposts} />}
    </>
  )
}
