// EarthPulse — World Pulse weekly writer (Vercel Cron target).
// Two-step for reliability: (1) research the twelve forces with Claude + web
// search → plain-text findings; (2) a second call with FORCED tool-use turns the
// findings into guaranteed-valid JSON. Saves the week to Vercel Blob (26-week
// history). No database.
//
// Triggered weekly by vercel.json cron, or manually with ?force=1.

import { put, get } from '@vercel/blob'

declare const process: { env: Record<string, string | undefined> }

export const maxDuration = 300

const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5'
const WEB_SEARCH_TOOL = { type: 'web_search_20260209', name: 'web_search', max_uses: 6 }
const BLOB_PATH = 'world/latest.json'
const MAX_WEEKS = 26

const FORCE_KEYS = [
  'us_power', 'us_china', 'chokepoints_energy', 'russia_europe',
  'institutions', 'living_planet', 'identity_religion', 'ai', 'money_trade',
  'space_orbit', 'israel_us', 'elites',
]

function isoMonday(d = new Date()): string {
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = dt.getUTCDay() || 7
  if (day !== 1) dt.setUTCDate(dt.getUTCDate() - (day - 1))
  return dt.toISOString().slice(0, 10)
}

const validHttp = (u: unknown) => typeof u === 'string' && /^https?:\/\//.test(u)

const ANTHROPIC = 'https://api.anthropic.com/v1/messages'
function headers() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set')
  return { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }
}

// ── Step 1: research with web search → plain-text findings ────────────
const RESEARCH_SYSTEM = `You are EarthPulse's geopolitics researcher. Research the LAST 7 DAYS across twelve forces (us_power, us_china, chokepoints_energy, russia_europe, institutions, living_planet, identity_religion, ai, money_trade, space_orbit, israel_us, elites). space_orbit = the space race and orbit: military/anti-satellite activity, mega-constellations, the near-absence of binding space law, Moon/resource competition, orbital debris. israel_us = Israel, the US and the world: Gaza and regional escalation, US military/diplomatic backing, ICJ/ICC proceedings, protests and shifting opinion, normalisation talks, Palestinian recognition. elites = the ruling elites: concentration of wealth and power — billionaire wealth, lobbying and campaign finance, media ownership, tax policy, state capture and revolving doors. Prefer primary/major sources (Reuters, AP, Al Jazeera, BBC, FT, IEA, IMF, WMO, Copernicus, FAO, UN, OCHA, ICJ, Crisis Group, SIPRI, ESA, UNOOSA, World Inequality Lab, Oxfam). Be politically neutral and factual.`

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
  name: 'emit_world',
  description: 'Return the structured weekly World Pulse reading.',
  input_schema: {
    type: 'object',
    properties: {
      summary: { type: 'string' },
      scenario_lean: {
        type: 'object',
        properties: { A: { type: 'number' }, B: { type: 'number' }, C: { type: 'number' }, D: { type: 'number' } },
        required: ['A', 'B', 'C', 'D'],
      },
      lean_rationale: { type: 'string' },
      forces: {
        type: 'array',
        minItems: 12,
        maxItems: 12,
        items: {
          type: 'object',
          properties: {
            force_key: { type: 'string', enum: FORCE_KEYS },
            tension: { type: 'number' },
            headline: { type: 'string' },
            what_changed: { type: 'string' },
            counterpoint: { type: 'string' },
            indicators: {
              type: 'array',
              items: {
                type: 'object',
                properties: { label: { type: 'string' }, value: {}, unit: { type: 'string' }, as_of: { type: 'string' }, source_url: { type: 'string' } },
                required: ['label', 'value'],
              },
            },
            sources: {
              type: 'array',
              items: { type: 'object', properties: { title: { type: 'string' }, url: { type: 'string' } }, required: ['title', 'url'] },
            },
          },
          required: ['force_key', 'tension', 'headline', 'what_changed', 'counterpoint', 'indicators', 'sources'],
        },
      },
      signpost_updates: {
        type: 'array',
        items: { type: 'object', properties: { title: { type: 'string' }, status: { type: 'string' }, outcome: { type: 'string' } }, required: ['title'] },
      },
      new_signposts: {
        type: 'array',
        items: { type: 'object', properties: { event_date: {}, date_label: { type: 'string' }, title: { type: 'string' }, force_keys: { type: 'array', items: { type: 'string' } }, what_it_means: { type: 'string' } }, required: ['date_label', 'title'] },
      },
    },
    required: ['summary', 'scenario_lean', 'lean_rationale', 'forces'],
  },
}

