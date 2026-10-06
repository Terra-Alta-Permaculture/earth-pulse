// Health & outbreaks — "what's spreading and what could become the next
// pandemic." This is the most time-sensitive panel, so it's designed to be
// refreshed weekly by the World Pulse writer (WHO Disease Outbreak News etc.).
// The values below are the curated seed / fallback (best known early 2026).

export const HEALTH_STATS = {
  lifeExpectancy: 73.5, // World Bank SP.DYN.LE00.IN, 2024 (fetched live in the component)
  pheics: 1, // WHO Public Health Emergencies of International Concern in effect
  pheicsNote: 'international health emergency in effect (mpox)',
  outbreaksTracked: 8, // significant active outbreaks below
  outbreaksNote: 'significant outbreaks on the world’s radar',
  topThreat: 'H5N1 avian flu',
  asOf: 'early 2026',
}

export interface Outbreak {
  name: string
  place: string
  note: string
  /** 'watch' = pandemic-potential / highest concern; 'active' = serious ongoing. */
  concern: 'watch' | 'active'
}

export const HEALTH_OUTBREAKS: Outbreak[] = [
  { name: 'H5N1 avian influenza', place: 'Global', concern: 'watch',
    note: 'Spreading through poultry, dairy cattle and wild mammals, with sporadic human cases — the top pandemic-potential watch.' },
  { name: 'Mpox (clade Ib)', place: 'Central & East Africa', concern: 'watch',
    note: 'A newer, more transmissible strain; declared a WHO public health emergency.' },
  { name: 'Cholera', place: 'Africa · Middle East · Haiti', concern: 'active',
    note: 'A large multi-country resurgence driven by conflict, flooding and broken water systems.' },
  { name: 'Measles', place: 'Global', concern: 'active',
    note: 'Resurging wherever childhood vaccination has slipped.' },
  { name: 'Marburg virus', place: 'East Africa', concern: 'active',
    note: 'Sporadic, high-fatality haemorrhagic-fever outbreaks (Rwanda, Tanzania).' },
  { name: 'Dengue', place: 'Americas & Asia', concern: 'active',
    note: 'Record transmission, expanding into new regions as the climate warms.' },
  { name: 'Oropouche', place: 'South America & Caribbean', concern: 'active',
    note: 'An emerging arbovirus spreading beyond the Amazon.' },
  { name: 'Polio', place: 'Conflict-affected areas', concern: 'active',
    note: 'Persisting where vaccination campaigns are disrupted, including war zones.' },
]

export const HEALTH_SOURCES: { label: string; url: string }[] = [
  { label: 'WHO Outbreak News', url: 'https://www.who.int/emergencies/disease-outbreak-news' },
  { label: 'CDC', url: 'https://www.cdc.gov/outbreaks/' },
  { label: 'ECDC', url: 'https://www.ecdc.europa.eu/en/threats-and-outbreaks' },
  { label: 'Our World in Data', url: 'https://ourworldindata.org/pandemics' },
  { label: 'CIDRAP', url: 'https://www.cidrap.umn.edu/' },
]
