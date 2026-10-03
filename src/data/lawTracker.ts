// "The law — above & below the line": a curated, cited tracker of legal moves
// that either protect life (above the line) or enable extraction / punish its
// defenders (below the line). No free/keyless feed exists for global
// legislation, so this is a maintained list of real, verifiable milestones.
// Sources: UN Harmony with Nature, GARN, Stop Ecocide International, ISA, news.

export type LawLine = 'above' | 'below'

export interface LawMilestone {
  year: string
  place: string
  /** '' for international/multilateral, else the country for filtering. */
  country: string
  scope: 'international' | 'national'
  line: LawLine
  title: string
  note: string
  /** Source link, for live (weekly-fetched) entries. */
  url?: string
}

export const LAW_MILESTONES: LawMilestone[] = [
  // ── Above the line — protecting life ──
  { year: '2008', place: 'Ecuador', country: 'Ecuador', scope: 'national', line: 'above', title: 'Rights of Nature in a constitution', note: 'First country to enshrine the rights of nature (Pachamama) in its constitution.' },
  { year: '2010', place: 'Bolivia', country: 'Bolivia', scope: 'national', line: 'above', title: 'Law of the Rights of Mother Earth', note: 'Gave legal rights to the Earth system and its living community.' },
  { year: '2017', place: 'New Zealand', country: 'New Zealand', scope: 'national', line: 'above', title: 'Whanganui River legal personhood', note: 'The Te Awa Tupua Act recognised the river as a legal person, after decades of Māori advocacy.' },
  { year: '2017', place: 'Colombia', country: 'Colombia', scope: 'national', line: 'above', title: 'Atrato River granted rights', note: 'Constitutional Court recognised the river as a rights-bearing entity; the Amazon followed in 2018.' },
  { year: '2021', place: 'France', country: 'France', scope: 'national', line: 'above', title: 'Ecocide offence in national law', note: 'Introduced a délit d’écocide for serious, lasting environmental harm.' },
  { year: '2021', place: 'International', country: '', scope: 'international', line: 'above', title: 'A legal definition of ecocide', note: 'An independent expert panel (Stop Ecocide Foundation) published a draft definition for international law.' },
  { year: '2021', place: 'Panama', country: 'Panama', scope: 'national', line: 'above', title: 'National Rights of Nature law', note: 'Recognised nature’s right to exist, persist and regenerate its cycles.' },
  { year: '2022', place: 'Spain', country: 'Spain', scope: 'national', line: 'above', title: 'Mar Menor lagoon legal personhood', note: 'First ecosystem in Europe granted legal standing, by citizen-led popular initiative.' },
  { year: '2023', place: 'Ecuador', country: 'Ecuador', scope: 'national', line: 'above', title: 'Yasuní: oil kept in the ground', note: 'Voters chose in a referendum to halt oil drilling in a biodiverse Amazon reserve.' },
  { year: '2023', place: 'Panama', country: 'Panama', scope: 'national', line: 'above', title: 'Cobre Panamá copper mine closed', note: 'Supreme Court ruled the huge mining contract unconstitutional after mass protests.' },
  { year: '2024', place: 'European Union', country: '', scope: 'international', line: 'above', title: 'Environmental Crimes Directive', note: 'Adopted EU-wide criminal penalties for conduct “comparable to ecocide.”' },
  { year: '2024', place: 'Belgium', country: 'Belgium', scope: 'national', line: 'above', title: 'First EU country to criminalise ecocide', note: 'Wrote ecocide into its penal code at both national and international level.' },
  { year: '2024', place: 'Vanuatu · Fiji · Samoa', country: '', scope: 'international', line: 'above', title: 'Ecocide proposed at the ICC', note: 'Formally proposed adding ecocide as a fifth crime under the Rome Statute.' },

  // ── Below the line — enabling extraction / punishing its defenders ──
  { year: '2023', place: 'United Kingdom', country: 'United Kingdom', scope: 'national', line: 'below', title: 'Public Order Act', note: 'New criminal penalties widely used against climate and environmental protest.' },
  { year: '2024', place: 'International', country: '', scope: 'international', line: 'below', title: 'Deep-sea Mining Code negotiations', note: 'The International Seabed Authority is drafting rules that would permit commercial seabed mining.' },
  { year: '2025', place: 'USA / International', country: 'United States', scope: 'international', line: 'below', title: 'First commercial seabed-mining bid', note: 'A company sought the first commercial deep-sea mining permit, bypassing the ISA via national law.' },
]

export const LAW_HEADLINES = {
  above: {
    label: 'Above the line',
    stat: '~400 initiatives',
    detail: 'Rights of Nature across 40+ countries; ecocide now a crime in a growing number of states',
    source: 'UN Harmony with Nature · GARN · Stop Ecocide',
    sourceUrl: 'https://www.stopecocide.earth/',
  },
  below: {
    label: 'Below the line',
    stat: 'the push to extract',
    detail: 'seabed-mining rules, protest crackdowns and rollbacks moving the other way',
    source: 'ISA · news',
    sourceUrl: 'https://www.isa.org.jm/',
  },
} as const

// Authoritative live databases — for checking the very latest yourself.
export const LAW_SOURCES: { label: string; url: string }[] = [
  { label: 'Climate Change Laws of the World', url: 'https://climate-laws.org/' },
  { label: 'ECOLEX (environmental law)', url: 'https://www.ecolex.org/' },
  { label: 'UN Harmony with Nature', url: 'https://www.harmonywithnatureun.org/rightsOfNature/' },
  { label: 'Stop Ecocide International', url: 'https://www.stopecocide.earth/' },
]

export const LINE_META: Record<LawLine, { label: string; color: string }> = {
  above: { label: 'Above the line', color: '#6fae57' },
  below: { label: 'Below the line', color: '#d9604a' },
}
