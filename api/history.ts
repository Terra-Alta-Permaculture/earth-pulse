// EarthPulse — "planet over time" history store.
// Keeps a small daily series of the headline numbers the dashboard already
// computes (ecological balance, the Doughnut safe-&-just score, and a few raw
// vitals) in the SAME private Vercel Blob store the other writers use. No DB.
//
//   GET  /api/history           → { updated, points: [...] }  (204 if empty)
//   POST /api/history { point }  → records today's point (one per day; the
//                                  first reading of a given day wins, so the
//                                  series is stable and the endpoint is
//                                  idempotent — repeat posts that day are no-ops)

import { put, get } from '@vercel/blob'

const BLOB_PATH = 'history/daily.json'
const MAX_POINTS = 800 // ~2+ years of daily points

// Sane clamps so a bad/abusive POST can't poison the series.
const RANGES: Record<string, [number, number]> = {
  balance: [0, 100],
  score: [0, 100],
  co2: [300, 500], // ppm
  ch4: [1500, 2500], // ppb
  sea: [0, 100], // cm since 1880
  renew: [0, 100], // % electricity
  protland: [0, 100], // % land
}

interface Point {
  date: string
  balance?: number
  score?: number
  co2?: number
  ch4?: number
  sea?: number
  renew?: number
  protland?: number
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

async function readText(g: any): Promise<string> {
  if (g?.stream) return await new Response(g.stream).text()
  if (g?.blob) {
    if (typeof g.blob.text === 'function') return await g.blob.text()
    return Buffer.from(g.blob).toString('utf-8')
  }
  throw new Error('no readable blob content')
}

async function readPoints(): Promise<Point[]> {
  try {
    const g = await get(BLOB_PATH, { access: 'private' })
    if (!g) return []
    const data = JSON.parse(await readText(g))
    return Array.isArray(data?.points) ? data.points : []
  } catch {
    return []
  }
}

function clean(raw: any): Point | null {
  if (!raw || typeof raw !== 'object') return null
  const date = today() // server decides the date; client can't backfill
  const out: Point = { date }
  for (const [k, [lo, hi]] of Object.entries(RANGES)) {
    const v = raw[k]
    if (typeof v === 'number' && isFinite(v) && v >= lo && v <= hi) {
      ;(out as any)[k] = Math.round(v * 100) / 100
    }
  }
  // Need at least one real measurement to be worth recording.
  return Object.keys(out).length > 1 ? out : null
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method === 'GET') {
    const points = await readPoints()
    if (points.length === 0) return res.status(204).end()
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400')
    return res.status(200).json({ updated: points[points.length - 1]?.date ?? null, points })
  }

  if (req.method === 'POST') {
    try {
      const body =
        typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body ?? {}
      const point = clean(body.point ?? body)
      if (!point) return res.status(400).json({ ok: false, error: 'no valid measurements' })

      const points = await readPoints()
      const last = points[points.length - 1]
      // One point per day — the first reading of the day wins.
      if (last && last.date === point.date) {
        return res.status(200).json({ ok: true, recorded: false, points: points.length })
      }
      points.push(point)
      const trimmed = points.slice(-MAX_POINTS)
      await put(BLOB_PATH, JSON.stringify({ updated: point.date, points: trimmed }), {
        access: 'private',
        contentType: 'application/json',
        allowOverwrite: true,
      })
      return res.status(200).json({ ok: true, recorded: true, points: trimmed.length })
    } catch (e: any) {
      return res.status(500).json({ ok: false, error: String(e?.message ?? e) })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).end()
}
