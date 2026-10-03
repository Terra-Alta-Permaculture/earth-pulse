import { useMemo } from 'react'
import type { LiveSignal } from '../data/liveSources'
import { resolveBoundaries, STATUS_META, type BoundaryStatus } from '../data/planetaryBoundaries'
import { useSocialFoundation, FOUNDATION_STATUS, type FoundationStatus } from '../data/socialFoundation'
import { doughnutScore } from '../lib/doughnutScore'
import { InfoDot } from './InfoDot'

const CX = 120
const CY = 120
const HUB = 30
const FLOOR_R = 66 // social-foundation line
const CEIL_R = 84 // ecological-ceiling line

// Ecological overshoot beyond the ceiling line (outward).
const ECO_OVER: Record<BoundaryStatus, number> = { safe: 0, risk: 7, crossed: 24 }

function pt(r: number, ang: number): [number, number] {
  const a = ((ang - 90) * Math.PI) / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}
function wedge(ri: number, ro: number, a0: number, a1: number): string {
  const [x0o, y0o] = pt(ro, a0)
  const [x1o, y1o] = pt(ro, a1)
  const [x1i, y1i] = pt(ri, a1)
  const [x0i, y0i] = pt(ri, a0)
  const large = a1 - a0 > 180 ? 1 : 0
  return `M${x0o.toFixed(2)} ${y0o.toFixed(2)} A${ro} ${ro} 0 ${large} 1 ${x1o.toFixed(2)} ${y1o.toFixed(2)} L${x1i.toFixed(2)} ${y1i.toFixed(2)} A${ri} ${ri} 0 ${large} 0 ${x0i.toFixed(2)} ${y0i.toFixed(2)} Z`
}

