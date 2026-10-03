// EarthPulse — weekly "law watch" writer (Vercel Cron target).
// Two-step like the World Pulse writer: (1) research recent legal moves that
// protect life (above the line) or enable extraction / punish its defenders
// (below the line), worldwide, with Claude + web search; (2) a forced tool-use
// call turns them into guaranteed-valid JSON. Accumulates into Vercel Blob,
// de-duplicated by title, newest kept. No database.
//
// Triggered weekly by vercel.json cron, or manually with ?force=1.

import { put, get } from '@vercel/blob'

declare const process: { env: Record<string, string | undefined> }

export const maxDuration = 300

const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5'
const WEB_SEARCH_TOOL = { type: 'web_search_20260209', name: 'web_search', max_uses: 6 }
const BLOB_PATH = 'law/latest.json'
const MAX_ITEMS = 60

function isoMonday(d = new Date()): string {
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = dt.getUTCDay() || 7
  if (day !== 1) dt.setUTCDate(dt.getUTCDate() - (day - 1))
  return dt.toISOString().slice(0, 10)
}

const validHttp = (u: unknown) => typeof u === 'string' && /^https?:\/\//.test(u)
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const ANTHROPIC = 'https://api.anthropic.com/v1/messages'
function headers() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set')
  return { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }
}

// ── Step 1: research with web search → plain-text findings ────────────
const RESEARCH_SYSTEM = `You are EarthPulse's legal researcher, tracking how law protects — or fails to protect — the living world. Find recent (roughly the last 30 days) legal and policy developments worldwide, both international and national. "Above the line" = protects life: Rights of Nature, ecocide crimes, landmark pro-nature court rulings, bans or moratoria on harmful extraction, strong new protections. "Below the line" = enables extraction or punishes its defenders: new fossil/mining approvals, deep-sea mining moves, rollbacks of environmental protection, laws criminalising environmental protest or defenders. Prefer primary/major sources. Be factual and politically neutral; describe what a law does, not who to blame.`

async function research(user: string): Promise<string> {
  let messages: any[] = [{ role: 'user', content: user }]
  for (let i = 0; i < 6; i++) {
    const res = await fetch(ANTHROPIC, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ model: MODEL, max_tokens: 6000, system: RESEARCH_SYSTEM, tools: [WEB_SEARCH_TOOL], messages }),
    })
    if (!res.ok) throw new Error(`research ${res.status}: ${await res.text()}`)
    const data = await res.json()
    if (data.stop_reason === 'pause_turn') {
      messages = [...messages, { role: 'assistant', content: data.content }]
      continue
    }
    return (data.content ?? []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('\n')
  }
  throw new Error('research loop did not converge')
}

// ── Step 2: forced tool-use → guaranteed-valid JSON ───────────────────
const EMIT_TOOL = {
  name: 'emit_laws',
  description: 'Return the structured list of recent legal developments.',
  input_schema: {
    type: 'object',
    properties: {
      laws: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: { type: 'string', description: 'YYYY-MM or YYYY-MM-DD' },
            place: { type: 'string', description: 'Jurisdiction shown to the reader, e.g. "France" or "European Union"' },
            country: { type: 'string', description: 'Country name for filtering, or "" if international/multilateral' },
            scope: { type: 'string', enum: ['international', 'national'] },
            line: { type: 'string', enum: ['above', 'below'] },
            title: { type: 'string' },
            note: { type: 'string', description: 'One sentence: what the law does.' },
            source_url: { type: 'string' },
          },
          required: ['date', 'place', 'scope', 'line', 'title', 'note', 'source_url'],
        },
      },
    },
    required: ['laws'],
  },
}

const STRUCTURE_SYSTEM = `Convert the research briefing into a list of legal developments via the emit_laws tool. Only include real, verifiable items with a working http(s) source URL. Each item: date (YYYY-MM or YYYY-MM-DD), place (jurisdiction), country ("" if international), scope (international|national), line (above|below), a short title, and a one-sentence factual note. Skip anything older than ~60 days, speculative, or without a source. Politically neutral. Return up to 12 items.`

async function structure(findings: string): Promise<any> {
  const res = await fetch(ANTHROPIC, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 8000,
      system: STRUCTURE_SYSTEM,
      tools: [EMIT_TOOL],
      tool_choice: { type: 'tool', name: 'emit_laws' },
      messages: [{ role: 'user', content: `Research briefing:\n\n${findings}\n\nEmit the structured list of recent above/below-the-line legal developments now.` }],
    }),
  })
  if (!res.ok) throw new Error(`structure ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const block = (data.content ?? []).find((b: any) => b.type === 'tool_use')
  if (!block) throw new Error('no tool_use in structure response')
  return block.input
}

async function loadExisting(): Promise<{ week_start: string | null; milestones: any[] }> {
  try {
    const g: any = await get(BLOB_PATH, { access: 'private' })
    if (!g) return { week_start: null, milestones: [] }
    const text = g.stream
      ? await new Response(g.stream).text()
      : typeof g.blob?.text === 'function'
        ? await g.blob.text()
        : Buffer.from(g.blob).toString('utf-8')
    const d = JSON.parse(text)
    return { week_start: d.week_start ?? null, milestones: d.milestones ?? [] }
  } catch {
    return { week_start: null, milestones: [] }
  }
}

export default async function handler(req: any, res: any) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers?.authorization || req.headers?.Authorization
    if (auth !== `Bearer ${secret}`) return res.status(401).json({ error: 'unauthorized' })
  }

  try {
    const week_start = isoMonday()
    const existing = await loadExisting()
    const force = req.query?.force === '1' || req.query?.force === 1
    if (existing.week_start === week_start && !force) {
      return res.status(200).json({ ok: true, note: 'already refreshed this week', week_start, items: existing.milestones.length })
    }

    const findings = await research(
      `Today is around ${week_start}. Do up to 6 targeted web searches for legal & policy developments in roughly the last 30 days, worldwide, that are clearly above-the-line (protect nature/climate/rights) or below-the-line (enable extraction or punish its defenders). Cover both international/multilateral and national. For each, give the jurisdiction, approximate date, what it does, whether it is above or below the line, and a source URL. Keep it brief.`,
    )

    const out = await structure(findings)
    const laws: any[] = Array.isArray(out.laws) ? out.laws : []

    // Validate + normalise into frontend LawMilestone shape.
    const clean = laws
      .filter((l) => l && l.title && validHttp(l.source_url) && (l.line === 'above' || l.line === 'below'))
      .map((l) => {
        const date = String(l.date || week_start)
        return {
          year: date.slice(0, 7), // YYYY-MM
          place: String(l.place || (l.country || 'International')),
          country: typeof l.country === 'string' ? l.country : '',
          scope: l.scope === 'national' ? 'national' : 'international',
          line: l.line,
          title: String(l.title),
          note: String(l.note || ''),
          url: String(l.source_url),
          live: true,
        }
      })

    // Merge with existing, de-dup by title (newest wins), cap list.
    const byTitle = new Map<string, any>()
    for (const m of existing.milestones) byTitle.set(norm(m.title), m)
    for (const m of clean) byTitle.set(norm(m.title), m)
    const milestones = [...byTitle.values()]
      .sort((a, b) => String(b.year).localeCompare(String(a.year)))
      .slice(0, MAX_ITEMS)

    const payload = { week_start, milestones }
    await put(BLOB_PATH, JSON.stringify(payload), { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true })

    return res.status(200).json({ ok: true, week_start, added: clean.length, total: milestones.length })
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err instanceof Error ? err.message : err) })
  }
}
