import { SCENARIOS } from '../../data/forces'

interface Props {
  lean: Record<'A' | 'B' | 'C' | 'D', number>
  rationale: string
}

const COLOR: Record<'A' | 'B' | 'C' | 'D', string> = {
  A: '#d18f36', // armed bargaining — managed
  B: '#8f5a19', // chokepoint spiral — worst
  C: '#9c937f', // two camps — neutral split
  D: '#5a9d48', // patchwork repair — best
}

export function ScenarioLean({ lean, rationale }: Props) {
  return (
    <section className="card mt-6 p-5">
      <div className="flex items-end justify-between">
        <div>
          <span className="eyebrow">Where it's heading</span>
          <h2 className="mt-1 font-display text-xl text-sand-100">Scenario lean</h2>
        </div>
        <span className="rounded-full border border-soil-600 px-2 py-0.5 text-[0.6rem] text-sand-500">
          Judgment, not prediction
        </span>
      </div>

      {/* Stacked bar */}
      <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full">
        {SCENARIOS.map((s) => (
          <div
            key={s.id}
            style={{ width: `${lean[s.id]}%`, background: COLOR[s.id] }}
            title={`${s.name} — ${lean[s.id]}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {SCENARIOS.map((s) => (
          <div key={s.id} className="flex gap-2.5">
            <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full" style={{ background: COLOR[s.id] }} />
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-medium text-sand-100">{s.id} · {s.name}</span>
                <span className="stat-num text-sm text-sand-300">{lean[s.id]}%</span>
              </div>
              <p className="text-[0.72rem] leading-snug text-sand-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 border-t border-soil-800 pt-3 text-xs leading-relaxed text-sand-400">
        {rationale}
      </p>
    </section>
  )
}
