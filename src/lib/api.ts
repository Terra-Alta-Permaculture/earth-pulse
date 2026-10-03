import type {
  AdviceResponse,
  EarthSnapshot,
  Scenario,
  UserType,
} from './types'

// The Claude proxy (server-side function that holds the API key). Same-origin
// `/api/ai` when deployed on Vercel; overridable for other hosts via env.
const AI_ENDPOINT =
  (import.meta.env.VITE_AI_ENDPOINT as string | undefined) ?? '/api/ai'

async function invokeAI<T>(body: unknown): Promise<T> {
  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`ai proxy failed: ${res.status}`)
  return (await res.json()) as T
}

export async function fetchScenarios(rows: EarthSnapshot[]): Promise<{
  scenarios: Scenario[]
  fallback: boolean
}> {
  try {
    const data = await invokeAI<{ scenarios: Scenario[] }>({
      kind: 'scenarios',
      signals: rows,
    })
    const list = Array.isArray(data?.scenarios) ? data.scenarios : []
    if (!list.length) throw new Error('empty')
    // Normalize: the model's structured output can occasionally omit a nested
    // array — guarantee every field the UI maps over is an array.
    const scenarios = list.map((s: any) => ({
      ...s,
      keyIndicators: Array.isArray(s?.keyIndicators) ? s.keyIndicators : [],
      tippingPoints: Array.isArray(s?.tippingPoints) ? s.tippingPoints : [],
    })) as Scenario[]
    return { scenarios, fallback: false }
  } catch {
    return { scenarios: fallbackScenarios(), fallback: true }
  }
}

export async function fetchAdvice(
  rows: EarthSnapshot[],
  userType: UserType,
  balance: number,
): Promise<{ advice: AdviceResponse; fallback: boolean }> {
  try {
    const data = await invokeAI<AdviceResponse>({
      kind: 'advice',
      signals: rows,
      userType,
      balance,
    })
    const items = Array.isArray(data?.items) ? data.items : []
    if (!items.length) throw new Error('empty')
    return { advice: { ...data, items }, fallback: false }
  } catch {
    return { advice: fallbackAdvice(userType, balance), fallback: true }
  }
}

// ── Offline fallbacks ───────────────────────────────────────────────
// Used when edge functions / Claude are not reachable (e.g. local dev
// before deploy). Keeps the panels meaningful without a live model call.

function fallbackScenarios(): Scenario[] {
  return [
    {
      id: 'business_as_usual',
      title: 'Business as usual',
      timeframe: '2025 – 2050',
      summary:
        'Current trajectories continue: deforestation and particulate pollution stay elevated while restoration commitments lag delivery. Biodiversity records rise where monitoring expands, masking underlying loss.',
      keyIndicators: [
        { name: 'Deforestation alerts', trajectory: 'gradually rising' },
        { name: 'Air pollution (PM2.5)', trajectory: 'plateau at unhealthy levels' },
        { name: 'Forest under restoration', trajectory: 'slow, below pledge' },
      ],
      tippingPoints: [
        'Amazon dry-season lengthening past forest tolerance',
        'Coral bleaching becoming annual in major reef systems',
      ],
    },
    {
      id: 'moderate',
      title: 'Moderate earth care adoption',
      timeframe: '2025 – 2050',
      summary:
        'Widening adoption of clean air policy and reforestation pledges bends the curves. Crisis indicators stabilise; regeneration signals strengthen in monitored regions, though gains are uneven globally.',
      keyIndicators: [
        { name: 'Clean-air locations', trajectory: 'steady increase' },
        { name: 'Biodiversity observations', trajectory: 'rising in protected zones' },
        { name: 'Deforestation alerts', trajectory: 'flattening' },
      ],
      tippingPoints: [
        'Restoration delivery crossing 50% of pledged area',
        'Urban PM2.5 dropping below WHO guideline in leading cities',
      ],
    },
    {
      id: 'accelerated',
      title: 'Accelerated regenerative transition',
      timeframe: '2025 – 2050',
      summary:
        'Rapid, coordinated action: restoration outpaces loss, air quality improves broadly, and biodiversity recovery becomes measurable at scale. Degradation signals decline year on year.',
      keyIndicators: [
        { name: 'Forest under restoration', trajectory: 'exceeding pledges' },
        { name: 'Deforestation alerts', trajectory: 'falling sharply' },
        { name: 'Species observed', trajectory: 'recovering' },
      ],
      tippingPoints: [
        'Net forest gain achieved across major biomes',
        'Regeneration stream overtaking crisis stream in balance index',
      ],
    },
  ]
}

function fallbackAdvice(userType: UserType, balance: number): AdviceResponse {
  const leaning =
    balance < 45 ? 'degradation is currently outweighing recovery' : 'recovery signals are holding'
  const byType: Record<UserType, AdviceResponse['items']> = {
    individual: [
      { title: 'Log what you see', detail: 'Contribute biodiversity observations via iNaturalist/GBIF — every record strengthens the regeneration signal.', stream: 'regeneration' },
      { title: 'Cut particulate load', detail: 'Favour walking, cycling and transit on high-pollution days; support local low-emission zones.', stream: 'crisis' },
      { title: 'Back verified restoration', detail: 'Direct giving to reforestation with transparent monitoring, not offset-only schemes.', stream: 'balance' },
    ],
    community: [
      { title: 'Adopt a patch', detail: 'Organise a local rewilding or tree-planting group and register the site for restoration tracking.', stream: 'regeneration' },
      { title: 'Air-quality watch', detail: 'Deploy low-cost PM2.5 sensors and publish a community clean-air dashboard.', stream: 'crisis' },
      { title: 'Protect what remains', detail: 'Campaign for local protection of intact habitat before restoring degraded land.', stream: 'balance' },
    ],
    policy: [
      { title: 'Fund monitored restoration', detail: 'Tie restoration finance to delivery milestones and satellite-verified survival rates.', stream: 'regeneration' },
      { title: 'Tighten emission standards', detail: 'Align PM2.5 limits to WHO guidelines with enforceable timelines.', stream: 'crisis' },
      { title: 'Halt frontier loss', detail: 'Prioritise zero-deforestation supply-chain regulation over downstream offsets.', stream: 'balance' },
    ],
  }
  return {
    headline: `With ${leaning}, here is where ${userType} action moves the needle most.`,
    items: byType[userType],
  }
}
