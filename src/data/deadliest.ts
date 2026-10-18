// The deadliest — power that killed millions. The far end of "below the line":
// when those in power stop feeling the consequences of their actions. Shown for
// remembrance and accountability (NOVA: make consequences visible), not as a
// morbid ranking. Estimates are CONTESTED and vary by source and definition
// (war vs. democide vs. famine vs. colonial policy) — shown as ranges, cited.

export interface Atrocity {
  name: string
  period: string
  toll: string
  note: string
  source: { label: string; url: string }
}

export const ATROCITIES: Atrocity[] = [
  {
    name: 'Colonisation of the Americas',
    period: '1492–1600s',
    toll: 'up to ~56M',
    note: 'Disease, violence and displacement killed most of the Indigenous population within a century.',
    source: { label: 'Koch et al. (UCL)', url: 'https://www.ucl.ac.uk/news/2019/jan/european-colonisation-americas-killed-10-world-population-and-caused-global-cooling' },
  },
  {
    name: 'Mao-era China',
    period: '1949–1976',
    toll: '~40–80M',
    note: 'Mostly the Great Leap Forward famine (1959–61), plus the Cultural Revolution and political campaigns.',
    source: { label: 'Britannica', url: 'https://www.britannica.com/event/Great-Leap-Forward' },
  },
  {
    name: 'World War II',
    period: '1939–1945',
    toll: '~70–85M',
    note: 'The deadliest conflict in history — soldiers and civilians across every continent.',
    source: { label: 'Our World in Data', url: 'https://ourworldindata.org/war-and-peace' },
  },
  {
    name: 'Stalin-era USSR',
    period: '1922–1953',
    toll: '~9–20M',
    note: 'Famines (incl. the Holodomor), the Gulag labour camps and the Great Purge.',
    source: { label: 'Britannica', url: 'https://www.britannica.com/place/Soviet-Union' },
  },
  {
    name: 'The Holocaust (Nazi Germany)',
    period: '1941–1945',
    toll: '~11M (6M Jews)',
    note: 'The industrialised genocide of Europe’s Jews, plus Roma, disabled people and others.',
    source: { label: 'USHMM', url: 'https://encyclopedia.ushmm.org/' },
  },
  {
    name: 'King Leopold II — Congo',
    period: '1885–1908',
    toll: '~1–15M',
    note: 'Forced-labour rubber extraction in the “Congo Free State”, run as his private colony.',
    source: { label: '“King Leopold’s Ghost”', url: 'https://en.wikipedia.org/wiki/Atrocities_in_the_Congo_Free_State' },
  },
  {
    name: 'Transatlantic slave trade',
    period: '1500s–1800s',
    toll: '~12.5M enslaved',
    note: 'Around 2 million died in the Middle Passage alone; generations of lives destroyed.',
    source: { label: 'SlaveVoyages', url: 'https://www.slavevoyages.org/' },
  },
  {
    name: 'Colonial famines (British India)',
    period: '1760s–1940s',
    toll: 'tens of millions',
    note: 'Repeated famines (e.g. Bengal 1943, ~2–3M) worsened by colonial economic policy.',
    source: { label: 'Our World in Data', url: 'https://ourworldindata.org/famines' },
  },
  {
    name: 'Khmer Rouge (Pol Pot)',
    period: '1975–1979',
    toll: '~1.5–2M',
    note: 'Roughly a quarter of Cambodia’s population died through execution, forced labour and starvation.',
    source: { label: 'Britannica', url: 'https://www.britannica.com/topic/Khmer-Rouge' },
  },
]

// ↑ Above the line — the tools humanity built to name it and refuse repetition.
export const ACCOUNTABILITY: { title: string; note: string }[] = [
  { title: 'Genocide Convention (1948)', note: 'Made genocide a crime under international law.' },
  { title: 'International Criminal Court', note: 'Prosecutes genocide, war crimes and crimes against humanity.' },
  { title: 'Truth & reconciliation', note: 'From South Africa to Rwanda — naming the past to heal it.' },
  { title: 'Memory & memorial', note: 'Museums, archives and testimony so it is never forgotten.' },
]

export const DEADLIEST_SOURCES: { label: string; url: string }[] = [
  { label: 'Our World in Data', url: 'https://ourworldindata.org/war-and-peace' },
  { label: 'USHMM', url: 'https://encyclopedia.ushmm.org/' },
  { label: 'Genocide Studies (Yale)', url: 'https://gsp.yale.edu/' },
]
