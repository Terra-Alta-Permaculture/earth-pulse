// Curated map layers for the "Above & below the line — mapped" section.
// Below the line: the nine World Pulse forces placed at a representative
// location (illustrative hotspots, not precise points). Above the line: real,
// citable places building a better world — ecovillages, Doughnut cities,
// regenerative networks and Rights-of-Nature wins.

export interface MapMarker {
  lat: number
  lon: number
  title: string
  note: string
  kind: string
}

// ── Below the line — the 9 forces, as geographic hotspots ──
export const FORCE_MARKERS: MapMarker[] = [
  { lat: 38.9, lon: -77.0, title: 'US power', note: 'Tariffs, force, alliance pressure', kind: 'force' },
  { lat: 24.5, lon: 119.5, title: 'US–China rivalry', note: 'Taiwan Strait, chips & minerals', kind: 'force' },
  { lat: 26.6, lon: 56.3, title: 'Chokepoints & energy', note: 'Strait of Hormuz', kind: 'force' },
  { lat: 49.0, lon: 32.0, title: "Russia's war & Europe", note: 'Ukraine front', kind: 'force' },
  { lat: 52.08, lon: 4.31, title: 'Rules & institutions', note: 'The Hague — ICC / ICJ', kind: 'force' },
  { lat: -3.5, lon: -62.0, title: 'Living planet & resources', note: 'The Amazon', kind: 'force' },
  { lat: 31.78, lon: 35.22, title: 'Identity & religion', note: 'Jerusalem & the wider region', kind: 'force' },
  { lat: 37.4, lon: -122.1, title: 'Artificial intelligence', note: 'Compute concentration', kind: 'force' },
  { lat: 28.4, lon: -80.6, title: 'Space race & orbit', note: 'Launch & satellite build-up', kind: 'force' },
]

// ── Above the line — real places healing the world ──
export type RegenKind = 'ecovillage' | 'doughnut' | 'network' | 'rights'

