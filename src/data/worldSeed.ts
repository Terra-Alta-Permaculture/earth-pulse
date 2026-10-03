import type { WorldReading, WorldWeekly, WorldSignpost } from '../lib/types'

// "State of the World 2026" — first calibrated reading, week of 28 Sep 2026.
// Bundled so the World tab renders fully even with no backend. All later weeks
// are scored relative to these (week one is all `direction: "flat"`).

export const SEED_WEEK_START = '2026-09-28'

const SRC = {
  iea: 'https://www.iea.org/reports/oil-market-report-september-2026',
  copernicus:
    'https://climate.copernicus.eu/copernicus-august-was-worlds-joint-hottest-month-record-pushing-global-temperatures-back-above',
  imf: 'https://data.imf.org/en/news/imf%20data%20brief%20july%201',
  cbo: 'https://www.cbo.gov/publication/62105',
  sipri:
    'https://www.sipri.org/media/press-release/2026/global-military-spending-rise-continues-european-and-asian-expenditures-surge',
  newStart:
    'https://www.armscontrol.org/act/2026-03/news/new-start-expires-us-urges-modernized-treaty',
  unHr: 'https://ukraine.ohchr.org/en/Protection-of-Civilians-in-Armed-Conflict-August-2026',
  aljazeeraAi:
    'https://www.aljazeera.com/news/2026/9/24/china-vs-us-who-is-winning-the-ai-race-in-four-charts',
  pennWharton:
    'https://budgetmodel.wharton.upenn.edu/p/2026-08-10-effective-tariff-rates-and-revenues-updated-august-10-2026/',
  faoSofia:
    'https://www.msc.org/media-centre/news-opinion/news/2026/06/19/five-takeaways-from-the-fao-sofia-report-2026',
  mongabay:
    'https://news.mongabay.com/2026/06/amazon-deforestation-alerts-fall-to-lowest-12-month-level-since-2014-show-brazilian-data/',
}

export const worldWeeklySeed: WorldWeekly = {
  week_start: SEED_WEEK_START,
  summary:
    'The world is at its most dangerous in decades. The US–Israel war on Iran has kept the Strait of Hormuz shut or nearly shut for seven months, and the Houthis now hold the Bab al-Mandab coast. Russia’s war on Ukraine has no ceasefire and its drones and sabotage reach NATO soil. A possibly record El Niño is stressing harvests in the same regions already at war, while arms control, the UN and the ICC are weaker than at any time since 1945.',
  scenario_lean: { A: 45, B: 25, C: 20, D: 10 },
  lean_rationale:
    'Both Washington and Tehran pay a high price for the Hormuz stalemate, and a phased deal is being discussed through Qatar, so managed bargaining (A) is most likely. The main risks are an Israeli strike on Iran’s nuclear work (B) and the collapse of the short US–China truces (C).',
}

