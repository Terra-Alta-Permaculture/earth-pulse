import type { IndicatorReading, Stream } from '../lib/types'
import { IndicatorCard } from './IndicatorCard'

interface Props {
  stream: Stream
  readings: IndicatorReading[]
}

const COPY = {
  crisis: {
    eyebrow: 'Crisis stream',
    title: 'Degradation signals',
    desc: 'Where the living systems are under strain.',
    accent: 'from-ember-600/20',
    ring: 'border-ember-700/40',
    glow: 'bg-ember-500',
    label: 'text-ember-200',
  },
  regeneration: {
    eyebrow: 'Regeneration stream',
    title: 'Recovery signals',
    desc: 'Where life and repair are gaining ground.',
    accent: 'from-moss-600/20',
    ring: 'border-moss-700/40',
    glow: 'bg-moss-500',
    label: 'text-moss-200',
  },
} as const

export function StreamPanel({ stream, readings }: Props) {
  const c = COPY[stream]

  return (
    <section className={`card overflow-hidden border ${c.ring}`}>
      <header
        className={`relative bg-gradient-to-b ${c.accent} to-transparent px-5 pb-4 pt-5`}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${c.glow} opacity-60 animate-pulse-ring`}
            />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${c.glow}`} />
          </span>
          <span className={`eyebrow ${c.label}`}>{c.eyebrow}</span>
        </div>
        <h2 className="mt-2 font-display text-xl text-sand-100">{c.title}</h2>
        <p className="mt-0.5 text-sm text-sand-500">{c.desc}</p>
      </header>

      <div className="grid gap-3 p-4 pt-1 sm:grid-cols-2">
        {readings.map((r) => (
          <IndicatorCard key={r.meta.key} reading={r} />
        ))}
      </div>
    </section>
  )
}