export const REGEN_HUBS: (MapMarker & { kind: RegenKind; url?: string })[] = [
  // Terra Alta — home
  { lat: 38.8, lon: -9.38, title: 'Terra Alta', note: 'Permaculture & Escola da Terra, Sintra — home of EarthPulse', kind: 'ecovillage', url: 'https://terralta.org' },

  // Ecovillages & intentional communities
  { lat: 57.66, lon: -3.6, title: 'Findhorn', note: 'Pioneering ecovillage, Scotland', kind: 'ecovillage', url: 'https://www.findhorn.org' },
  { lat: 37.72, lon: -8.53, title: 'Tamera', note: 'Peace research village, Portugal', kind: 'ecovillage', url: 'https://www.tamera.org' },
  { lat: 12.0, lon: 79.81, title: 'Auroville', note: 'Experimental township, India', kind: 'ecovillage', url: 'https://auroville.org' },
  { lat: 45.42, lon: 7.7, title: 'Damanhur', note: 'Eco-society, Italy', kind: 'ecovillage', url: 'https://damanhur.org' },
  { lat: 52.6, lon: 11.16, title: 'Sieben Linden', note: 'Low-carbon ecovillage, Germany', kind: 'ecovillage', url: 'https://siebenlinden.org' },
  { lat: -26.8, lon: 152.87, title: 'Crystal Waters', note: 'Permaculture village, Australia', kind: 'ecovillage', url: 'https://crystalwaters.org.au' },

  // Doughnut Economics cities (DEAL)
  { lat: 52.37, lon: 4.9, title: 'Amsterdam', note: 'First city to adopt the Doughnut (DEAL)', kind: 'doughnut', url: 'https://doughnuteconomics.org/stories/amsterdam-city-doughnut' },
  { lat: 50.85, lon: 4.35, title: 'Brussels', note: 'Doughnut city, Belgium', kind: 'doughnut', url: 'https://doughnuteconomics.org' },
  { lat: 55.68, lon: 12.57, title: 'Copenhagen', note: 'Doughnut-aligned city, Denmark', kind: 'doughnut', url: 'https://doughnuteconomics.org' },
  { lat: 45.52, lon: -122.68, title: 'Portland', note: 'Doughnut city, USA', kind: 'doughnut', url: 'https://doughnuteconomics.org' },

  // Regenerative networks & cooperative economies
  { lat: 43.06, lon: -2.51, title: 'Mondragón', note: '80,000 worker-owners, Basque Country', kind: 'network', url: 'https://www.mondragon-corporation.com/en/' },
  { lat: 30.32, lon: 78.03, title: 'Navdanya', note: "Vandana Shiva's seed banks, India", kind: 'network', url: 'https://www.navdanya.org' },
  { lat: 16.73, lon: -92.63, title: 'Zapatista communities', note: 'Self-governing, Chiapas, Mexico', kind: 'network', url: 'https://enlacezapatista.ezln.org.mx' },
  { lat: 36.9, lon: 40.0, title: 'Rojava', note: 'Make Rojava Green Again, NE Syria', kind: 'network', url: 'https://makerojavagreenagain.org' },
  { lat: 30.4, lon: 31.4, title: 'SEKEM', note: 'Biodynamic desert farming, Egypt', kind: 'network', url: 'https://www.sekem.com' },
  { lat: 50.43, lon: -3.69, title: 'Totnes', note: 'First Transition Town, England', kind: 'network', url: 'https://www.transitiontowntotnes.org' },
  { lat: -28.6, lon: 153.32, title: 'Permaculture Research Institute', note: 'Zaytuna Farm, Australia', kind: 'network', url: 'https://www.permaculturenews.org' },
  { lat: 53.8, lon: -1.55, title: 'Permaculture Association', note: 'Britain', kind: 'network', url: 'https://www.permaculture.org.uk' },

  // Rights of Nature wins
  { lat: -39.93, lon: 175.05, title: 'Whanganui River', note: 'Legal personhood, New Zealand', kind: 'rights', url: 'https://en.wikipedia.org/wiki/Te_Awa_Tupua_(Whanganui_River_Claims_Settlement)_Act_2017' },
  { lat: 37.7, lon: -0.8, title: 'Mar Menor', note: "Europe's first ecosystem with rights, Spain", kind: 'rights', url: 'https://en.wikipedia.org/wiki/Mar_Menor' },
  { lat: 5.69, lon: -76.66, title: 'Atrato River', note: 'Granted legal rights, Colombia', kind: 'rights', url: 'https://en.wikipedia.org/wiki/Atrato_River' },
  { lat: -0.18, lon: -78.47, title: 'Ecuador', note: 'Rights of Nature in the constitution', kind: 'rights', url: 'https://www.garn.org' },
]

// The real, maintained directories — EarthPulse points outward rather than
// trying to become one of these.
export const REGEN_DIRECTORIES: { label: string; url: string }[] = [
  { label: 'Global Ecovillage Network', url: 'https://ecovillage.org/projects/map/' },
  { label: 'Transition Network', url: 'https://transitionnetwork.org/transition-near-me/' },
  { label: 'Doughnut (DEAL)', url: 'https://doughnuteconomics.org/communities' },
  { label: 'Permaculture Global', url: 'https://permacultureglobal.org/projects' },
]

export const REGEN_LEGEND: { kind: RegenKind; label: string; color: string }[] = [
  { kind: 'ecovillage', label: 'Ecovillages', color: '#6fae57' },
  { kind: 'doughnut', label: 'Doughnut cities', color: '#7ac7d4' },
  { kind: 'network', label: 'Regen networks', color: '#9bcf6a' },
  { kind: 'rights', label: 'Rights of Nature', color: '#4fae8c' },
]

export const REGEN_COLOR: Record<RegenKind, string> = {
  ecovillage: '#6fae57',
  doughnut: '#7ac7d4',
  network: '#9bcf6a',
  rights: '#4fae8c',
}
