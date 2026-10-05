import { useCallback, useState } from 'react'
import { setEmergePlace } from '../lib/emerge'

export type LocalStatus =
  | 'idle'
  | 'locating'
  | 'loading'
  | 'ready'
  | 'denied'
  | 'error'

export interface NearestQuake {
  mag: number
  place: string
  km: number
}

export interface LocalPulse {
  place: string
  /** Rounded to ~1 km. */
  lat: number
  lon: number
  temp: number | null
  tempMax: number | null
  tempMin: number | null
  uv: number | null
  humidity: number | null
  wind: number | null
  /** Today's mean temp minus the ~10-year average for this date & place. */
  anomaly: number | null
  baselineLabel: string | null
  pm25: number | null
  elevation: number | null
  nearestQuake: NearestQuake | null
  /** Local-food & relocalization anchors within ~25 km (OpenStreetMap). */
  local: LocalMovements | null
}

export interface LocalMovements {
  markets: number
  farmShops: number
  gardens: number
}

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  return res.json()
}

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371
  const dLat = ((bLat - aLat) * Math.PI) / 180
  const dLon = ((bLon - aLon) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const d = await getJson(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
  )
  const parts = [d.city || d.locality, d.principalSubdivision, d.countryName].filter(Boolean)
  // Trim overly long official country names.
  const place = parts.slice(0, 2).join(', ')
  return place || d.countryName || 'your location'
}

async function weather(lat: number, lon: number) {
  const d = await getJson(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index` +
      `&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean&timezone=auto&forecast_days=1`,
  )
  const c = d.current ?? {}
  return {
    temp: c.temperature_2m ?? null,
    humidity: c.relative_humidity_2m ?? null,
    wind: c.wind_speed_10m ?? null,
    uv: c.uv_index ?? null,
    tempMax: d.daily?.temperature_2m_max?.[0] ?? null,
    tempMin: d.daily?.temperature_2m_min?.[0] ?? null,
    todayMean: d.daily?.temperature_2m_mean?.[0] ?? null,
  }
}

async function airQuality(lat: number, lon: number): Promise<number | null> {
  const d = await getJson(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5`,
  )
  const v = d?.current?.pm2_5
  return typeof v === 'number' ? v : null
}

async function elevation(lat: number, lon: number): Promise<number | null> {
  const d = await getJson(
    `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`,
  )
  const v = d?.elevation?.[0]
  return typeof v === 'number' ? v : null
}

async function nearestQuake(lat: number, lon: number): Promise<NearestQuake | null> {
  const d = await getJson(
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson',
  )
  const feats: any[] = d?.features ?? []
  let best: NearestQuake | null = null
  for (const f of feats) {
    const c = f?.geometry?.coordinates
    if (!Array.isArray(c) || typeof c[0] !== 'number') continue
    const km = haversineKm(lat, lon, c[1], c[0])
    if (!best || km < best.km) {
      best = {
        km: Math.round(km),
        mag: typeof f.properties?.mag === 'number' ? f.properties.mag : 0,
        place: f.properties?.place ?? 'unknown',
      }
    }
  }
  return best
}

/** Local-food & relocalization anchors near you, via OpenStreetMap (Overpass). */
async function localMovements(lat: number, lon: number): Promise<LocalMovements | null> {
  const q = `[out:json][timeout:25];
(
  nwr["amenity"="marketplace"](around:25000,${lat},${lon});
  nwr["shop"="farm"](around:25000,${lat},${lon});
  nwr["leisure"="garden"]["garden:type"="community"](around:25000,${lat},${lon});
);
out tags qt;`
  // The public Overpass instances are slow and rate-limit, so try a few mirrors.
  const endpoints = [
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass-api.de/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
  ]
  let d: any = null
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(q),
      })
      if (!res.ok) continue
      d = await res.json()
      if (d?.elements) break
    } catch {
      /* try next mirror */
    }
  }
  if (!d?.elements) throw new Error('overpass unavailable')
  const els: any[] = d.elements ?? []
  const count = (pred: (t: any) => boolean) =>
    els.filter((e) => pred(e.tags ?? {})).length
  return {
    markets: count((t) => t.amenity === 'marketplace'),
    farmShops: count((t) => t.shop === 'farm'),
    gardens: count((t) => t.leisure === 'garden'),
  }
}