function Cards<T extends { key: string; name: string; desc: string; context?: string; status: string }>({
  title,
  count,
  items,
  meta,
}: {
  title: string
  count: string
  items: T[]
  meta: Record<string, { label: string; color: string }>
}) {
  return (
    <div>
      <p className="eyebrow mb-2">
        {title} <span className="text-sand-600">· {count}</span>
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((d) => {
          const m = meta[d.status]
          return (
            <div key={d.key} className="rounded-lg border border-soil-700/50 bg-soil-800/40 p-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 flex-none rounded-full" style={{ backgroundColor: m.color }} />
                <span className="text-xs font-medium text-sand-100">{d.name}</span>
              </div>
              {d.context && <p className="mt-0.5 stat-num text-[0.62rem] text-sand-400">{d.context}</p>}
              <p className="text-[0.6rem]" style={{ color: m.color }}>
                {m.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Doughnut({ signals }: { signals: LiveSignal[] }) {
  const eco = useMemo(() => resolveBoundaries(signals), [signals])
  const { dims } = useSocialFoundation()

  const ecoSeg = 360 / eco.length
  const socSeg = dims.length ? 360 / dims.length : 30
  const crossed = eco.filter((b) => b.status === 'crossed').length
  const shortfalls = dims.filter((d) => d.status !== 'met').length

  // Safe & just space score (shared with the daily briefing).
  const ds = doughnutScore(dims, eco)
  const score = ds?.score ?? null
  const total = ds?.total ?? dims.length + eco.length
  const fullyIn = ds?.fullyIn ?? 0
  const beyond = ds?.beyond ?? 0
  const ready = ds != null
  const scoreColor = score == null ? '#b8ab90' : score >= 60 ? '#6fae57' : score >= 35 ? '#e0a852' : '#d9604a'

  return (
    <section className="mt-6 rounded-2xl border border-soil-700/60 bg-soil-900/50 p-5 sm:p-6">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="flex items-center gap-2 font-display text-xl text-sand-100">
          <span className="text-moss-400">◉</span> The Doughnut
          <InfoDot topic="doughnut" label="The Doughnut" />
        </h2>
        <span className="text-xs text-sand-500">a safe & just space for humanity</span>
      </div>
      <p className="mb-5 max-w-2xl text-sm text-sand-500">
        Below the <span className="text-sand-300">social foundation</span> people fall short of life's
        essentials; above the <span className="text-sand-300">ecological ceiling</span> we overshoot the
        planet's limits. The goal is the green ring between — Kate Raworth's Doughnut.
      </p>

      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="stat-num text-3xl leading-none" style={{ color: scoreColor }}>
          {score == null ? '–' : score}
          <span className="text-base text-sand-600">/100</span>
        </span>
        <span className="text-xs text-sand-500">
          safe &amp; just space score
          {ready && (
            <>
              {' '}· <span className="text-sand-300">{fullyIn}</span> of {total} dimensions within,{' '}
              <span className="text-ember-200">{beyond}</span> beyond a limit
            </>
          )}
        </span>
      </div>

      <div className="flex flex-col items-center gap-7 lg:flex-row lg:items-start lg:gap-8">
        {/* The ring */}
        <svg viewBox="0 0 240 240" className="w-64 flex-none sm:w-72" role="img" aria-label="Doughnut: social foundation and ecological ceiling">
          {/* safe & just space (green band between floor and ceiling) */}
          <circle cx={CX} cy={CY} r={(FLOOR_R + CEIL_R) / 2} fill="none" stroke="#2c4a33" strokeWidth={CEIL_R - FLOOR_R} strokeOpacity="0.45" />

          {/* Social foundation — shortfalls dip inward from the floor line */}
          {dims.map((d, i) => {
            const a0 = i * socSeg + 1
            const a1 = (i + 1) * socSeg - 1
            const dip = (d.shortfall / 100) * (FLOOR_R - HUB)
            const color = FOUNDATION_STATUS[d.status].color
            return (
              <path key={d.key} d={wedge(FLOOR_R - dip, FLOOR_R, a0, a1)} fill={color} fillOpacity="0.85">
                <title>{`${d.name} — ${FOUNDATION_STATUS[d.status].label} (${Math.round(d.shortfall)}%)`}</title>
              </path>
            )
          })}

          {/* Ecological ceiling — overshoots push outward from the ceiling line */}
          {eco.map((b, i) => {
            const a0 = i * ecoSeg + 1.5
            const a1 = (i + 1) * ecoSeg - 1.5
            const over = ECO_OVER[b.status]
            const color = STATUS_META[b.status].color
            return (
              <path key={b.key} d={wedge(CEIL_R - 6, CEIL_R + over, a0, a1)} fill={color} fillOpacity={b.status === 'crossed' ? 0.9 : 0.82}>
                <title>{`${b.name} — ${STATUS_META[b.status].label}`}</title>
              </path>
            )
          })}

          {/* boundary lines */}
          <circle cx={CX} cy={CY} r={FLOOR_R} fill="none" stroke="#e8dcc4" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="2 3" />
          <circle cx={CX} cy={CY} r={CEIL_R} fill="none" stroke="#e8dcc4" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="2 3" />
          {/* hub */}
          <circle cx={CX} cy={CY} r={HUB - 3} fill="#0b1410" />
          <text x={CX} y={CY + 1} textAnchor="middle" style={{ fontSize: 20, fontWeight: 600, fill: scoreColor }}>
            {score == null ? '–' : score}
          </text>
          <text x={CX} y={CY + 12} textAnchor="middle" className="fill-sand-500" style={{ fontSize: 6.5 }}>
            safe &amp; just /100
          </text>
        </svg>

        {/* Detail cards */}
        <div className="flex w-full flex-col gap-5">
          <Cards
            title="Social foundation"
            count={`${shortfalls} of ${dims.length} in shortfall`}
            items={dims.map((d) => ({ key: d.key, name: d.name, desc: d.desc, context: d.context, status: d.status }))}
            meta={FOUNDATION_STATUS as Record<string, { label: string; color: string }>}
          />
          <Cards
            title="Ecological ceiling"
            count={`${crossed} of ${eco.length} crossed`}
            items={eco.map((b) => ({ key: b.key, name: b.name, desc: b.desc, context: b.live, status: b.status }))}
            meta={STATUS_META as Record<string, { label: string; color: string }>}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {(['met', 'moderate', 'severe'] as FoundationStatus[]).map((s) => (
          <span key={s} className="flex items-center gap-1.5 text-[0.7rem] text-sand-400">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: FOUNDATION_STATUS[s].color }} />
            {FOUNDATION_STATUS[s].label}
          </span>
        ))}
        <span className="ml-auto text-[0.6rem] text-sand-700">
          Social: World Bank + cited estimates · Ceiling: Stockholm Resilience Centre 2023
        </span>
      </div>
    </section>
  )
}
