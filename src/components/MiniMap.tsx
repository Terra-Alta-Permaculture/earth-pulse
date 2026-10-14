import { useMemo } from 'react'
import { LAND_RINGS } from '../data/worldOutline'

const W = 360
const H = 180
const px = (lon: number) => lon + 180
const py = (lat: number) => 90 - lat

export interface MapPoint {
  lon: number
  lat: number
  r?: number
  color?: string
  title: string
  href?: string
}

/** Small equirectangular world map with curated point markers. */
export function MiniMap({
  points,
  landFill = '#17271d',
  landStroke = '#294d38',
}: {
  points: MapPoint[]
  landFill?: string
  landStroke?: string
}) {
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
            const r = p.r ?? 2
            const color = p.color ?? '#79b568'
            const marker = (
              <circle
                key={i}
                cx={px(p.lon).toFixed(1)}
                cy={py(p.lat).toFixed(1)}
                r={r}
                fill={color}
                fillOpacity="0.85"
                stroke={color}
                strokeOpacity="0.35"
                strokeWidth={r * 0.7}
                style={p.href ? { cursor: 'pointer' } : undefined}
              >
                <title>
                  {p.title}
                  {p.href ? ' (click to open)' : ''}
                </title>
              </circle>
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
