// Animal rights & welfare — curated, cited headline figures. No free, keyless,
// CORS live API, so hand-maintained from FAO / WWF / World Animal Protection.

export const ANIMAL_STATS = {
  landAnimalsBn: 80, // ~80 billion land animals slaughtered for food each year (FAO)
  landAnimalsNote: 'billion land animals farmed for food each year',
  wildlifeDeclinePct: 73, // WWF Living Planet Index 2024: average -73% since 1970
  wildlifeDeclineNote: 'average fall in monitored wildlife populations since 1970 (WWF)',
  sentienceJurisdictions: 32, // jurisdictions recognising animal sentience in law
  sentienceNote: 'jurisdictions legally recognise animals as sentient',
  asOf: '2024',
}

export const ANIMAL_PROGRESS: { title: string; note: string }[] = [
  { title: 'Sentience in law', note: 'The EU, UK, New Zealand and others now recognise animals as sentient beings.' },
  { title: 'Cages on the way out', note: 'Bans on battery cages, sow crates and fur farming are spreading across Europe.' },
  { title: 'Wildlife protection', note: 'CITES trade curbs and rewilding are expanding — though poaching and habitat loss persist.' },
  { title: 'The scale problem', note: 'Factory farming still dominates: most farmed animals never see daylight.' },
]

export const ANIMAL_SOURCES: { label: string; url: string }[] = [
  { label: 'WWF Living Planet', url: 'https://www.worldwildlife.org/pages/living-planet-report' },
  { label: 'FAO (FAOSTAT)', url: 'https://www.fao.org/faostat/' },
  { label: 'World Animal Protection', url: 'https://www.worldanimalprotection.org/' },
  { label: 'Compassion in World Farming', url: 'https://www.ciwf.com/' },
]
