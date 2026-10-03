// Real-time planetary signals fetched directly in the browser.
// Every source here is public, keyless, and CORS-enabled — so the dashboard
// shows genuinely live, citable data with zero backend dependency. Each fetcher
// is independent; one failure never blocks the others.

export type SignalStream = 'crisis' | 'regeneration' | 'neutral'

export interface LiveSignal {
  key: string
  label: string
  value: number | string
  unit: string
  detail?: string
  stream: SignalStream
  source: string
  sourceUrl: string
  updatedAt: string // ISO
  /** For non-real-time data (e.g. annual stats), the period the value is for. */
  asOf?: string
  /** Optional 0–1 health score (1 = healthy) for the planetary-balance meter. */
  score?: number
  /** Optional historical series (oldest → newest) for a trend sparkline. */
  history?: number[]
  /** Labels for the first & last history points, e.g. ['2009', '2024']. */
  trendSpan?: [string, string]
}

const nowIso = () => new Date().toISOString()
const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

async function getJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  return res.json()
}

// Slow-moving sources (annual World Bank stats, NOAA trend files) don't change
// minute to minute, so we cache them for a few hours. This keeps the app's
// auto-refresh from hammering World Bank (which rate-limits) while real-time
// feeds — quakes, Kp, air quality — keep refreshing every cycle.
const _ttlCache = new Map<string, { at: number; p: Promise<LiveSignal> }>()
const SIX_HOURS = 6 * 60 * 60 * 1000
function ttl(key: string, fetcher: () => Promise<LiveSignal>, ms = SIX_HOURS) {
  return () => {
    const hit = _ttlCache.get(key)
    if (hit && Date.now() - hit.at < ms) return hit.p
    const p = fetcher().catch((e) => {
      _ttlCache.delete(key) // don't cache failures — retry next cycle
      throw e
    })
    _ttlCache.set(key, { at: Date.now(), p })
    return p
  }
}

