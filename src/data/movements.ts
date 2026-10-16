// People rising — protests, demonstrations & petitions, read above/below the
// line (NOVA): movements that distribute power & widen rights (above) vs. those
// that concentrate power or roll back rights (below). No clean live API, so
// curated+cited (Carnegie Global Protest Tracker, ACLED, CIVICUS, Avaaz,
// Change.org); the weekly writer refreshes the current ones.

export const MOVEMENT_STATS = {
  recordNote: 'The 2020s have seen more mass protest movements than any decade on record (Carnegie).',
  openCivicPct: 2, // CIVICUS: % in fully open civic space
  openCivicNote: 'of people live where the right to protest is fully open (CIVICUS)',
  asOf: 'early 2026',
}

export interface Movement {
  name: string
  place?: string
  note: string
}

// ↑ Above the line — distribute power, widen rights, make consequences visible.
export const PROTESTS_ABOVE: Movement[] = [
  { name: 'Climate justice', place: 'Global', note: 'Fridays for Future, climate strikes and fossil-finance blockades keep the pressure on.' },
  { name: 'Pro-democracy movements', place: 'Multiple', note: 'Mass protests against authoritarian capture, rigged votes and corruption.' },
  { name: 'Woman, Life, Freedom & rights', place: 'Iran & beyond', note: 'Women’s, reproductive and LGBTQ+ rights marches worldwide.' },
  { name: 'Indigenous & land defence', place: 'Amazon, Pacific, Arctic', note: 'Front-line resistance to mining, dams and deforestation.' },
  { name: 'Labour & living wage', place: 'Global', note: 'Strikes and unionisation drives for fair pay and conditions.' },
]

// ↓ Below the line — concentrate power, scapegoat, or roll back rights.
export const PROTESTS_BELOW: Movement[] = [
  { name: 'Far-right & anti-immigrant marches', place: 'Europe & US', note: 'Nationalist mobilisations targeting migrants and minorities.' },
  { name: 'Anti-climate backlash', place: 'Multiple', note: 'Pushback against climate policy, often fossil-funded.' },
  { name: 'State-organised rallies', place: 'Authoritarian states', note: 'Top-down “demonstrations” that manufacture consent.' },
  { name: 'Crackdowns on protest', place: 'Global', note: 'New laws and force used to criminalise and silence dissent.' },
]

export interface Petition {
  name: string
  signatures: string
  side: 'above' | 'below'
  note: string
}

export const PETITIONS: Petition[] = [
  { name: 'Save Bees & Farmers (EU)', signatures: '1M+', side: 'above', note: 'EU citizens’ initiative to phase out synthetic pesticides.' },
  { name: 'Stop Ecocide', signatures: 'global', side: 'above', note: 'Make mass ecosystem destruction an international crime.' },
  { name: 'Climate & nature petitions (Avaaz)', signatures: 'millions', side: 'above', note: 'Recurring mega-petitions on climate, forests and oceans.' },
  { name: 'Justice & rights campaigns (Change.org)', signatures: 'millions', side: 'above', note: 'The platform’s largest petitions are overwhelmingly rights-based.' },
  { name: 'Anti-protections / border petitions', signatures: 'varies', side: 'below', note: 'Petitions also mobilise to roll back environmental rules or close borders.' },
]

export const MOVEMENT_SOURCES: { label: string; url: string }[] = [
  { label: 'Carnegie Protest Tracker', url: 'https://carnegieendowment.org/features/global-protest-tracker' },
  { label: 'ACLED', url: 'https://acleddata.com/' },
  { label: 'CIVICUS Monitor', url: 'https://monitor.civicus.org/' },
  { label: 'Avaaz', url: 'https://secure.avaaz.org/campaign/en/' },
  { label: 'Change.org', url: 'https://www.change.org/' },
]