const STRUCTURE_SYSTEM = `Convert the research briefing into the World Pulse reading via the emit_world tool. The forces array MUST contain exactly twelve objects, one for EACH of these keys and no others: us_power, us_china, chokepoints_energy, russia_europe, institutions, living_planet, identity_religion, ai, money_trade, space_orbit, israel_us, elites. If the briefing is thin on a force, still include it with your best estimate. Score each force's tension 0–10 with this rubric: 0–2 calm/improving; 3–4 elevated but stable; 5–6 high but managed (truces holding); 7–8 severe active crisis with spillover risk; 9–10 systemic. Twelve forces, exact keys.

scenario_lean is your best-judgment probability (%) for four scenarios over the next year, and the four MUST be positive numbers summing to exactly 100 (never zero):
- A — Armed bargaining: great powers keep bargaining; chokepoints reopen slowly.
- B — Chokepoint spiral: Middle East bargaining fails; straits stay shut; food & debt crises.
- C — Two camps: US–China bargaining breaks; the world splits into blocs.
- D — Patchwork repair: middle powers build issue-by-issue coalitions; institutions partly recover.
Set lean_rationale to one or two sentences justifying the split.

signpost_updates: for any signpost listed in the briefing whose date has passed and whose outcome you actually know, add { title (matching exactly), status: "happened", outcome: one factual sentence on what occurred }. Only mark "happened" when you know the real result — never guess. Add up to 3 new_signposts for notable upcoming dated events.

Keep it concise: summary ≤3 sentences; each force what_changed ≤2 sentences, at most 2 indicators and 2 sources; every URL http(s). Counterpoint: one real positive or "No clear counterpoint this week." Plain English, politically neutral.`

