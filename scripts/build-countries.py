#!/usr/bin/env python3
"""Builds src/data/countriesData.ts — the 195 countries behind "The world at a glance".

Sources (all open, cloned once; re-run when they publish new releases):
  git clone --depth 1 https://github.com/mledoze/countries            # names, flags, centroids (ODbL)
  git clone --depth 1 https://github.com/datasets/population          # World Bank population
  git clone --depth 1 https://github.com/datasets/gdp                 # World Bank GDP (current US$)
  git clone --depth 1 https://github.com/vdeminstitute/vdemdata       # V-Dem v16: regimes + leaders (2025)

  pip install rdata pandas
  python3 scripts/build-countries.py <dir-containing-the-four-clones>

Government orientation (left/right) is NOT in these datasets. It is hand-coded
below in ORIENTATION for the most populous countries, from the governing
party's family as of end-2025 (the leaders V-Dem lists). Everything else is
'not coded'. Keep it that way: an honest gap beats a guessed label.
"""
import json, sys, warnings
from pathlib import Path
import pandas as pd
import rdata

warnings.filterwarnings('ignore')
src = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
out = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'countriesData.ts'

# ── Orientation of the effective executive, end-2025 ──────────────────────
# L left · CL centre-left · C centre · CR centre-right · R right
# X doesn't fit the axis: one-party state, military rule, absolute monarchy,
#   theocracy, or interim/caretaker government
ORIENTATION = {
    'IND': 'R', 'CHN': 'X', 'USA': 'R', 'IDN': 'R', 'PAK': 'CR', 'NGA': 'CR',
    'BRA': 'CL', 'BGD': 'X', 'RUS': 'R', 'MEX': 'L', 'JPN': 'R', 'EGY': 'X',
    'PHL': 'CR', 'VNM': 'X', 'IRN': 'X', 'TUR': 'R', 'DEU': 'CR', 'THA': 'CR',
    'GBR': 'CL', 'FRA': 'C', 'ZAF': 'CL', 'ITA': 'R', 'MMR': 'X', 'COL': 'L',
    'KOR': 'CL', 'SDN': 'X', 'ESP': 'CL', 'ARG': 'R', 'AFG': 'X', 'YEM': 'X',
    'CAN': 'C', 'UKR': 'C', 'MAR': 'X', 'UZB': 'X', 'SAU': 'X', 'POL': 'CR',
    'MYS': 'CL', 'GHA': 'CL', 'PER': 'X', 'MDG': 'X', 'CIV': 'CR', 'NPL': 'X',
    'VEN': 'L', 'NER': 'X', 'AUS': 'CL', 'PRK': 'X', 'SYR': 'X', 'MLI': 'X',
    'BFA': 'X', 'MWI': 'CR', 'LKA': 'L', 'TCD': 'X', 'CHL': 'L', 'ROU': 'CR',
    'SEN': 'L', 'GTM': 'CL', 'ECU': 'CR', 'NLD': 'C', 'CUB': 'X', 'GIN': 'X',
    'GAB': 'X', 'ARE': 'X', 'QAT': 'X', 'OMN': 'X', 'KWT': 'X', 'BHR': 'X',
    'JOR': 'X', 'BRN': 'X', 'SWZ': 'X', 'LAO': 'X', 'ERI': 'X', 'TKM': 'X',
    'VAT': 'X', 'PRT': 'CR',
}

# Systems that sit on top of the V-Dem regime type.
FLAGS = {
    'SAU': 'Absolute monarchy', 'OMN': 'Absolute monarchy', 'BRN': 'Absolute monarchy',
    'SWZ': 'Absolute monarchy', 'QAT': 'Absolute monarchy', 'ARE': 'Federation of monarchies',
    'VAT': 'Theocracy (elective monarchy)', 'IRN': 'Theocracy', 'AFG': 'Theocracy (Taliban emirate)',
    'CHN': 'One-party state', 'VNM': 'One-party state', 'LAO': 'One-party state',
    'CUB': 'One-party state', 'PRK': 'One-party state', 'ERI': 'One-party state',
    'MMR': 'Military rule', 'SDN': 'Military rule', 'MLI': 'Military rule', 'BFA': 'Military rule',
    'NER': 'Military rule', 'GIN': 'Military rule', 'MDG': 'Military rule', 'TCD': 'Military-led',
}

CLUBS = {
    'G7': ['USA', 'JPN', 'DEU', 'GBR', 'FRA', 'ITA', 'CAN'],
    'G20': ['ARG', 'AUS', 'BRA', 'CAN', 'CHN', 'FRA', 'DEU', 'IND', 'IDN', 'ITA', 'JPN', 'KOR',
            'MEX', 'RUS', 'SAU', 'ZAF', 'TUR', 'GBR', 'USA'],  # + EU + African Union
    'BRICS+': ['BRA', 'RUS', 'IND', 'CHN', 'ZAF', 'EGY', 'ETH', 'IRN', 'ARE', 'IDN'],
    'EU': ['AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 'GRC',
           'HUN', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 'PRT', 'ROU', 'SVK',
           'SVN', 'ESP', 'SWE'],
    'P5': ['USA', 'RUS', 'CHN', 'GBR', 'FRA'],
}

