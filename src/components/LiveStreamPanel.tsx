import type { LiveSignal, SignalStream } from '../data/liveSources'
import { LiveCard } from './LiveCard'
import { InfoDot } from './InfoDot'

interface Props {
  stream: Exclude<SignalStream, 'neutral'>
  signals: LiveSignal[]
}

const COPY = {
  crisis: {
    eyebrow: 'Below the line · extraction',
    topic: 'below_line',
    title: 'Degradation signals',
    desc: 'Systems taking more than they return — where the living world is under strain.',
    accent: 'from-ember-600/20',
    ring: 'border-ember-700/40',
    glow: 'bg-ember-500',
    label: 'text-ember-200',
  },
  regeneration: {
    eyebrow: 'Above the line · regeneration',
    topic: 'above_line',
    title: 'Recovery signals',
    desc: 'Systems giving back more than they take — where life and repair are gaining ground.',
    accent: 'from-moss-600/20',
    ring: 'border-moss-700/40',
    glow: 'bg-moss-500',
    label: 'text-moss-200',
  },
} as const

export function LiveStreamPanel({ stream, signals }: Props) {
  const c = COPY[stream]
  return (
    <section className={`card overflow-hidden border ${c.ring}`}>
      <header className={`relative bg-gradient-to-b ${c.accent} to-transparent px-5 pb-4 pt-5`}>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`absolute inline-flex h-full w-full rounded-full ${c.glow} opacity-60 animate-pulse-ring`} />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${c.glow}`} />
          </span>
          <span className={`eyebrow ${c.label}`}>{c.eyebrow}</span>
          <InfoDot topic={c.topic} label={c.eyebrow} />
        </div>
        <h2 className="mt-2 font-display text-xl text-sand-100">{c.title}</h2>
        <p className="mt-0.5 text-sm text-sand-500">{c.desc}</p>
      </header>

      <div className="grid gap-3 p-4 pt-1 sm:grid-cols-2">
        {signals.map((s) => (
          <LiveCard key={s.key} s={s} />
        ))}
      </div>
    </section>
  )
}
