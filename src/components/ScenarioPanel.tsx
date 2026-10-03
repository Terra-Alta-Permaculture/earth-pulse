import { useEffect, useState } from 'react'
import type { EarthSnapshot, Scenario } from '../lib/types'
import { fetchScenarios } from '../lib/api'

interface Props {
  rows: EarthSnapshot[]
}

const ACCENT: Record<Scenario['id'], { bar: string; label: string; chip: string }> = {
  business_as_usual: { bar: 'bg-ember-500', label: 'text-ember-200', chip: 'border-ember-700/40 bg-ember-700/10' },
  moderate: { bar: 'bg-sand-500', label: 'text-sand-300', chip: 'border-soil-600 bg-soil-700/40' },
  accelerated: { bar: 'bg-moss-500', label: 'text-moss-200', chip: 'border-moss-700/40 bg-moss-700/10' },
}

export function ScenarioPanel({ rows }: Props) {
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [fallback, setFallback] = useState(false)

  async function generate() {
    setLoading(true)
    const { scenarios: s, fallback: f } = await fetchScenarios(rows)
    setScenarios(s)
    setFallback(f)
    setLoading(false)
  }

  // Auto-generate once on first mount so the panel is populated.
  useEffect(() => {
    generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="mt-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <span className="eyebrow">Futures</span>
          <h2 className="mt-1 font-display text-xl text-sand-100">Three planetary scenarios</h2>
          <p className="mt-0.5 text-sm text-sand-500">
            Projected from the last 30 days of both streams.
          </p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="rounded-lg border border-soil-600 bg-soil-800 px-3 py-1.5 text-xs font-medium text-sand-300 transition-colors hover:bg-soil-700 disabled:opacity-50"
        >
          {loading ? 'Modelling…' : 'Regenerate'}
        </button>
      </div>

      {fallback && (
        <p className="mb-3 text-[0.7rem] text-sand-700">
          Showing baseline projections — connect the scenarios function for live Claude modelling.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {(Array.isArray(scenarios) ? scenarios : placeholder).map((s, i) => {
          const a = ACCENT[s.id] ?? ACCENT.moderate
          return (
            <article
              key={s.id}
              className="card animate-fade-up p-5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`h-1 w-10 rounded-full ${a.bar}`} />
              <h3 className="mt-3 font-display text-lg text-sand-100">{s.title}</h3>
              <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[0.65rem] ${a.chip} ${a.label}`}>
                {s.timeframe}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-sand-300">{s.summary}</p>

              <div className="mt-4">
                <p className="eyebrow mb-1.5">Key indicators</p>
                <ul className="space-y-1">
                  {(s.keyIndicators ?? []).map((k) => (
                    <li key={k.name} className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="text-sand-300">{k.name}</span>
                      <span className="text-right text-sand-500">{k.trajectory}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="eyebrow mb-1.5">Tipping points</p>
                <ul className="space-y-1.5">
                  {(s.tippingPoints ?? []).map((tp) => (
                    <li key={tp} className="flex gap-2 text-xs text-sand-500">
                      <span className={`mt-1 h-1 w-1 flex-none rounded-full ${a.bar}`} />
                      <span>{tp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

const placeholder: Scenario[] = [
  { id: 'business_as_usual', title: 'Business as usual', timeframe: '—', summary: 'Generating…', keyIndicators: [], tippingPoints: [] },
  { id: 'moderate', title: 'Moderate earth care', timeframe: '—', summary: 'Generating…', keyIndicators: [], tippingPoints: [] },
  { id: 'accelerated', title: 'Accelerated regeneration', timeframe: '—', summary: 'Generating…', keyIndicators: [], tippingPoints: [] },
]