// ── Vital: Global CO₂ — NOAA Global Monitoring Laboratory ────────────
export async function fetchCO2(): Promise<LiveSignal> {
  const res = await fetch(
    'https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_trend_gl.csv',
  )
  if (!res.ok) throw new Error(`NOAA CO2 → ${res.status}`)
  const text = await res.text()
  const rows = text.split('\n').filter((l) => l.trim() && !l.startsWith('#'))
  const last = rows[rows.length - 1].split(',').map((s) => s.trim())
  const [year, month, day, smoothed] = last
  const ppm = Number(parseFloat(smoothed).toFixed(1))
  // Annual series (last smoothed reading of each year) for the trend line.
  const annual = new Map<string, number>()
  for (const r of rows) {
    const c = r.split(',').map((s) => s.trim())
    const v = parseFloat(c[3])
    if (!Number.isNaN(v)) annual.set(c[0], v)
  }
  const years = [...annual.keys()].sort().slice(-15)
  return {
    key: 'co2',
    label: 'Global CO₂',
    value: ppm,
    unit: 'ppm',
    detail: `daily global average · ${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
    stream: 'neutral',
    source: 'NOAA GML',
    sourceUrl: 'https://gml.noaa.gov/ccgg/trends/global.html',
    updatedAt: nowIso(),
    // 350 ppm ≈ healthy, 450 ppm ≈ critical
    score: clamp01((450 - ppm) / 100),
    history: years.length >= 3 ? years.map((y) => Number(annual.get(y)!.toFixed(1))) : undefined,
    trendSpan: years.length >= 3 ? [years[0], year] : undefined,
  }
}

// ── Vital: Earthquakes — USGS (updates every minute) ─────────────────
export async function fetchEarthquakes(): Promise<LiveSignal> {
  const d = await getJson(
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson',
  )
  const feats: any[] = d.features ?? []
  const mags = feats.map((f) => f.properties?.mag).filter((m) => typeof m === 'number')
  const max = mags.length ? Math.max(...mags) : 0
  const biggest = feats.find((f) => f.properties?.mag === max)?.properties?.place
  return {
    key: 'earthquakes',
    label: 'Earthquakes',
    value: feats.length,
    unit: 'M2.5+ · 24h',
    detail: max ? `up to M${max.toFixed(1)} — ${biggest ?? 'unknown'}` : undefined,
    stream: 'neutral',
    source: 'USGS',
    sourceUrl: 'https://earthquake.usgs.gov/earthquakes/map/',
    updatedAt: nowIso(),
  }
}

// ── Vital: Geomagnetic activity — NOAA SWPC planetary K-index ────────
export async function fetchGeomagnetic(): Promise<LiveSignal> {
  const d = await getJson(
    'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
  )
  // Array of objects; the last entry is the most recent reading.
  const rows: any[] = Array.isArray(d) ? d : []
  const last = rows[rows.length - 1]
  const kp = last ? Number(parseFloat(last.Kp).toFixed(1)) : 0
  return {
    key: 'geomagnetic',
    label: 'Geomagnetic activity',
    value: kp,
    unit: 'Kp index',
    detail: kp >= 5 ? 'geomagnetic storm in progress' : 'quiet to unsettled',
    stream: 'neutral',
    source: 'NOAA SWPC',
    sourceUrl: 'https://www.swpc.noaa.gov/products/planetary-k-index',
    updatedAt: nowIso(),
  }
}

// ── Crisis: Active natural events — NASA EONET (last 30 days) ─────────
export async function fetchNaturalEvents(): Promise<LiveSignal> {
  const d = await getJson(
    'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=30',
  )
  const events: any[] = d.events ?? []
  const storms = events.filter((e) =>
    (e.categories ?? []).some((c: any) => c.id === 'severeStorms'),
  ).length
  return {
    key: 'natural_events',
    label: 'Active natural events',
    value: events.length,
    unit: 'events · 30d',
    detail: storms ? `incl. ${storms} severe storms` : 'across all hazard types',
    stream: 'crisis',
    source: 'NASA EONET',
    sourceUrl: 'https://eonet.gsfc.nasa.gov/',
    updatedAt: nowIso(),
  }
}

// ── Crisis: Active wildfires — NASA EONET (last 30 days) ──────────────
export async function fetchWildfires(): Promise<LiveSignal> {
  const d = await getJson(
    'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=30&category=wildfires',
  )
  const events: any[] = d.events ?? []
  return {
    key: 'wildfires',
    label: 'Active wildfires',
    value: events.length,
    unit: 'fires · 30d',
    detail: 'large fires detected worldwide',
    stream: 'crisis',
    source: 'NASA EONET',
    sourceUrl: 'https://eonet.gsfc.nasa.gov/',
    updatedAt: nowIso(),
  }
}

// ── Crisis: Methane (CH₄) — NOAA Global Monitoring Laboratory ─────────
export async function fetchMethane(): Promise<LiveSignal> {
  const res = await fetch(
    'https://gml.noaa.gov/webdata/ccgg/trends/ch4/ch4_mm_gl.txt',
  )
  if (!res.ok) throw new Error(`NOAA CH4 → ${res.status}`)
  const text = await res.text()
  const rows = text.split('\n').filter((l) => l.trim() && !l.startsWith('#'))
  const cols = rows[rows.length - 1].trim().split(/\s+/)
  // columns: year, month, decimal, average, average_unc, trend, trend_unc
  const [year, month, , average] = cols
  // Annual series (last monthly average of each year) for the trend line.
  const annual = new Map<string, number>()
  for (const r of rows) {
    const c = r.trim().split(/\s+/)
    const v = parseFloat(c[3])
    if (!Number.isNaN(v)) annual.set(c[0], v)
  }
  const years = [...annual.keys()].sort().slice(-15)
  return {
    key: 'methane',
    label: 'Methane (CH₄)',
    value: Math.round(parseFloat(average)).toLocaleString(), // e.g. "1,939"
    unit: 'ppb',
    detail: `monthly global average · ${year}-${String(month).padStart(2, '0')}`,
    stream: 'crisis',
    source: 'NOAA GML',
    sourceUrl: 'https://gml.noaa.gov/ccgg/trends_ch4/',
    updatedAt: nowIso(),
    history: years.length >= 3 ? years.map((y) => Math.round(annual.get(y)!)) : undefined,
    trendSpan: years.length >= 3 ? [years[0], year] : undefined,
  }
}

// ── Air quality — Open-Meteo across a sample of world cities ──────────
const CITIES = [
  { lat: 51.51, lon: -0.13 }, { lat: 40.71, lon: -74.01 },
  { lat: 35.68, lon: 139.69 }, { lat: 28.61, lon: 77.21 },
  { lat: -23.55, lon: -46.63 }, { lat: -1.29, lon: 36.82 },
  { lat: -33.87, lon: 151.21 }, { lat: 39.9, lon: 116.4 },
]

let cityPm25Cache: { at: number; vals: number[] } | null = null
async function fetchCityPm25(): Promise<number[]> {
  // Cache briefly so the two air signals share one network call per refresh.
  if (cityPm25Cache && Date.now() - cityPm25Cache.at < 30_000) {
    return cityPm25Cache.vals
  }
  const lat = CITIES.map((c) => c.lat).join(',')
  const lon = CITIES.map((c) => c.lon).join(',')
  const d = await getJson(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5`,
  )
  const arr = Array.isArray(d) ? d : [d]
  const vals = arr.map((r) => r?.current?.pm2_5).filter((v) => typeof v === 'number')
  cityPm25Cache = { at: Date.now(), vals }
  return vals
}

