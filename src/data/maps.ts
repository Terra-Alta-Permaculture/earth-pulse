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

// ── Below the line — the 12 World Pulse forces, as geographic hotspots ──
export const FORCE_MARKERS: MapMarker[] = [
  { lat: 38.9, lon: -77.0, title: 'US power', note: 'Tariffs, force, alliance pressure', kind: 'force' },
  { lat: 24.5, lon: 119.5, title: 'US–China rivalry', note: 'Taiwan Strait, chips & minerals', kind: 'force' },
  { lat: 26.6, lon: 56.3, title: 'Chokepoints & energy', note: 'Strait of Hormuz', kind: 'force' },
  { lat: 49.0, lon: 32.0, title: "Russia's war & Europe", note: 'Ukraine front', kind: 'force' },
  { lat: 52.08, lon: 4.31, title: 'Rules & institutions', note: 'The Hague — ICC / ICJ', kind: 'force' },
  { lat: -6.0, lon: -53.0, title: 'Living planet & resources', note: 'Amazon & the global commons', kind: 'force' },
  { lat: 33.9, lon: 35.5, title: 'Identity & religion', note: 'Sectarian & nationalist mobilisation', kind: 'force' },
  { lat: 37.4, lon: -122.1, title: 'Artificial intelligence', note: 'Compute concentration', kind: 'force' },
  { lat: 28.4, lon: -80.6, title: 'Space race & orbit', note: 'Launch & satellite build-up', kind: 'force' },
  { lat: 31.5, lon: 34.47, title: 'Israel, the US & the world', note: 'Gaza & regional escalation', kind: 'force' },
  { lat: 46.8, lon: 9.83, title: 'The ruling elites', note: 'Concentrated wealth & power (Davos)', kind: 'force' },
  { lat: 40.7, lon: -74.0, title: 'Money, trade & sanctions', note: 'Dollar, debt & global finance', kind: 'force' },
]

// ── Below the line — curated degradation & extraction sites ──
export type DegradeKind = 'deforestation' | 'mining' | 'fossil' | 'pollution' | 'conflict'

export const DEGRADATION_SITES: (MapMarker & { kind: DegradeKind })[] = [
  // Deforestation fronts
  { lat: -3.5, lon: -62.0, title: 'Amazon', note: 'Largest deforestation front, Brazil', kind: 'deforestation' },
  { lat: -1.0, lon: 23.0, title: 'Congo Basin', note: 'Rainforest loss, DRC', kind: 'deforestation' },
  { lat: 0.5, lon: 114.0, title: 'Borneo', note: 'Palm-oil clearing, Indonesia', kind: 'deforestation' },
  { lat: -15.0, lon: -48.0, title: 'Cerrado', note: 'Savanna cleared for soy, Brazil', kind: 'deforestation' },
  { lat: -22.0, lon: -60.0, title: 'Gran Chaco', note: 'Fastest-clearing dry forest, Paraguay', kind: 'deforestation' },
  { lat: 18.0, lon: 104.0, title: 'Mekong forests', note: 'Logging & plantations, Laos', kind: 'deforestation' },
  // Mining & mineral extraction
  { lat: 10.0, lon: -140.0, title: 'Clarion–Clipperton Zone', note: 'Deep-sea mining frontier, Pacific', kind: 'mining' },
  { lat: -23.0, lon: -68.0, title: 'Lithium Triangle', note: 'Water-intensive lithium, Atacama', kind: 'mining' },
  { lat: -10.7, lon: 25.5, title: 'Katanga cobalt belt', note: 'Cobalt & copper mining, DRC', kind: 'mining' },
  { lat: -6.0, lon: -50.3, title: 'Carajás', note: "World's largest iron mine, Brazil", kind: 'mining' },
  { lat: 11.1, lon: -72.6, title: 'Cerrejón', note: 'Vast open-pit coal mine, Colombia', kind: 'mining' },
  // Fossil-fuel megaprojects
  { lat: 31.9, lon: -102.3, title: 'Permian Basin', note: 'Oil & gas super-basin, USA', kind: 'fossil' },
  { lat: 57.0, lon: -111.5, title: 'Athabasca tar sands', note: 'Carbon-heavy oil, Canada', kind: 'fossil' },
  { lat: 25.4, lon: 49.3, title: 'Ghawar', note: "World's largest oil field, Saudi Arabia", kind: 'fossil' },
  { lat: 70.0, lon: 68.0, title: 'Yamal', note: 'Arctic gas megaproject, Russia', kind: 'fossil' },
  { lat: -32.5, lon: 151.0, title: 'Hunter Valley', note: 'Coal export heartland, Australia', kind: 'fossil' },
  // Pollution & footprint
  { lat: 28.6, lon: 77.2, title: 'Delhi', note: "Among the world's worst air, India", kind: 'pollution' },
  { lat: 5.0, lon: 6.3, title: 'Niger Delta', note: 'Chronic oil spills, Nigeria', kind: 'pollution' },
  { lat: 32.0, lon: -145.0, title: 'Great Pacific Garbage Patch', note: 'Ocean plastic accumulation', kind: 'pollution' },
  { lat: 39.0, lon: -77.5, title: 'Data Center Alley', note: 'Energy-hungry data centres, N. Virginia', kind: 'pollution' },
  // Conflict & war pollution
  { lat: 49.0, lon: 36.0, title: 'Ukraine', note: 'War emissions & environmental damage', kind: 'conflict' },
  { lat: 15.5, lon: 32.5, title: 'Sudan', note: 'Conflict & displacement', kind: 'conflict' },
  { lat: -1.6, lon: 29.0, title: 'Eastern DRC', note: 'Resource-fuelled conflict', kind: 'conflict' },
]

