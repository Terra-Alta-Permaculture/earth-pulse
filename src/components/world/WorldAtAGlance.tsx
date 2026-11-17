import { useEffect, useMemo, useState } from 'react'
import { COUNTRIES, COUNTRY_META, type Country } from '../../data/countriesData'
import { InfoDot } from '../InfoDot'
import { MiniMap, type MapPoint } from '../MiniMap'

// The world at a glance — how many of us, how many countries, how they are
// governed, the clubs that run the table, and (deliberately set apart) the old
// left/right map. One number first, groupings next, detail only on tap.

const M = COUNTRY_META

// ── formatting ────────────────────────────────────────────────────────
const fmtPop = (n: number | null) => {
  if (n == null) return '—'
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} bn`
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)} M`
  if (n >= 1e3) return `${Math.round(n / 1e3)}k`
  return String(n)
}
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0)

// ── regimes (V-Dem Regimes of the World) ──────────────────────────────
const REGIMES: { code: number; label: string; short: string; color: string; note: string }[] = [
  { code: 3, label: 'Liberal democracy', short: 'Liberal democracy', color: '#79b568', note: 'free elections plus courts, rights and limits on power' },
  { code: 2, label: 'Electoral democracy', short: 'Electoral democracy', color: '#a9c98a', note: 'free and fair elections, weaker checks on power' },
  { code: 1, label: 'Electoral autocracy', short: 'Electoral autocracy', color: '#d9935f', note: 'elections are held, but not free or fair' },
  { code: 0, label: 'Closed autocracy', short: 'Closed autocracy', color: '#b0563a', note: 'no meaningful elections for who rules' },
  { code: -1, label: 'Not assessed', short: 'Not assessed', color: '#4a5048', note: 'micro-states V-Dem does not cover' },
]
const regimeOf = (c: number) => REGIMES.find((r) => r.code === c) ?? REGIMES[4]

// ── the old map: left / right ─────────────────────────────────────────
const ORIENT: { key: Country['orient']; label: string; x?: number }[] = [
  { key: 'L', label: 'Left', x: -2 },
  { key: 'CL', label: 'Centre-left', x: -1 },
  { key: 'C', label: 'Centre', x: 0 },
  { key: 'CR', label: 'Centre-right', x: 1 },
  { key: 'R', label: 'Right', x: 2 },
  { key: 'X', label: 'Doesn’t fit the axis' },
  { key: '', label: 'Not coded' },
]
const orientLabel = (k: Country['orient']) => ORIENT.find((o) => o.key === k)?.label ?? 'Not coded'
const NEUTRAL = '#8fa3b8'

// ── clubs ─────────────────────────────────────────────────────────────
const CLUBS: { key: string; label: string; note: string }[] = [
  { key: 'G7', label: 'G7', note: 'The rich democracies’ club. It was the G8 until Russia was suspended in 2014 after annexing Crimea.' },
  { key: 'G20', label: 'G20', note: '19 countries plus the EU and the African Union — the biggest economies around one table.' },
  { key: 'BRICS+', label: 'BRICS+', note: 'Brazil, Russia, India, China, South Africa and, since 2024–25, five more. Saudi Arabia was invited but has not confirmed.' },
  { key: 'EU', label: 'EU', note: '27 countries pooling law, trade and (for most) a currency.' },
  { key: 'P5', label: 'UN veto five', note: 'The permanent members of the Security Council — each can block any resolution.' },
  { key: 'AU', label: 'African Union', note: 'Every African state plus the Sahrawi Republic; members are suspended after coups.' },
]

