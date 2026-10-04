import { useMemo } from 'react'
import { LAND_RINGS } from '../data/worldOutline'
import {
  FORCE_MARKERS,
  DEGRADATION_SITES,
  DEGRADE_COLOR,
  DEGRADE_LEGEND,
  REGEN_HUBS,
  REGEN_LEGEND,
  REGEN_COLOR,
  REGEN_DIRECTORIES,
} from '../data/maps'
import { InfoDot } from './InfoDot'

const W = 360
const H = 180
const px = (lon: number) => lon + 180
const py = (lat: number) => 90 - lat

interface Pt {
  lon: number
  lat: number
  r: number
  color: string
  title: string
  ring?: boolean
  href?: string
}

function MiniMap({ points, landFill = '#1b2c22', landStroke = '#2c4234' }: { points: Pt[]; landFill?: string; landStroke?: string }) {
  const landPaths = useMemo(
    () =>
      LAND_RINGS.map((ring) => {
        let d = ''
        for (let i = 0; i < ring.length; i++) {
          const [lon, lat] = ring[i]
          d += `${i ? 'L' : 'M'}${px(lon).toFixed(1)} ${py(lat).toFixed(1)}`
        }
        return d + 'Z'
      }),
    [],
  )
  return (
    <div className="overflow-hidden rounded-xl border border-soil-800/80 bg-[#0b1410]">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" style={{ aspectRatio: '2 / 1' }}>
        <g fill={landFill} stroke={landStroke} strokeWidth="0.25">
          {landPaths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <g>
          {points.map((p, i) => {
            const marker = (
              <g key={i} style={p.href ? { cursor: 'pointer' } : undefined}>
                {p.ring && (
                  <circle cx={px(p.lon)} cy={py(p.lat)} r={p.r * 2.2} fill={p.color} fillOpacity="0.18">
                    <animate attributeName="r" values={`${p.r};${p.r * 2.6};${p.r}`} dur="3s" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={px(p.lon).toFixed(1)} cy={py(p.lat).toFixed(1)} r={p.r} fill={p.color} fillOpacity={p.ring ? 0.95 : 0.82} stroke={p.color} strokeOpacity="0.35" strokeWidth={p.r * 0.7}>
                  <title>{p.title}{p.href ? ' (click to open)' : ''}</title>
                </circle>
              </g>
            )
            if (!p.href) return marker
            const external = !p.href.startsWith('#')
            return (
              <a key={i} href={p.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {marker}
              </a>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

export function DualMap() {
  const belowPoints: Pt[] = useMemo(() => {
    const sites: Pt[] = DEGRADATION_SITES.map((s) => ({
      lon: s.lon,
      lat: s.lat,
      r: 2.0,
      color: DEGRADE_COLOR[s.kind],
      title: `${s.title} — ${s.note}`,
    }))
    const forces: Pt[] = FORCE_MARKERS.map((m) => ({
      lon: m.lon,
      lat: m.lat,
      r: 2.3,
      color: '#e85c43',
      title: `${m.title} — ${m.note}`,
      ring: true,
      href: '#world', // the forces live on the World tab
    }))
    return [...sites, ...forces]
  }, [])

  const abovePoints: Pt[] = useMemo(
    () =>
      REGEN_HUBS.map((h) => ({
        lon: h.lon,
        lat: h.lat,
        r: 2.1,
        color: REGEN_COLOR[h.kind],
        title: `${h.title} — ${h.note}`,
        ring: true,
        href: h.url,
      })),
    [],
  )

  return (
    <section className="mt-6 rounded-2xl border border-soil-700/60 bg-soil-900/50 p-5 sm:p-6">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="flex items-center gap-2 font-display text-xl text-sand-100">
          <span className="text-moss-400">◍</span> Above &amp; below the line — mapped
          <InfoDot topic="the_line" label="Above & below the line" />
        </h2>
        <span className="text-xs text-sand-500">where the world is breaking &amp; healing</span>
      </div>
      <p className="mb-4 max-w-2xl text-sm text-sand-500">
        Two readings of the same planet: the strain and the geopolitics pulling it down, and the
        places quietly building it back up.
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Below the line */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-ember-400" />
            <span className="eyebrow text-ember-200">Below the line</span>
            <span className="ml-auto text-[0.7rem] text-sand-500">
              extraction, degradation &amp; the <span className="stat-num text-ember-200">{FORCE_MARKERS.length}</span> forces
            </span>
          </div>
          <MiniMap points={belowPoints} />
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.65rem] text-sand-400">
            {DEGRADE_LEGEND.map((l) => (
              <Legend key={l.kind} color={DEGRADE_COLOR[l.kind]} label={l.label} />
            ))}
            <Legend color="#e85c43" label="Geopolitical forces" />
          </div>
        </div>

        {/* Above the line */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-moss-400" />
            <span className="eyebrow text-moss-200">Above the line</span>
            <span className="ml-auto text-[0.7rem] text-sand-500">
              <span className="stat-num text-moss-200">{REGEN_HUBS.length}</span> places building better
            </span>
          </div>
          <MiniMap points={abovePoints} landFill="#16281e" landStroke="#294d38" />
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.65rem] text-sand-400">
            {REGEN_LEGEND.map((l) => (
              <Legend key={l.kind} color={l.color} label={l.label} />
            ))}
          </div>
          <p className="mt-2.5 text-[0.7rem] text-sand-500">
            Explore the full living networks:{' '}
            {REGEN_DIRECTORIES.map((d, i) => (
              <span key={d.label}>
                {i > 0 && ' · '}
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-moss-300 underline decoration-moss-800 hover:decoration-moss-400">
                  {d.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[0.6rem] text-sand-700">
        Both maps are curated layers of real places — below: extraction &amp; degradation hotspots plus the{' '}
        {FORCE_MARKERS.length} World Pulse forces; above: ecovillages, Doughnut cities, regen networks and
        Rights-of-Nature wins. Click a green point to visit it; a red force opens the World tab. Live
        earthquakes &amp; hazards are on the Live planet map above; what's near you is in Your Pulse.
      </p>
    </section>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
