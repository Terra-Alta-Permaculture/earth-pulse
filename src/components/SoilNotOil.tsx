import { SOIL_STATS, SOIL_FRAMING, SOIL_LINKS, type SoilLine } from '../data/soilNotOil'
import { InfoDot } from './InfoDot'
import { ActOnThis } from './ActOnThis'

const LINE = {
  below: { label: 'Oil-based farming', color: '#9b6b3f' },
  above: { label: 'Living soil', color: '#6fae57' },
} as const

function Col({ line }: { line: SoilLine }) {
  const m = LINE[line]
  const stats = SOIL_STATS.filter((s) => s.line === line)
  return (
    <div className="flex-1">
      <div className="mb-2 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
        <span className="eyebrow" style={{ color: m.color }}>
          {line === 'below' ? 'Below the line · ' : 'Above the line · '}{m.label}
        </span>
        <InfoDot
          topic={line === 'below' ? 'below_line' : 'above_line'}
          label={line === 'below' ? 'Below the line' : 'Above the line'}
        />
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

export function SoilNotOil() {
  return (
    <section className="mt-6 rounded-2xl border border-soil-700/60 bg-soil-900/50 p-5 sm:p-6">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="flex items-center gap-2 font-display text-xl text-sand-100">
          <span className="text-moss-400">🪱</span> Soil, not oil
          <InfoDot topic="soil_not_oil" label="Soil, not oil" />
        </h2>
        <span className="text-xs text-sand-500">the food system, two ways</span>
      </div>
      <p className="mb-4 max-w-2xl text-sm text-sand-500">{SOIL_FRAMING}</p>

      <div className="flex flex-col gap-5 sm:flex-row">
        <Col line="below" />
        <Col line="above" />
      </div>

      <p className="mt-4 text-[0.65rem] leading-snug text-sand-500">
        Go deeper:{' '}
        {SOIL_LINKS.map((l, i) => (
          <span key={l.label}>
            {i > 0 && ' · '}
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-moss-300 underline decoration-moss-800 hover:decoration-moss-400">
              {l.label}
            </a>
          </span>
        ))}
      </p>
      <p className="mt-1.5 text-[0.6rem] text-sand-700">
        Curated, cited (not a live feed) · after Vandana Shiva’s “Soil Not Oil”
      </p>
      <div className="mt-4">
        <ActOnThis q="permaculture" label="permaculture events" />
      </div>
    </section>
  )
}
