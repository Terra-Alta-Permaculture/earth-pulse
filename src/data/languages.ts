// Languages & cultures — curated, cited (Ethnologue, UNESCO). The "monocultures
// of the mind" counterpoint: ~7,000 living tongues, most of them endangered.

export const LANG_STATS = {
  total: 7159, // Ethnologue: living languages
  totalNote: 'living languages spoken today',
  endangeredPct: 40, // ~40% endangered
  endangeredNote: 'are endangered — about half may vanish this century',
  deathRate: '~2 weeks', // one language dies roughly every 2 weeks
  deathRateNote: 'is how often, on average, a language falls silent',
  asOf: '2024',
}

// Top languages by total speakers (first + second language), in millions.
export const TOP_LANGUAGES: { name: string; speakersM: number }[] = [
  { name: 'English', speakersM: 1515 },
  { name: 'Mandarin Chinese', speakersM: 1140 },
  { name: 'Hindi', speakersM: 610 },
  { name: 'Spanish', speakersM: 560 },
  { name: 'Arabic', speakersM: 335 },
  { name: 'French', speakersM: 310 },
  { name: 'Bengali', speakersM: 280 },
  { name: 'Portuguese', speakersM: 265 },
  { name: 'Russian', speakersM: 255 },
  { name: 'Urdu', speakersM: 230 },
]

export const LANG_SOURCES: { label: string; url: string }[] = [
  { label: 'Ethnologue', url: 'https://www.ethnologue.com/' },
  { label: 'UNESCO — languages in danger', url: 'https://en.wal.unesco.org/' },
  { label: 'Endangered Languages Project', url: 'https://www.endangeredlanguages.com/' },
]
