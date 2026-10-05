import { useLocalPulse, type LocalPulse } from '../hooks/useLocalPulse'
import { InfoDot } from './InfoDot'

function uvWord(uv: number): string {
  if (uv < 3) return 'low'
  if (uv < 6) return 'moderate'
  if (uv < 8) return 'high'
  if (uv < 11) return 'very high'
  return 'extreme'
}

function pmWord(pm: number): { word: string; cls: string } {
  if (pm < 10) return { word: 'clean', cls: 'text-moss-300' }
  if (pm < 25) return { word: 'moderate', cls: 'text-sand-200' }
  if (pm < 50) return { word: 'unhealthy (sensitive)', cls: 'text-ember-300' }
  if (pm < 75) return { word: 'unhealthy', cls: 'text-ember-300' }
  return { word: 'very unhealthy', cls: 'text-ember-200' }
}

function Stat({
  label,
  value,
  sub,
  valueCls = 'text-sand-100',
}: {
  label: string
  value: string
  sub?: string
  valueCls?: string
}) {
  return (
    <div className="rounded-xl border border-soil-700/60 bg-soil-800/40 p-3.5">
      <div className="text-[0.7rem] font-medium text-sand-400">{label}</div>
      <div className={`stat-num mt-1 text-xl ${valueCls}`}>{value}</div>
      {sub && <div className="mt-0.5 text-[0.65rem] leading-snug text-sand-500">{sub}</div>}
    </div>
  )
}

function Cards({ d }: { d: LocalPulse }) {
  const pm = d.pm25 != null ? pmWord(d.pm25) : null
  const anomPos = (d.anomaly ?? 0) > 0
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {d.temp != null && (
        <Stat
          label="Temperature now"
          value={`${Math.round(d.temp)}°C`}
          sub={
            d.tempMax != null && d.tempMin != null
              ? `today ${Math.round(d.tempMin)}–${Math.round(d.tempMax)}°`
              : undefined
          }
        />
      )}
      {d.anomaly != null && (
        <Stat
          label="Heat vs normal"
          value={`${anomPos ? '+' : ''}${d.anomaly}°C`}
          sub={d.baselineLabel ?? undefined}
          valueCls={anomPos ? 'text-ember-200' : 'text-moss-200'}
        />
      )}
      {pm && (
        <Stat
          label="Air quality (PM2.5)"
          value={`${Math.round(d.pm25!)} µg/m³`}
          sub={pm.word}
          valueCls={pm.cls}
        />
      )}
      {d.uv != null && (
        <Stat label="UV index" value={`${d.uv.toFixed(1)}`} sub={uvWord(d.uv)} />
      )}
      {d.nearestQuake && (
        <Stat
          label="Nearest quake (7d)"
          value={`M${d.nearestQuake.mag.toFixed(1)}`}
          sub={`${d.nearestQuake.km.toLocaleString()} km away`}
        />
      )}
      {d.elevation != null && (
        <Stat
          label="Your elevation"
          value={`${Math.round(d.elevation)} m`}
          sub={d.elevation < 10 ? 'low-lying — sea-level exposed' : 'above sea level'}
          valueCls={d.elevation < 10 ? 'text-ember-200' : 'text-sand-100'}
        />
      )}
      {d.humidity != null && d.wind != null && (
        <Stat
          label="Humidity · wind"
          value={`${Math.round(d.humidity)}%`}
          sub={`wind ${Math.round(d.wind)} km/h`}
        />
      )}
    </div>
  )
}

function Localize({ d, loading }: { d: LocalPulse; loading: boolean }) {
  const l = d.local
  const anchors = l
    ? [
        { label: 'Markets', value: l.markets },
        { label: 'Farm shops', value: l.farmShops },
        { label: 'Community gardens', value: l.gardens },
      ]
    : []
  return (
    <div className="mt-4 rounded-xl border border-moss-900/50 bg-moss-950/20 p-3.5">
      <div className="flex items-center gap-1.5">
        <span className="text-moss-400">⟲</span>
        <span className="text-xs font-medium text-sand-200">Relocalize — the living economy near you</span>
      </div>
      {loading ? (
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[3.25rem] animate-pulse rounded-lg bg-soil-800/50" />
          ))}
        </div>
      ) : l && anchors.some((a) => a.value > 0) ? (
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {anchors.map((a) => (
            <div key={a.label} className="rounded-lg border border-soil-700/50 bg-soil-800/40 p-2.5 text-center">
              <div className="stat-num text-lg text-moss-200">{a.value}</div>
              <div className="text-[0.6rem] leading-tight text-sand-500">{a.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-1.5 text-[0.68rem] text-sand-500">
          No local-food spots mapped within 25 km yet — the directories below are the place to start one.
        </p>
      )}
      <p className="mt-2 text-[0.68rem] leading-snug text-sand-500">
        Find your people:{' '}
        <a href="https://ecovillage.org/projects/map/" target="_blank" rel="noopener noreferrer" className="text-moss-300 underline decoration-moss-800 hover:decoration-moss-400">
          ecovillages
        </a>
        {' · '}
        <a href="https://transitionnetwork.org/transition-near-me/" target="_blank" rel="noopener noreferrer" className="text-moss-300 underline decoration-moss-800 hover:decoration-moss-400">
          Transition initiatives
        </a>
        {' near you'}
      </p>
      {(l || loading) && (
        <p className="mt-1 text-[0.55rem] text-sand-700">
          within ~25 km · OpenStreetMap
        </p>
      )}
    </div>
  )
}

export function YourPulse() {
  const { status, data, locate, localLoading } = useLocalPulse()

  return (
    <section className="rounded-2xl border border-soil-700/60 bg-soil-900/50 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-sand-100">
            <span className="text-moss-400">◎</span> Your pulse
            <InfoDot topic="your_pulse" label="Your pulse" />
            {status === 'ready' && data && (
              <span className="text-sm font-normal text-sand-400">· {data.place}</span>
            )}
          </h2>
          <p className="text-xs text-sand-500">
            The planet's signals, where you are — local conditions, and the living economy to plug into.
          </p>
        </div>
        {(status === 'idle' || status === 'denied' || status === 'error') && (
          <button
            onClick={locate}
            className="rounded-lg border border-moss-700/60 bg-moss-900/40 px-3 py-1.5 text-xs font-medium text-moss-100 transition-colors hover:border-moss-600 hover:bg-moss-900/70"
          >
            {status === 'idle' ? 'Show my local pulse' : 'Try again'}
          </button>
        )}
      </div>

      {(status === 'locating' || status === 'loading') && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[4.75rem] animate-pulse rounded-xl bg-soil-800/50" />
          ))}
        </div>
      )}

      {status === 'denied' && (
        <p className="text-xs text-sand-500">
          Location access was blocked. Your coordinates never leave your browser except to
          fetch local weather, air and seismic data — enable location and try again.
        </p>
      )}
      {status === 'error' && (
        <p className="text-xs text-sand-500">
          Couldn't read your location. You can try again, or check that your browser allows it.
        </p>
      )}

      {status === 'ready' && data && (
        <>
          <Cards d={data} />
          <Localize d={data} loading={localLoading} />
          <p className="mt-3 text-[0.6rem] text-sand-700">
            Open-Meteo · USGS · BigDataCloud · OpenStreetMap · coordinates rounded to ~1 km and used only for these lookups
          </p>
        </>
      )}
    </section>
  )
}
