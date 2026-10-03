import { useState } from 'react'
import type { WorldReading } from '../../lib/types'
import { forceByKey } from '../../data/forces'
import { Sparkline } from '../Sparkline'

interface Props {
  reading: WorldReading
  history: WorldReading[]
}

const DIRECTION = {
  up: { arrow: '↑', label: 'rising', cls: 'text-ember-400' },
  down: { arrow: '↓', label: 'easing', cls: 'text-moss-400' },
  flat: { arrow: '→', label: 'steady', cls: 'text-sand-500' },
} as const

// Amber intensity scales with the tension score.
function barColor(score: number): string {
  if (score >= 8.5) return '#e0a852'
  if (score >= 6.5) return '#d18f36'
  if (score >= 4) return '#b5741f'
  return '#8f5a19'
}

export function ForceCard({ reading, history }: Props) {
  const meta = forceByKey[reading.force_key]
  const [expanded, setExpanded] = useState(false)
  const [showNumbers, setShowNumbers] = useState(false)

  const dir = DIRECTION[reading.direction]
  const prev = history.length >= 2 ? history[history.length - 2] : null
  const change = prev ? reading.tension - prev.tension : null
  const changeLabel =
    change === null ? 'first reading' : `${change >= 0 ? '+' : ''}${change.toFixed(1)} vs last week`

  return (
    <article className="flex flex-col rounded-2xl border border-soil-700/70 bg-soil-900/60 p-4 backdrop-blur-sm">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <span className="text-lg leading-none" aria-hidden>{meta?.icon}</span>
          <h3 className="text-sm font-medium leading-tight text-sand-100">{meta?.title}</h3>
        </div>
        <Sparkline
          values={history.map((h) => h.tension)}
          color={barColor(reading.tension)}
          width={72}
          height={26}
          className="mt-0.5 flex-none"
        />
      </div>

      {/* Thermometer */}
      <div className="mt-3 flex items-center gap-3">
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-soil-700">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${(reading.tension / 10) * 100}%`, background: barColor(reading.tension) }}
          />
        </div>
        <span className="stat-num text-sm text-sand-100">
          {reading.tension.toFixed(1)}
          <span className="text-[0.6rem] text-sand-500"> /10</span>
        </span>
      </div>

      <div className={`mt-1.5 flex items-center gap-1.5 text-[0.68rem] ${dir.cls}`}>
        <span aria-hidden>{dir.arrow}</span>
        <span className="sr-only">Tension {dir.label},</span>
        <span>{changeLabel}</span>
      </div>

      {/* Headline + what changed */}
      <p className="mt-3 text-sm font-medium leading-snug text-sand-100">{reading.headline}</p>
      <p className={`mt-1 text-xs leading-relaxed text-sand-400 ${expanded ? '' : 'line-clamp-2'}`}>
        {reading.what_changed}
      </p>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 self-start text-[0.65rem] text-sand-600 hover:text-sand-300"
      >
        {expanded ? 'Show less' : 'Read more'}
      </button>

      {/* Counterpoint */}
      <div className="mt-3 flex gap-2 rounded-lg border border-moss-700/30 bg-moss-700/10 p-2.5">
        <span className="text-sm leading-none" aria-hidden>🌱</span>
        <p className="text-[0.72rem] leading-snug text-moss-200">{reading.counterpoint}</p>
      </div>

      {/* Numbers + sources */}
      {(reading.indicators.length > 0 || reading.sources.length > 0) && (
        <button
          onClick={() => setShowNumbers((v) => !v)}
          className="mt-3 self-start text-[0.65rem] text-sand-600 hover:text-sand-300"
        >
          {showNumbers ? 'Hide numbers' : 'Numbers & sources'}
        </button>
      )}
      {showNumbers && (
        <div className="mt-2 space-y-2">
          {reading.indicators.length > 0 && (
            <ul className="space-y-1">
              {reading.indicators.map((ind, i) => (
                <li key={i} className="flex items-baseline justify-between gap-2 text-[0.7rem]">
                  <span className="text-sand-400">{ind.label}</span>
                  <span className="text-right text-sand-200">
                    {ind.source_url ? (
                      <a href={ind.source_url} target="_blank" rel="noopener noreferrer" className="underline decoration-soil-600 underline-offset-2 hover:text-sand-100">
                        {ind.value}{ind.unit ? ` ${ind.unit}` : ''}
                      </a>
                    ) : (
                      <>{ind.value}{ind.unit ? ` ${ind.unit}` : ''}</>
                    )}
                    {ind.as_of && <span className="ml-1 text-[0.6rem] text-sand-700">{ind.as_of}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {reading.sources.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {reading.sources.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-soil-600 px-2 py-0.5 text-[0.6rem] text-sand-500 hover:text-sand-200">
                  {s.title}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
