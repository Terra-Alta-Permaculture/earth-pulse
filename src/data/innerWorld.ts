// The inner world — wellbeing, mental health & meaning. The missing half of the
// map: EarthPulse tracks the outer world exhaustively, but NOVA's diagnosis is
// that we are "technically brilliant and humanly impoverished." Curated + cited
// (WHO, World Happiness Report, Our World in Data, Gallup).

export const INNER_STATS = {
  mentalHealth: '1 in 8',
  mentalHealthNote: 'people live with a mental-health condition (~970M) — WHO',
  loneliness: '1 in 4',
  lonelinessNote: 'adults feel lonely — the WHO now calls it a global health threat',
  costTrillion: 1, // ~$1T/yr lost to depression & anxiety
  costNote: 'trillion dollars a year lost to depression & anxiety (WHO)',
  asOf: '2024',
}

// ↓ The strains on the inner life.
export const INNER_STRAINS: { title: string; note: string }[] = [
  { title: 'The loneliness epidemic', note: 'Chronic loneliness is linked to mortality comparable to smoking ~15 cigarettes a day.' },
  { title: 'Youth in crisis', note: 'Anxiety and depression are rising sharply among young people; in the rich world the young are now the least happy.' },
  { title: 'Burnout & the meaning crisis', note: 'Overwork, status anxiety and a loss of shared purpose — brilliance without belonging.' },
  { title: 'Attention under siege', note: 'Feeds engineered to capture us leave minds restless and distracted.' },
]

// ↑ What actually helps (the evidence is clear).
export const INNER_HELPS: { title: string; note: string }[] = [
  { title: 'Real connection', note: 'Close relationships and community are the strongest predictor of a good life (Harvard 85-yr study).' },
  { title: 'Time in nature', note: 'Even brief time outdoors measurably lowers stress and lifts mood.' },
  { title: 'Purpose & service', note: 'Meaning and contributing to others protect wellbeing more than comfort does.' },
  { title: 'Less feed, more life', note: 'Reclaiming attention from the scroll — presence over performance.' },
]

export const INNER_SOURCES: { label: string; url: string }[] = [
  { label: 'WHO — Mental health', url: 'https://www.who.int/health-topics/mental-health' },
  { label: 'WHO — Social connection', url: 'https://www.who.int/groups/commission-on-social-connection' },
  { label: 'World Happiness Report', url: 'https://worldhappiness.report/' },
  { label: 'Our World in Data', url: 'https://ourworldindata.org/mental-health' },
]
