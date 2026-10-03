// EarthPulse — contextual earth-care advice.
// Given current snapshot data, the stream balance, and a user type
// (individual / community / policy), Claude returns tailored, actionable advice.

import { corsHeaders, json } from '../_shared/cors.ts'
import { callClaudeTool } from '../_shared/anthropic.ts'
import { summarize, digest, type SnapshotRow } from '../_shared/summary.ts'

type UserType = 'individual' | 'community' | 'policy'

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    headline: { type: 'string', description: 'One sentence framing the moment for this audience.' },
    items: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: { type: 'string', description: 'Short imperative action, 2-5 words.' },
          detail: { type: 'string', description: 'One or two sentences, specific and doable.' },
          stream: {
            type: 'string',
            enum: ['crisis', 'regeneration', 'balance'],
            description: 'Which stream this action most addresses.',
          },
        },
        required: ['title', 'detail', 'stream'],
      },
    },
  },
  required: ['headline', 'items'],
}

const AUDIENCE: Record<UserType, string> = {
  individual: 'an individual person acting in their own life and household',
  community: 'a local community group, neighbourhood, or organisation',
  policy: 'a policymaker or institution able to shape regulation and funding',
}

const SYSTEM = `You are EarthPulse's earth-care advisor. You translate the current balance between planetary degradation and regeneration into concrete, non-generic guidance.

Rules:
- Ground every recommendation in the indicator data provided.
- Weight advice by the current balance: if degradation is outweighing recovery, emphasise stopping harm; if recovery is holding, emphasise accelerating it.
- Be specific and actionable — avoid platitudes. No guilt, no doom; empowering and realistic.
- Return exactly three items appropriate to the given audience.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const { snapshots, userType, balance } = (await req.json()) as {
      snapshots: SnapshotRow[]
      userType: UserType
      balance: number
    }
    if (!Array.isArray(snapshots) || snapshots.length === 0) {
      return json({ error: 'No snapshot data provided' }, 400)
    }
    const audience = AUDIENCE[userType] ?? AUDIENCE.individual

    const summaries = summarize(snapshots)
    const lean =
      balance < 45
        ? 'degradation is currently outweighing recovery'
        : balance > 56
          ? 'recovery signals are currently holding or gaining'
          : 'the two streams are near equilibrium'

    const user = `Current planetary balance index: ${balance}/100 (${lean}).

Latest indicator trends:
${digest(summaries)}

Audience: ${audience}.

Give three tailored earth-care actions for this audience, weighted by the balance.`

    const result = await callClaudeTool({
      system: SYSTEM,
      user,
      toolName: 'emit_advice',
      toolDescription: 'Return a headline plus exactly three tailored actions.',
      schema: SCHEMA,
      maxTokens: 1536,
    })

    return json(result)
  } catch (err) {
    return json({ error: String(err instanceof Error ? err.message : err) }, 500)
  }
})