export async function fetchAirQuality(): Promise<LiveSignal> {
  const vals = await fetchCityPm25()
  if (!vals.length) throw new Error('no air-quality data')
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length
  return {
    key: 'air_pm25',
    label: 'Air pollution (PM2.5)',
    value: Number(avg.toFixed(1)),
    unit: 'µg/m³',
    detail: `avg across ${vals.length} major cities`,
    stream: 'crisis',
    source: 'Open-Meteo',
    sourceUrl: 'https://open-meteo.com/en/docs/air-quality-api',
    updatedAt: nowIso(),
    // 5 µg/m³ ≈ healthy, 50 µg/m³ ≈ hazardous
    score: clamp01(1 - (avg - 5) / 45),
  }
}

export async function fetchCleanAirCities(): Promise<LiveSignal> {
  const vals = await fetchCityPm25()
  if (!vals.length) throw new Error('no air-quality data')
  const clean = vals.filter((v) => v < 15).length // WHO 24h guideline
  return {
    key: 'clean_air_cities',
    label: 'Clean-air cities',
    value: clean,
    unit: `of ${vals.length}`,
    detail: 'below WHO 15 µg/m³ guideline',
    stream: 'regeneration',
    source: 'Open-Meteo',
    sourceUrl: 'https://open-meteo.com/en/docs/air-quality-api',
    updatedAt: nowIso(),
    score: clamp01(clean / vals.length),
  }
}

// ── Regeneration: Biodiversity — GBIF occurrences logged this year ───
export async function fetchBiodiversity(): Promise<LiveSignal> {
  const year = new Date().getUTCFullYear()
  const d = await getJson(
    `https://api.gbif.org/v1/occurrence/search?limit=0&year=${year}`,
  )
  return {
    key: 'biodiversity_obs',
    label: 'Biodiversity observations',
    value: d.count ?? 0,
    unit: `logged in ${year}`,
    detail: 'species occurrences worldwide',
    stream: 'regeneration',
    source: 'GBIF',
    sourceUrl: 'https://www.gbif.org/',
    updatedAt: nowIso(),
  }
}

// ── Regeneration: Nature observations today — iNaturalist ────────────
export async function fetchINaturalist(): Promise<LiveSignal> {
  const today = new Date().toISOString().slice(0, 10)
  const d = await getJson(
    `https://api.inaturalist.org/v1/observations?per_page=0&d1=${today}&verifiable=true`,
  )
  return {
    key: 'inat_today',
    label: 'Nature observations today',
    value: d.total_results ?? 0,
    unit: 'logged today',
    detail: 'people recording wild species right now',
    stream: 'regeneration',
    source: 'iNaturalist',
    sourceUrl: 'https://www.inaturalist.org/observations',
    updatedAt: nowIso(),
  }
}

// ── Vital: Significant earthquakes — USGS (last 30 days) ─────────────
export async function fetchSignificantQuakes(): Promise<LiveSignal> {
  const d = await getJson(
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson',
  )
  const feats: any[] = d.features ?? []
  return {
    key: 'sig_quakes',
    label: 'Significant quakes',
    value: feats.length,
    unit: '· 30d',
    detail: 'major seismic events worldwide',
    stream: 'neutral',
    source: 'USGS',
    sourceUrl: 'https://earthquake.usgs.gov/earthquakes/map/',
    updatedAt: nowIso(),
  }
}

