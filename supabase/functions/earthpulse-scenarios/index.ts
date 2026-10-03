// EarthPulse — scenario generation.
// Takes up to 30 days of snapshots, asks Claude to produce three future
// scenarios (business as usual / moderate / accelerated) as structured JSON.

import { corsHeaders, json } from '../_shared/cors.ts'
import { callClaudeTool } from '../_shared/anthropic.ts'
import { summarize, digest, type SnapshotRow } from '../_shared/summary.ts'

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    scenarios: {
      type: 'array',
      minItems: 3,
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          id: {
            type: 'string',
            enum: ['business_as_usual', 'moderate', 'accelerated'],
          },
          title: { type: 'string' },
          timeframe: { type: 'string', description: 'e.g. "2025 – 2050"' },
          summary: { type: 'string', description: '2-3 sentences, grounded, not alarmist' },
          keyIndicators: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                name: { type: 'string' },
                trajectory: { type: 'string', description: 'short phrase' },
              },
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

const SYSTEM = `You are EarthPulse's foresight engine. You read planetary indicator trends split into a "crisis" stream (degradation) and a "regeneration" stream (recovery), and you generate three grounded future scenarios.

Tone: clear-eyed and evidence-based. Neither alarmist nor naively optimistic. Scenarios should be plausible, specific to the indicators provided, and useful for decision-makers. Always return exactly three scenarios with ids business_as_usual, moderate, and accelerated (in that order).`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  try {
    const { snapshots } = (await req.json()) as { snapshots: SnapshotRow[] }
    if (!Array.isArray(snapshots) || snapshots.length === 0) {
      return json({ error: 'No snapshot data provided' }, 400)
    }

    const summaries = summarize(snapshots)
    const user = `Here are the last ~30 days of planetary indicators:\n\n${digest(
      summaries,
    )}\n\nGenerate three future scenarios projecting from these trends.`

    const result = await callClaudeTool<{ scenarios: unknown[] }>({
      system: SYSTEM,
      user,
      toolName: 'emit_scenarios',
      toolDescription: 'Return exactly three planetary future scenarios.',
      schema: SCHEMA,
      maxTokens: 2560,
    })

    return json(result)
  } catch (err) {
    return json({ error: String(err instanceof Error ? err.message : err) }, 500)
  }
})
