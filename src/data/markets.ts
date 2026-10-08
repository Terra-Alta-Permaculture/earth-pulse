// Markets, metals & crypto — the money layer, and the mined matter it rests on.
// Crypto + precious metals are LIVE (CoinGecko, gold-api.com, alternative.me,
// all keyless + CORS). Stocks and rare-earth/critical-mineral developments have
// no clean free feed, so they're refreshed weekly by the World Pulse writer,
// with the cited values below as seed / fallback.

export const MARKETS_SEED = {
  stocksNote: 'Global equities sit near record highs, carried by big tech and the AI boom — concentrated gains in a handful of firms.',
  mineralsNote: 'China has tightened exports of rare earths and critical minerals (gallium, germanium, graphite, rare-earth magnets) as strategic leverage.',
  chinaMiningPct: 60, // USGS: China ≈ 60% of rare-earth mining
  chinaProcessingPct: 90, // IEA/USGS: China ≈ 85–90% of refining/processing
  asOf: 'early 2026',
}

// What the rare earths & critical minerals actually sit inside — the point is
// that the "weightless" digital and "clean" green economies are deeply material.
export const CRITICAL_MINERAL_USES: string[] = [
  'Smartphones & computer chips',
  'EV motors & batteries',
  'Wind turbines & solar',
  'Fighter jets, missiles & radar',
  'MRI & medical tech',
  'Robotics & automation',
]

export const MARKETS_SOURCES: { label: string; url: string }[] = [
  { label: 'CoinGecko', url: 'https://www.coingecko.com/' },
  { label: 'World Gold Council', url: 'https://www.gold.org/goldhub' },
  { label: 'USGS — critical minerals', url: 'https://www.usgs.gov/centers/national-minerals-information-center' },
  { label: 'IEA — critical minerals', url: 'https://www.iea.org/topics/critical-minerals' },
]
