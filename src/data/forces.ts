import type { ForceKey } from '../lib/types'

export interface ForceMeta {
  key: ForceKey
  title: string
  blurb: string
  icon: string // emoji, matching the app's dependency-free icon style
}

/** The forces, in fixed display order. Keys must never be renamed. */
export const FORCES: ForceMeta[] = [
  { key: 'us_power', title: 'How the US uses its power', blurb: 'Tariffs, unilateral force, alliance pressure, spheres of influence.', icon: '🏛️' },
  { key: 'us_china', title: 'US–China rivalry', blurb: 'Trade truces, chip & mineral controls, Taiwan pressure.', icon: '⚔️' },
  { key: 'chokepoints_energy', title: 'Chokepoints & energy', blurb: 'Hormuz, Bab al-Mandab, the Red Sea, oil, gas and LNG prices.', icon: '🛢️' },
  { key: 'russia_europe', title: "Russia's war & Europe", blurb: 'Ukraine front, talks, hybrid attacks on NATO, European rearmament.', icon: '🪖' },
  { key: 'institutions', title: 'Rules & institutions', blurb: 'UN, ICC, ICJ, arms control, treaty exits.', icon: '⚖️' },
  { key: 'living_planet', title: 'Living planet & resources', blurb: 'Climate, El Niño, harvests, soil, forests, fisheries, war minerals.', icon: '🌍' },
  { key: 'identity_religion', title: 'Identity & religion', blurb: 'Religious/nationalist mobilisation, sectarian violence, persecution.', icon: '👥' },
  { key: 'ai', title: 'Artificial intelligence', blurb: 'Compute concentration, chip controls, military AI, model access, rules.', icon: '🤖' },
  { key: 'money_trade', title: 'Money, trade & sanctions', blurb: 'Dollar share, US debt, sanctions, frozen assets, trade, debt distress.', icon: '💱' },
  { key: 'space_orbit', title: 'Space race & orbit', blurb: 'Military space, satellite mega-constellations, a legal vacuum, and orbital debris.', icon: '🛰️' },
]

export const forceByKey = Object.fromEntries(
  FORCES.map((f) => [f.key, f]),
) as Record<ForceKey, ForceMeta>

/** Scenario definitions (fixed A–D), shared by the seed and the UI. */
export const SCENARIOS: { id: 'A' | 'B' | 'C' | 'D'; name: string; desc: string }[] = [
  { id: 'A', name: 'Armed bargaining', desc: 'Great powers keep bargaining; chokepoints reopen slowly.' },
  { id: 'B', name: 'Chokepoint spiral', desc: 'Middle East bargaining fails; straits stay shut; food & debt crises.' },
  { id: 'C', name: 'Two camps', desc: 'US–China bargaining breaks; the world splits into blocs.' },
  { id: 'D', name: 'Patchwork repair', desc: 'Middle powers build issue-by-issue coalitions; institutions partly recover.' },
]
