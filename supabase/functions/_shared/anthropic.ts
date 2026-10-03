// Minimal Anthropic Messages API helper for Deno edge functions.
// Uses forced tool-use to get reliable structured JSON out of the model —
// this works across models (including claude-sonnet-4-6, which does not support
// the output_config.format structured-outputs feature).

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

export const MODEL = Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-sonnet-4-6'

interface ToolCallOpts {
  system: string
  user: string
  toolName: string
  toolDescription: string
  schema: Record<string, unknown>
  maxTokens?: number
}

/**
 * Calls Claude and forces it to emit a single tool call whose `input` matches
 * `schema`. Returns the parsed input object.
 */
export async function callClaudeTool<T>(opts: ToolCallOpts): Promise<T> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set')

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: opts.maxTokens ?? 2048,
      system: opts.system,
      messages: [{ role: 'user', content: opts.user }],
      tools: [
        {
          name: opts.toolName,
          description: opts.toolDescription,
          input_schema: opts.schema,
        },
      ],
      tool_choice: { type: 'tool', name: opts.toolName },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Anthropic API ${res.status}: ${text}`)
  }

  const data = await res.json()
  const toolUse = (data.content ?? []).find(
    (b: { type: string }) => b.type === 'tool_use',
  )
  if (!toolUse) throw new Error('No tool_use block in Claude response')
  return toolUse.input as T
}