// ── Vital: Solar activity — NOAA SWPC F10.7 radio flux ───────────────
export async function fetchSolar(): Promise<LiveSignal> {
  const d = await getJson('https://services.swpc.noaa.gov/json/f107_cm_flux.json')
  const rows: any[] = Array.isArray(d) ? d : []
  const last = rows[rows.length - 1]
  const flux = last ? Number(parseFloat(last.flux).toFixed(0)) : 0
  return {
    key: 'solar_flux',
    label: 'Solar activity',
    value: flux,
    unit: 'sfu (F10.7)',
    detail: 'solar radio flux — drives space weather',
    stream: 'neutral',
    source: 'NOAA SWPC',
    sourceUrl: 'https://www.swpc.noaa.gov/',
    updatedAt: nowIso(),
    asOf: last?.time_tag ? String(last.time_tag).slice(0, 10) : undefined,
  }
}

// ── Vital: Ocean surface temperature — Open-Meteo Marine (live) ───────
const OCEAN_POINTS = [
  { lat: 0, lon: -140 }, { lat: 25, lon: -40 }, { lat: -20, lon: 80 },
  { lat: 40, lon: -30 }, { lat: -40, lon: 150 },
]
export async function fetchOceanTemp(): Promise<LiveSignal> {
  const lat = OCEAN_POINTS.map((p) => p.lat).join(',')
  const lon = OCEAN_POINTS.map((p) => p.lon).join(',')
  const d = await getJson(
    `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=sea_surface_temperature`,
  )
  const arr = Array.isArray(d) ? d : [d]
  const vals = arr
    .map((r) => r?.current?.sea_surface_temperature)
    .filter((v) => typeof v === 'number')
  if (!vals.length) throw new Error('no SST data')
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length
  return {
    key: 'ocean_temp',
    label: 'Ocean surface temp',
    value: Number(avg.toFixed(1)),
    unit: '°C',
    detail: `avg across ${vals.length} ocean regions`,
    stream: 'neutral',
    source: 'Open-Meteo',
    sourceUrl: 'https://open-meteo.com/en/docs/marine-weather-api',
    updatedAt: nowIso(),
  }
}

// ── Crisis: Net forest loss — World Bank forest-area trend ───────────
export async function fetchForestLoss(): Promise<LiveSignal> {
  const d = await getJson(
    'https://api.worldbank.org/v2/country/WLD/indicator/AG.LND.FRST.K2?format=json&date=2013:2023',
  )
  const pts = (d?.[1] ?? [])
    .filter((r: any) => r.value != null)
    .map((r: any) => [Number(r.date), Number(r.value)] as [number, number])
    .sort((a: number[], b: number[]) => a[0] - b[0])
  if (pts.length < 2) throw new Error('WB forest trend empty')
  const [y0, v0] = pts[0]
  const [y1, v1] = pts[pts.length - 1]
  const perYearKm2 = (v1 - v0) / (y1 - y0)
  const lossMha = Math.abs(perYearKm2) / 10_000 // km² → Mha
  return {
    key: 'forest_loss',
    label: 'Net forest loss',
    value: Number(lossMha.toFixed(1)),
    unit: 'Mha / yr',
    detail: `net global forest change, ${y0}–${y1}`,
    stream: 'crisis',
    source: 'World Bank',
    sourceUrl: 'https://data.worldbank.org/indicator/AG.LND.FRST.K2',
    updatedAt: nowIso(),
    asOf: `${y0}–${y1}`,
  }
}

