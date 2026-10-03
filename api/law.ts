// EarthPulse — law-watch read endpoint.
// Reads the weekly-written law list from the (private) Vercel Blob store.
// Returns 204 when nothing is stored yet so the frontend falls back to its
// bundled curated milestones.

import { get } from '@vercel/blob'

const BLOB_PATH = 'law/latest.json'

async function readText(g: any): Promise<string> {
  if (g?.stream) return await new Response(g.stream).text()
  if (g?.blob) {
    if (typeof g.blob.text === 'function') return await g.blob.text()
    return Buffer.from(g.blob).toString('utf-8')
  }
  throw new Error('no readable blob content')
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
    const g = await get(BLOB_PATH, { access: 'private' })
    if (!g) return res.status(204).end()
    const data = JSON.parse(await readText(g))
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400')
    return res.status(200).json(data)
  } catch {
    return res.status(204).end()
  }
}
