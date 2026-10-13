import type { EarthSnapshot } from '../lib/types'
import type { LiveState } from '../hooks/useLiveSignals'
import { liveBalance } from '../data/liveSources'
import { ErrorBoundary } from './ErrorBoundary'
import { InfoDot } from './InfoDot'
import { Collapsible } from './Collapsible'
import { SectionNav } from './SectionNav'

const PLANET_NAV = [
  { id: 'map', label: '◍ Live map' },
  { id: 'pulse', label: '◎ Your pulse' },
  { id: 'streams', label: '↕ Streams' },
  { id: 'maps', label: '🗺 Maps' },
  { id: 'balance', label: '⚖ Balance' },
  { id: 'history', label: '📈 Trends' },
  { id: 'doughnut', label: '◉ Doughnut' },
  { id: 'law', label: '§ Law' },
  { id: 'seed', label: '🌱 Seed' },
  { id: 'soil', label: '🪱 Soil' },
]
import { DailyBriefing } from './DailyBriefing'
import { PlanetSound } from './PlanetSound'
import { ShareSnapshot } from './ShareSnapshot'
import { VitalsStrip } from './VitalsStrip'
import { YourPulse } from './YourPulse'
import { WorldMap } from './WorldMap'
import { LiveStreamPanel } from './LiveStreamPanel'
import { BalanceMeter } from './BalanceMeter'
import { Doughnut } from './Doughnut'
import { DoughnutMovement } from './DoughnutMovement'
import { PlanetHistory } from './PlanetHistory'
import { DualMap } from './DualMap'
import { LawTracker } from './LawTracker'
import { SeedSovereignty } from './SeedSovereignty'
import { SoilNotOil } from './SoilNotOil'
import { ScenarioPanel } from './ScenarioPanel'
import { AdvicePanel } from './AdvicePanel'

/** The original "living planet" dashboard, driven by the live-signal feeds. */
export function PlanetPulsePage({ live }: { live: LiveState }) {
  const { signals, loading, lastUpdated } = live

  const vitals = signals.filter((s) => s.stream === 'neutral')
  const crisis = signals.filter((s) => s.stream === 'crisis')
  const regen = signals.filter((s) => s.stream === 'regeneration')
  const balance = liveBalance(signals)

  const rows: EarthSnapshot[] = signals
    .filter((s) => s.stream !== 'neutral')
    .map((s) => ({
      indicator_name: s.key,
      value: typeof s.value === 'number' ? s.value : 0,
      unit: s.unit,
      source: s.source,
      stream: s.stream as 'crisis' | 'regeneration',
      region: 'Global',
      fetched_at: s.updatedAt,
    }))

  return (
    <>
      <SectionNav items={PLANET_NAV} />

      {signals.length > 0 && (
        <div className="mb-5 space-y-3">
          <DailyBriefing signals={signals} balance={balance} />
          <div className="grid gap-3 sm:grid-cols-2">
            <PlanetSound signals={signals} balance={balance} />
            <ShareSnapshot signals={signals} balance={balance} />
          </div>
        </div>
      )}

      <VitalsStrip signals={vitals} lastUpdated={lastUpdated} loading={loading} />

      <div id="map" className="mt-5 scroll-mt-20">
        <WorldMap />
      </div>

      <div id="pulse" className="mt-5 scroll-mt-20">
        <YourPulse />
      </div>

      {loading && signals.length === 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-2xl bg-soil-900/60" />
          <div className="h-80 animate-pulse rounded-2xl bg-soil-900/60" />
        </div>
      ) : (
        <>
          <div className="mt-6 mb-2 flex items-center justify-center gap-2 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-sand-500">
              Not left or right — <span className="text-ember-300">below the line</span> or{' '}
              <span className="text-moss-300">above</span> it
            </span>
            <InfoDot topic="the_line" label="Above & below the line" />
          </div>

          <div id="streams" className="grid gap-5 scroll-mt-20 lg:grid-cols-2">
            <LiveStreamPanel stream="crisis" signals={crisis} />
            <LiveStreamPanel stream="regeneration" signals={regen} />
          </div>

          <Collapsible id="maps">
            <ErrorBoundary area="Maps">
              <DualMap />
            </ErrorBoundary>
          </Collapsible>

          <div id="balance" className="mt-5 scroll-mt-20">
            <BalanceMeter balance={balance} />
            <p className="mt-2 text-[0.68rem] leading-snug text-sand-700">
              A rough directional composite of the ecological indicators above —
              greenhouse gases, air, forests, land use, water, farming intensity
              and protected areas. It deliberately excludes human-access metrics
              (electricity, water, cooking) and can't capture drivers with no open
              live data — pesticide toxicity, data-centre demand, regenerative
              farming — nor trajectories. Treat it as a rough signal, not a verdict.
            </p>
          </div>

          <Collapsible id="history">
            <ErrorBoundary area="Planet history">
              <PlanetHistory signals={signals} balance={balance} />
            </ErrorBoundary>
          </Collapsible>

          <Collapsible id="doughnut">
            <ErrorBoundary area="Doughnut">
              <Doughnut signals={signals} />
            </ErrorBoundary>
          </Collapsible>

          <Collapsible id="movement">
            <ErrorBoundary area="Doughnut movement">
              <DoughnutMovement />
            </ErrorBoundary>
          </Collapsible>

          <Collapsible id="law">
            <ErrorBoundary area="Law tracker">
              <LawTracker />
            </ErrorBoundary>
          </Collapsible>

          <Collapsible id="seed">
            <ErrorBoundary area="Seed sovereignty">
              <SeedSovereignty />
            </ErrorBoundary>
          </Collapsible>

          <Collapsible id="soil">
            <ErrorBoundary area="Soil not oil">
              <SoilNotOil />
            </ErrorBoundary>
          </Collapsible>

          <ErrorBoundary area="Scenarios panel">
            <ScenarioPanel rows={rows} />
          </ErrorBoundary>
          <ErrorBoundary area="Advice panel">
            <AdvicePanel rows={rows} balance={balance} />
          </ErrorBoundary>
        </>
      )}
    </>
  )
}