// ── Crisis: Sea level rise — NOAA/EPA reconstruction (keyless, CORS) ──
export async function fetchSeaLevel(): Promise<LiveSignal> {
  const res = await fetch(
    'https://raw.githubusercontent.com/datasets/sea-level-rise/main/data/epa-sea-level.csv',
  )
  if (!res.ok) throw new Error(`sea level → ${res.status}`)
  const text = await res.text()
  const rows = text.trim().split('\n').slice(1) // drop header
  // columns: Year, CSIRO Adjusted, Lower, Upper, NOAA Adjusted (inches vs 1880)
  const pts: { y: string; cm: number }[] = []
  for (const line of rows) {
    const c = line.split(',')
    const noaa = parseFloat(c[4])
    if (!Number.isNaN(noaa)) pts.push({ y: c[0], cm: noaa * 2.54 })
  }
  if (!pts.length) throw new Error('no sea-level value')
  const cur = pts[pts.length - 1]
  const series = pts.slice(-20) // NOAA satellite record (~1993→)
  return {
    key: 'sea_level',
    label: 'Sea level rise',
    value: Number(cur.cm.toFixed(1)),
    unit: 'cm since 1880',
    detail: 'global mean sea level (NOAA)',
    stream: 'crisis',
    source: 'NOAA / EPA',
    sourceUrl: 'https://www.epa.gov/climate-indicators/climate-change-indicators-sea-level',
    updatedAt: nowIso(),
    asOf: cur.y,
    history: series.length >= 3 ? series.map((p) => Number(p.cm.toFixed(1))) : undefined,
    trendSpan: series.length >= 3 ? [series[0].y, cur.y] : undefined,
  }
}

// ── Crisis: Threatened species — World Bank / IUCN (summed groups) ────
export async function fetchThreatenedSpecies(): Promise<LiveSignal> {
  const codes = ['EN.MAM.THRD.NO', 'EN.BIR.THRD.NO', 'EN.FSH.THRD.NO', 'EN.HPT.THRD.NO']
  const results = await Promise.all(
    codes.map((c) =>
      getJson(`https://api.worldbank.org/v2/country/WLD/indicator/${c}?format=json&mrnev=1`),
    ),
  )
  let total = 0
  let year = ''
  for (const d of results) {
    const row = d?.[1]?.[0]
    if (row?.value != null) {
      total += Number(row.value)
      year = String(row.date)
    }
  }
  if (!total) throw new Error('WB threatened species empty')
  return {
    key: 'threatened_species',
    label: 'Species threatened',
    value: total,
    unit: 'on IUCN Red List',
    detail: 'mammals, birds, fish & plants',
    stream: 'crisis',
    source: 'World Bank / IUCN',
    sourceUrl: 'https://data.worldbank.org/indicator/EN.MAM.THRD.NO',
    updatedAt: nowIso(),
    asOf: year,
  }
}

// ── Crisis: Data-centre electricity — derived (live base × IEA share) ─
// World Bank has no direct data-centre series, so derive it: live world
// electricity (per-capita use × population) × IEA's ~1.5% data-centre share.
export async function fetchDataCenters(): Promise<LiveSignal> {
  const [perCapD, popD] = await Promise.all([
    getJson('https://api.worldbank.org/v2/country/WLD/indicator/EG.USE.ELEC.KH.PC?format=json&mrnev=1'),
    getJson('https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.TOTL?format=json&mrnev=1'),
  ])
  const pc = perCapD?.[1]?.[0]
  const pop = popD?.[1]?.[0]
  if (!pc?.value || !pop?.value) throw new Error('WB electricity/pop empty')
  const totalTWh = (Number(pc.value) * Number(pop.value)) / 1e9 // kWh → TWh
  const dcTWh = totalTWh * 0.015 // IEA: data centres ≈ 1.5% of world electricity
  return {
    key: 'data_centers',
    label: 'Data-centre electricity',
    value: Math.round(dcTWh),
    unit: 'TWh / yr',
    detail: '≈1.5% of world electricity (IEA share)',
    stream: 'crisis',
    source: 'World Bank × IEA',
    sourceUrl: 'https://www.iea.org/energy-system/buildings/data-centres-and-data-transmission-networks',
    updatedAt: nowIso(),
    asOf: `~${pc.date}`,
  }
}

// ── Crisis: Military emissions — static research estimate (CEOBS/SGR) ──
// No live feed exists for war/military emissions; this is a fixed, cited
// research estimate, clearly marked as such (not a live reading).
export async function fetchWarEmissions(): Promise<LiveSignal> {
  return {
    key: 'war_emissions',
    label: 'Military emissions',
    value: '~5.5',
    unit: '% of global GHG',
    detail: 'world militaries’ share — research estimate',
    stream: 'crisis',
    source: 'CEOBS / SGR',
    sourceUrl: 'https://ceobs.org/',
    updatedAt: nowIso(),
    asOf: 'est. 2022',
  }
}

