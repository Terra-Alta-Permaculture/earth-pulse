import { useEffect, useState } from 'react'

export type EventKind =
  | 'quake'
  | 'wildfires'
  | 'severeStorms'
  | 'volcanoes'
  | 'seaLakeIce'
  | 'floods'
  | 'other'

export interface MapPoint {
  lon: number
  lat: number
  kind: EventKind
  label: string
  /** Earthquake magnitude, when applicable — drives marker size. */
  mag?: number
}

export interface WorldEventsState {
  points: MapPoint[]
  quakeCount: number
  hazardCount: number
  loading: boolean
  updatedAt: number | null
}

const USGS =
  'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'
const EONET = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=30'

const CATEGORY_TO_KIND: Record<string, EventKind> = {
  wildfires: 'wildfires',
  severeStorms: 'severeStorms',
  volcanoes: 'volcanoes',
  seaLakeIce: 'seaLakeIce',
  floods: 'floods',
}

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  return res.json()
}

async function fetchQuakes(): Promise<MapPoint[]> {
  const d = await getJson(USGS)
  const feats: any[] = d?.features ?? []
  const pts: MapPoint[] = []
  for (const f of feats) {
    const c = f?.geometry?.coordinates
    const mag = f?.properties?.mag
    if (!Array.isArray(c) || typeof c[0] !== 'number') continue
    pts.push({
      lon: c[0],
      lat: c[1],
      kind: 'quake',
      mag: typeof mag === 'number' ? mag : undefined,
      label: `M${typeof mag === 'number' ? mag.toFixed(1) : '?'} — ${f?.properties?.place ?? 'earthquake'}`,
    })
  }
  return pts
}

async function fetchHazards(): Promise<MapPoint[]> {
  const d = await getJson(EONET)
  const events: any[] = d?.events ?? []
  const pts: MapPoint[] = []
  for (const e of events) {
    const catId = e?.categories?.[0]?.id as string | undefined
    const kind: EventKind = (catId && CATEGORY_TO_KIND[catId]) || 'other'
    // Use the most recent geometry with point coordinates.
    const geoms: any[] = e?.geometry ?? []
    let coord: any = null
    for (let i = geoms.length - 1; i >= 0; i--) {
      const g = geoms[i]
      if (g?.type === 'Point' && Array.isArray(g.coordinates)) {
        coord = g.coordinates
        break
      }
    }
    if (!coord || typeof coord[0] !== 'number') continue
    pts.push({
      lon: coord[0],
      lat: coord[1],
      kind,
      label: e?.title ?? e?.categories?.[0]?.title ?? 'event',
    })
  }
  return pts
}

/**
 * Live geolocated events for the world map: earthquakes (USGS, past week) and
 * open natural-hazard events (NASA EONET). Independent fetches; a failure of one
 * never blanks the other. Refreshes every 5 minutes.
 */
export function useWorldEvents(): WorldEventsState {
  const [state, setState] = useState<WorldEventsState>({
    points: [],
    quakeCount: 0,
    hazardCount: 0,
    loading: true,
    updatedAt: null,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [q, h] = await Promise.allSettled([fetchQuakes(), fetchHazards()])
      if (cancelled) return
      const quakes = q.status === 'fulfilled' ? q.value : []
      const hazards = h.status === 'fulfilled' ? h.value : []
      setState({
        points: [...hazards, ...quakes], // quakes drawn last (on top)
        quakeCount: quakes.length,
        hazardCount: hazards.length,
        loading: false,
        updatedAt: Date.now(),
      })
    }

    load()
    const id = setInterval(load, 5 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return state
}