async function structure(findings: string, week_start: string): Promise<any> {
  const res = await fetch(ANTHROPIC, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 16000,
      system: STRUCTURE_SYSTEM,
      tools: [EMIT_TOOL],
      tool_choice: { type: 'tool', name: 'emit_world' },
      messages: [{ role: 'user', content: `Week starting ${week_start}. Research briefing:\n\n${findings}\n\nEmit the World Pulse reading for all twelve forces now.` }],
    }),
  })
  if (!res.ok) throw new Error(`structure ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const block = (data.content ?? []).find((b: any) => b.type === 'tool_use')
  if (!block) throw new Error('no tool_use in structure response')
  return block.input
}

async function loadExisting(): Promise<{ weekly: any; readings: any[]; signposts: any[] }> {
  try {
    const g: any = await get(BLOB_PATH, { access: 'private' })
    if (!g) return { weekly: null, readings: [], signposts: [] }
    const text = g.stream
      ? await new Response(g.stream).text()
      : typeof g.blob?.text === 'function'
        ? await g.blob.text()
        : Buffer.from(g.blob).toString('utf-8')
    const d = JSON.parse(text)
    return { weekly: d.weekly ?? null, readings: d.readings ?? [], signposts: d.signposts ?? [] }
  } catch {
    return { weekly: null, readings: [], signposts: [] }
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
    const already = existing.readings.some((r: any) => r.week_start === week_start)
    const force = req.query?.force === '1' || req.query?.force === 1
    if (already && !force) {
      return res.status(200).json({ ok: true, note: 'already refreshed this week', week_start })
    }

    const lastWeek = new Date(Date.parse(week_start) - 7 * 86_400_000).toISOString().slice(0, 10)
    const prevScore: Record<string, number> = {}
    for (const r of existing.readings) if (r.week_start === lastWeek) prevScore[r.force_key] = Number(r.tension)

    const findings = await research(
      `This week starts ${week_start} (Monday, UTC). Last week's tension scores: ${JSON.stringify(prevScore)}. Do at most 6 targeted web searches covering the week's biggest developments across the twelve forces, then write a brief plain-text finding per force: what changed in the last 7 days, an estimated tension 0–10, one counterpoint, and 1–2 key numbers with dates and source URLs. For any of these upcoming signposts whose date has now passed, search for what actually happened and state the outcome in one factual sentence (or say still unresolved): ${JSON.stringify(existing.signposts.filter((s: any) => s.status !== 'happened').map((s: any) => s.title))}. Also flag up to 3 new dated events worth watching. Keep it brief.`,
    )

    const out = await structure(findings, week_start)

    // Validate
    if (!Array.isArray(out.forces) || out.forces.length !== 12) throw new Error("expected 12 forces")
    const seen = new Set<string>()
    for (const f of out.forces) {
      if (!FORCE_KEYS.includes(f.force_key)) throw new Error(`bad force_key ${f.force_key}`)
      seen.add(f.force_key)
      if (typeof f.tension !== 'number' || f.tension < 0 || f.tension > 10) throw new Error(`bad tension ${f.force_key}`)
      for (const s of f.sources ?? []) if (!validHttp(s.url)) throw new Error('bad source url')
    }
    if (seen.size !== 12) throw new Error('duplicate/missing force')
    const lean = out.scenario_lean ?? {}
    const sum = ['A', 'B', 'C', 'D'].reduce((a, k) => a + (Number(lean[k]) || 0), 0)
    if (Math.abs(sum - 100) > 2) throw new Error(`lean sums to ${sum}`)
    if (sum !== 100 && sum > 0) for (const k of ['A', 'B', 'C', 'D']) lean[k] = Math.round((Number(lean[k]) || 0) * 100 / sum)

    const newReadings = out.forces.map((f: any) => {
      const p = prevScore[f.force_key]
      let direction = 'flat'
      if (typeof p === 'number') {
        if (f.tension - p >= 0.5) direction = 'up'
        else if (f.tension - p <= -0.5) direction = 'down'
      }
      return {
        week_start, force_key: f.force_key, tension: f.tension, direction,
        headline: String(f.headline ?? ''), what_changed: String(f.what_changed ?? ''),
        counterpoint: String(f.counterpoint ?? 'No clear counterpoint this week.'),
        indicators: f.indicators ?? [], sources: f.sources ?? [],
      }
    })

    const kept = existing.readings.filter((r: any) => r.week_start !== week_start)
    const cutoff = new Date(Date.parse(week_start) - MAX_WEEKS * 7 * 86_400_000).toISOString().slice(0, 10)
    const readings = [...kept, ...newReadings].filter((r: any) => r.week_start >= cutoff)

    const signposts = [...existing.signposts]
    for (const u of out.signpost_updates ?? []) {
      const m = signposts.find((s) => s.title === u.title)
      if (m) { m.status = u.status ?? 'happened'; m.outcome = u.outcome ?? null }
    }
    for (const s of out.new_signposts ?? []) {
      if (s.title && !signposts.some((x) => x.title === s.title)) {
        signposts.push({ event_date: s.event_date ?? null, date_label: s.date_label ?? '', title: s.title, force_keys: s.force_keys ?? [], what_it_means: s.what_it_means ?? '', status: 'upcoming' })
      }
    }

    const payload = {
      weekly: { week_start, summary: String(out.summary ?? ''), scenario_lean: lean, lean_rationale: String(out.lean_rationale ?? '') },
      readings,
      signposts,
    }

    await put(BLOB_PATH, JSON.stringify(payload), { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true })

    return res.status(200).json({ ok: true, week_start, forces: newReadings.length, weeks: new Set(readings.map((r: any) => r.week_start)).size })
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err instanceof Error ? err.message : err) })
  }
}
