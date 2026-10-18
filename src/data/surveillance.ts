// Surveillance & digital control — a below-the-line force: the concentration of
// power through watching, and the shrinking of digital freedom. Distinct from
// the information-commons panel (that's disinformation; this is control).
// Curated + cited (Freedom House, Access Now, Citizen Lab, Carnegie).

export const SURVEIL_STATS = {
  declineYears: 14, // Freedom House: consecutive years of declining internet freedom
  declineNote: 'consecutive years of declining internet freedom (Freedom House)',
  shutdowns: 283, // Access Now: internet shutdowns in 2023
  shutdownsNote: 'internet shutdowns in a single year, across ~39 countries (Access Now)',
  aiSurveilCountries: 100, // Carnegie: countries using AI/biometric surveillance
  aiSurveilNote: 'countries deploy AI or biometric mass surveillance',
  asOf: '2024',
}

// ↓ The toolkit of control.
export const SURVEIL_TOOLS: { title: string; note: string }[] = [
  { title: 'Mass data harvesting', note: 'Every click, location and purchase logged, bought and sold.' },
  { title: 'Spyware', note: 'Tools like Pegasus silently take over phones — found in 45+ countries.' },
  { title: 'Facial recognition', note: 'Cameras that identify you in a crowd, often without consent or limit.' },
  { title: 'Internet shutdowns', note: 'Governments pulling the plug to silence protest and hide abuses.' },
  { title: 'Social scoring', note: 'Behaviour tracked and ranked to reward compliance and punish dissent.' },
]

// ↑ The defenders of digital freedom.
export const SURVEIL_DEFENDERS: { title: string; note: string }[] = [
  { title: 'Encryption', note: 'End-to-end encryption keeps messages private — and is under political attack.' },
  { title: 'Privacy law', note: 'Rules like GDPR give people rights over their own data.' },
  { title: 'Watchdogs', note: 'Access Now, Citizen Lab and EFF expose spyware and defend users.' },
  { title: 'Decentralisation', note: 'Open-source and user-owned tools that don’t pool power in one place.' },
]

export const SURVEIL_SOURCES: { label: string; url: string }[] = [
  { label: 'Freedom on the Net', url: 'https://freedomhouse.org/report/freedom-net' },
  { label: 'Access Now (#KeepItOn)', url: 'https://www.accessnow.org/keepiton/' },
  { label: 'Citizen Lab', url: 'https://citizenlab.ca/' },
  { label: 'EFF', url: 'https://www.eff.org/' },
]
