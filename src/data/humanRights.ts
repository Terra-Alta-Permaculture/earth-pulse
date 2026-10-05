// Human rights — curated, cited figures from the major monitors. No free,
// keyless, CORS live API gives a clean global rights score, so these are
// hand-maintained headline numbers with sources to check the latest.

export const HR_STATS = {
  declineYears: 19, // Freedom House: consecutive years of global decline
  declineNote: 'consecutive years of decline in global freedom (Freedom House)',
  notFreePct: 38, // Freedom House: share of world population in "Not Free" countries
  notFreeNote: 'of people live in countries rated “Not Free”',
  autocracyPct: 72, // V-Dem: share living under autocratic rule
  autocracyNote: 'live under autocratic rule — ~7 in 10 people',
  openCivicPct: 2, // CIVICUS: share in "open" civic space
  openCivicNote: 'live where civic space is fully open (CIVICUS)',
  asOf: '2024–25',
}

// A few of the conditions rights monitors flag most urgently right now.
export const HR_CONCERNS: { title: string; note: string }[] = [
  { title: 'Shrinking civic space', note: 'Protest, press and assembly curbed in a growing number of countries.' },
  { title: 'Repression of dissent', note: 'Jailing of journalists, activists and opposition at record highs.' },
  { title: 'Rights in wartime', note: 'Civilians, aid workers and the laws of war under attack in active conflicts.' },
  { title: 'Surveillance & digital rights', note: 'Spyware, internet shutdowns and online censorship spreading.' },
]

export const HR_SOURCES: { label: string; url: string }[] = [
  { label: 'Freedom House', url: 'https://freedomhouse.org/report/freedom-world' },
  { label: 'V-Dem', url: 'https://v-dem.net/' },
  { label: 'CIVICUS Monitor', url: 'https://monitor.civicus.org/' },
  { label: 'Amnesty International', url: 'https://www.amnesty.org/en/latest/' },
  { label: 'Human Rights Watch', url: 'https://www.hrw.org/world-report' },
]
