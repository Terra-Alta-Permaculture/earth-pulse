import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { FORCES } from '../../data/forces'
import { useWorldPulse } from '../../hooks/useWorldPulse'
import { ForceCard } from './ForceCard'
import { InfoDot } from '../InfoDot'
import { ScenarioLean } from './ScenarioLean'
import { SignpostTimeline } from './SignpostTimeline'
import { ActiveConflicts } from './ActiveConflicts'
import { HealthWatch } from './HealthWatch'
import { GenderEquality } from './GenderEquality'
import { HumanRights } from './HumanRights'
import { ChildrensRights } from './ChildrensRights'
import { NatureRights } from './NatureRights'
import { AnimalRights } from './AnimalRights'
import { MarketsPanel } from './MarketsPanel'
import { IndigenousPeoples } from './IndigenousPeoples'
import { Languages } from './Languages'
import { Faiths } from './Faiths'
import { MedicinePanel } from './MedicinePanel'
import { PeopleRising } from './PeopleRising'
import { MotherLines } from './MotherLines'
import { Collapsible } from '../Collapsible'
import { SectionNav } from '../SectionNav'

// Ordered by the three bands: ↓ below · ◑ floor · ↑ above
const NAV_ITEMS = [
  { id: 'forces', label: '🧭 Forces' },
  { id: 'wars', label: '⚔ Wars' },
  { id: 'markets', label: '💰 Markets' },
  { id: 'health', label: '🦠 Health' },
  { id: 'gender', label: '⚖ Gender' },
  { id: 'rights', label: '✊ Rights' },
  { id: 'children', label: '🧒 Children' },
  { id: 'faiths', label: '🕊️ Faiths' },
  { id: 'tongues', label: '🗣️ Tongues' },
  { id: 'medicine', label: '⚕️ Medicine' },
  { id: 'protests', label: '✊ People' },
  { id: 'nature', label: '🌍 Nature' },
  { id: 'indigenous', label: '🪶 Indigenous' },
  { id: 'lineages', label: '🌕 Lineages' },
  { id: 'animals', label: '🐾 Animals' },
  { id: 'outlook', label: '🔭 Outlook' },
]

type Lens = 'all' | 'below' | 'floor' | 'above'
const LENSES: { k: Lens; label: string }[] = [
  { k: 'all', label: 'All' },
  { k: 'below', label: '↓ Below' },
  { k: 'floor', label: '◑ Floor' },
  { k: 'above', label: '↑ Above' },
]

function BandHeader({ tone, title, desc }: { tone: 'below' | 'floor' | 'above'; title: string; desc: string }) {
  const color = tone === 'below' ? 'text-ember-300' : tone === 'above' ? 'text-moss-300' : 'text-sand-300'
  return (
    <div className="mb-3 mt-8 flex flex-wrap items-baseline gap-x-2 border-t border-soil-800/70 pt-5">
      <span className={`text-xs font-semibold uppercase tracking-[0.18em] ${color}`}>{title}</span>
      <span className="text-[0.72rem] text-sand-600">— {desc}</span>
    </div>
  )
}

const reportUrl = import.meta.env.VITE_WORLD_REPORT_URL as string | undefined

export function WorldPulsePage() {
  const { weekly, latestByForce, historyByForce, signposts, human, loading, isSample } = useWorldPulse()
  const [sortByTension, setSortByTension] = useState(false)
  const [lens, setLens] = useState<Lens>('all')

  // A jump-nav tap should always reveal the section, even across a lens filter.
  useEffect(() => {
    const h = () => setLens('all')
    window.addEventListener('ep-expand', h)
    return () => window.removeEventListener('ep-expand', h)
  }, [])

  const show = (band: 'below' | 'floor' | 'above') => (lens === 'all' || lens === band ? '' : 'hidden')

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
      <SectionNav items={NAV_ITEMS} />

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
        <h2 className="mt-2 flex items-center gap-2 font-display text-xl text-sand-100">
          The pressures on the planet
          <InfoDot topic="world_summary" label="This week" />
        </h2>
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
          <span className="flex items-center gap-1.5">
            <span className="eyebrow">World tension</span>
            <InfoDot topic="world_tension" label="World tension" />
          </span>
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

      {/* Vertical Politics lens — read the world below or above the line */}
      <div id="lens" className="scroll-mt-20">
        <div className="mb-2 flex flex-wrap items-center justify-center gap-2 text-center">
          <span className="text-xs uppercase tracking-[0.2em] text-sand-500">
            Not left or right — <span className="text-ember-300">below the line</span> or{' '}
            <span className="text-moss-300">above</span> it
          </span>
          <InfoDot topic="the_line" label="Above & below the line" />
        </div>
        <div className="mb-1 flex flex-wrap justify-center gap-1.5">
          {LENSES.map((l) => (
            <button
              key={l.k}
              onClick={() => setLens(l.k)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                lens === l.k
                  ? 'border-moss-500 bg-moss-900/40 text-sand-100'
                  : 'border-soil-700 bg-soil-800/50 text-sand-400 hover:text-sand-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* ↓ Below the line — extraction, concentration, domination */}
      <div className={show('below')}>
        <BandHeader tone="below" title="↓ Below the line" desc="what extracts, concentrates & dominates" />
        <Collapsible id="forces" title={`The ${FORCES.length} forces`} infoTopic="world_forces" infoLabel="The forces">
          <div className="mb-3 flex justify-end">
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
        </Collapsible>
        <Collapsible id="wars"><ActiveConflicts live={human?.conflicts} /></Collapsible>
        <Collapsible id="markets"><MarketsPanel live={human?.markets} /></Collapsible>
      </div>

      {/* ◑ The human floor — where people actually stand (social foundation) */}
      <div className={show('floor')}>
        <BandHeader tone="floor" title="◑ The human floor" desc="where people actually stand — met or short" />
        <Collapsible id="health"><HealthWatch live={human?.health} /></Collapsible>
        <Collapsible id="gender"><GenderEquality /></Collapsible>
        <Collapsible id="rights"><HumanRights live={human?.human_rights} /></Collapsible>
        <Collapsible id="children"><ChildrensRights live={human?.children} /></Collapsible>
        <Collapsible id="faiths"><Faiths live={human?.culture} /></Collapsible>
        <Collapsible id="tongues"><Languages live={human?.culture} /></Collapsible>
        <Collapsible id="medicine"><MedicinePanel live={human?.culture} /></Collapsible>
      </div>

      {/* ↑ Above the line — regeneration, rights, the widening circle */}
      <div className={show('above')}>
        <BandHeader tone="above" title="↑ Above the line" desc="what regenerates, distributes & widens rights" />
        <Collapsible id="protests"><PeopleRising live={human?.movements} /></Collapsible>
        <Collapsible id="nature"><NatureRights live={human?.nature} /></Collapsible>
        <Collapsible id="indigenous"><IndigenousPeoples live={human?.culture} /></Collapsible>
        <Collapsible id="lineages"><MotherLines live={human?.culture} /></Collapsible>
        <Collapsible id="animals"><AnimalRights live={human?.animals} /></Collapsible>
      </div>

      {/* Scenario lean */}
      <div id="outlook" className="scroll-mt-20">
        {weekly && <ScenarioLean lean={weekly.scenario_lean} rationale={weekly.lean_rationale} />}
      </div>

      {/* Signposts */}
      {signposts.length > 0 && <SignpostTimeline signposts={signposts} />}
    </>
  )
}
