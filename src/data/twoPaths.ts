// Two paths for technology — the fork in how we build the future, read through
// NOVA's Vertical Politics. Biomimicry (↑ above) learns from and works WITH
// nature; transhumanism (↓ below, with nuance) seeks to transcend and
// re-engineer nature and the human. Curated + cited.

export interface Example {
  name: string
  note: string
}

// ↑ Biomimicry — nature as model, measure and mentor (Janine Benyus).
export const BIOMIMICRY: Example[] = [
  { name: 'Velcro', note: 'Copied from the tiny hooks of burdock burrs.' },
  { name: 'Bullet-train nose', note: 'Shaped like a kingfisher’s beak to cut noise and drag.' },
  { name: 'Passive cooling', note: 'Buildings cooled like termite mounds — almost no energy.' },
  { name: 'Mycelium & algae materials', note: 'Packaging, leather and bricks grown, not extracted.' },
  { name: 'Artificial photosynthesis', note: 'Turning sunlight, water and CO₂ into fuel, like a leaf.' },
  { name: 'Whale-fin turbine blades', note: 'Bumps from humpback fins make blades quieter and more efficient.' },
]

// ↓ Transhumanism — transcend and re-engineer the human. Real healing uses,
// real risks of concentration and the domination of biology.
export const TRANSHUMANISM: Example[] = [
  { name: 'Gene enhancement', note: 'CRISPR beyond curing disease — editing traits, “designer” genomes.' },
  { name: 'Brain–computer interfaces', note: 'Implants linking mind and machine (restorative — and beyond).' },
  { name: 'Radical longevity', note: 'Trying to slow, stop or reverse ageing itself.' },
  { name: 'Human–AI merger', note: 'Augmenting cognition with AI — and the dream of “uploading” minds.' },
]

export const TWOPATHS_SOURCES: { label: string; url: string }[] = [
  { label: 'Biomimicry Institute', url: 'https://biomimicry.org/' },
  { label: 'AskNature', url: 'https://asknature.org/' },
  { label: 'MIT Technology Review', url: 'https://www.technologyreview.com/' },
]