/** Heat anomaly: today's mean vs the average for this date over ~10 past years. */
async function heatAnomaly(
  lat: number,
  lon: number,
  todayMean: number | null,
): Promise<{ anomaly: number | null; label: string | null }> {
  if (todayMean == null) return { anomaly: null, label: null }
  const now = new Date()
  const endYear = now.getUTCFullYear() - 1
  const startYear = endYear - 9
  const d = await getJson(
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
      `&start_date=${startYear}-01-01&end_date=${endYear}-12-31&daily=temperature_2m_mean&timezone=auto`,
  )
  const times: string[] = d?.daily?.time ?? []
  const means: number[] = d?.daily?.temperature_2m_mean ?? []
  const mm = now.getUTCMonth() + 1
  const dd = now.getUTCDate()
  const target = new Date(Date.UTC(2000, mm - 1, dd))
  const sample: number[] = []
  for (let i = 0; i < times.length; i++) {
    const v = means[i]
    if (typeof v !== 'number') continue
    const [, m, day] = times[i].split('-').map(Number)
    const cur = new Date(Date.UTC(2000, m - 1, day))
    // within ±5 calendar days of today (across all years)
    const diff = Math.abs((cur.getTime() - target.getTime()) / 86_400_000)
    if (diff <= 5 || diff >= 360) sample.push(v)
  }
  if (sample.length < 10) return { anomaly: null, label: null }
  const baseline = sample.reduce((a, b) => a + b, 0) / sample.length
  return {
    anomaly: Number((todayMean - baseline).toFixed(1)),
    label: `${startYear}–${endYear} avg for this date`,
  }
}

export function useLocalPulse() {
  const [status, setStatus] = useState<LocalStatus>('idle')
  const [data, setData] = useState<LocalPulse | null>(null)
  const [localLoading, setLocalLoading] = useState(false)

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('error')
      return
    }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // Round to ~1km for privacy before any network call leaves the browser.
        const lat = Number(pos.coords.latitude.toFixed(2))
        const lon = Number(pos.coords.longitude.toFixed(2))
        setStatus('loading')
        const [place, wx, pm25, elev, quake] = await Promise.all([
          reverseGeocode(lat, lon).catch(() => 'your location'),
          weather(lat, lon).catch(() => null),
          airQuality(lat, lon).catch(() => null),
          elevation(lat, lon).catch(() => null),
          nearestQuake(lat, lon).catch(() => null),
        ])
        const anom = wx
          ? await heatAnomaly(lat, lon, wx.todayMean).catch(() => ({ anomaly: null, label: null }))
          : { anomaly: null, label: null }
        setData({
          place,
          lat,
          lon,
          temp: wx?.temp ?? null,
          tempMax: wx?.tempMax ?? null,
          tempMin: wx?.tempMin ?? null,
          uv: wx?.uv ?? null,
          humidity: wx?.humidity ?? null,
          wind: wx?.wind ?? null,
          anomaly: anom.anomaly,
          baselineLabel: anom.label,
          pm25,
          elevation: elev,
          nearestQuake: quake,
          local: null,
        })
        setStatus('ready')
        setEmergePlace({ lat, lng: lon, place: place.split(',')[0] })

        // Localization (OpenStreetMap/Overpass) is slow — load it in the
        // background so it never blocks the core pulse.
        setLocalLoading(true)
        localMovements(lat, lon)
          .then((local) => setData((prev) => (prev ? { ...prev, local } : prev)))
          .catch(() => {})
          .finally(() => setLocalLoading(false))
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error')
      },
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 600_000 },
    )
  }, [])

  return { status, data, locate, localLoading }
}
