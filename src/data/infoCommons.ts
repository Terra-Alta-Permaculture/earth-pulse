// The information commons — the health of our shared, evidence-based reality.
// Disinformation is a below-the-line force: it concentrates power through
// manipulation and HIDES consequences (the opposite of NOVA's "make
// consequences visible"). EarthPulse's stance: defend a shared reality.
//
// CREDIBILITY RULE: never present a false claim neutrally. Every narrative is
// shown debunk-first (claim → clearly FALSE → the reality → the technique →
// a reputable fact-check), the inoculation / "prebunking" approach. Curated +
// cited; politically neutral — judged by evidence vs. manipulation, not left/right.

export const INFO_STATS = {
  trustPct: 40, // Reuters Institute: ~40% trust most news most of the time
  trustNote: 'of people trust the news most of the time (and falling)',
  disinfoCountries: 80, // Oxford Internet Institute: 80+ countries ran disinfo ops
  disinfoNote: 'countries where governments or parties have run disinformation campaigns',
  deepfakeNote: 'AI-generated deepfakes and “slop” are surging, making real and fake harder to tell apart.',
  asOf: '2024–25',
}

// The recurring manipulation toolkit (based on the FLICC framework).
export const TECHNIQUES: { name: string; note: string }[] = [
  { name: 'Fake experts', note: 'A few fringe voices dressed up to rival an overwhelming consensus.' },
  { name: 'Cherry-picking', note: 'A single cold day, one outlier study — the rest ignored.' },
  { name: 'Conspiratorial logic', note: 'Unfalsifiable: any evidence against it is “part of the plot.”' },
  { name: 'Flooding & bots', note: 'Manufactured consensus — drowning truth in volume.' },
  { name: 'Deepfakes & AI', note: 'Fabricated images, audio and video that look real.' },
  { name: 'Emotional hijack', note: 'Fear and outrage travel faster than careful truth.' },
]

export interface Narrative {
  claim: string
  reality: string
  technique: string
  source: { label: string; url: string }
}

// The most consequential false narratives circulating — each DEBUNKED. The
// weekly writer can add what's newly surging; these are the durable ones.
export const NARRATIVES: Narrative[] = [
  {
    claim: 'Climate change is a hoax or isn’t human-caused.',
    reality: 'The evidence is overwhelming and the scientific consensus is ~97–99%: human emissions are the dominant cause (IPCC). EarthPulse’s own live CO₂ and temperature data show it.',
    technique: 'Fake experts + cherry-picking',
    source: { label: 'Science Feedback', url: 'https://science.feedback.org/' },
  },
  {
    claim: 'Vaccines cause autism / are secretly dangerous.',
    reality: 'Vaccines are among the most studied, safest medicines and have saved an estimated 150M+ lives. The autism link came from a single retracted, fraudulent 1998 paper.',
    technique: 'Fabricated research + fear',
    source: { label: 'WHO', url: 'https://www.who.int/news-room/questions-and-answers/item/vaccines-and-immunization-myths-and-misconceptions' },
  },
  {
    claim: 'The election was stolen (rigged-vote claims).',
    reality: 'Repeated audits, recounts and dozens of courts across countries have found no evidence of fraud that could change results.',
    technique: 'Unfalsifiable claims + flooding',
    source: { label: 'Reuters Fact Check', url: 'https://www.reuters.com/fact-check/' },
  },
  {
    claim: 'The “Great Replacement” — elites are engineering demographic change.',
    reality: 'A debunked white-nationalist conspiracy theory with no factual basis; it has been cited to justify terror attacks.',
    technique: 'Scapegoating + conspiratorial logic',
    source: { label: 'ADL', url: 'https://www.adl.org/resources/backgrounder/great-replacement-conspiracy-theory' },
  },
  {
    claim: 'The “Great Reset” / 15-minute cities are a plot for control.',
    reality: 'Misrepresents an economic-forum theme and a basic urban-planning idea (shops and services within a short walk) as authoritarian schemes.',
    technique: 'Catastrophising + guilt by association',
    source: { label: 'Full Fact', url: 'https://fullfact.org/' },
  },
  {
    claim: '5G causes illness or spread COVID.',
    reality: 'No credible evidence. 5G uses low-energy, non-ionising radio waves within international safety limits; viruses don’t travel on radio signals.',
    technique: 'Fear of new tech + false correlation',
    source: { label: 'AFP Fact Check', url: 'https://factcheck.afp.com/' },
  },
  {
    claim: 'Secret “globalist” figures control world events (Soros, etc.).',
    reality: 'Recycles centuries-old antisemitic tropes, blaming a hidden group for complex events. No evidence; real harm.',
    technique: 'Scapegoating a group',
    source: { label: 'ADL', url: 'https://www.adl.org/' },
  },
]

// ↑ Above the line — the defenders of a shared reality.
export const DEFENDERS: { title: string; note: string }[] = [
  { title: 'Independent fact-checkers', note: 'A global network (IFCN) that verifies claims against evidence.' },
  { title: 'Prebunking', note: 'Teaching the manipulation tricks in advance “inoculates” people (Jigsaw, Cambridge).' },
  { title: 'Media literacy', note: 'Learning to read sources critically — UNESCO’s global push.' },
  { title: 'Content provenance', note: 'Signing images & video at the source (C2PA / Content Credentials).' },
]

export const INFO_SOURCES: { label: string; url: string }[] = [
  { label: 'Reuters Institute (DNR)', url: 'https://reutersinstitute.politics.ox.ac.uk/digital-news-report' },
  { label: 'EU vs Disinfo', url: 'https://euvsdisinfo.eu/' },
  { label: 'IFCN / Poynter', url: 'https://www.poynter.org/ifcn/' },
  { label: 'Science Feedback', url: 'https://science.feedback.org/' },
  { label: 'Edelman Trust Barometer', url: 'https://www.edelman.com/trust/trust-barometer' },
]
