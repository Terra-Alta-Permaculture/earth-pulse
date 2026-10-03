import { useMemo, useState } from 'react'
import { LAW_HEADLINES, LAW_SOURCES, LINE_META, type LawLine } from '../data/lawTracker'
import { useLawWatch } from '../hooks/useLawWatch'
import { InfoDot } from './InfoDot'

function Headline({ line }: { line: LawLine }) {
  const h = LAW_HEADLINES[line]
  return (
    <a
      href={h.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-1 rounded-xl border border-soil-700/60 bg-soil-800/40 p-4 transition-colors hover:border-soil-600"
    >
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LINE_META[line].color }} />
        <span className="text-xs font-medium text-sand-300">{h.label}</span>
      </div>
      <div className="stat-num mt-1.5 text-xl text-sand-100">{h.stat}</div>
      <p className="mt-1 text-[0.7rem] leading-snug text-sand-500">{h.detail}</p>
      <div className="mt-2 text-[0.6rem] text-sand-700 group-hover:text-sand-500">{h.source}</div>
    </a>
  )
}

export function LawTracker() {
  // 'international' (default) · a specific country · 'all'
  const [filter, setFilter] = useState<string>('international')
  const { milestones, live } = useLawWatch()

  const countries = useMemo(
    () => [...new Set(milestones.filter((m) => m.country).map((m) => m.country))].sort(),
    [milestones],
  )

  const shown = useMemo(() => {
    const list =
      filter === 'all'
        ? milestones
        : filter === 'international'
        ? milestones.filter((m) => m.scope === 'international')
        : milestones.filter((m) => m.country === filter)
    return [...list].sort((a, b) => b.year.localeCompare(a.year))
  }, [filter, milestones])

  return (
    <section className="mt-6 rounded-2xl border border-soil-700/60 bg-soil-900/50 p-5 sm:p-6">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="flex items-center gap-2 font-display text-xl text-sand-100">
          <span className="text-moss-400">§</span> The law — above &amp; below the line
          <InfoDot topic="law_tracker" label="The law catching up" />
        </h2>
        <span className="text-xs text-sand-500">
          {live ? 'who the law protects · updated weekly' : 'who the law protects'}
        </span>
      </div>
      <p className="mb-4 max-w-2xl text-sm text-sand-500">
        Legal moves that protect life — rivers with rights, ecocide as a crime — and those going the
        other way, enabling extraction or punishing its defenders.
      </p>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <Headline line="above" />
        <Headline line="below" />
      </div>

      {/* Filter */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="text-[0.7rem] text-sand-500">Showing</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-soil-600 bg-soil-800 px-2.5 py-1 text-xs text-sand-200 focus:border-moss-600 focus:outline-none"
        >
          <option value="international">International</option>
          <option value="all">All countries</option>
          <optgroup label="By country">
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </optgroup>
        </select>
        <span className="text-[0.7rem] text-sand-600">
          {shown.length} {shown.length === 1 ? 'milestone' : 'milestones'}
        </span>
      </div>

      {/* Timeline */}
      {shown.length > 0 ? (
        <ol className="relative space-y-3 border-l border-soil-700/60 pl-5">
          {shown.map((m, i) => (
            <li key={i} className="relative">
              <span
                className="absolute -left-[1.42rem] top-1.5 h-2 w-2 rounded-full ring-2 ring-soil-900"
                style={{ backgroundColor: LINE_META[m.line].color }}
              />
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="stat-num text-sm text-sand-200">{m.year}</span>
                {m.url ? (
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-sand-100 underline decoration-soil-600 hover:decoration-moss-400">
                    {m.title}
                  </a>
                ) : (
                  <span className="text-sm font-medium text-sand-100">{m.title}</span>
                )}
                <span className="text-[0.7rem] text-sand-500">· {m.place}</span>
                <span className="text-[0.6rem]" style={{ color: LINE_META[m.line].color }}>
                  {m.line === 'above' ? '↑ protects' : '↓ extracts'}
                </span>
              </div>
              <p className="mt-0.5 text-[0.72rem] leading-snug text-sand-500">{m.note}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-xs text-sand-500">No tracked milestones for this filter yet.</p>
      )}

      {/* Live sources */}
      <p className="mt-4 text-[0.65rem] leading-snug text-sand-500">
        Check the latest yourself:{' '}
        {LAW_SOURCES.map((s, i) => (
          <span key={s.label}>
            {i > 0 && ' · '}
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-moss-300 underline decoration-moss-800 hover:decoration-moss-400">
              {s.label}
            </a>
          </span>
        ))}
      </p>
      <p className="mt-1.5 text-[0.6rem] text-sand-700">
        Curated tracker (not a live feed) · sources above
      </p>
    </section>
  )
}
