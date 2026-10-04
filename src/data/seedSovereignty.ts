// "Seed sovereignty — who owns the seed?" A curated, cited tribute to Vandana
// Shiva's life's work (bija swaraj), mapped onto the above/below-the-line frame.
// Not a live feed — maintained, sourced figures.

export type SeedLine = 'below' | 'above'

export interface SeedStat {
  line: SeedLine
  stat: string
  label: string
  note: string
  source: string
  url?: string
}

export const SEED_STATS: SeedStat[] = [
  // Below the line — enclosure of the seed
  {
    line: 'below', stat: '~60%',
    label: 'of the global seed market',
    note: 'controlled by just four corporations (Bayer, Corteva, ChemChina/Syngenta, BASF).',
    source: 'ETC Group / IPES-Food',
    url: 'https://ipes-food.org/',
  },
  {
    line: 'below', stat: '~75%',
    label: 'of crop diversity lost',
    note: 'of the genetic diversity of crops disappeared over the 20th century, as farmers shifted to uniform commercial varieties.',
    source: 'FAO',
    url: 'https://www.fao.org/home/en',
  },
  {
    line: 'below', stat: 'criminalised',
    label: 'saving & sharing seed',
    note: 'patents and UPOV-91 seed laws restrict farmers from saving, exchanging or selling protected seed in many countries.',
    source: 'La Via Campesina',
    url: 'https://viacampesina.org/en/',
  },
  // Above the line — the living commons
  {
    line: 'above', stat: '150+',
    label: 'community seed banks',
    note: "Vandana Shiva's Navdanya has set up 150+ seed banks across India and conserved 3,000+ rice varieties.",
    source: 'Navdanya',
    url: 'https://www.navdanya.org',
  },
  {
    line: 'above', stat: '1.3M+',
    label: 'seeds safeguarded',
    note: 'samples of the world’s crop diversity are backed up in the Svalbard Global Seed Vault.',
    source: 'Crop Trust',
    url: 'https://www.croptrust.org/work/svalbard-global-seed-vault/',
  },
  {
    line: 'above', stat: 'thousands',
    label: 'of seed libraries',
    note: 'seed libraries, swaps and farmer networks keep open-pollinated, saveable varieties alive and shared worldwide.',
    source: 'Seed sovereignty movement',
    url: 'https://seedfreedom.info/',
  },
]

// Her idea, described (not a verbatim quote), to stay accurate.
export const SEED_FRAMING =
  'Vandana Shiva calls this bija swaraj — seed sovereignty: the seed as a living commons to be freely saved, shared and renewed, not a patented commodity. “Saving seeds is saving freedom.”'

export const SEED_LINKS: { label: string; url: string }[] = [
  { label: 'Navdanya', url: 'https://www.navdanya.org' },
  { label: 'Seed Freedom', url: 'https://seedfreedom.info/' },
  { label: 'ETC Group', url: 'https://www.etcgroup.org/' },
]