// ── Crisis: Deep-sea mining — static, pre-commercial status (ISA) ──
// No open live feed exists, and no commercial seabed mining has begun. This is
// a fixed, cited status marker (exploration contracts), clearly labelled — the
// real story is whether extraction *starts*, not a live production number.
export async function fetchDeepSeaMining(): Promise<LiveSignal> {
  return {
    key: 'deep_sea_mining',
    label: 'Deep-sea mining',
    value: '~31',
    unit: 'ISA exploration contracts',
    detail: 'exploration only — no commercial seabed mining has begun',
    stream: 'crisis',
    source: 'Int’l Seabed Authority',
    sourceUrl: 'https://www.isa.org.jm/exploration-contracts/',
    updatedAt: nowIso(),
    asOf: 'status 2026',
  }
}

// ── Crisis: Orbital debris — static estimate (ESA Space Environment) ──
// The "ring of space trash": no keyless live catalogue is reliable in-browser,
// so this is ESA's authoritative published estimate, clearly marked.
export async function fetchOrbitalDebris(): Promise<LiveSignal> {
  return {
    key: 'orbital_debris',
    label: 'Space debris (>10 cm)',
    value: '~40,500',
    unit: 'tracked objects',
    detail: 'plus ~1.1M pieces 1–10 cm circling Earth — ESA estimate',
    stream: 'crisis',
    source: 'ESA Space Environment Report',
    sourceUrl: 'https://www.esa.int/Space_Safety/Space_Debris/ESA_s_Space_Environment_Report_2025',
    updatedAt: nowIso(),
    asOf: 'est. 2025',
  }
}

// ── Regeneration: Ozone layer recovery — the great success story ──────
// Static, cited: the Montreal Protocol phased out ~99% of ozone-depleting
// substances; WMO/UNEP project the layer recovering to 1980 levels by ~2066
// (Antarctic). Proof that coordinated global action can heal the atmosphere.
export async function fetchOzoneRecovery(): Promise<LiveSignal> {
  return {
    key: 'ozone_recovery',
    label: 'Ozone layer healing',
    value: '~99',
    unit: '% of ODS phased out',
    detail: 'on track to fully recover by ~2066 — Montreal Protocol',
    stream: 'regeneration',
    source: 'WMO / UNEP',
    sourceUrl: 'https://www.unep.org/ozonaction/who-we-are/about-montreal-protocol',
    updatedAt: nowIso(),
    asOf: 'assessment 2022',
  }
}

// ── Regeneration: EV adoption — static estimate (IEA) ─────────────────
export async function fetchEVAdoption(): Promise<LiveSignal> {
  return {
    key: 'ev_adoption',
    label: 'Electric-car sales',
    value: '~20',
    unit: '% of new cars',
    detail: '≈1 in 5 cars sold worldwide is now electric — IEA',
    stream: 'regeneration',
    source: 'IEA Global EV Outlook',
    sourceUrl: 'https://www.iea.org/reports/global-ev-outlook-2025',
    updatedAt: nowIso(),
    asOf: '2024',
  }
}

// ── Regeneration: Forest restoration pledges — static (Bonn Challenge) ─
export async function fetchForestRestoration(): Promise<LiveSignal> {
  return {
    key: 'forest_restoration',
    label: 'Forest restoration pledged',
    value: '~210',
    unit: 'M ha pledged',
    detail: 'toward the 350M-ha-by-2030 Bonn Challenge goal',
    stream: 'regeneration',
    source: 'Bonn Challenge / IUCN',
    sourceUrl: 'https://www.bonnchallenge.org/',
    updatedAt: nowIso(),
    asOf: 'status 2026',
  }
}

// ── World Bank — authoritative annual global indicators ──────────────
interface WBConfig {
  code: string
  key: string
  label: string
  unit: string
  detail: string
  stream: SignalStream
  decimals?: number
  transform?: (v: number) => number
  score?: (v: number) => number
}

