import { useMemo } from 'react'
import type { LiveSignal } from '../data/liveSources'
import { buildBriefing } from '../lib/briefing'
import { resolveBoundaries } from '../data/planetaryBoundaries'
import { useSocialFoundation } from '../data/socialFoundation'
import { doughnutScore } from '../lib/doughnutScore'

export function DailyBriefing({
  signals,
  balance,
}: {
  signals: LiveSignal[]
  balance: number
}) {
  const { dims } = useSocialFoundation()
  const doughnut = useMemo(
    () => doughnutScore(dims, resolveBoundaries(signals)),
    [dims, signals],
  )
  const briefing = useMemo(
    () => buildBriefing(signals, balance, doughnut),
    [signals, balance, doughnut],
  )
  if (!briefing) return null

  return (
    <section className="rounded-2xl border border-moss-800/50 bg-gradient-to-br from-soil-900/70 to-soil-900/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-sand-100">
          <span className="text-moss-400">◐</span> {briefing.greeting} — today's planet
        </h2>
        <span className="text-xs text-sand-500">{briefing.date}</span>
      </div>

      <p className="mt-3 text-[0.95rem] leading-relaxed text-sand-200">
        {briefing.sentences.map((s, i) => (
          <span key={i}>
            {i === 0 ? (
              <span className="text-sand-100">{s} </span>
            ) : (
              <span>{s} </span>
            )}
          </span>
        ))}
      </p>

      <p className="mt-3 text-[0.6rem] text-sand-700">
        Written from today's live signals · updates through the day, every visit
      </p>
    </section>
  )
}
