// Active armed conflicts — curated, cited figures. There is no free, keyless,
// CORS-enabled live API for a global war count (UCDP's API blocks browsers,
// ACLED needs a key), so this is a hand-maintained snapshot from the major
// trackers, with sources to check the latest yourself. Update periodically.

export interface Conflict {
  name: string
  region: string
  since: string
  /** One line on what it is. */
  note: string
  /** Rough intensity, for ordering/colour. */
  intensity: 'war' | 'conflict'
}

// Headline numbers (as of early 2025). Two honest measures, because "how many
// wars" depends on the definition:
//  • state-based armed conflicts — the academic count (UCDP/PRIO)
//  • all armed conflicts incl. non-state & one-sided — the ICRC's wider count
export const CONFLICT_STATS = {
  stateBasedConflicts: 61, // UCDP: 61 state-based conflicts in 2024
  stateBasedNote: 'state-based armed conflicts in 2024 — the most since 1946',
  allConflicts: 120, // ICRC: "more than 120 armed conflicts" today
  allConflictsNote: 'armed conflicts worldwide today (incl. non-state groups)',
  displacement: 122, // UNHCR: 122.1M forcibly displaced (mid-2024), millions
  displacementNote: 'million people forcibly displaced by war & persecution',
  asOf: '2024–25',
}

// The largest active wars by scale of violence / displacement.
export const ACTIVE_CONFLICTS: Conflict[] = [
  { name: 'Russia–Ukraine', region: 'Eastern Europe', since: '2022', intensity: 'war',
    note: 'Full-scale invasion; the deadliest interstate war in Europe since 1945.' },
  { name: 'Sudan civil war', region: 'East Africa', since: '2023', intensity: 'war',
    note: 'Army vs. RSF; the world’s largest displacement and hunger crisis.' },
  { name: 'Israel–Gaza / Palestine', region: 'Middle East', since: '2023', intensity: 'war',
    note: 'War in Gaza with mass civilian casualties and a humanitarian emergency.' },
  { name: 'Myanmar civil war', region: 'Southeast Asia', since: '2021', intensity: 'war',
    note: 'Post-coup junta vs. resistance and ethnic armies across the country.' },
  { name: 'Sahel insurgencies', region: 'West Africa', since: '2012', intensity: 'war',
    note: 'Mali, Burkina Faso & Niger — jihadist insurgencies, now the epicentre of terrorism deaths.' },
  { name: 'Eastern DR Congo', region: 'Central Africa', since: '2022', intensity: 'war',
    note: 'M23 and dozens of armed groups; millions displaced in the Kivus.' },
  { name: 'Yemen', region: 'Middle East', since: '2014', intensity: 'conflict',
    note: 'Fragile truce after years of war; one of the worst humanitarian crises.' },
  { name: 'Haiti', region: 'Caribbean', since: '2023', intensity: 'conflict',
    note: 'Armed gangs control much of the capital amid state collapse.' },
  { name: 'Ethiopia', region: 'East Africa', since: '2023', intensity: 'conflict',
    note: 'Post-Tigray violence in Amhara and Oromia regions.' },
  { name: 'Syria', region: 'Middle East', since: '2011', intensity: 'conflict',
    note: 'Instability and localised fighting through the 2024 political transition.' },
]

export const CONFLICT_SOURCES: { label: string; url: string }[] = [
  { label: 'UCDP (Uppsala)', url: 'https://ucdp.uu.se/' },
  { label: 'PRIO', url: 'https://www.prio.org/' },
  { label: 'ACLED', url: 'https://acleddata.com/' },
  { label: 'ICRC — today’s conflicts', url: 'https://www.icrc.org/en/war-and-law' },
  { label: 'Geneva Academy RULAC', url: 'https://www.rulac.org/' },
]
