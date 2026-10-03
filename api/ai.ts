// EarthPulse — server-side Claude proxy (Vercel serverless function).
// Holds ANTHROPIC_API_KEY server-side so the browser never sees it. Generates
// the scenario + advice panels live from the current indicator readings.
//
// POST /api/ai
//   { kind: 'scenarios', signals: [...] }
//   { kind: 'advice', signals: [...], userType: 'individual'|'community'|'policy', balance: number }

// Node runtime global (avoids needing @types/node for this single function)
declare const process: { env: Record<string, string | undefined> }

interface Signal {
  label?: string
  indicator_name?: string
  value: number | string
  unit?: string
  stream?: string
  detail?: string
}

const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5'

const SCENARIO_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    scenarios: {
      type: 'array', minItems: 3, maxItems: 3,
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          id: { type: 'string', enum: ['business_as_usual', 'moderate', 'accelerated'] },
          title: { type: 'string' },
          timeframe: { type: 'string' },
          summary: { type: 'string' },
          keyIndicators: {
            type: 'array',
            items: {
              type: 'object', additionalProperties: false,
              properties: { name: { type: 'string' }, trajectory: { type: 'string' } },
              required: ['name', 'trajectory'],
            },
          },
          tippingPoints: { type: 'array', items: { type: 'string' } },
        },
        required: ['id', 'title', 'timeframe', 'summary', 'keyIndicators', 'tippingPoints'],
      },
    },
  },
  required: ['scenarios'],
}

const ADVICE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    headline: { type: 'string' },
    items: {
      type: 'array', minItems: 3, maxItems: 3,
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          title: { type: 'string' },
          detail: { type: 'string' },
          stream: { type: 'string', enum: ['crisis', 'regeneration', 'balance'] },
        },
        required: ['title', 'detail', 'stream'],
      },
    },
  },
  required: ['headline', 'items'],
}

function digest(signals: Signal[]): string {
  return signals
    .map((s) => {
      const name = s.label ?? s.indicator_name ?? 'indicator'
      const stream = s.stream ? `[${s.stream}] ` : ''
      const detail = s.detail ? ` — ${s.detail}` : ''
      return `- ${stream}${name}: ${s.value} ${s.unit ?? ''}${detail}`.trim()
    })
    .join('\n')
}

async function callClaude(system: string, user: string, tool: {
  name: string; description: string; schema: unknown; maxTokens: number
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set')
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: tool.maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
      tools: [{ name: tool.name, description: tool.description, input_schema: tool.schema }],
      tool_choice: { type: 'tool', name: tool.name },
    }),
  })
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const block = (data.content ?? []).find((b: { type: string }) => b.type === 'tool_use')
  if (!block) throw new Error('no tool_use in response')
  return block.input
}

const SCENARIO_SYSTEM = `You are EarthPulse's foresight engine. You read live planetary indicators, split into a "crisis" stream (degradation) and a "regeneration" stream (recovery), and generate three grounded future scenarios. Clear-eyed and evidence-based — neither alarmist nor naive. Plausible, specific to the data given, useful for decision-makers. Always return exactly three scenarios with ids business_as_usual, moderate, accelerated in that order.`

const ADVICE_SYSTEM = `You are EarthPulse's earth-care advisor. You turn the current balance between planetary degradation and regeneration into concrete, non-generic guidance. Ground every recommendation in the data provided. Weight by the balance: if degradation outweighs recovery, emphasise stopping harm; if recovery holds, emphasise accelerating it. Specific and actionable — no platitudes, no guilt, no doom. Return exactly three items tailored to the given audience.`

const AUDIENCE: Record<string, string> = {
  individual: 'an individual person acting in their own life and household',
  community: 'a local community group, neighbourhood, or organisation',
  policy: 'a policymaker or institution able to shape regulation and funding',
}

// Vercel Node serverless handler
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'content-type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { kind, signals = [], userType, balance } = body ?? {}
    if (!Array.isArray(signals) || signals.length === 0) {
      return res.status(400).json({ error: 'No signals provided' })
    }

    if (kind === 'scenarios') {
      const user = `Live planetary indicators right now:\n\n${digest(signals)}\n\nGenerate three future scenarios projecting from these.`
      const out = await callClaude(SCENARIO_SYSTEM, user, {
        name: 'emit_scenarios',
        description: 'Return exactly three planetary future scenarios.',
        schema: SCENARIO_SCHEMA,
        maxTokens: 2560,
      })
      return res.status(200).json(out)
    }

    if (kind === 'advice') {
      const audience = AUDIENCE[userType] ?? AUDIENCE.individual
      const lean =
        balance < 45 ? 'degradation is currently outweighing recovery'
          : balance > 56 ? 'recovery signals are currently holding or gaining'
            : 'the two streams are near equilibrium'
      const user = `Planetary balance: ${balance}/100 (${lean}).\n\nLive indicators:\n${digest(signals)}\n\nAudience: ${audience}.\n\nGive three tailored earth-care actions, weighted by the balance.`
      const out = await callClaude(ADVICE_SYSTEM, user, {
        name: 'emit_advice',
        description: 'Return a headline plus exactly three tailored actions.',
        schema: ADVICE_SCHEMA,
        maxTokens: 1536,
      })
      return res.status(200).json(out)
    }

    return res.status(400).json({ error: 'Unknown kind' })
  } catch (err) {
    return res.status(500).json({ error: String(err instanceof Error ? err.message : err) })
  }
}
