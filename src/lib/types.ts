export type Stream = 'crisis' | 'regeneration'

export type UserType = 'individual' | 'community' | 'policy'

/** A row of the `earth_snapshots` Supabase table. */
export interface EarthSnapshot {
  id?: string
  indicator_name: string
  value: number
  unit: string
  source: string
  stream: Stream
  region: string
  fetched_at: string // ISO timestamp
}

/** Static metadata that describes an indicator (not stored in DB). */
export interface IndicatorMeta {
  key: string
  label: string
  stream: Stream
  unit: string
  source: string
  /** Short human explanation shown under the number. */
  blurb: string
  /** Whether a rising value is "good". Crisis indicators are usually false. */
  higherIsBetter: boolean
  region: string
}

/** An indicator with its latest fetched reading + short history. */
export interface IndicatorReading {
  meta: IndicatorMeta
  latest: number | null
  unit: string
  fetchedAt: string | null
  /** Chronological values, oldest → newest, for the sparkline. */
  history: { value: number; fetched_at: string }[]
  stale: boolean
  error?: string
}

export interface Scenario {
  id: 'business_as_usual' | 'moderate' | 'accelerated'
  title: string
  timeframe: string
  summary: string
  keyIndicators: { name: string; trajectory: string }[]
  tippingPoints: string[]
}

export interface AdviceItem {
  title: string
  detail: string
  stream: Stream | 'balance'
}

export interface AdviceResponse {
  headline: string
  items: AdviceItem[]
}

// ── World Pulse — human systems pressing on the planet ───────────────

export type ForceKey =
  | 'us_power' | 'us_china' | 'chokepoints_energy' | 'russia_europe'
  | 'institutions' | 'living_planet' | 'identity_religion' | 'ai' | 'money_trade'
  | 'space_orbit' | 'israel_us' | 'elites'

export interface WorldIndicator {
  label: string
  value: string | number
  unit?: string
  as_of?: string
  source_url?: string
}

export interface WorldSource {
  title: string
  url: string
}

export interface WorldReading {
  week_start: string
  force_key: ForceKey
  tension: number
  direction: 'up' | 'down' | 'flat'
  headline: string
  what_changed: string
  counterpoint: string
  indicators: WorldIndicator[]
  sources: WorldSource[]
}

export interface WorldWeekly {
  week_start: string
  summary: string
  scenario_lean: Record<'A' | 'B' | 'C' | 'D', number>
  lean_rationale: string
}

export interface WorldSignpost {
  id?: string
  event_date: string | null
  date_label: string
  title: string
  force_keys: ForceKey[]
  what_it_means: string
  status: 'upcoming' | 'happened' | 'cancelled'
  outcome?: string | null
}
