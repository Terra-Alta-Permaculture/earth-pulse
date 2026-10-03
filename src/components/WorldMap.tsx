import { useMemo } from 'react'
import { LAND_RINGS } from '../data/worldOutline'
import { useWorldEvents, type EventKind, type MapPoint } from '../hooks/useWorldEvents'
import { InfoDot } from './InfoDot'

// Equirectangular projection into a 360×180 viewBox: x = lon+180, y = 90-lat.
const W = 360
const H = 180
const px = (lon: number) => lon + 180
const py = (lat: number) => 90 - lat

const KIND_STYLE: Record<EventKind, { color: string; label: string }> = {
  quake: { color: '#e0a852', label: 'Earthquakes' },
  wildfires: { color: '#ef6a3a', label: 'Wildfires' },
  severeStorms: { color: '#6aa9e0', label: 'Storms' },
  volcanoes: { color: '#ff5b4a', label: 'Volcanoes' },
  seaLakeIce: { color: '#9fd8e0', label: 'Ice' },
  floods: { color: '#5f8fe0', label: 'Floods' },
  other: { color: '#c3b28f', label: 'Other' },
}

function radius(p: MapPoint): number {
  if (p.kind === 'quake') {
    const m = p.mag ?? 2.5
    return Math.max(0.5, Math.min(3.2, 0.4 + (m - 2.5) * 0.42))
  }
  return 1.15
}

export function WorldMap() {
  const { points, quakeCount, hazardCount, loading, updatedAt } = useWorldEvents()

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

  // Which kinds are actually present, for the legend.
  const legendKinds = useMemo(() => {
    const set = new Set<EventKind>()
    for (const p of points) set.add(p.kind)
    const order: EventKind[] = ['quake', 'wildfires', 'severeStorms', 'volcanoes', 'floods', 'seaLakeIce', 'other']
    return order.filter((k) => set.has(k))
  }, [points])

  return (
    <section className="rounded-2xl border border-soil-700/60 bg-soil-900/50 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-sand-100">
            <span className="text-moss-400">◍</span> Live planet map
            <InfoDot topic="world_map" label="Live planet map" />
          </h2>
          <p className="text-xs text-sand-500">
            Real-time earthquakes and active natural hazards, right now.
          </p>
        </div>
        <div className="text-right text-[0.7rem] text-sand-400">
          {loading ? (
            <span className="text-sand-600">connecting…</span>
          ) : (
            <>
              <span className="stat-num text-ember-200">{quakeCount}</span> quakes ·{' '}
              <span className="stat-num text-sand-200">{hazardCount}</span> hazards
            </>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-soil-800/80 bg-[#0b1410]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          style={{ aspectRatio: '2 / 1' }}
          role="img"
          aria-label="World map of live earthquakes and natural events"
        >
          {/* Ocean grid — faint graticule for depth */}
          <g stroke="#16261d" strokeWidth="0.3">
            {[-120, -60, 0, 60, 120].map((lon) => (
              <line key={`v${lon}`} x1={px(lon)} y1={0} x2={px(lon)} y2={H} />
            ))}
            {[-60, -30, 0, 30, 60].map((lat) => (
              <line key={`h${lat}`} x1={0} y1={py(lat)} x2={W} y2={py(lat)} />
            ))}
          </g>

          {/* Land */}
          <g fill="#1b2c22" stroke="#2c4234" strokeWidth="0.25">
            {landPaths.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>

          {/* Events */}
          <g>
            {points.map((p, i) => {
              const st = KIND_STYLE[p.kind]
              const r = radius(p)
              return (
                <circle
                  key={i}
                  cx={px(p.lon).toFixed(1)}
                  cy={py(p.lat).toFixed(1)}
                  r={r.toFixed(2)}
                  fill={st.color}
                  fillOpacity={p.kind === 'quake' ? 0.75 : 0.85}
                  stroke={st.color}
                  strokeOpacity="0.35"
                  strokeWidth={r * 0.9}
                >
                  <title>{p.label}</title>
                </circle>
              )
            })}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {legendKinds.map((k) => (
          <span key={k} className="flex items-center gap-1.5 text-[0.7rem] text-sand-400">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: KIND_STYLE[k].color }}
            />
            {KIND_STYLE[k].label}
          </span>
        ))}
        <span className="ml-auto text-[0.6rem] text-sand-700">
          USGS · NASA EONET{updatedAt ? ' · hover a point for detail' : ''}
        </span>
      </div>
    </section>
  )
}
