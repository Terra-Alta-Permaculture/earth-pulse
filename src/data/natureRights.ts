// Rights of Nature — curated, cited. The detailed timeline lives in the Planet
// tab's Law Tracker; this is a compact World-tab summary of the global movement.

export const NATURE_STATS = {
  initiatives: 400, // Eco Jurisprudence Monitor: ~400+ Rights of Nature initiatives
  initiativesNote: 'Rights of Nature laws & initiatives worldwide',
  countries: 39, // GARN: provisions across ~39 countries
  countriesNote: 'countries with Rights of Nature provisions',
  ecocideNote:
    'Belgium became the first EU state to criminalise ecocide (2024); an ICC amendment to make it an international crime is under negotiation.',
  asOf: '2024',
}

// Landmark cases where an ecosystem was granted legal rights / personhood.
export const NATURE_PERSONHOOD: { name: string; place: string; year: string; note: string }[] = [
  { name: 'Ecuador’s Constitution', place: 'Ecuador', year: '2008', note: 'First country to enshrine the Rights of Nature.' },
  { name: 'Whanganui River', place: 'Aotearoa NZ', year: '2017', note: 'First river recognised as a legal person.' },
  { name: 'Atrato River', place: 'Colombia', year: '2016', note: 'Constitutional Court recognised the river’s rights.' },
  { name: 'Ganga & Yamuna', place: 'India', year: '2017', note: 'Rivers declared legal persons by a high court.' },
  { name: 'Mar Menor lagoon', place: 'Spain', year: '2022', note: 'First ecosystem in Europe granted legal rights.' },
  { name: 'Los Cedros forest', place: 'Ecuador', year: '2021', note: 'Court halted mining, citing the forest’s rights.' },
]

export const NATURE_SOURCES: { label: string; url: string }[] = [
  { label: 'GARN', url: 'https://www.garn.org/' },
  { label: 'UN Harmony with Nature', url: 'http://www.harmonywithnatureun.org/' },
  { label: 'Eco Jurisprudence Monitor', url: 'https://ecojurisprudence.org/' },
  { label: 'Stop Ecocide', url: 'https://www.stopecocide.earth/' },
]