export const DEGRADE_COLOR: Record<DegradeKind, string> = {
  deforestation: '#e0a852',
  mining: '#c87f3a',
  fossil: '#9b6b3f',
  pollution: '#8f9a5a',
  conflict: '#d4503f',
}

export const DEGRADE_LEGEND: { kind: DegradeKind; label: string }[] = [
  { kind: 'deforestation', label: 'Deforestation' },
  { kind: 'mining', label: 'Mining' },
  { kind: 'fossil', label: 'Fossil fuels' },
  { kind: 'pollution', label: 'Pollution & waste' },
  { kind: 'conflict', label: 'Conflict' },
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

  // ── More ecovillages & communities ──
  { lat: 35.6, lon: -87.3, title: 'The Farm', note: 'Historic intentional community, Tennessee', kind: 'ecovillage', url: 'https://thefarmcommunity.com' },
  { lat: 42.45, lon: -76.5, title: 'EcoVillage Ithaca', note: 'Cohousing & regenerative living, USA', kind: 'ecovillage', url: 'https://ecovillageithaca.org' },
  { lat: 35.43, lon: -82.33, title: 'Earthaven', note: 'Off-grid ecovillage, North Carolina', kind: 'ecovillage', url: 'https://www.earthaven.org' },
  { lat: 40.2, lon: -92.1, title: 'Dancing Rabbit', note: 'Low-footprint ecovillage, Missouri', kind: 'ecovillage' },
  { lat: 52.9, lon: -8.02, title: 'Cloughjordan', note: 'Ecovillage, Ireland', kind: 'ecovillage', url: 'https://www.thevillage.ie' },
  { lat: 42.78, lon: -1.4, title: 'Lakabe', note: 'Reclaimed mountain village, Spain', kind: 'ecovillage' },
  { lat: 52.03, lon: 12.9, title: 'ZEGG', note: 'Community & research, Germany', kind: 'ecovillage', url: 'https://www.zegg.de' },
  { lat: 55.72, lon: 11.9, title: 'Svanholm', note: 'Collective & organic farm, Denmark', kind: 'ecovillage' },
  { lat: 35.3, lon: 138.7, title: 'Konohana Family', note: 'Farming community, Japan', kind: 'ecovillage' },
  { lat: 18.92, lon: -99.23, title: 'Huehuecóyotl', note: 'Veteran ecovillage, Mexico', kind: 'ecovillage' },
  { lat: -33.42, lon: 151.33, title: 'Narara', note: 'Ecovillage, Australia', kind: 'ecovillage', url: 'https://nararaecovillage.com' },

  // ── More Doughnut / thriving cities ──
  { lat: 41.39, lon: 2.17, title: 'Barcelona', note: 'Doughnut-aligned city, Spain', kind: 'doughnut' },
  { lat: -37.81, lon: 144.96, title: 'Melbourne', note: 'Doughnut city, Australia', kind: 'doughnut' },
  { lat: 55.86, lon: -4.25, title: 'Glasgow', note: 'Doughnut-aligned city, Scotland', kind: 'doughnut' },
  { lat: 45.19, lon: 5.72, title: 'Grenoble', note: 'Doughnut city, France', kind: 'doughnut' },
  { lat: 49.16, lon: -123.94, title: 'Nanaimo', note: 'Council-adopted Doughnut, Canada', kind: 'doughnut' },
  { lat: 9.93, lon: -84.08, title: 'Costa Rica', note: 'National Doughnut exploration', kind: 'doughnut' },

  // ── More regenerative networks & projects ──
  { lat: 37.0, lon: 109.0, title: 'Loess Plateau', note: 'Vast ecosystem restoration, China', kind: 'network' },
  { lat: 14.5, lon: 0.0, title: 'Great Green Wall', note: 'Sahel reforestation belt, Africa', kind: 'network', url: 'https://www.greatgreenwall.org' },
  { lat: -18.6, lon: 27.5, title: 'Africa Centre (Savory)', note: 'Holistic grazing, Zimbabwe', kind: 'network', url: 'https://savory.global' },
  { lat: 6.5, lon: 2.6, title: 'Songhaï Centre', note: 'Regenerative farming training, Benin', kind: 'network', url: 'https://www.songhai.org' },
  { lat: 26.0, lon: 74.9, title: 'Barefoot College', note: 'Rural solar & education, India', kind: 'network', url: 'https://www.barefootcollege.org' },
  { lat: 12.0, lon: 79.81, title: 'Sadhana Forest', note: 'Reforestation & water, India', kind: 'network', url: 'https://sadhanaforest.org' },
  { lat: 23.1, lon: -82.4, title: 'Havana organopónicos', note: 'Urban agroecology, Cuba', kind: 'network' },
  { lat: 42.36, lon: -83.1, title: 'Detroit urban farms', note: 'Community food growing, USA', kind: 'network' },
  { lat: 53.71, lon: -2.1, title: 'Incredible Edible', note: 'Community food movement, Todmorden UK', kind: 'network', url: 'https://www.incredibleedible.org.uk' },
  { lat: 4.56, lon: -71.3, title: 'Gaviotas', note: 'Reforested savanna village, Colombia', kind: 'network' },
  { lat: -17.83, lon: 31.05, title: 'La Via Campesina', note: 'Global peasant movement — 200M+ families for food sovereignty & agroecology', kind: 'network', url: 'https://viacampesina.org/en/' },

  // ── More Rights of Nature wins ──
  { lat: 23.7, lon: 90.4, title: 'Bangladesh rivers', note: 'All rivers given legal rights (2019)', kind: 'rights' },
  { lat: 51.3, lon: -64.5, title: 'Magpie River', note: 'Legal personhood, Québec (2021)', kind: 'rights' },
  { lat: 41.5, lon: -124.0, title: 'Klamath River', note: 'Rights recognised by Yurok Tribe, USA', kind: 'rights' },
  { lat: 25.3, lon: 83.0, title: 'Ganga & Yamuna', note: 'Rivers granted rights, India (2017)', kind: 'rights' },
  { lat: 19.43, lon: -99.13, title: 'Mexico City', note: 'Rights of Nature in its constitution', kind: 'rights' },
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