// ── computed once ─────────────────────────────────────────────────────
const S = (() => {
  const totalPop = COUNTRIES.reduce((a, c) => a + (c.pop ?? 0), 0)
  const totalGdp = COUNTRIES.reduce((a, c) => a + (c.gdp ?? 0), 0)
  const byRegime = REGIMES.map((r) => {
    const cs = COUNTRIES.filter((c) => c.regime === r.code)
    return { ...r, n: cs.length, pop: cs.reduce((a, c) => a + (c.pop ?? 0), 0) }
  })
  const demN = byRegime.filter((r) => r.code >= 2).reduce((a, r) => a + r.n, 0)
  const demPop = byRegime.filter((r) => r.code >= 2).reduce((a, r) => a + r.pop, 0)
  const assessedN = COUNTRIES.filter((c) => c.regime >= 0).length

  const systems: Record<string, { n: number; pop: number }> = {}
  for (const c of COUNTRIES) {
    if (!c.system) continue
    const k = c.system.startsWith('Absolute') || c.system.startsWith('Federation of monarchies')
      ? 'Absolute monarchies'
      : c.system.startsWith('Theocracy') ? 'Theocracies'
      : c.system.startsWith('One-party') ? 'One-party states'
      : 'Military rule'
    systems[k] = systems[k] ?? { n: 0, pop: 0 }
    systems[k].n++
    systems[k].pop += c.pop ?? 0
  }

  const byOrient = ORIENT.map((o) => {
    const cs = COUNTRIES.filter((c) => c.orient === o.key)
    return { ...o, n: cs.length, pop: cs.reduce((a, c) => a + (c.pop ?? 0), 0) }
  })
  const onAxis = byOrient.filter((o) => o.x != null)
  const axisPop = onAxis.reduce((a, o) => a + o.pop, 0)
  const needle = axisPop ? onAxis.reduce((a, o) => a + (o.x ?? 0) * o.pop, 0) / axisPop : 0
  const leftPop = onAxis.filter((o) => (o.x ?? 0) < 0).reduce((a, o) => a + o.pop, 0)
  const rightPop = onAxis.filter((o) => (o.x ?? 0) > 0).reduce((a, o) => a + o.pop, 0)
  const centrePop = onAxis.filter((o) => o.x === 0).reduce((a, o) => a + o.pop, 0)
  const offAxisPop = byOrient.find((o) => o.key === 'X')?.pop ?? 0

  const clubs = Object.fromEntries(
    CLUBS.map((k) => {
      const cs = COUNTRIES.filter((c) => c.clubs.includes(k.key))
      return [k.key, {
        members: cs,
        pop: cs.reduce((a, c) => a + (c.pop ?? 0), 0),
        gdp: cs.reduce((a, c) => a + (c.gdp ?? 0), 0),
      }]
    }),
  )
  return { totalPop, totalGdp, byRegime, demN, demPop, assessedN, systems, byOrient, needle, axisPop, leftPop, rightPop, centrePop, offAxisPop, clubs }
})()

// ── live population estimate ──────────────────────────────────────────
// Anchored at mid-year of the World Bank's latest figure, growing at the
// last year's net rate (births minus deaths). An estimate, ticking.
const ANCHOR = Date.UTC(M.worldPopYear, 6, 1)
const PER_MS = M.worldPopGrowth / (365.25 * 24 * 3600 * 1000)
const popNow = () => Math.round(M.worldPop + (Date.now() - ANCHOR) * PER_MS)