function worldBank(c: WBConfig): () => Promise<LiveSignal> {
  return async () => {
    // Pull a multi-year window (not just the latest point) so each card can
    // show a trend. Rows come newest-first with gaps; we clean and sort them.
    const d = await getJson(
      `https://api.worldbank.org/v2/country/WLD/indicator/${c.code}?format=json&date=2004:2026&per_page=300`,
    )
    const rows: any[] = Array.isArray(d?.[1]) ? d[1] : []
    const round = (n: number) => Number(n.toFixed(c.decimals ?? 1))
    const pts = rows
      .filter((r) => r && r.value != null)
      .map((r) => ({ date: String(r.date), v: c.transform ? c.transform(Number(r.value)) : Number(r.value) }))
      .sort((a, b) => a.date.localeCompare(b.date)) // oldest → newest
    if (!pts.length) throw new Error(`WB ${c.code} empty`)
    const cur = pts[pts.length - 1]
    const series = pts.slice(-15) // last ~15 years for the sparkline
    return {
      key: c.key,
      label: c.label,
      value: round(cur.v),
      unit: c.unit,
      detail: c.detail,
      stream: c.stream,
      source: 'World Bank',
      sourceUrl: `https://data.worldbank.org/indicator/${c.code}`,
      updatedAt: nowIso(),
      asOf: cur.date,
      score: c.score ? clamp01(c.score(cur.v)) : undefined,
      history: series.length >= 3 ? series.map((p) => round(p.v)) : undefined,
      trendSpan: series.length >= 3 ? [series[0].date, cur.date] : undefined,
    }
  }
}

const WB_INDICATORS: WBConfig[] = [
  // Crisis
  {
    code: 'EN.GHG.CO2.MT.CE.AR5', key: 'co2_total',
    label: 'CO₂ emissions (total)', unit: 'Gt / yr',
    detail: 'annual global CO₂ emissions', stream: 'crisis',
    decimals: 1, transform: (v) => v / 1000, // Mt → Gt
  },
  {
    code: 'EN.GHG.ALL.PC.CE.AR5', key: 'ghg_per_capita',
    label: 'Greenhouse gas / person', unit: 't CO₂e',
    detail: 'global average emissions per person', stream: 'crisis',
    decimals: 2, score: (v) => 1 - v / 12,
  },
  {
    code: 'EN.ATM.PM25.MC.M3', key: 'pm25_exposure',
    label: 'PM2.5 exposure', unit: 'µg/m³',
    detail: 'population-weighted annual mean', stream: 'crisis',
  },
  {
    code: 'AG.LND.AGRI.ZS', key: 'agri_land',
    label: 'Agricultural land', unit: '% of land',
    detail: 'land converted to farming & grazing', stream: 'crisis',
  },
  {
    code: 'AG.CON.FERT.ZS', key: 'fertilizer',
    label: 'Fertilizer use', unit: 'kg/ha',
    detail: 'nutrient & chemical load on farmland', stream: 'crisis',
  },
  {
    code: 'ER.H2O.FWTL.ZS', key: 'freshwater_withdrawal',
    label: 'Freshwater withdrawal', unit: '% of resources',
    detail: 'renewable freshwater drawn for human use', stream: 'crisis',
  },
  {
    code: 'MS.MIL.XPND.CD', key: 'military_spending',
    label: 'Military spending', unit: '$ trn / yr',
    detail: 'global total — a proxy for war’s footprint', stream: 'crisis',
    decimals: 2, transform: (v) => v / 1e12, // US$ → trillions
  },
  {
    code: 'NY.GDP.MINR.RT.ZS', key: 'mineral_rents',
    label: 'Mineral rents', unit: '% of GDP',
    detail: 'value extracted from mining — the economic weight of digging up the planet', stream: 'crisis',
    decimals: 2,
  },
  {
    code: 'TX.VAL.MMTL.ZS.UN', key: 'ores_metals_exports',
    label: 'Ores & metals trade', unit: '% of exports',
    detail: 'raw ores & metals as a share of world merchandise exports', stream: 'crisis',
    decimals: 1,
  },
  // Regeneration
  {
    code: 'AG.LND.FRST.ZS', key: 'forest_area',
    label: 'Forest cover', unit: '% of land',
    detail: 'share of land under forest', stream: 'regeneration',
    score: (v) => v / 40,
  },
  {
    code: 'EG.FEC.RNEW.ZS', key: 'renewable_energy',
    label: 'Renewable energy', unit: '% of use',
    detail: 'share of final energy consumption', stream: 'regeneration',
    score: (v) => v / 50,
  },
  {
    code: 'EG.ELC.RNEW.ZS', key: 'renewable_electricity',
    label: 'Renewable electricity', unit: '% of power',
    detail: 'share of electricity generated from renewables', stream: 'regeneration',
    score: (v) => v / 60,
  },
  {
    code: 'ER.LND.PTLD.ZS', key: 'protected_land',
    label: 'Protected land', unit: '% of land',
    detail: 'terrestrial areas under protection', stream: 'regeneration',
    score: (v) => v / 30,
  },
  {
    code: 'EG.ELC.ACCS.ZS', key: 'electricity_access',
    label: 'Electricity access', unit: '% of people',
    detail: 'population with electricity', stream: 'regeneration',
    score: (v) => v / 100,
  },
  {
    code: 'SH.H2O.SMDW.ZS', key: 'safe_water',
    label: 'Safe drinking water', unit: '% of people',
    detail: 'safely managed drinking water', stream: 'regeneration',
    score: (v) => v / 100,
  },
  {
    code: 'ER.MRN.PTMR.ZS', key: 'marine_protected',
    label: 'Marine protected areas', unit: '% of seas',
    detail: 'territorial waters under protection', stream: 'regeneration',
    score: (v) => v / 30,
  },
  {
    code: 'EG.CFT.ACCS.ZS', key: 'clean_cooking',
    label: 'Clean cooking access', unit: '% of people',
    detail: 'access to clean cooking fuels', stream: 'regeneration',
    score: (v) => v / 100,
  },
]

