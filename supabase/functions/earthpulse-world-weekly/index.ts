// EarthPulse — World Pulse weekly writer.
// Researches the past 7 days for the nine forces with Claude + web search,
// scores them with the fixed rubric, and upserts world_readings / world_weekly /
// world_signposts. All-or-nothing: on any failure it writes nothing.
//
// UNTESTED as of writing: there is no Supabase project wired up yet, and the
// web-search server-tool version string should be re-checked against current
// Anthropic docs before first run (see NOTE below).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'

const MODEL = Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-sonnet-5'
// NOTE: verify the current web-search tool type for this model in Anthropic's
// docs. On Sonnet 5 the dynamic-filtering variant is web_search_20260209.
const WEB_SEARCH_TOOL = { type: 'web_search_20260209', name: 'web_search', max_uses: 12 }

const FORCE_KEYS = [
  'us_power', 'us_china', 'chokepoints_energy', 'russia_europe',
  'institutions', 'living_planet', 'identity_religion', 'ai', 'money_trade',
] as const

function isoMonday(d = new Date()): string {
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = dt.getUTCDay() || 7 // Sun=0 → 7
  if (day !== 1) dt.setUTCDate(dt.getUTCDate() - (day - 1))
  return dt.toISOString().slice(0, 10)
}

const SYSTEM = `You are EarthPulse's geopolitics analyst. Each week you assess nine forces pressing on the planet and score their tension 0–10 with a fixed rubric.

The nine forces (use these exact keys):
- us_power: tariffs, unilateral force, alliance pressure, spheres of influence
- us_china: trade truces, chip/mineral controls, Taiwan pressure
- chokepoints_energy: Hormuz, Bab al-Mandab, Red Sea, oil & gas prices, LNG
- russia_europe: Ukraine front, talks, hybrid attacks on NATO, European rearmament
- institutions: UN, ICC, ICJ, arms control, treaty exits
- living_planet: climate, El Niño, harvests, soil, forests, fisheries, war-finance minerals
- identity_religion: religious/nationalist mobilisation, sectarian violence, persecution
- ai: compute concentration, chip controls, military AI, model access, AI rules
- money_trade: dollar share, US debt, sanctions, frozen assets, trade flows, debt distress

Tension rubric (0–2 calm/improving; 3–4 elevated but stable; 5–6 high but managed, truces holding; 7–8 severe active crisis with spillover risk; 9–10 systemic: great-power war, a global chokepoint shut, or a global market/food shock).

Rules:
- Research what changed in the LAST 7 DAYS for each force using web search. Prefer primary and major sources (Reuters, AP, Al Jazeera, BBC, FT, IEA, IMF, WMO, Copernicus, FAO, UN, Crisis Group, SIPRI).
- Score with the rubric. Justify changes vs last week in what_changed.
- Every number in indicators has an as_of date and a source_url.
- Plain English, short sentences, politically neutral. No speculation presented as fact.
- Regeneration counterpoint: one real, sourced positive development this week, or "No clear counterpoint this week."
- Scenario lean: four scenarios A/B/C/D whose percentages sum to 100 (judgment).
- Update signposts: mark events that happened (one-line outcome) and add new dated events worth watching in the next 6 months.
- Output ONLY the JSON object described by the user. No prose, no markdown fences.`

function extractJson(text: string): any {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced ? fenced[1] : text
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('no JSON object in model output')
  return JSON.parse(raw.slice(start, end + 1))
}

function validHttp(u: unknown): boolean {
  return typeof u === 'string' && /^https?:\/\//.test(u)
}

async function callClaude(system: string, user: string): Promise<any> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set')
  let messages: any[] = [{ role: 'user', content: user }]

  for (let i = 0; i < 6; i++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 8000,
        system,
        tools: [WEB_SEARCH_TOOL],
        messages,
      }),
    })
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`)
    const data = await res.json()

    if (data.stop_reason === 'pause_turn') {
      // Server-tool loop paused; resume by echoing the assistant turn back.
      messages = [...messages, { role: 'assistant', content: data.content }]
      continue
    }
    const text = (data.content ?? [])
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('\n')
    return extractJson(text)
  }
  throw new Error('web-search loop did not converge')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  try {
    const week_start = isoMonday()
    const lastWeek = new Date(Date.parse(week_start) - 7 * 86_400_000)
      .toISOString()
      .slice(0, 10)

    const { data: prev } = await supabase
      .from('world_readings')
      .select('force_key,tension')
      .eq('week_start', lastWeek)
    const prevScore: Record<string, number> = {}
    for (const r of prev ?? []) prevScore[r.force_key] = Number(r.tension)

    const { data: signposts } = await supabase.from('world_signposts').select('*')

    const user = `This week starts ${week_start} (Monday, UTC). Last week's tension scores: ${JSON.stringify(prevScore)}.

