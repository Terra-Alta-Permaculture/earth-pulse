// Mother lines — curated layer for the lineages panel. The counts come from
// lineagesEA.ts (generated from the D-PLACE Ethnographic Atlas); this file holds
// the living matrilineal cultures, labels and sources.

/** Descent groups shown in the bar, in display order. Codes = EA043. */
export const DESCENT_GROUPS: { key: string; label: string; codes: number[]; color: string; note: string }[] = [
  { key: 'patri', label: 'Patrilineal', codes: [1], color: '#c8734f', note: 'belonging, name and land pass through the father’s line' },
  { key: 'matri', label: 'Matrilineal', codes: [3], color: '#e0a852', note: 'belonging, name and land pass through the mother’s line' },
  { key: 'both', label: 'Both lines', codes: [2, 4, 5, 6, 7], color: '#79b568', note: 'bilateral, double or flexible descent — kin on both sides count' },
]

/** ISO-3 codes for the World Bank law lookup. */
export interface LivingCulture {
  name: string
  place: string
  country: string // display name
  iso3: string
  lat: number
  lon: number
  line: string // how lineage, home and land pass through women
  pressure: string // what presses on it now
}

export const LIVING_CULTURES: LivingCulture[] = [
  {
    name: 'Minangkabau', place: 'West Sumatra', country: 'Indonesia', iso3: 'IDN', lat: -0.9, lon: 100.4,
    line: 'The largest matrilineal society on Earth — millions strong. Ancestral land and the great house pass from mother to daughter, alongside devout Islam.',
    pressure: 'National and religious inheritance law, and young people migrating away (merantau), pull at the communal land.',
  },
  {
    name: 'Khasi', place: 'Meghalaya', country: 'India', iso3: 'IND', lat: 25.5, lon: 91.9,
    line: 'Children take their mother’s clan name; the youngest daughter keeps the ancestral home and cares for the parents.',
    pressure: 'Recurring political pushes to rewrite inheritance and lineage custom toward the father’s line.',
  },
  {
    name: 'Mosuo (Na)', place: 'Lugu Lake, Yunnan–Sichuan', country: 'China', iso3: 'CHN', lat: 27.7, lon: 100.8,
    line: 'Households are run by a grandmother; in “walking marriage” partners live apart and children grow up in the mother’s house.',
    pressure: 'Mass tourism sells the culture as exotic, and state schooling and marriage norms erode it.',
  },
  {
    name: 'Akan (Asante)', place: 'Southern Ghana', country: 'Ghana', iso3: 'GHA', lat: 6.7, lon: -1.6,
    line: 'You belong to your mother’s abusua (lineage). The queen mother (ohemaa) has a central voice in choosing the chief.',
    pressure: 'Ghana’s 1985 intestate-succession law shifted inheritance toward spouses and children, away from the matrilineage.',
  },
  {
    name: 'Bribri', place: 'Talamanca', country: 'Costa Rica', iso3: 'CRI', lat: 9.6, lon: -82.9,
    line: 'Clan passes through the mother and women inherit the land; women hold key ceremonial roles, including preparing sacred cacao.',
    pressure: 'Settlers occupying land inside Indigenous territories, and land defenders facing violence.',
  },
  {
    name: 'Haudenosaunee', place: 'Great Lakes', country: 'USA / Canada', iso3: 'USA', lat: 43.0, lon: -76.1,
    line: 'Clans run through the mother. Clan mothers choose the chiefs — and can remove them.',
    pressure: 'Colonial-era elected councils were imposed over the clan-mother system and still compete with it.',
  },
  {
    name: 'Diné (Navajo)', place: 'Four Corners', country: 'USA', iso3: 'USA', lat: 36.1, lon: -109.0,
    line: 'You are “born to” your mother’s clan, and homesteads traditionally grow around a mother and her daughters.',
    pressure: 'A tribal government modelled on US institutions rather than the clan structure.',
  },
]

export const LINEAGE_SOURCES: { label: string; url: string }[] = [
  { label: 'D-PLACE — Ethnographic Atlas', url: 'https://d-place.org/' },
  { label: 'EA dataset (CC BY-NC 4.0)', url: 'https://github.com/D-PLACE/dplace-dataset-ea' },
  { label: 'World Bank — Women, Business & the Law', url: 'https://data.worldbank.org/indicator/SG.LAW.INDX' },
]
