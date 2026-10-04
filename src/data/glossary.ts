// Plain-language, one-line explanations for every data point — so anyone can
// tap the "i" and understand what they're looking at. Short and sweet.

export const GLOSSARY: Record<string, string> = {
  // ── Vitals ──
  co2: 'Carbon dioxide in the air, the main gas heating the planet. Pre-industrial was ~280 ppm; 350 is considered safe. Higher = more warming.',
  earthquakes: 'How many magnitude-2.5+ earthquakes happened worldwide in the last 24 hours. A normal planetary heartbeat, not a warning on its own.',
  significant_quakes: 'Major earthquakes (large enough to cause damage) recorded worldwide in the last 30 days.',
  geomagnetic: 'How disturbed Earth’s magnetic field is right now (the Kp index). High values mean solar storms, which can spark auroras and disrupt satellites.',
  solar: 'The Sun’s radio output — a measure of how active it is. It drives space weather that affects satellites and power grids.',
  ocean_temp: 'The average sea-surface temperature across several ocean regions right now. Warmer oceans fuel stronger storms and coral bleaching.',

  // ── Crisis stream ──
  natural_events: 'Active natural hazard events worldwide right now (storms, floods, volcanoes, wildfires and more), tracked by NASA.',
  wildfires: 'Large wildfires currently burning around the world, detected from space by NASA.',
  methane: 'Methane in the air — a greenhouse gas ~80x stronger than CO₂ over 20 years. It comes from fossil fuels, livestock and wetlands.',
  air_pm25: 'Tiny airborne particles (PM2.5) averaged across major world cities. They lodge deep in the lungs; the WHO safe guideline is 5 µg/m³.',
  pm25_exposure: 'The average amount of fine-particle air pollution (PM2.5) the world’s people breathe. Lower is healthier.',
  forest_loss: 'How much forest the world is losing each year, net of regrowth. Forests store carbon and hold biodiversity.',
  threatened_species: 'The number of species officially assessed as threatened with extinction on the IUCN Red List.',
  sea_level: 'How far the global average sea level has risen since 1880, as warming melts ice and expands the oceans.',
  data_centers: 'Estimated electricity used by the world’s data centres each year — the hidden energy cost of the internet and AI.',
  war_emissions: 'The share of global greenhouse gases estimated to come from the world’s militaries. A research estimate, not a live reading.',
  deep_sea_mining: 'Mining the ocean floor for metals. Still at the exploration stage — this counts the contracts issued; no commercial mining has begun.',
  orbital_debris: 'Pieces of space junk larger than 10 cm circling Earth — the “ring of trash” that threatens satellites.',
  mineral_rents: 'The value pulled from mining, as a share of the world economy — a rough measure of how much we dig up.',
  ores_metals_exports: 'Raw ores and metals as a share of everything the world trades — a proxy for mining pressure.',
  co2_total: 'Total carbon dioxide the world emits each year, in billions of tonnes.',
  ghg_per_capita: 'The average greenhouse gas emissions per person on Earth each year.',
  agri_land: 'The share of the planet’s land used for farming and grazing.',
  fertilizer: 'How much synthetic fertiliser is used per hectare of farmland. Runoff pollutes rivers and seas.',
  freshwater_withdrawal: 'The share of the world’s renewable freshwater that people draw out each year.',
  military_spending: 'Total global military spending per year — a proxy for the resources going to conflict rather than care.',

  // ── Regeneration stream ──
  biodiversity: 'Wildlife sightings logged by people and researchers worldwide this year — a sign of life being watched over and recorded.',
  inaturalist: 'Nature observations people are logging right now through the iNaturalist app — citizen science in action.',
  clean_air_cities: 'Cities currently measuring clean, healthy air (PM2.5 below the WHO guideline).',
  ozone_recovery: 'The ozone layer is healing: ~99% of the chemicals that damaged it have been phased out, and it’s on track to fully recover. Proof global action works.',
  ev_adoption: 'The share of new cars sold worldwide that are electric — a fast-rising sign of the shift away from petrol. A direction, not a clean win: EVs still depend on mining (lithium, cobalt) and are only as low-carbon as the grid that charges them.',
  forest_restoration: 'How much land the world has pledged to restore to forest, toward a global 2030 goal.',
  renewable_electricity: 'The share of the world’s electricity generated from renewables like sun, wind and water.',
  renewable_energy: 'Renewables as a share of all the energy the world uses (not just electricity — also heating, transport, industry).',
  forest_area: 'The share of the world’s land still covered by forest.',
  protected_land: 'The share of land set aside and protected for nature.',
  marine_protected: 'The share of the world’s seas under some form of protection.',
  electricity_access: 'The share of people worldwide who have access to electricity.',
  safe_water: 'The share of people with safely managed drinking water at home.',
  clean_cooking: 'The share of people who can cook with clean fuels, rather than smoky fires that harm health.',

  // ── Section-level ──
  balance: 'A rough 0–100 score of ecological health, blending the indicators above. It’s a direction, not a verdict.',
  doughnut: 'Kate Raworth’s model: a safe & just space between a social floor (nobody left short) and an ecological ceiling (not overshooting the planet).',
  world_map: 'A live map of earthquakes and natural hazards happening on Earth right now.',
  law_tracker: 'How law is starting to protect nature — giving rivers rights, and making large-scale ecosystem destruction (ecocide) a crime.',

  // ── Vertical Politics (NOVA) ──
  the_line: 'Not left or right, but up or down: does a system regenerate or extract? The test is five questions — does it (1) regenerate what it uses, (2) grow diversity & resilience, (3) work with natural cycles, (4) need other life to flourish, and (5) let decision-makers feel the consequences? Mostly yes = above the line.',
  below_line: 'Below the line = extraction: systems that take more than they return, hide the consequences, and push past the planet’s limits. These are the degradation signals.',
  above_line: 'Above the line = regeneration: systems that give back more than they take and share the benefits widely. These are the signs of repair.',
  doughnut_movement: 'The Doughnut isn’t just an idea — cities and regions are using it to set real policy, coordinated by the Doughnut Economics Action Lab (DEAL), founded in 2019 by Kate Raworth and team.',
}
