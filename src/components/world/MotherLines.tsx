import { useEffect, useMemo, useState } from 'react'
import { EA_SOCIETIES } from '../../data/lineagesEA'
import { DESCENT_GROUPS, LIVING_CULTURES, LINEAGE_SOURCES } from '../../data/lineages'
import type { WorldHuman } from '../../hooks/useWorldPulse'
import { InfoDot } from '../InfoDot'
import { MiniMap, type MapPoint } from '../MiniMap'

// Mother lines — whose line you belong to, across the world's documented
// societies. Three honest layers: the deep pattern (D-PLACE Ethnographic Atlas,
// bundled), living matrilineal cultures (curated), and a live layer (World Bank
// women-and-law scores for the countries they live in + a weekly note).

// ── Deep pattern: computed once from the bundled Atlas rows ───────────
const groupOf = (code: number) => DESCENT_GROUPS.find((g) => g.codes.includes(code))

const STATS = (() => {
  const counts: Record<string, number> = {}
  let known = 0
  for (const r of EA_SOCIETIES) {
    const g = groupOf(r[2])
    if (!g) continue
    counts[g.key] = (counts[g.key] ?? 0) + 1
    known++
  }
  const matri = EA_SOCIETIES.filter((r) => r[2] === 3)
  const res = { m: 0, a: 0, p: 0, b: 0 }
  for (const r of matri) if (r[3]) res[r[3]]++
  const landKnown = matri.filter((r) => r[4] > 0 && r[4] !== 1)
  const toMatriHeirs = landKnown.filter((r) => r[4] === 3).length
  const toSistersSons = landKnown.filter((r) => r[4] === 2).length
  // Residence across all societies: whose kin the couple lives with.
  const all = { m: 0, a: 0, p: 0, b: 0 }
  for (const r of EA_SOCIETIES) if (r[3]) all[r[3]]++
  return { counts, known, total: EA_SOCIETIES.length, matriN: matri.length, res, landKnown: landKnown.length, toMatriHeirs, toSistersSons, all }
})()

const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0)

// ── Live: women's legal equality where each living culture sits ────────
interface LawScore { v: number; year: string }
let lawCache: { at: number; data: Record<string, LawScore> } | null = null
const SIX_H = 6 * 60 * 60 * 1000
const ISO = [...new Set(LIVING_CULTURES.map((c) => c.iso3))]

async function loadLaw(): Promise<Record<string, LawScore>> {
  if (lawCache && Date.now() - lawCache.at < SIX_H) return lawCache.data
  const out: Record<string, LawScore> = {}
  try {
    const res = await fetch(
      `https://api.worldbank.org/v2/country/${ISO.join(';')}/indicator/SG.LAW.INDX?format=json&mrnev=1&per_page=50`,
    )
    if (res.ok) {
      const d = await res.json()
      for (const row of d?.[1] ?? []) {
        if (typeof row?.value === 'number' && row?.countryiso3code) {
          out[row.countryiso3code] = { v: row.value, year: row.date }
        }
      }
    }
  } catch {
    /* offline or blocked — the cards simply hide the law line */
  }
  lawCache = { at: Date.now(), data: out }
  return out
}

function SplitBar({ parts }: { parts: { label: string; n: number; color: string }[] }) {
  const total = parts.reduce((a, p) => a + p.n, 0)
  return (
    <div className="flex h-3 overflow-hidden rounded-full bg-soil-800">
      {parts.map((p) => (
        <div key={p.label} title={`${p.label}: ${p.n}`} style={{ width: `${(p.n / total) * 100}%`, background: p.color }} />
      ))}
    </div>
  )
}

