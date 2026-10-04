import { useEffect, useState } from 'react'

// The twelve dimensions of the Doughnut's social foundation (Kate Raworth,
// from the SDGs). Each shows a *shortfall* — the share of people falling below
// the social floor. Live figures are World Bank (keyless); three dimensions
// without a clean global feed use a cited recent estimate.

export type FoundationStatus = 'met' | 'moderate' | 'severe'

interface Dimension {
  key: string
  name: string
  desc: string
  /** World Bank indicator code for a live figure, if any. */
  code?: string
  /** Latest known value — used as a labelled fallback if the live fetch fails. */
  fallbackValue?: number
  /** People below the floor (0–100) from the raw indicator value. */
  shortfall: (v: number) => number
  context: (v: number) => string
  /** For dimensions with no live feed: a fixed shortfall + context. */
  staticShortfall?: number
  staticContext?: string
  /** World Bank serves some indicators without CORS headers — skip the live
   *  fetch for those and use the recent fallback value instead. */
  noFetch?: boolean
  source: string
}

export interface ResolvedDimension {
  key: string
  name: string
  desc: string
  shortfall: number
  status: FoundationStatus
  context: string
  source: string
  live: boolean
}

const r0 = (n: number) => Math.round(n)

const DIMENSIONS: Dimension[] = [
  {
    key: 'water', name: 'Water', desc: 'Safe drinking water and sanitation.',
    code: 'SH.H2O.SMDW.ZS', fallbackValue: 73.7,
    shortfall: (v) => 100 - v, context: (v) => `${r0(100 - v)}% without safely managed water`,
    source: 'World Bank',
  },
  {
    key: 'food', name: 'Food', desc: 'Enough nutritious food for everyone.',
    code: 'SN.ITK.DEFC.ZS', fallbackValue: 8.5,
    shortfall: (v) => v, context: (v) => `${v}% undernourished`,
    source: 'World Bank / FAO',
  },
  {
    key: 'health', name: 'Health', desc: 'Survival and access to healthcare.',
    code: 'SH.DYN.MORT', fallbackValue: 37.4,
    shortfall: (v) => v / 10, context: (v) => `under-5 mortality ${v}/1,000`,
    source: 'World Bank / UN IGME',
  },
  {
    key: 'education', name: 'Education', desc: 'Literacy and access to learning.',
    code: 'SE.ADT.LITR.ZS', fallbackValue: 87.7,
    shortfall: (v) => 100 - v, context: (v) => `${r0(100 - v)}% of adults can't read`,
    source: 'World Bank / UNESCO',
  },
  {
    key: 'income', name: 'Income & work', desc: 'A livelihood above extreme poverty.',
    code: 'SI.POV.DDAY', fallbackValue: 10.4, noFetch: true, // WB serves this without CORS
    shortfall: (v) => v, context: (v) => `${v}% in extreme poverty ($3/day)`,
    source: 'World Bank',
  },
  {
    key: 'energy', name: 'Energy', desc: 'Access to electricity.',
    code: 'EG.ELC.ACCS.ZS', fallbackValue: 91.9,
    shortfall: (v) => 100 - v, context: (v) => `${r0(100 - v)}% without electricity`,
    source: 'World Bank',
  },
  {
    key: 'networks', name: 'Networks', desc: 'Connection and access to information.',
    code: 'IT.NET.USER.ZS', fallbackValue: 73.6,
    shortfall: (v) => 100 - v, context: (v) => `${r0(100 - v)}% still offline`,
    source: 'World Bank / ITU',
  },
  {
    key: 'gender', name: 'Gender equality', desc: "Women's voice in decision-making.",
    code: 'SG.GEN.PARL.ZS', fallbackValue: 27.2,
    shortfall: (v) => Math.max(0, 50 - v), context: (v) => `${r0(v)}% of parliament seats held by women`,
    source: 'World Bank / IPU',
  },
  {
    key: 'peace', name: 'Peace & justice', desc: 'Freedom from violence.',
    code: 'VC.IHR.PSRC.P5', fallbackValue: 5.2, noFetch: true, // WB serves this without CORS
    shortfall: (v) => Math.min(100, v * 4), context: (v) => `${v} homicides per 100,000`,
    source: 'World Bank / UNODC',
  },
  // ── No clean global live feed — cited recent estimates ──
  {
    key: 'housing', name: 'Housing', desc: 'Adequate, secure shelter.',
    shortfall: () => 24, context: () => '~24% of urban residents live in slums',
    staticShortfall: 24, staticContext: '~24% of urban residents live in slums',
    source: 'UN-Habitat (2022)',
  },
  {
    key: 'voice', name: 'Political voice', desc: 'A say in how you are governed.',
    shortfall: () => 71, context: () => '~71% live under non-democratic rule',
    staticShortfall: 71, staticContext: '~71% live under non-democratic rule',
    source: 'V-Dem (2024)',
  },
  {
    key: 'equity', name: 'Social equity', desc: 'Fairness in income and opportunity.',
    shortfall: () => 52, context: () => 'richest 10% capture ~52% of global income',
    staticShortfall: 52, staticContext: 'richest 10% capture ~52% of global income',
    source: 'World Inequality Report (2022)',
  },
]

function classify(shortfall: number): FoundationStatus {
  if (shortfall < 10) return 'met'
  if (shortfall <= 30) return 'moderate'
  return 'severe'
}

export const FOUNDATION_STATUS: Record<FoundationStatus, { label: string; color: string }> = {
  met: { label: 'Floor met', color: '#6fae57' },
  moderate: { label: 'Shortfall', color: '#e0a852' },
  severe: { label: 'Severe shortfall', color: '#d9604a' },
}

async function fetchWB(code: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.worldbank.org/v2/country/WLD/indicator/${code}?format=json&mrnev=1`)
    if (!res.ok) return null
    const d = await res.json()
    const v = d?.[1]?.[0]?.value
    return typeof v === 'number' ? v : null
  } catch {
    return null
  }
}

let _cache: { at: number; data: ResolvedDimension[] } | null = null
const SIX_HOURS = 6 * 60 * 60 * 1000

async function loadFoundation(): Promise<ResolvedDimension[]> {
  if (_cache && Date.now() - _cache.at < SIX_HOURS) return _cache.data

  const resolved = await Promise.all(
    DIMENSIONS.map(async (d): Promise<ResolvedDimension> => {
      // Static dimension
      if (d.staticShortfall != null) {
        return {
          key: d.key, name: d.name, desc: d.desc,
          shortfall: d.staticShortfall, status: classify(d.staticShortfall),
          context: d.staticContext ?? '', source: d.source, live: false,
        }
      }
      // Live dimension (fall back to the latest known value on failure).
      // Skip the fetch entirely for indicators WB serves without CORS headers.
      const v = d.code && !d.noFetch ? await fetchWB(d.code) : null
      const value = v ?? d.fallbackValue ?? 0
      const shortfall = Math.max(0, Math.min(100, d.shortfall(value)))
      return {
        key: d.key, name: d.name, desc: d.desc,
        shortfall, status: classify(shortfall),
        context: d.context(value), source: d.source, live: v != null,
      }
    }),
  )
  _cache = { at: Date.now(), data: resolved }
  return resolved
}

export function useSocialFoundation(): { dims: ResolvedDimension[]; loading: boolean } {
  const [dims, setDims] = useState<ResolvedDimension[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let cancelled = false
    loadFoundation().then((d) => {
      if (!cancelled) {
        setDims(d)
        setLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])
  return { dims, loading }
}
