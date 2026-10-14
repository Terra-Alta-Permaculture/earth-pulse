// Faiths & beliefs — curated, cited (Pew Research). Global shares of the world's
// religions, plus how belief is shifting and where it shapes geopolitics.

export const FAITH_SHARES: { name: string; pct: number; color: string }[] = [
  { name: 'Christianity', pct: 31.1, color: '#5fa8d3' },
  { name: 'Islam', pct: 24.9, color: '#6fae57' },
  { name: 'Unaffiliated', pct: 15.6, color: '#8a8f86' },
  { name: 'Hinduism', pct: 15.2, color: '#e0a852' },
  { name: 'Buddhism', pct: 6.6, color: '#c98b6b' },
  { name: 'Folk & other', pct: 6.4, color: '#9a7bbf' },
  { name: 'Judaism', pct: 0.2, color: '#d9604a' },
]

export const FAITH_STATS = {
  religiousPct: 84, // ~84% of people identify with a religion
  religiousNote: 'of people identify with a religion',
  fastestGrowing: 'Islam',
  fastestNote: 'is the fastest-growing — projected to near-equal Christianity by 2050',
  restrictionsNote: 'Government restrictions on religion are at their highest since Pew began tracking — and faith still shapes conflict, law and identity worldwide.',
  asOf: '2024',
}

export const FAITH_SOURCES: { label: string; url: string }[] = [
  { label: 'Pew — Global Religious Landscape', url: 'https://www.pewresearch.org/religion/' },
  { label: 'Pew — Religious Restrictions', url: 'https://www.pewresearch.org/religion/topics/restrictions-on-religion/' },
  { label: 'ARDA', url: 'https://www.thearda.com/' },
]
