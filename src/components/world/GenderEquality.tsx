import { useEffect, useState } from 'react'
import { InfoDot } from '../InfoDot'

// Live gender-equality signals from the World Bank (keyless + CORS), with the
// latest known values as labelled fallbacks. The headline Global Gender Gap
// figure is a cited WEF estimate (no clean live feed).

interface GInd {
  parl?: number // women in parliament %
  laborF?: number // female labour-force participation %
  laborM?: number // male labour-force participation %
  edu?: number // school enrolment gender parity index (≈1 = equal)
  live: boolean
  year?: string
}

const FALLBACK: GInd = { parl: 27.2, laborF: 48.9, laborM: 73.1, edu: 0.99, live: false, year: '2025' }

const WB = (code: string) =>
  `https://api.worldbank.org/v2/country/WLD/indicator/${code}?format=json&mrnev=1`

async function one(code: string): Promise<{ v: number; year: string } | null> {
  try {
    const res = await fetch(WB(code))
    if (!res.ok) return null
    const d = await res.json()
    const row = d?.[1]?.[0]
    return typeof row?.value === 'number' ? { v: row.value, year: row.date } : null
  } catch {
    return null
  }
}

let cache: { at: number; data: GInd } | null = null
const SIX_H = 6 * 60 * 60 * 1000

async function load(): Promise<GInd> {
  if (cache && Date.now() - cache.at < SIX_H) return cache.data
  const [parl, lf, lm, edu] = await Promise.all([
    one('SG.GEN.PARL.ZS'),
    one('SL.TLF.CACT.FE.ZS'),
    one('SL.TLF.CACT.MA.ZS'),
    one('SE.ENR.PRSC.FM.ZS'),
  ])
  const any = parl || lf || lm || edu
  const data: GInd = {
    parl: parl?.v ?? FALLBACK.parl,
    laborF: lf?.v ?? FALLBACK.laborF,
    laborM: lm?.v ?? FALLBACK.laborM,
    edu: edu?.v ?? FALLBACK.edu,
    live: Boolean(any),
    year: parl?.year ?? lf?.year ?? FALLBACK.year,
  }
  cache = { at: Date.now(), data }
  return data
}

function Bar({ value, label, sub, topic }: { value: number; label: string; sub: string; topic: string }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="rounded-xl border border-soil-800 bg-soil-900/40 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
          {label}
          <InfoDot topic={topic} label={label} />
        </span>
        <span className="stat-num text-sm text-sand-200">{sub}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-soil-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-moss-600 to-moss-400"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function GenderEquality() {
  const [g, setG] = useState<GInd | null>(null)
  useEffect(() => {
    let cancelled = false
    load().then((d) => {
      if (!cancelled) setG(d)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const d = g ?? FALLBACK
  const laborGap =
    d.laborF != null && d.laborM != null ? d.laborM - d.laborF : undefined

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">⚖ Women &amp; men — the equality gap</h2>
          <InfoDot topic="gender_equality" label="Gender equality" />
        </div>
        <span className="text-xs text-sand-500">
          {g?.live ? `World Bank · ${d.year}` : `latest known · ${d.year}`}
        </span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        Half of humanity, and the single clearest test of whether power is shared.
        Progress is real but slow — and uneven.
      </p>

      {/* WEF headline (cited) */}
      <div className="mt-4 rounded-xl border border-moss-800/40 bg-moss-950/20 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <span className="stat-num text-3xl text-moss-200">~68%</span>
            <InfoDot topic="gender_gap" label="Global Gender Gap" />
          </span>
          <span className="text-[0.7rem] text-sand-500">WEF Global Gender Gap 2024</span>
        </div>
        <p className="mt-1 text-[0.82rem] leading-snug text-sand-300">
          of the global gender gap is closed. At today’s pace, full parity is still
          an estimated <span className="text-sand-100">~134 years</span> away.
        </p>
      </div>

      {/* Live World Bank metrics */}
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Bar
          label="In parliament"
          topic="women_parliament"
          sub={`${d.parl?.toFixed(0)}%`}
          value={d.parl ?? 0}
        />
        <Bar
          label="In the workforce"
          topic="women_workforce"
          sub={`${d.laborF?.toFixed(0)}% vs ${d.laborM?.toFixed(0)}%`}
          value={d.laborF ?? 0}
        />
        <Bar
          label="Girls in school"
          topic="girls_school"
          sub={d.edu != null ? `${d.edu.toFixed(2)} parity` : '—'}
          value={d.edu != null ? d.edu * 100 : 0}
        />
      </div>

      <p className="mt-3 text-[0.72rem] leading-snug text-sand-600">
        Parity would be 50% of parliament seats and an equal share of paid work;
        women hold ~{d.parl?.toFixed(0)}% of seats and the workforce gap is still{' '}
        {laborGap != null ? `~${laborGap.toFixed(0)} points` : 'wide'}. Schooling,
        by contrast, is now near-equal worldwide (≈1.00 would be exact parity).
        Sources: World Bank / IPU; World Economic Forum.
      </p>
    </section>
  )
}