countries = json.load(open(src / 'countries' / 'countries.json'))
members = [c for c in countries if (c.get('unMember') and c['cca3'] != 'VAT') or c['cca3'] in ('PSE', 'VAT')]
assert len(members) == 195, len(members)
africa_un = {c['cca3'] for c in members if c['region'] == 'Africa' and c['cca3'] != 'PSE'}
CLUBS['AU'] = sorted(africa_un)  # all 54 African UN members (+ Sahrawi Republic, not a UN member)


def latest(csv: Path) -> tuple[dict, dict]:
    df = pd.read_csv(csv)
    df = df[df.Year == df.groupby('Country Code').Year.transform('max')]
    return df.set_index('Country Code')['Value'].to_dict(), df.set_index('Country Code')['Year'].to_dict()


pop, pop_year = latest(src / 'population' / 'data' / 'population.csv')
gdp, gdp_year = latest(src / 'gdp' / 'data' / 'gdp.csv')
pop_prev = pd.read_csv(src / 'population' / 'data' / 'population.csv')
w = pop_prev[pop_prev['Country Code'] == 'WLD'].sort_values('Year').tail(2)

vd = list(rdata.read_rda(src / 'vdemdata' / 'data' / 'vdem.RData').values())[0]
vd = vd[vd.year == vd.year.max()].set_index('country_text_id')
VDEM_ID: dict = {}  # V-Dem's PSE is the West Bank (Palestinian Authority); Gaza is PSG


def clean(s):
    return None if s is None or (isinstance(s, float) and pd.isna(s)) or str(s).startswith('[') else str(s)


rows = []
for c in sorted(members, key=lambda c: c['name']['common']):
    iso = c['cca3']
    v = vd.loc[VDEM_ID.get(iso, iso)] if VDEM_ID.get(iso, iso) in vd.index else None
    regime = int(v['v2x_regime']) if v is not None and not pd.isna(v['v2x_regime']) else -1
    hos = clean(v['v2exnamhos']) if v is not None else None
    hog = clean(v['v2exnamhog']) if v is not None else None
    # The more powerful of head of state / head of government (V-Dem v2ex_hosw:
    # 1 = head of state dominates, 0.5 = shared, 0 = head of government).
    hosw = v['v2ex_hosw'] if v is not None and 'v2ex_hosw' in v.index else 1
    leader = hog if (hog and not pd.isna(hosw) and hosw < 0.5) else hos
    rows.append({
        'iso': iso,
        'name': c['name']['common'],
        'flag': c.get('flag', ''),
        'lat': round(c['latlng'][0], 1), 'lon': round(c['latlng'][1], 1),
        'region': c['region'],
        'un': iso not in ('PSE', 'VAT'),
        'pop': int(pop[iso]) if iso in pop else None,
        'gdp': round(gdp[iso] / 1e9, 1) if iso in gdp and not pd.isna(gdp[iso]) else None,
        'regime': regime,
        'demo': round(float(v['v2x_polyarchy']), 2) if v is not None and not pd.isna(v['v2x_polyarchy']) else None,
        'leader': leader,
        'orient': ORIENTATION.get(iso, ''),
        'system': FLAGS.get(iso, ''),
        'clubs': [k for k, isos in CLUBS.items() if iso in isos],
    })

world_pop, world_pop_prev = int(w.Value.iloc[-1]), int(w.Value.iloc[-2])
meta = {
    'worldPop': world_pop,
    'worldPopYear': int(w.Year.iloc[-1]),
    'worldPopGrowth': world_pop - world_pop_prev,
    'worldGdpBn': round(gdp['WLD'] / 1e9),
    'gdpYear': int(gdp_year['WLD']),
    'vdemYear': int(vd.year.max()),
}

body = (
    '// GENERATED by scripts/build-countries.py — do not edit by hand.\n'
    '// Sources: World Bank (population, GDP) via github.com/datasets; V-Dem v16\n'
    '// (regimes, leaders); mledoze/countries (names, flags, centroids, ODbL).\n'
    '// regime: 0 closed autocracy · 1 electoral autocracy · 2 electoral democracy ·\n'
    '//         3 liberal democracy · -1 not assessed by V-Dem\n'
    "// orient: '' not coded · L · CL · C · CR · R · X (doesn't fit the left/right axis)\n"
    '// gdp in US$ billions. demo = V-Dem electoral democracy index, 0–1.\n'
    'export interface Country {\n'
    '  iso: string; name: string; flag: string; lat: number; lon: number; region: string\n'
    '  un: boolean; pop: number | null; gdp: number | null; regime: number; demo: number | null\n'
    "  leader: string | null; orient: '' | 'L' | 'CL' | 'C' | 'CR' | 'R' | 'X'; system: string; clubs: string[]\n"
    '}\n\n'
    f'export const COUNTRY_META = {json.dumps(meta)} as const\n\n'
    'export const COUNTRIES: Country[] = [\n'
    + '\n'.join('  ' + json.dumps(r, ensure_ascii=False) + ',' for r in rows)
    + '\n]\n'
)
out.write_text(body)
coded = [r for r in rows if r['orient']]
print(f"wrote {len(rows)} countries → {out}")
print('V-Dem assessed:', sum(r['regime'] >= 0 for r in rows), '· orientation coded:', len(coded),
      f"covering {sum(r['pop'] or 0 for r in coded) / world_pop:.0%} of people")
