import type { LiveSignal } from './liveSources'

// The nine planetary boundaries (Stockholm Resilience Centre). Status reflects
// the 2023 assessment (Richardson et al., Science Advances): six transgressed,
// ozone within the safe zone and recovering, aerosols & ocean acidification in
// the zone of increasing risk. The *status* is the scientific assessment; where
// EarthPulse holds a related live indicator we surface it as context — a proxy,
// not the boundary's exact control variable.

export type BoundaryStatus = 'safe' | 'risk' | 'crossed'

export interface Boundary {
  key: string
  name: string
  desc: string
  status: BoundaryStatus
  note: string
  /** EarthPulse signal key for live context, if any. */
  liveKey?: string
  /** How to render the live value as a short context string. */
  context?: (v: number | string, unit: string) => string
}

export interface ResolvedBoundary extends Boundary {
  live?: string
}

export const BOUNDARIES: Boundary[] = [
  {
    key: 'climate',
    name: 'Climate change',
    desc: 'Heat-trapping gases destabilising the climate system.',
    status: 'crossed',
    note: 'CO₂ far past the 350 ppm safe limit',
    liveKey: 'co2',
    context: (v) => `CO₂ ${v} ppm · safe ≤ 350`,
  },
  {
    key: 'biosphere',
    name: 'Biosphere integrity',
    desc: 'The web of life — genetic diversity and ecosystem function.',
    status: 'crossed',
    note: 'extinction rate far above the natural background',
    liveKey: 'threatened_species',
    context: (v) => `${Number(v).toLocaleString()} species on the IUCN Red List`,
  },
  {
    key: 'land',
    name: 'Land-system change',
    desc: 'Forests and wild land converted to human use.',
    status: 'crossed',
    note: 'forest cover below the safe threshold',
    liveKey: 'forest_loss',
    context: (v, u) => `losing ${v} ${u}`,
  },
  {
    key: 'freshwater',
    name: 'Freshwater change',
    desc: 'Disruption of the blue- and green-water cycles.',
    status: 'crossed',
    note: 'newly assessed as transgressed in 2023',
    liveKey: 'freshwater_withdrawal',
    context: (v) => `${v}% of renewable water withdrawn`,
  },
  {
    key: 'biogeochemical',
    name: 'Nitrogen & phosphorus',
    desc: 'Fertiliser runoff overloading land, rivers and seas.',
    status: 'crossed',
    note: 'the most heavily transgressed boundary',
    liveKey: 'fertilizer',
    context: (v, u) => `fertiliser ${v} ${u}`,
  },
  {
    key: 'novel',
    name: 'Novel entities',
    desc: 'Plastics, synthetic chemicals and other new substances.',
    status: 'crossed',
    note: 'production outpacing safety assessment',
  },
  {
    key: 'aerosols',
    name: 'Atmospheric aerosols',
    desc: 'Particulate pollution loading the atmosphere.',
    status: 'risk',
    note: 'within the limit globally, breached in many regions',
    liveKey: 'pm25_exposure',
    context: (v) => `PM2.5 ${v} µg/m³`,
  },
  {
    key: 'ocean_acid',
    name: 'Ocean acidification',
    desc: 'Seas absorbing CO₂ and turning more acidic.',
    status: 'risk',
    note: 'right at the boundary and worsening',
  },
  {
    key: 'ozone',
    name: 'Ozone layer',
    desc: 'The stratospheric shield against solar UV.',
    status: 'safe',
    note: 'recovering, thanks to the Montreal Protocol',
    liveKey: 'ozone_recovery',
    context: (v) => `${v}% of ODS phased out`,
  },
]

export function resolveBoundaries(signals: LiveSignal[]): ResolvedBoundary[] {
  const by = new Map(signals.map((s) => [s.key, s]))
  return BOUNDARIES.map((b) => {
    let live: string | undefined
    if (b.liveKey && b.context) {
      const s = by.get(b.liveKey)
      if (s != null) live = b.context(s.value, s.unit)
    }
    return { ...b, live }
  })
}

export const STATUS_META: Record<BoundaryStatus, { label: string; color: string }> = {
  safe: { label: 'Safe', color: '#6fae57' },
  risk: { label: 'Increasing risk', color: '#e0a852' },
  crossed: { label: 'Boundary crossed', color: '#d9604a' },
}