export function MotherLines({ live }: { live?: WorldHuman['culture'] }) {
  const [only, setOnly] = useState<'all' | 'matri'>('all')
  const [law, setLaw] = useState<Record<string, LawScore>>({})

  useEffect(() => {
    let cancelled = false
    loadLaw().then((d) => {
      if (!cancelled) setLaw(d)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const points: MapPoint[] = useMemo(() => {
    const pts: MapPoint[] = []
    for (const r of EA_SOCIETIES) {
      const g = groupOf(r[2])
      if (!g || (only === 'matri' && g.key !== 'matri')) continue
      pts.push({ lat: r[0], lon: r[1], r: g.key === 'matri' ? 1.7 : 1.1, color: g.color, title: `${r[5]} — ${g.label.toLowerCase()}` })
    }
    // Draw matrilineal dots last so they sit on top.
    return pts.sort((a, b) => (a.color === '#e0a852' ? 1 : 0) - (b.color === '#e0a852' ? 1 : 0))
  }, [only])

  const S = STATS
  const patri = S.counts.patri ?? 0
  const matri = S.counts.matri ?? 0
  const ratio = matri ? (patri / matri).toFixed(1) : '—'
  const note = live?.lineage_note

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🌕 Mother lines</h2>
          <InfoDot topic="lineages" label="Mother lines" />
        </div>
        <span className="text-xs text-sand-500">
          {note ? 'updated weekly · ' : ''}Ethnographic Atlas · {S.total.toLocaleString()} societies
        </span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        Whose line do you belong to — your father’s or your mother’s? Across the world’s
        documented cultures, the answer shows how deep the father’s line runs, and where
        the mother’s line still holds.
      </p>

      {/* Headline ratio */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#c8734f]/40 bg-[#c8734f]/10 p-4">
          <span className="stat-num block text-3xl text-[#e3a183]">{patri}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">
            patrilineal societies — {pct(patri, S.known)}% of those coded
          </span>
        </div>
        <div className="rounded-xl border border-[#e0a852]/40 bg-[#e0a852]/10 p-4">
          <span className="stat-num block text-3xl text-[#f0c77f]">{matri}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">
            matrilineal societies — {pct(matri, S.known)}%
          </span>
        </div>
        <div className="rounded-xl border border-soil-800 bg-soil-900/40 p-4">
          <span className="stat-num block text-3xl text-moss-200">{ratio}×</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">
            father’s-line societies for every mother’s-line one
          </span>
        </div>
      </div>

      <div className="mt-3">
        <SplitBar parts={DESCENT_GROUPS.map((g) => ({ label: g.label, n: S.counts[g.key] ?? 0, color: g.color }))} />
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {DESCENT_GROUPS.map((g) => (
            <span key={g.key} className="flex items-center gap-1.5 text-[0.72rem] text-sand-400">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: g.color }} />
              {g.label} · {S.counts[g.key] ?? 0} — {g.note}
            </span>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
          Where the lines run
          <InfoDot topic="lineages_map" label="Lineages map" />
        </h3>
        <div className="flex gap-1">
          {(['all', 'matri'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setOnly(k)}
              className={`rounded-lg border px-2.5 py-1 text-[0.72rem] transition-colors ${
                only === k
                  ? 'border-[#e0a852]/60 bg-[#e0a852]/15 text-sand-100'
                  : 'border-soil-700 bg-soil-800 text-sand-400 hover:bg-soil-700'
              }`}
            >
              {k === 'all' ? 'All societies' : 'Mother’s line only'}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2">
        <MiniMap points={points} />
        <p className="mt-1.5 text-[0.68rem] text-sand-600">
          Each dot is one society. The mother’s line clusters in Africa’s “matrilineal belt”,
          Melanesia and Native North America.
        </p>
      </div>

      {/* Matrilineal ≠ matriarchal */}
      <div className="mt-5 rounded-xl border border-[#e0a852]/30 bg-soil-900/50 p-4">
        <h3 className="flex items-center gap-1.5 text-sm font-medium text-sand-100">
          Mother’s line ≠ women’s rule
          <InfoDot topic="lineages_power" label="Lineage vs power" />
        </h3>
        <p className="mt-1 text-[0.8rem] leading-snug text-sand-400">
          Lineage, home and authority are three different things. Inside the {S.matriN} matrilineal
          societies, the line runs through women — but power often sits with their brothers.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span className="text-[0.7rem] uppercase tracking-wide text-sand-500">Whose home</span>
            <p className="mt-1 text-[0.8rem] leading-snug text-sand-300">
              <span className="stat-num text-sand-100">{S.res.m}</span> live with the wife’s kin;{' '}
              <span className="stat-num text-sand-100">{S.res.a}</span> with the husband’s maternal uncle —
              a matrilineal household led by men.
            </p>
          </div>
          <div className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span className="text-[0.7rem] uppercase tracking-wide text-sand-500">Whose land</span>
            <p className="mt-1 text-[0.8rem] leading-snug text-sand-300">
              Where land is inherited, <span className="stat-num text-sand-100">{pct(S.toMatriHeirs + S.toSistersSons, S.landKnown)}%</span>{' '}
              keep it in the mother’s line — yet in <span className="stat-num text-sand-100">{pct(S.toSistersSons, S.landKnown)}%</span>{' '}
              it goes from a man to his sister’s son. Through women, held by men.
            </p>
          </div>
          <div className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
            <span className="text-[0.7rem] uppercase tracking-wide text-sand-500">Who decides</span>
            <p className="mt-1 text-[0.8rem] leading-snug text-sand-300">
              No global dataset codes it. The living cultures below show both: clan mothers who
              unseat chiefs, and lineages where uncles hold the say.
            </p>
          </div>
        </div>
        <div className="mt-3">
          <span className="text-[0.7rem] uppercase tracking-wide text-sand-500">
            All {S.total.toLocaleString()} societies — whose kin a couple lives with
          </span>
          <div className="mt-1.5">
            <SplitBar
              parts={[
                { label: 'Husband’s kin', n: S.all.p, color: '#c8734f' },
                { label: 'Husband’s maternal uncle', n: S.all.a, color: '#a8896a' },
                { label: 'Either / their own home', n: S.all.b, color: '#79b568' },
                { label: 'Wife’s kin', n: S.all.m, color: '#e0a852' },
              ]}
            />
          </div>
          <p className="mt-1.5 text-[0.72rem] text-sand-500">
            {pct(S.all.p, S.all.p + S.all.a + S.all.b + S.all.m)}% move in with the husband’s family;{' '}
            {pct(S.all.m, S.all.p + S.all.a + S.all.b + S.all.m)}% with the wife’s.
          </p>
        </div>
      </div>

      {/* Living cultures */}
      <h3 className="mt-5 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        Mother’s-line cultures alive today
        <InfoDot topic="lineages_living" label="Living matrilineal cultures" />
      </h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {LIVING_CULTURES.map((c) => {
          const l = law[c.iso3]
          return (
            <div key={c.name} className="rounded-lg border border-soil-800 bg-soil-900/40 p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="text-sm font-medium text-sand-100">{c.name}</span>
                <span className="text-[0.7rem] text-sand-500">{c.place} · {c.country}</span>
              </div>
              <p className="mt-1 text-[0.78rem] leading-snug text-sand-300">{c.line}</p>
              <p className="mt-1 text-[0.75rem] leading-snug text-sand-500">
                <span className="text-[#e3a183]">Pressure:</span> {c.pressure}
              </p>
              {l && (
                <p className="mt-1.5 text-[0.7rem] text-sand-500">
                  Women’s legal equality in {c.iso3 === 'USA' ? 'the US' : c.country}:{' '}
                  <span className="stat-num text-moss-200">{Math.round(l.v)}/100</span>{' '}
                  <span className="text-sand-600">World Bank · {l.year}</span>
                </p>
              )}
            </div>
          )
        })}
      </div>

      {note && (
        <p className="mt-3 text-[0.82rem] leading-snug text-sand-300">
          <span className="font-medium text-sand-100">This week:</span> {note}
        </p>
      )}

      <p className="mt-3 text-[0.68rem] leading-snug text-sand-600">
        How to read this: the Atlas codes {S.total.toLocaleString()} mostly small-scale societies, largely
        from ethnographies of c.1850–1950, one dot each regardless of size. It shows the range of human
        kinship, not how today’s 8 billion people live — the big modern nations are under-counted.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {LINEAGE_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
