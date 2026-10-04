import { SEED_STATS, SEED_FRAMING, SEED_LINKS, type SeedLine } from '../data/seedSovereignty'
import { InfoDot } from './InfoDot'

const LINE = {
  below: { label: 'Enclosure', color: '#d9604a' },
  above: { label: 'The commons', color: '#6fae57' },
} as const

function Col({ line }: { line: SeedLine }) {
  const m = LINE[line]
  const stats = SEED_STATS.filter((s) => s.line === line)
  return (
    <div className="flex-1">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
        <span className="eyebrow" style={{ color: m.color }}>
          {line === 'below' ? 'Below the line · ' : 'Above the line · '}{m.label}
        </span>
      </div>
      <div className="space-y-2">
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-soil-700/50 bg-soil-800/40 p-3 transition-colors hover:border-soil-600"
          >
            <div className="flex items-baseline gap-2">
              <span className="stat-num text-lg" style={{ color: m.color }}>{s.stat}</span>
              <span className="text-xs font-medium text-sand-200">{s.label}</span>
            </div>
            <p className="mt-0.5 text-[0.7rem] leading-snug text-sand-500">{s.note}</p>
            <div className="mt-1 text-[0.58rem] text-sand-700 group-hover:text-sand-500">{s.source}</div>
          </a>
        ))}
      </div>
    </div>
  )
}

export function SeedSovereignty() {
  return (
    <section className="mt-6 rounded-2xl border border-soil-700/60 bg-soil-900/50 p-5 sm:p-6">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="flex items-center gap-2 font-display text-xl text-sand-100">
          <span className="text-moss-400">🌱</span> Seed sovereignty
          <InfoDot topic="seed_sovereignty" label="Seed sovereignty" />
        </h2>
        <span className="text-xs text-sand-500">who owns the seed?</span>
      </div>
      <p className="mb-4 max-w-2xl text-sm text-sand-500">{SEED_FRAMING}</p>

      <div className="flex flex-col gap-5 sm:flex-row">
        <Col line="below" />
        <Col line="above" />
      </div>

      <p className="mt-4 text-[0.65rem] leading-snug text-sand-500">
        Go deeper:{' '}
        {SEED_LINKS.map((l, i) => (
          <span key={l.label}>
            {i > 0 && ' · '}
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-moss-300 underline decoration-moss-800 hover:decoration-moss-400">
              {l.label}
            </a>
          </span>
        ))}
      </p>
      <p className="mt-1.5 text-[0.6rem] text-sand-700">
        Curated, cited (not a live feed) · in honour of Vandana Shiva
      </p>
    </section>
  )
}
