// "Soil, not oil" — Vandana Shiva's argument that the climate and food crises
// are one, and the way through is living soil over fossil-fed industrial farming.
// Curated, cited figures (not a live feed). Pairs with the Seed section.

export type SoilLine = 'below' | 'above'

export interface SoilStat {
  line: SoilLine
  stat: string
  label: string
  note: string
  source: string
  url?: string
}

export const SOIL_STATS: SoilStat[] = [
  // Below the line — the oil-based food system
  {
    line: 'below', stat: '~1/3',
    label: 'of global emissions',
    note: 'come from the food system — fossil fertiliser, machinery, transport and land clearing.',
    source: 'IPCC / Our World in Data',
    url: 'https://ourworldindata.org/food-ghg-emissions',
  },
  {
    line: 'below', stat: '~33%',
    label: 'of soils degraded',
    note: 'of the world’s soils are already degraded by erosion, chemicals and intensive tillage.',
    source: 'FAO',
    url: 'https://www.fao.org/soils-portal/en/',
  },
  {
    line: 'below', stat: '5 sec',
    label: 'a football pitch of soil',
    note: 'is lost to erosion roughly every five seconds — faster than it can reform.',
    source: 'FAO',
    url: 'https://www.fao.org/soils-portal/en/',
  },
  // Above the line — living soil
  {
    line: 'above', stat: '~96M ha',
    label: 'of organic farmland',
    note: 'now farmed organically worldwide, and rising year on year.',
    source: 'FiBL / IFOAM',
    url: 'https://www.fibl.org/en/',
  },
  {
    line: 'above', stat: '~3×',
    label: 'carbon in living soil',
    note: 'soils hold around three times more carbon than the atmosphere — regenerative farming draws it back down.',
    source: 'FAO / IPCC',
    url: 'https://www.fao.org/soils-portal/en/',
  },
  {
    line: 'above', stat: '200M+',
    label: 'farming families',
    note: 'in La Via Campesina champion agroecology — biodiverse, local, low-input farming.',
    source: 'La Via Campesina',
    url: 'https://viacampesina.org/en/',
  },
]

export const SOIL_FRAMING =
  'Vandana Shiva’s Soil Not Oil: the climate and food crises are one crisis. The way through is to base farming on living soil — biodiverse, local, regenerative — rather than on fossil fuels. Oil is extraction from the dead past; soil is regeneration in the living present.'

export const SOIL_LINKS: { label: string; url: string }[] = [
  { label: 'Navdanya', url: 'https://www.navdanya.org' },
  { label: 'FAO Soils', url: 'https://www.fao.org/soils-portal/en/' },
  { label: 'La Via Campesina', url: 'https://viacampesina.org/en/' },
]
