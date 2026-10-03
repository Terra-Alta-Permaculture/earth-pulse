// EarthPulse — daily indicator fetch.
// Pulls fresh values from the source APIs and stores one snapshot per indicator
// in `earth_snapshots`. Designed to run once per day via Supabase cron.
//
// No-key sources always run: NASA EONET, GBIF.
// Key-gated sources run only if their env var is set: OpenAQ (OPENAQ_API_KEY),
// Global Forest Watch (GFW_API_KEY). Each fetcher is independent — one failure
// never blocks the others.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'

interface Row {
  indicator_name: string
  value: number
  unit: string
  source: string
  stream: 'crisis' | 'regeneration'
  region: string
  fetched_at: string
}

const now = () => new Date().toISOString()
const yesterday = () => {
  const d = new Date(Date.now() - 86_400_000)
  return d.toISOString().slice(0, 10)
}

async function getJson(url: string, headers: Record<string, string> = {}) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${url} → ${res.status}`)
  return res.json()
}

// ── Crisis: NASA EONET (open natural events) ─────────────────────────
async function fetchEonet(): Promise<Row[]> {
  const data = await getJson(
    'https://eonet.gsfc.nasa.gov/api/v3/events?status=open',
  )
  const events = Array.isArray(data.events) ? data.events : []
  return [
    {
      indicator_name: 'natural_events',
      value: events.length,
      unit: 'events',
      source: 'NASA EONET',
      stream: 'crisis',
      region: 'Global',
      fetched_at: now(),
    },
  ]
}

// ── Regeneration: GBIF (biodiversity + species richness) ─────────────
async function fetchGbif(): Promise<Row[]> {
  const day = yesterday()
  const rows: Row[] = []

  const occ = await getJson(
    `https://api.gbif.org/v1/occurrence/search?limit=0&eventDate=${day}`,
  )
  if (typeof occ.count === 'number') {
    rows.push({
      indicator_name: 'biodiversity_obs',
      value: occ.count,
      unit: 'records / day',
      source: 'GBIF',
      stream: 'regeneration',
      region: 'Global',
      fetched_at: now(),
    })
  }

  // Distinct species observed that day (approximated by facet breadth).
  const facet = await getJson(
    `https://api.gbif.org/v1/occurrence/search?limit=0&facet=speciesKey&facetLimit=1200&eventDate=${day}`,
  )
  const counts = facet?.facets?.[0]?.counts
  if (Array.isArray(counts)) {
    rows.push({
      indicator_name: 'species_richness',
      value: counts.length,
      unit: 'distinct species',
      source: 'GBIF',
      stream: 'regeneration',
      region: 'Global',
      fetched_at: now(),
    })
  }
  return rows
}

// ── Crisis + Regeneration: OpenAQ (needs OPENAQ_API_KEY) ─────────────
async function fetchOpenAQ(): Promise<Row[]> {
  const key = Deno.env.get('OPENAQ_API_KEY')
  if (!key) return []
  // v3 latest PM2.5 measurements (parameters_id=2 is pm25).
  const data = await getJson(
    'https://api.openaq.org/v3/parameters/2/latest?limit=1000',
    { 'X-API-Key': key },
  )
  const results = Array.isArray(data.results) ? data.results : []
  const values: number[] = results
    .map((r: { value?: number }) => r.value)
    .filter((v: number) => typeof v === 'number' && v >= 0 && v < 1000)
  if (values.length === 0) return []

  const avg = values.reduce((a, b) => a + b, 0) / values.length
  const cleanSites = values.filter((v) => v < 15).length // WHO guideline

  return [
    {
      indicator_name: 'air_pm25',
      value: Number(avg.toFixed(1)),
      unit: 'µg/m³',
      source: 'OpenAQ',
      stream: 'crisis',
      region: 'Global',
      fetched_at: now(),
    },
    {
      indicator_name: 'clean_air_sites',
      value: cleanSites,
      unit: 'sites',
      source: 'OpenAQ',
      stream: 'regeneration',
      region: 'Global',
      fetched_at: now(),
    },
  ]
}

// ── Crisis + Regeneration: Global Forest Watch (needs GFW_API_KEY) ───
async function fetchGfw(): Promise<Row[]> {
  const key = Deno.env.get('GFW_API_KEY')
  if (!key) return []
  const rows: Row[] = []
  try {
    // Integrated deforestation alerts — weekly global count.
    // Endpoint/dataset ids vary by GFW Data API version; adjust as needed.
    const alerts = await getJson(
      'https://data-api.globalforestwatch.org/dataset/gfw_integrated_alerts/latest/query?sql=' +
        encodeURIComponent(
          "SELECT SUM(alert__count) AS total FROM data WHERE alert__date >= now() - interval '7 days'",
        ),
      { 'x-api-key': key },
    )
    const total = alerts?.data?.[0]?.total
    if (typeof total === 'number') {
      rows.push({
        indicator_name: 'forest_loss_alerts',
        value: total,
        unit: 'alerts / week',
        source: 'Global Forest Watch',
        stream: 'crisis',
        region: 'Global',
        fetched_at: now(),
      })
    }
  } catch (_) {
    // best-effort; skip on schema/endpoint drift
  }
  return rows
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Run every fetcher independently; collect what succeeds.
  const settled = await Promise.allSettled([
    fetchEonet(),
    fetchGbif(),
    fetchOpenAQ(),
    fetchGfw(),
  ])

  const rows: Row[] = []
  const errors: string[] = []
  for (const s of settled) {
    if (s.status === 'fulfilled') rows.push(...s.value)
    else errors.push(String(s.reason?.message ?? s.reason))
  }

  if (rows.length === 0) {
    return json({ inserted: 0, errors, note: 'no data fetched' }, 502)
  }

  // Insert; ignore duplicate-day conflicts so re-runs are safe.
  const { error } = await supabase
    .from('earth_snapshots')
    .upsert(rows, { ignoreDuplicates: true })

  if (error) {
    // Fall back to per-row inserts so one bad row doesn't drop the batch.
    let inserted = 0
    for (const r of rows) {
      const { error: e } = await supabase.from('earth_snapshots').insert(r)
      if (!e) inserted++
      else errors.push(`${r.indicator_name}: ${e.message}`)
    }
    return json({ inserted, errors })
  }

  return json({ inserted: rows.length, indicators: rows.map((r) => r.indicator_name), errors })
})