Current upcoming signposts: ${JSON.stringify((signposts ?? []).map((s: any) => ({ title: s.title, status: s.status, date_label: s.date_label })))}.

Return ONLY this JSON:
{
  "summary": "3–5 sentence weekly brief",
  "scenario_lean": {"A": 45, "B": 25, "C": 20, "D": 10},
  "lean_rationale": "string",
  "forces": [ { "force_key": "one of the nine keys", "tension": 0-10, "headline": "string", "what_changed": "string", "counterpoint": "string", "indicators": [{"label":"","value":"","unit":"","as_of":"YYYY-MM-DD","source_url":"https://..."}], "sources": [{"title":"","url":"https://..."}] } ],
  "signpost_updates": [ {"title":"existing signpost title","status":"happened","outcome":"one line"} ],
  "new_signposts": [ {"event_date":"YYYY-MM-DD or null","date_label":"string","title":"string","force_keys":["key"],"what_it_means":"string"} ]
}`

    const out = await callClaude(SYSTEM, user)

    // ── Validate ──────────────────────────────────────────────────────
    if (!Array.isArray(out.forces) || out.forces.length !== 9) {
      throw new Error('expected 9 forces')
    }
    const seen = new Set<string>()
    for (const f of out.forces) {
      if (!FORCE_KEYS.includes(f.force_key)) throw new Error(`bad force_key ${f.force_key}`)
      seen.add(f.force_key)
      if (typeof f.tension !== 'number' || f.tension < 0 || f.tension > 10) {
        throw new Error(`bad tension for ${f.force_key}`)
      }
      for (const ind of f.indicators ?? []) {
        if (ind.source_url && !validHttp(ind.source_url)) throw new Error('bad indicator url')
      }
      for (const s of f.sources ?? []) {
        if (!validHttp(s.url)) throw new Error('bad source url')
      }
    }
    if (seen.size !== 9) throw new Error('duplicate or missing force')

    const lean = out.scenario_lean ?? {}
    let sum = ['A', 'B', 'C', 'D'].reduce((a, k) => a + (Number(lean[k]) || 0), 0)
    if (Math.abs(sum - 100) > 2) throw new Error(`scenario_lean sums to ${sum}`)
    if (sum !== 100 && sum > 0) {
      for (const k of ['A', 'B', 'C', 'D']) lean[k] = Math.round((Number(lean[k]) || 0) * 100 / sum)
    }

    // ── Build rows; recompute direction server-side from last week ────
    const readingRows = out.forces.map((f: any) => {
      const p = prevScore[f.force_key]
      let direction = 'flat'
      if (typeof p === 'number') {
        if (f.tension - p >= 0.5) direction = 'up'
        else if (f.tension - p <= -0.5) direction = 'down'
      }
      return {
        week_start,
        force_key: f.force_key,
        tension: f.tension,
        direction,
        headline: String(f.headline ?? ''),
        what_changed: String(f.what_changed ?? ''),
        counterpoint: String(f.counterpoint ?? 'No clear counterpoint this week.'),
        indicators: f.indicators ?? [],
        sources: f.sources ?? [],
        created_by: 'weekly-job',
      }
    })

    // ── Write (upserts) ───────────────────────────────────────────────
    const r1 = await supabase.from('world_readings').upsert(readingRows, { onConflict: 'week_start,force_key' })
    if (r1.error) throw new Error(`readings: ${r1.error.message}`)

    const r2 = await supabase.from('world_weekly').upsert({
      week_start,
      summary: String(out.summary ?? ''),
      scenario_lean: lean,
      lean_rationale: String(out.lean_rationale ?? ''),
    }, { onConflict: 'week_start' })
    if (r2.error) throw new Error(`weekly: ${r2.error.message}`)

    // Mark happened signposts by title match.
    for (const u of out.signpost_updates ?? []) {
      if (!u.title) continue
      await supabase.from('world_signposts')
        .update({ status: u.status ?? 'happened', outcome: u.outcome ?? null, updated_at: new Date().toISOString() })
        .eq('title', u.title)
    }
    // Add new signposts that don't already exist (by title).
    for (const s of out.new_signposts ?? []) {
      if (!s.title) continue
      const { data: exists } = await supabase.from('world_signposts').select('id').eq('title', s.title).limit(1)
      if (exists && exists.length) continue
      await supabase.from('world_signposts').insert({
        event_date: s.event_date ?? null,
        date_label: s.date_label ?? '',
        title: s.title,
        force_keys: s.force_keys ?? [],
        what_it_means: s.what_it_means ?? '',
        status: 'upcoming',
      })
    }

    return json({ ok: true, week_start, forces: readingRows.length })
  } catch (err) {
    return json({ ok: false, error: String(err instanceof Error ? err.message : err) }, 500)
  }
})