export const worldReadingsSeed: WorldReading[] = [
  {
    week_start: SEED_WEEK_START,
    force_key: 'us_power',
    tension: 8.0,
    direction: 'flat',
    headline: 'US power is used through pressure, tariffs and force',
    what_changed:
      'The US captured Venezuela’s president in January, pressed Greenland into a defence deal in late September, and sanctions 13 ICC judges and prosecutors. The Supreme Court struck down the emergency tariffs in February, and midterm elections on 3 Nov may change Congress.',
    counterpoint:
      'The Supreme Court limited emergency tariff powers, showing domestic checks still work.',
    indicators: [
      { label: 'Effective US tariff rate', value: 7.1, unit: '%', as_of: '2026-06', source_url: SRC.pennWharton },
      { label: 'US military spending', value: 954, unit: 'US$bn', as_of: '2025', source_url: SRC.sipri },
    ],
    sources: [
      { title: 'Penn Wharton Budget Model — tariffs', url: SRC.pennWharton },
      { title: 'SIPRI — global military spending', url: SRC.sipri },
    ],
  },
  {
    week_start: SEED_WEEK_START,
    force_key: 'us_china',
    tension: 6.0,
    direction: 'flat',
    headline: '“Hostile but hooked”: short truces hold for now',
    what_changed:
      'Xi’s September state visit extended the trade truce by two months. Export controls were “off the table” and a new AI-incident channel was launched. Taiwan detected 176 Chinese aircraft and 242 vessels in August.',
    counterpoint: 'A new US–China channel for reporting AI incidents was created.',
    indicators: [
      { label: 'US tariff on Chinese goods (headline)', value: 36.5, unit: '%', as_of: '2026-09' },
      { label: 'US tariff on Chinese goods (effective)', value: 23, unit: '%', as_of: '2026-09' },
      { label: 'China rare-earth controls expire', value: '10 Nov 2026' },
    ],
    sources: [],
  },
  {
    week_start: SEED_WEEK_START,
    force_key: 'chokepoints_energy',
    tension: 9.0,
    direction: 'flat',
    headline: 'Both Arabian sea gates are shut or threatened',
    what_changed:
      'Hormuz has been shut or nearly shut since March under a US naval blockade of Iran. Iran’s 25 Sept offer to reopen it was rejected, though a phased deal is discussed. The Houthis seized Yemen’s Red Sea coast on 10–12 Sept.',
    counterpoint:
      'IEA countries released 400m barrels of emergency stocks, softening the shock.',
    indicators: [
      { label: 'Brent crude (Sept range)', value: '91–113', unit: 'US$/bbl', as_of: '2026-09', source_url: SRC.iea },
      { label: 'EU gas storage', value: 68, unit: '% full', as_of: '2026-09' },
    ],
    sources: [{ title: 'IEA Oil Market Report, Sept 2026', url: SRC.iea }],
  },
  {
    week_start: SEED_WEEK_START,
    force_key: 'russia_europe',
    tension: 7.0,
    direction: 'flat',
    headline: 'Stuck front, no ceasefire, war creeping into NATO',
    what_changed:
      'Zelensky rejected the US peace plan in September; talks in the UAE are pencilled in for October. ISW sees near-zero Russian gains since March, but civilian deaths are up 55% and Putin signals a winter drone campaign on Ukraine’s grid.',
    counterpoint:
      "Europe’s defence spending rose 14% in 2025; NATO reaffirmed Article 5 in Ankara.",
    indicators: [
      { label: 'Ukraine civilian deaths (Jan–Aug)', value: 2222, as_of: '2026-08', source_url: SRC.unHr },
      { label: 'Russian hybrid incidents vs NATO', value: '200+', as_of: '2026' },
    ],
    sources: [{ title: 'UN Human Rights (HRMMU) — civilian casualties', url: SRC.unHr }],
  },
  {
    week_start: SEED_WEEK_START,
    force_key: 'institutions',
    tension: 8.0,
    direction: 'flat',
    headline: 'The post-1945 rules are at their weakest',
    what_changed:
      'New START expired on 5 Feb with no replacement, the NPT review failed for the third time, the UN budget was cut 15%, and five states are leaving the ICC.',
    counterpoint:
      'The High Seas Treaty entered into force on 16 Jan 2026; Duterte’s ICC trial opens 30 Nov.',
    indicators: [
      { label: 'US arrears to UN', value: '~4', unit: 'US$bn', as_of: '2026' },
      { label: 'Binding US–Russia nuclear limits', value: 0, as_of: '2026', source_url: SRC.newStart },
    ],
    sources: [{ title: 'Arms Control Association — New START expiry', url: SRC.newStart }],
  },
  {
    week_start: SEED_WEEK_START,
    force_key: 'living_planet',
    tension: 8.0,
    direction: 'flat',
    headline: 'Record heat and El Niño hit the regions already at war',
    what_changed:
      'August 2026 tied the hottest month ever measured (+1.65°C). A possibly record El Niño threatens harvests in the Sahel, Horn of Africa, Central America and South/Southeast Asia; 7.8m face acute hunger in South Sudan.',
    counterpoint:
      'Brazil’s Amazon clearing alerts are the lowest since records began in 2014.',
    indicators: [
      { label: 'Global temp anomaly (Aug)', value: 1.65, unit: '°C', as_of: '2026-08', source_url: SRC.copernicus },
      { label: 'Fish stocks overfished', value: 37.6, unit: '%', as_of: '2026', source_url: SRC.faoSofia },
    ],
    sources: [
      { title: 'Copernicus — August 2026 temperatures', url: SRC.copernicus },
      { title: 'FAO SOFIA 2026 — fisheries', url: SRC.faoSofia },
      { title: 'Mongabay — Amazon alerts fall', url: SRC.mongabay },
    ],
  },
  {
    week_start: SEED_WEEK_START,
    force_key: 'identity_religion',
    tension: 6.0,
    direction: 'flat',
    headline: 'Religion rarely starts wars but hardens them',
    what_changed:
      'Jihadist violence in Africa killed 23,872 in a year; Israel’s 27 Oct election is shaped by religious nationalism; India’s voter-roll changes and expulsions target Muslims.',
    counterpoint:
      'Hungary’s new government reversed its ICC exit after Orbán lost in April.',
    indicators: [
      { label: 'Countries with high religious hostility', value: 55, as_of: '2023' },
      { label: 'Christians facing high persecution', value: 388, unit: 'million', as_of: '2026' },
    ],
    sources: [],
  },
  {
    week_start: SEED_WEEK_START,
    force_key: 'ai',
    tension: 6.0,
    direction: 'flat',
    headline: 'AI concentrates power and speeds up every other force',
    what_changed:
      'The US holds ~73% of global AI compute and China ~14%. The US sells capped chips to China for a 25% fee while China mandates domestic chips. Russia reportedly used a fully autonomous attack drone in July; UN talks on autonomous weapons were watered down.',
    counterpoint:
      '76 states back negotiating a binding treaty on autonomous weapons; decision in Nov 2026.',
    indicators: [
      { label: 'US share of global AI compute', value: 73, unit: '%', as_of: '2026', source_url: SRC.aljazeeraAi },
      { label: 'US hyperscaler AI capex', value: '~764', unit: 'US$bn', as_of: '2026' },
      { label: 'Data-centre electricity', value: 485, unit: 'TWh', as_of: '2025' },
    ],
    sources: [{ title: 'Al Jazeera — the US–China AI race', url: SRC.aljazeeraAi }],
  },
  {
    week_start: SEED_WEEK_START,
    force_key: 'money_trade',
    tension: 6.0,
    direction: 'flat',
    headline: 'The dollar rules, but its edges are wearing',
    what_changed:
      'The dollar holds 57% of reserves (vs ~71% in 2000). The Fed raised rates in September to fight oil-driven inflation. €210bn of Russian assets stay frozen; the EU decides again on 15–16 Oct. China’s surplus hit a record $1.2tn in 2025.',
    counterpoint: 'World goods trade proved resilient despite the oil shock (WTO).',
    indicators: [
      { label: 'Dollar share of reserves', value: 57.1, unit: '%', as_of: '2026 Q1', source_url: SRC.imf },
      { label: 'US net interest', value: '>1', unit: 'US$tn/yr', source_url: SRC.cbo },
    ],
    sources: [
      { title: 'IMF COFER — reserve currencies', url: SRC.imf },
      { title: 'CBO — net interest outlook', url: SRC.cbo },
    ],
  },
  {
    week_start: SEED_WEEK_START,
    force_key: 'space_orbit',
    tension: 6.5,
    direction: 'flat',
    headline: 'A crowded orbit with almost no binding rules',
    what_changed:
      'Active satellites have passed ~11,000, with SpaceX’s Starlink alone above 7,000 and tens of thousands more filed. The only broad treaty is the 1967 Outer Space Treaty; there are still no binding global rules on debris, anti-satellite weapons or space-resource mining. The US, China, Russia and India have all destroyed satellites in ASAT tests, and military space commands keep expanding. Two rival Moon blocs are forming — the US-led Artemis Accords versus a China–Russia lunar programme.',
    counterpoint:
      'Over 50 states have signed the Artemis Accords norms and ~37 back a moratorium on destructive ASAT tests — voluntary rules that could harden into law.',
    indicators: [
      { label: 'Active satellites in orbit', value: '~11,000', as_of: '2026', source_url: 'https://www.esa.int/Space_Safety/Space_Debris/Space_debris_by_the_numbers' },
      { label: 'Tracked debris >10 cm', value: '~40,500', as_of: '2025', source_url: 'https://www.esa.int/Space_Safety/Space_Debris/ESA_s_Space_Environment_Report_2025' },
      { label: 'Binding treaties on debris / ASAT / mining', value: 0, as_of: '2026' },
    ],
    sources: [
      { title: 'ESA — space debris by the numbers', url: 'https://www.esa.int/Space_Safety/Space_Debris/Space_debris_by_the_numbers' },
      { title: 'UNOOSA — Outer Space Treaty (1967)', url: 'https://www.unoosa.org/oosa/en/ourwork/spacelaw/treaties/outerspacetreaty.html' },
      { title: 'NASA — Artemis Accords', url: 'https://www.nasa.gov/artemis-accords/' },
    ],
  },
]