function useTicker() {
  const [n, setN] = useState(popNow)
  useEffect(() => {
    const id = window.setInterval(() => setN(popNow()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return n
}

// ── small pieces ──────────────────────────────────────────────────────
function Stack({ parts }: { parts: { label: string; v: number; color: string }[] }) {
  const total = parts.reduce((a, p) => a + p.v, 0)
  return (
    <div className="flex h-3 overflow-hidden rounded-full bg-soil-800">
      {parts.map((p) => (
        <div key={p.label} title={`${p.label}: ${pct(p.v, total)}%`} style={{ width: `${(p.v / total) * 100}%`, background: p.color }} />
      ))}
    </div>
  )
}

function Seg<T extends string>({ value, options, onChange }: { value: T; options: { k: T; label: string }[]; onChange: (k: T) => void }) {
  return (
    <div className="flex gap-1">
      {options.map((o) => (
        <button
          key={o.k}
          onClick={() => onChange(o.k)}
          className={`rounded-lg border px-2.5 py-1 text-[0.72rem] transition-colors ${
            value === o.k ? 'border-sand-500/60 bg-soil-700 text-sand-100' : 'border-soil-700 bg-soil-800 text-sand-400 hover:bg-soil-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function CountryCard({ c, onClose }: { c: Country; onClose: () => void }) {
  const r = regimeOf(c.regime)
  const perPerson = c.gdp && c.pop ? (c.gdp * 1e9) / c.pop : null
  return (
    <div className="mt-3 rounded-xl border border-soil-700 bg-soil-900/70 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-lg text-sand-100">{c.flag} {c.name}</span>
          <span className="block text-[0.72rem] text-sand-500">
            {c.region}{c.un ? '' : ' · UN observer state'}
          </span>
        </div>
        <button onClick={onClose} aria-label="Close" className="rounded-lg px-2 py-1 text-sand-500 hover:bg-soil-800 hover:text-sand-200">✕</button>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[0.8rem]">
        <div>
          <dt className="text-[0.68rem] uppercase tracking-wide text-sand-500">People</dt>
          <dd className="stat-num text-sand-100">{fmtPop(c.pop)}</dd>
          {c.pop != null && <dd className="text-[0.68rem] text-sand-600">{(c.pop / S.totalPop * 100).toFixed(c.pop / S.totalPop > 0.01 ? 1 : 2)}% of humanity</dd>}
        </div>
        <div>
          <dt className="text-[0.68rem] uppercase tracking-wide text-sand-500">Income per person</dt>
          <dd className="stat-num text-sand-100">{perPerson ? `$${Math.round(perPerson).toLocaleString()}` : '—'}</dd>
          <dd className="text-[0.68rem] text-sand-600">GDP ÷ people, {M.gdpYear}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[0.68rem] uppercase tracking-wide text-sand-500">How it’s governed</dt>
          <dd className="flex items-center gap-1.5 text-sand-100">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: r.color }} />
            {r.label}{c.system ? ` · ${c.system}` : ''}
          </dd>
          {c.demo != null && (
            <dd className="text-[0.68rem] text-sand-600">Democracy score {c.demo.toFixed(2)} of 1 (V-Dem)</dd>
          )}
        </div>
        <div className="col-span-2">
          <dt className="text-[0.68rem] uppercase tracking-wide text-sand-500">Who holds power · end of {M.vdemYear}</dt>
          <dd className="text-sand-100">{c.leader ?? '—'}</dd>
          <dd className="text-[0.68rem] text-sand-600">On the old left/right map: {orientLabel(c.orient)}</dd>
        </div>
        {c.clubs.length > 0 && (
          <div className="col-span-2">
            <dt className="text-[0.68rem] uppercase tracking-wide text-sand-500">At the table</dt>
            <dd className="mt-1 flex flex-wrap gap-1">
              {c.clubs.map((k) => (
                <span key={k} className="rounded-full border border-soil-700 bg-soil-800 px-2 py-0.5 text-[0.7rem] text-sand-300">
                  {CLUBS.find((x) => x.key === k)?.label ?? k}
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}

// ── the panel ─────────────────────────────────────────────────────────
export function WorldAtAGlance() {
  const pop = useTicker()
  const [govBy, setGovBy] = useState<'countries' | 'people'>('people')
  const [club, setClub] = useState('G7')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Country | null>(null)

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (s.length < 2) return []
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(s)).slice(0, 6)
  }, [q])

  const points: MapPoint[] = useMemo(
    () =>
      COUNTRIES.map((c) => ({
        lat: c.lat,
        lon: c.lon,
        r: c.pop && c.pop > 1e8 ? 2.8 : c.pop && c.pop > 2e7 ? 2 : 1.4,
        color: regimeOf(c.regime).color,
        title: `${c.name} — ${regimeOf(c.regime).label}`,
        onClick: () => setSel(c),
        active: sel?.iso === c.iso,
      })),
    [sel],
  )

  const unN = COUNTRIES.filter((c) => c.un).length
  const cl = S.clubs[club]
  const clubMeta = CLUBS.find((k) => k.key === club)!
  const needlePct = ((S.needle + 2) / 4) * 100
  const needleWord = Math.abs(S.needle) < 0.15 ? 'dead centre' : S.needle < 0 ? 'slightly left of centre' : 'slightly right of centre'
  const lean = Math.abs(S.needle) >= 0.5 ? (S.needle < 0 ? 'left of centre' : 'right of centre') : needleWord

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🌐 The world at a glance</h2>
          <InfoDot topic="glance" label="The world at a glance" />
        </div>
        <span className="text-xs text-sand-500">World Bank · V-Dem {M.vdemYear}</span>
      </div>

      {/* Headline */}
      <div className="mt-4 rounded-xl border border-soil-800 bg-soil-900/40 p-4">
        <span className="text-[0.7rem] uppercase tracking-wide text-sand-500">Humans alive right now · estimate</span>
        <span className="stat-num mt-1 block text-3xl tabular-nums text-moss-200 sm:text-4xl">{pop.toLocaleString('en-US')}</span>
        <span className="mt-1 block text-[0.75rem] leading-snug text-sand-400">
          about {Math.round(M.worldPopGrowth / 365.25 / 1000)}k more each day — births minus deaths
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-soil-800 bg-soil-900/40 p-4">
          <span className="stat-num block text-3xl text-sand-100">{COUNTRIES.length}</span>
          <span className="mt-1 block text-[0.75rem] leading-snug text-sand-400">
            countries — {unN} UN members + Palestine and the Holy See
          </span>
        </div>
        <div className="rounded-xl border border-soil-800 bg-soil-900/40 p-4">
          <span className="stat-num block text-3xl text-sand-100">${Math.round(M.worldGdpBn / 1000)} tn</span>
          <span className="mt-1 block text-[0.75rem] leading-snug text-sand-400">the world economy in a year ({M.gdpYear})</span>
        </div>
      </div>

      {/* How the world is governed */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
          How the world is governed
          <InfoDot topic="glance_regimes" label="How the world is governed" />
        </h3>
        <Seg value={govBy} onChange={setGovBy} options={[{ k: 'people', label: 'By people' }, { k: 'countries', label: 'By countries' }]} />
      </div>
      <div className="mt-2">
        <Stack parts={S.byRegime.map((r) => ({ label: r.label, v: govBy === 'people' ? r.pop : r.n, color: r.color }))} />
        <div className="mt-2 grid gap-1.5 sm:grid-cols-2 sm:gap-x-6">
          {S.byRegime.filter((r) => govBy === 'countries' || r.code >= 0).map((r) => (
            <div key={r.code} className="text-[0.78rem]">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: r.color }} />
                <span className="text-sand-200">{r.label}</span>
                <span className="stat-num ml-auto text-sand-100 sm:ml-1">
                  {govBy === 'people' ? `${pct(r.pop, S.totalPop)}%` : r.n}
                </span>
              </span>
              <span className="block pl-3.5 text-[0.68rem] leading-snug text-sand-600">{r.note}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-[0.82rem] leading-snug text-sand-300">
        Counted by country, {pct(S.demN, S.assessedN)}% of nations are democracies. Counted by people, only{' '}
        <span className="text-sand-100">{pct(S.demPop, S.totalPop)}%</span> of us live in one — because the two
        biggest, India and China, are both autocracies by V-Dem’s measure.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {Object.entries(S.systems).map(([k, v]) => (
          <span key={k} className="rounded-full border border-soil-700 bg-soil-800/60 px-2.5 py-1 text-[0.7rem] text-sand-300">
            {k} <span className="stat-num text-sand-100">{v.n}</span>
            <span className="text-sand-500"> · {fmtPop(v.pop)} people</span>
          </span>
        ))}
      </div>

      {/* The old map */}
      <div className="mt-6 rounded-xl border border-dashed border-[#8fa3b8]/40 bg-soil-900/40 p-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: NEUTRAL }}>The old map</span>
          <InfoDot topic="glance_leftright" label="The old map: left & right" />
        </div>
        <h3 className="mt-1 text-sm font-medium text-sand-100">Left or right — where the world’s governments stand</h3>
        <p className="mt-1 text-[0.8rem] leading-snug text-sand-400">
          This is the map most news uses, and it splits people into two teams. EarthPulse doesn’t read the world
          this way — it asks whether power is <span className="text-ember-300">below the line</span> (extracting,
          concentrating) or <span className="text-moss-300">above it</span> (regenerating, sharing). Left and right
          governments both do either. It’s here so you can see the old map clearly, not to take a side on it.
        </p>

        <div className="mt-4">
          <div className="relative h-2.5 rounded-full" style={{ background: `linear-gradient(90deg, ${NEUTRAL}55, ${NEUTRAL}22 50%, ${NEUTRAL}55)` }}>
            <span className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-sand-100/25" />
          </div>
          <div className="relative h-4">
            <div className="absolute top-0 -translate-x-1/2" style={{ left: `${needlePct}%` }}>
              <div className="mx-auto h-0 w-0 border-x-[5px] border-b-[7px] border-x-transparent border-b-sand-100" />
            </div>
          </div>
          <div className="flex justify-between text-[0.68rem] text-sand-500">
            <span>Left</span>
            <span className="stat-num text-sand-300">{lean}</span>
            <span>Right</span>
          </div>
        </div>

        <p className="mt-3 text-[0.8rem] leading-snug text-sand-300">
          Weighted by the people each government rules, the needle sits {lean}:{' '}
          <span className="stat-num text-sand-100">{pct(S.leftPop, S.totalPop)}%</span> of humanity under left-leaning
          governments, <span className="stat-num text-sand-100">{pct(S.centrePop, S.totalPop)}%</span> centrist,{' '}
          <span className="stat-num text-sand-100">{pct(S.rightPop, S.totalPop)}%</span> right-leaning — and{' '}
          <span className="stat-num text-sand-100">{pct(S.offAxisPop, S.totalPop)}%</span> under one-party states,
          juntas, monarchs and clerics that don’t fit the axis at all.
        </p>
        <div className="mt-2">
          <Stack
            parts={S.byOrient.map((o, i) => ({
              label: o.label,
              v: o.pop,
              color: o.key === 'X' ? '#5b5f58' : o.key === '' ? '#2c302b' : `${NEUTRAL}${['ff', 'cc', '88', 'cc', 'ff'][i]}`,
            }))}
          />
          <div className="mt-1 flex justify-between text-[0.65rem] text-sand-600">
            <span>← left · centre · right →</span>
            <span>doesn’t fit · not coded</span>
          </div>
        </div>
        <p className="mt-3 text-[0.68rem] leading-snug text-sand-600">
          How this is measured: the governing party of {S.byOrient.filter((o) => o.key).reduce((a, o) => a + o.n, 0)} countries
          — the most populous, covering {pct(S.byOrient.filter((o) => o.key).reduce((a, o) => a + o.pop, 0), S.totalPop)}% of
          people — coded by party family, with leaders as V-Dem lists them at the end
          of {M.vdemYear}. Governments that changed since then still show the old one. The rest are left uncoded rather
          than guessed. A left–right label says nothing about whether a government extracts or regenerates — that’s
          what the rest of this tab is for.
        </p>
      </div>

      {/* Clubs */}
      <h3 className="mt-6 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        Who sits at the table
        <InfoDot topic="glance_clubs" label="The clubs" />
      </h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {CLUBS.map((k) => (
          <button
            key={k.key}
            onClick={() => setClub(k.key)}
            className={`rounded-full border px-3 py-1 text-[0.75rem] transition-colors ${
              club === k.key ? 'border-moss-500 bg-moss-900/40 text-sand-100' : 'border-soil-700 bg-soil-800/50 text-sand-400 hover:text-sand-200'
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-xl border border-soil-800 bg-soil-900/40 p-4">
        <p className="text-[0.8rem] leading-snug text-sand-300">{clubMeta.note}</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { label: 'of humanity', v: pct(cl.pop, S.totalPop) },
            { label: 'of world GDP', v: pct(cl.gdp, S.totalGdp) },
          ].map((x) => (
            <div key={x.label}>
              <span className="stat-num text-2xl text-sand-100">{x.v}%</span>
              <span className="ml-1 text-[0.72rem] text-sand-500">{x.label}</span>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-soil-800">
                <div className="h-full rounded-full bg-moss-500" style={{ width: `${x.v}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[0.75rem] leading-relaxed text-sand-400">
          {cl.members.map((c) => (
            <button key={c.iso} onClick={() => setSel(c)} className="mr-1.5 hover:text-sand-100" title={c.name}>
              {c.flag}
            </button>
          ))}
          <span className="text-sand-600">{cl.members.length} countries{club === 'G20' ? ' + EU + AU' : club === 'G7' ? ' + the EU' : ''}</span>
        </p>
      </div>

      {/* Find a country */}
      <h3 className="mt-6 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        Any country, one tap
        <InfoDot topic="glance_country" label="Country cards" />
      </h3>
      <div className="relative mt-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search 195 countries…"
          className="w-full rounded-xl border border-soil-700 bg-soil-900 px-3.5 py-2.5 text-[0.95rem] text-sand-100 placeholder:text-sand-600 focus:border-moss-600 focus:outline-none"
        />
        {matches.length > 0 && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-soil-700 bg-soil-900 shadow-lg">
            {matches.map((c) => (
              <button
                key={c.iso}
                onClick={() => { setSel(c); setQ('') }}
                className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm text-sand-200 hover:bg-soil-800"
              >
                <span>{c.flag} {c.name}</span>
                <span className="text-[0.7rem] text-sand-500">{fmtPop(c.pop)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {sel && <CountryCard c={sel} onClose={() => setSel(null)} />}
      <div className="mt-3">
        <MiniMap points={points} />
        <p className="mt-1.5 text-[0.68rem] text-sand-600">
          Tap a dot for its card. Colour = how it’s governed; bigger dots = more people.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {[
          { label: 'World Bank — population & GDP', url: 'https://data.worldbank.org/indicator/SP.POP.TOTL' },
          { label: 'V-Dem — Regimes of the World', url: 'https://www.v-dem.net/' },
          { label: 'UN member states', url: 'https://www.un.org/en/about-us/member-states' },
        ].map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
