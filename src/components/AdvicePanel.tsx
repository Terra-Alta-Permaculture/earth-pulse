import { useEffect, useState } from 'react'
import type { AdviceResponse, EarthSnapshot, UserType } from '../lib/types'
import { fetchAdvice } from '../lib/api'

interface Props {
  rows: EarthSnapshot[]
  balance: number
}

const TYPES: { key: UserType; label: string }[] = [
  { key: 'individual', label: 'Individual' },
  { key: 'community', label: 'Community' },
  { key: 'policy', label: 'Policy' },
]

const STREAM_DOT: Record<string, string> = {
  crisis: 'bg-ember-400',
  regeneration: 'bg-moss-400',
  balance: 'bg-sand-300',
}

export function AdvicePanel({ rows, balance }: Props) {
  const [userType, setUserType] = useState<UserType>('individual')
  const [advice, setAdvice] = useState<AdviceResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      const { advice: a, fallback: f } = await fetchAdvice(rows, userType, balance)
      if (cancelled) return
      setAdvice(a)
      setFallback(f)
      setLoading(false)
    }
    run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, rows.length])

  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">Earth care</span>
          <h2 className="mt-1 font-display text-xl text-sand-100">What moves the needle</h2>
          <p className="mt-0.5 text-sm text-sand-500">
            Contextual action, weighted by the current balance between the streams.
          </p>
        </div>

        {/* Toggle */}
        <div className="inline-flex rounded-xl border border-soil-600 bg-soil-800 p-1">
          {TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => setUserType(t.key)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                userType === t.key
                  ? 'bg-moss-600 text-soil-950'
                  : 'text-sand-400 hover:text-sand-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5">
        {advice && (
          <p className="mb-4 font-display text-base text-sand-100">{advice.headline}</p>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          {(Array.isArray(advice?.items) ? advice!.items : []).map((item, i) => (
            <div
              key={i}
              className="animate-fade-up rounded-xl border border-soil-700/60 bg-soil-800/40 p-4"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${STREAM_DOT[item.stream] ?? 'bg-sand-300'}`} />
                <h4 className="text-sm font-medium text-sand-100">{item.title}</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-sand-400">{item.detail}</p>
            </div>
          ))}

          {loading &&
            !advice &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-soil-800/40" />
            ))}
        </div>

        {fallback && (
          <p className="mt-3 text-[0.7rem] text-sand-700">
            Baseline guidance — connect the advice function for live Claude output.
          </p>
        )}
      </div>
    </section>
  )
}