export const worldSignpostsSeed: WorldSignpost[] = [
  { event_date: '2026-09-30', date_label: '~30 Sep 2026', title: 'IMF releases mid-2026 reserve-currency data', force_keys: ['money_trade'], what_it_means: 'A further drop in the dollar’s share → C', status: 'upcoming' },
  { event_date: '2026-09-30', date_label: '30 Sep 2026', title: 'UN Security Council vote on Haiti’s Gang Suppression Force', force_keys: ['institutions'], what_it_means: 'Renewal shows the Council still acts where big powers agree → A/D', status: 'upcoming' },
  { event_date: null, date_label: 'Early Oct 2026', title: 'US answer to Iran’s phased Hormuz plan; any Israeli strike', force_keys: ['chokepoints_energy'], what_it_means: 'Deal → A; strike → B', status: 'upcoming' },
  { event_date: null, date_label: 'Oct 2026', title: 'US–Ukraine–Russia talks in the UAE', force_keys: ['russia_europe'], what_it_means: 'Ceasefire framework → A; collapse + winter grid strikes → B/C', status: 'upcoming' },
  { event_date: '2026-10-04', date_label: '4 Oct 2026', title: 'Brazil’s general election', force_keys: ['living_planet', 'money_trade'], what_it_means: 'Shapes Amazon protection and BRICS direction', status: 'upcoming' },
  { event_date: '2026-10-15', date_label: '15–16 Oct 2026', title: 'EU summit on Ukraine financing and frozen Russian assets', force_keys: ['money_trade', 'russia_europe'], what_it_means: 'Confiscation → C; another compromise → A', status: 'upcoming' },
  { event_date: '2026-10-27', date_label: '27 Oct 2026', title: 'Israeli election', force_keys: ['identity_religion', 'chokepoints_energy'], what_it_means: 'Shapes Gaza disarmament, Lebanon talks and new Iran-strike risk', status: 'upcoming' },
  { event_date: '2026-11-03', date_label: '3 Nov 2026', title: 'US midterm elections', force_keys: ['us_power'], what_it_means: 'A new Congress could restrain tariffs and force → D', status: 'upcoming' },
  { event_date: '2026-11-10', date_label: '10 Nov 2026', title: 'China’s suspended rare-earth controls expire (may extend to Jan 2027)', force_keys: ['us_china', 'ai'], what_it_means: 'Extension → A; reimposition → C', status: 'upcoming' },
  { event_date: '2026-11-09', date_label: '9–20 Nov 2026', title: 'COP31 climate summit, Antalya', force_keys: ['living_planet', 'institutions'], what_it_means: 'Real adaptation money → D', status: 'upcoming' },
  { event_date: null, date_label: 'Nov 2026', title: 'UN review conference on autonomous weapons (CCW)', force_keys: ['ai', 'institutions'], what_it_means: 'Negotiating mandate → D; failure = military AI unregulated', status: 'upcoming' },
  { event_date: '2026-11-30', date_label: '30 Nov 2026', title: 'Duterte trial opens at the ICC', force_keys: ['institutions'], what_it_means: 'Shows whether the court still works under US sanctions', status: 'upcoming' },
  { event_date: '2026-12-14', date_label: '14–15 Dec 2026', title: 'G20 summit in Miami (South Africa excluded)', force_keys: ['us_power', 'institutions'], what_it_means: 'Global forum or US-led club?', status: 'upcoming' },
  { event_date: null, date_label: 'Winter 2026–27', title: 'Russian drone campaign on Ukraine’s grid; EU gas levels', force_keys: ['russia_europe', 'chokepoints_energy'], what_it_means: 'Energy stress in Europe; pressure on Kyiv', status: 'upcoming' },
  { event_date: null, date_label: 'Winter 2026–27', title: 'El Niño peak; harvests in Horn of Africa, Sahel, South Asia', force_keys: ['living_planet'], what_it_means: 'Famine or food export bans → B', status: 'upcoming' },
  { event_date: '2027-01-16', date_label: '16 Jan 2027', title: 'Nigeria’s presidential election', force_keys: ['identity_religion'], what_it_means: 'Religious framing and jihadist violence in Africa’s largest country', status: 'upcoming' },
  { event_date: null, date_label: 'Q4 2026', title: 'UN COPUOS talks on orbital-debris & space-traffic rules', force_keys: ['space_orbit', 'institutions'], what_it_means: 'Binding rules → D; a voluntary-only regime leaves orbit ungoverned', status: 'upcoming' },
]
