// Medicine & healing — curated, cited (WHO, Nature/Lancet). Two sides: the
// plural systems of medicine actually practiced worldwide, and the frontier of
// medical innovation. The weekly writer refreshes the "latest breakthrough" line.

export const MED_STATS = {
  traditionalPct: 80, // WHO: share relying on traditional medicine in some regions
  traditionalNote: 'of people in some regions rely on traditional medicine',
  countriesTradMed: 170, // 170+ countries report traditional-medicine use
  countriesNote: 'countries report using traditional medicine',
  naturalDerivedPct: 40, // ~40% of modern drugs derive from natural products
  naturalNote: 'of modern drugs derive from nature’s pharmacy',
  asOf: '2024',
}

// Plural medical systems in practice.
export const MED_SYSTEMS: { name: string; note: string }[] = [
  { name: 'Biomedicine', note: 'The dominant global system — evidence-based, hospital and pharma centred.' },
  { name: 'Traditional Chinese Medicine', note: 'Acupuncture, herbs and Qi; used by hundreds of millions, now WHO-recognised.' },
  { name: 'Ayurveda', note: 'India’s ancient system of balance, diet and herbal medicine.' },
  { name: 'Indigenous & herbal', note: 'Thousands of local healing traditions — the root of much of modern pharmacology.' },
]

// Current frontiers (writer may refresh the headline innovation).
export const MED_INNOVATIONS: { name: string; note: string }[] = [
  { name: 'mRNA platform', note: 'From COVID vaccines to cancer and personalised therapeutics.' },
  { name: 'CRISPR gene editing', note: 'First approved gene-editing therapy (sickle-cell) — rewriting disease at the source.' },
  { name: 'GLP-1 drugs', note: 'Ozempic/Wegovy-class medicines reshaping obesity, diabetes and more.' },
  { name: 'AI in medicine', note: 'Faster diagnosis, drug discovery and protein design (AlphaFold).' },
]

export const MED_SOURCES: { label: string; url: string }[] = [
  { label: 'WHO — Traditional Medicine', url: 'https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine' },
  { label: 'WHO Global TM Centre', url: 'https://www.who.int/initiatives/who-global-traditional-medicine-centre' },
  { label: 'Nature Medicine', url: 'https://www.nature.com/nm/' },
]