/** All live fetchers, ordered for display. */
export const LIVE_FETCHERS: (() => Promise<LiveSignal>)[] = [
  // Vitals (real-time, whole-earth)
  ttl('co2', fetchCO2), // NOAA trend file — daily
  fetchEarthquakes,
  fetchSignificantQuakes,
  fetchGeomagnetic,
  fetchSolar,
  fetchOceanTemp,
  // Crisis
  fetchNaturalEvents,
  fetchWildfires,
  ttl('methane', fetchMethane), // NOAA trend file — monthly
  fetchAirQuality,
  ttl('forest_loss', fetchForestLoss),
  ttl('threatened_species', fetchThreatenedSpecies),
  ttl('sea_level', fetchSeaLevel),
  ttl('data_centers', fetchDataCenters),
  fetchWarEmissions,
  fetchDeepSeaMining,
  fetchOrbitalDebris,
  // Regeneration
  fetchBiodiversity,
  fetchINaturalist,
  fetchCleanAirCities,
  fetchOzoneRecovery,
  fetchEVAdoption,
  fetchForestRestoration,
  // Annual authoritative indicators (World Bank) — cached ~6h to respect limits
  ...WB_INDICATORS.map((c) => ttl(`wb:${c.code}`, worldBank(c))),
]

/**
 * A 0–100 planetary-balance score built ONLY from ecological indicators, each
 * normalized to an explicit healthy→critical range. Deliberately excludes
 * human-development access metrics (electricity, safe water, clean cooking) and
 * monitoring-effort counts (observations logged) — those measure people, not
 * planetary health, and averaging them in falsely inflates the score.
 *
 * It is a rough directional composite, not a verdict: it can't capture drivers
 * with no open live data (data-centre demand, pesticide toxicity, regenerative
 * farming) or trajectories, and a flat average of levels trends to the middle.
 */
export function liveBalance(signals: LiveSignal[]): number {
  const num = (v: number | string) =>
    typeof v === 'number' ? v : parseFloat(String(v).replace(/,/g, ''))
  const by = new Map(signals.map((s) => [s.key, num(s.value)]))
  const norm = (v: number, good: number, bad: number) =>
    clamp01((v - bad) / (good - bad))
  const parts: number[] = []
  const add = (key: string, good: number, bad: number) => {
    const v = by.get(key)
    if (typeof v === 'number' && !Number.isNaN(v)) parts.push(norm(v, good, bad))
  }

  add('co2', 350, 450) //                greenhouse gases
  add('methane', 700, 2000)
  add('pm25_exposure', 5, 50) //         air
  add('air_pm25', 5, 50)
  add('forest_area', 40, 20) //          forests & land use
  add('forest_loss', 0, 10)
  add('agri_land', 20, 50)
  add('fertilizer', 50, 250) //          farming intensity
  add('freshwater_withdrawal', 0, 40) // water
  add('renewable_energy', 60, 0) //      energy & protection
  add('protected_land', 30, 0)
  add('marine_protected', 30, 0)

  if (!parts.length) return 50
  return Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100)
}
