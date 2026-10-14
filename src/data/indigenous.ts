// Indigenous peoples — curated, cited. The flagship of the "diversity of being
// human" block: ~476M people stewarding most of the planet's biodiversity, and
// the rights & losses that go with it. No live API — figures from the UN, IWGIA,
// Survival International, Global Witness.

export const INDIG_STATS = {
  peopleM: 476, // million (ILO / UN)
  peopleMNote: 'million Indigenous people — ~6% of humanity',
  countries: 90, // present in ~90 countries
  countriesNote: 'countries they live in, ~5,000 distinct peoples',
  biodiversityPct: 80, // steward ~80% of remaining biodiversity
  biodiversityNote: 'of Earth’s remaining biodiversity is on their lands',
  asOf: '2024',
}

export const INDIG_RIGHTS: { title: string; note: string }[] = [
  { title: 'UNDRIP (2007)', note: 'The UN Declaration on the Rights of Indigenous Peoples — self-determination, land, culture. Not binding, but a global standard.' },
  { title: 'Free, Prior & Informed Consent', note: 'The right to say yes or no to projects on their territories — often ignored in practice.' },
  { title: 'ILO Convention 169', note: 'The one binding treaty on Indigenous rights — ratified by only ~24 countries.' },
  { title: 'Land defenders killed', note: 'Around 200 environmental & land defenders are murdered each year — a large share Indigenous (Global Witness).' },
]

// Notable peoples / regions — markers for the map (lon, lat approximate homeland).
export const INDIG_PEOPLES: { name: string; place: string; lon: number; lat: number; note: string }[] = [
  { name: 'Yanomami', place: 'Amazon (Brazil/Venezuela)', lon: -63.5, lat: 2.0, note: 'Largest relatively isolated people in the Amazon; besieged by illegal gold mining.' },
  { name: 'Kayapó', place: 'Brazilian Amazon', lon: -52.0, lat: -8.0, note: 'Guardians of a vast rainforest territory; long resistance to dams and logging.' },
  { name: 'Guarani', place: 'Brazil/Paraguay', lon: -55.0, lat: -24.0, note: 'One of South America’s largest peoples; acute land conflict and displacement.' },
  { name: 'Quechua & Aymara', place: 'Andes (Peru/Bolivia)', lon: -70.0, lat: -15.0, note: 'Millions of highland people; keepers of potato and crop diversity.' },
  { name: 'Mapuche', place: 'Chile/Argentina', lon: -72.0, lat: -38.0, note: 'Long struggle for ancestral land and autonomy in the southern cone.' },
  { name: 'Maya', place: 'Mesoamerica', lon: -90.0, lat: 16.0, note: 'Millions across Guatemala and Mexico; a living civilisation and language family.' },
  { name: 'Navajo (Diné)', place: 'US Southwest', lon: -110.0, lat: 36.2, note: 'Largest federally recognised tribe in the US; sovereignty and water rights.' },
  { name: 'Inuit', place: 'Arctic (Greenland/Canada)', lon: -42.0, lat: 72.0, note: 'Arctic peoples on the front line of a warming, melting north.' },
  { name: 'Sámi', place: 'Nordic Arctic', lon: 25.0, lat: 68.5, note: 'Europe’s only recognised Indigenous people; reindeer herding vs. mining & wind farms.' },
  { name: 'Maasai', place: 'Kenya/Tanzania', lon: 36.0, lat: -2.5, note: 'Pastoralists facing eviction from ancestral lands for conservation and tourism.' },
  { name: 'San', place: 'Southern Africa', lon: 21.0, lat: -22.0, note: 'Among the oldest continuous cultures on Earth; land and hunting rights under pressure.' },
  { name: 'Adivasi', place: 'India', lon: 82.0, lat: 22.0, note: '~100 million people across hundreds of tribes; displaced by mining and dams.' },
  { name: 'Papuans', place: 'New Guinea / West Papua', lon: 140.0, lat: -5.0, note: 'Astonishing linguistic diversity; conflict and resource extraction in West Papua.' },
  { name: 'Aboriginal Australians', place: 'Australia', lon: 134.0, lat: -25.0, note: 'The world’s oldest continuous cultures (60,000+ years); the fight for land and voice.' },
  { name: 'Māori', place: 'Aotearoa NZ', lon: 174.0, lat: -41.0, note: 'Treaty of Waitangi rights; leaders in giving rivers and forests legal personhood.' },
  { name: 'Nenets', place: 'Siberian Arctic', lon: 70.0, lat: 68.0, note: 'Reindeer nomads whose tundra is opening to gas extraction and thaw.' },
  { name: 'Baka & Congo Basin peoples', place: 'Central Africa', lon: 15.0, lat: 3.0, note: 'Forest peoples evicted in the name of conservation; the “green” land grab.' },
  { name: 'Ainu', place: 'Hokkaido, Japan', lon: 143.0, lat: 43.3, note: 'Only recognised as Indigenous by Japan in 2019; reviving a near-lost language.' },
]

export const INDIG_SOURCES: { label: string; url: string }[] = [
  { label: 'UN — Indigenous Peoples', url: 'https://www.un.org/development/desa/indigenouspeoples/' },
  { label: 'IWGIA', url: 'https://www.iwgia.org/en/' },
  { label: 'Survival International', url: 'https://www.survivalinternational.org/' },
  { label: 'Cultural Survival', url: 'https://www.culturalsurvival.org/' },
  { label: 'Global Witness — defenders', url: 'https://www.globalwitness.org/en/campaigns/environmental-activists/' },
]
