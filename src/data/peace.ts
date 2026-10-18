// Peace & nonviolence — the above-the-line answer to war and atrocity. The
// hopeful, evidence-based counterweight: how change is won without violence.
// Curated + cited (Chenoweth & Stephan, Global Peace Index / IEP, Our World in Data).

export const PEACE_STATS = {
  successNonviolent: 53, // % of nonviolent campaigns that succeeded (1900–2006)
  successViolent: 26, // % of violent ones
  successNote: 'of nonviolent campaigns succeed — vs ~26% of violent ones (Chenoweth)',
  tippingPct: 3.5,
  tippingNote: 'of a population, mobilised nonviolently — no campaign that reached it has failed',
  topPeace: 'Iceland',
  topPeaceNote: 'tops the Global Peace Index; most of the world is not at war',
  asOf: '2024',
}

// How peace is actually built.
export const PEACE_METHODS: { title: string; note: string }[] = [
  { title: 'Nonviolent resistance', note: 'Strikes, boycotts and mass refusal — more durable and more successful than arms.' },
  { title: 'Mediation & diplomacy', note: 'Patient negotiation and third-party mediation end most wars, not total victory.' },
  { title: 'Truth & reconciliation', note: 'Facing the past together — from South Africa to Colombia — so peace can hold.' },
  { title: 'Disarmament', note: 'Fewer weapons, demined land, and treaties that pull back from the brink.' },
  { title: 'People-to-people', note: 'Cross-community ties and shared projects that make the “enemy” human again.' },
]

export const PEACE_SOURCES: { label: string; url: string }[] = [
  { label: 'Chenoweth — civil resistance', url: 'https://www.ericachenoweth.com/research' },
  { label: 'Global Peace Index', url: 'https://www.visionofhumanity.org/maps/' },
  { label: 'Our World in Data — war & peace', url: 'https://ourworldindata.org/war-and-peace' },
  { label: 'UN Peacekeeping', url: 'https://peacekeeping.un.org/' },
]
