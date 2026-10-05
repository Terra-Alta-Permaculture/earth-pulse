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
  biodiversity: 'Wildlife sightings logged by people and researchers worldwide this year. Caveat: it counts records, not animals — a rise can mean more people watching, not more nature.',
  inaturalist: 'Nature observations people are logging right now via the iNaturalist app — citizen science. Like the above, it measures recording effort, not how much wildlife is actually out there.',
  clean_air_cities: 'Cities currently measuring clean, healthy air (PM2.5 below the WHO guideline). Caveat: only counts cities that monitor air — a small, uneven sample, not the whole world.',
  ozone_recovery: 'The ozone layer is healing: ~99% of the chemicals that damaged it have been phased out, and it’s on track to fully recover. Proof global action works.',
  ev_adoption: 'The share of new cars sold worldwide that are electric — a fast-rising sign of the shift away from petrol. A direction, not a clean win: EVs still depend on mining (lithium, cobalt) and are only as low-carbon as the grid that charges them.',
  forest_restoration: 'How much land the world has pledged to restore to forest, toward a global 2030 goal. Caveat: these are pledges, not delivery — and some count tree plantations, which aren’t the same as living forest.',
  renewable_electricity: 'The share of the world’s electricity generated from renewables like sun, wind and water. Caveat: the share can rise even while total fossil use keeps growing, and the build-out needs mining too.',
  renewable_energy: 'Renewables as a share of all the energy the world uses (electricity, heating, transport, industry). Caveat: a bigger slice doesn’t yet mean fossil fuels are shrinking in absolute terms.',
  forest_area: 'The share of the world’s land still covered by forest. Caveat: plantations count as “forest” here, which can mask the loss of older, wilder forest.',
  protected_land: 'The share of land set aside and protected for nature. Caveat: much of it is protected “on paper” — enforcement is often weak (“paper parks”).',
  marine_protected: 'The share of the world’s seas under some form of protection. Caveat: a lot of marine protection is partial or poorly enforced.',
  electricity_access: 'The share of people worldwide with access to electricity. This is a social-foundation gain (a human need met), not an ecological one — and best when it’s clean power reaching the energy-poor.',
  safe_water: 'The share of people with safely managed drinking water at home. A social-foundation gain (a human need met), not a measure of planetary health.',
  clean_cooking: 'The share of people who can cook with clean fuels instead of smoky fires. A social-foundation gain (health & dignity), not an ecological signal.',

  // ── Section-level ──
  balance: 'A rough 0–100 score of ecological health, blending the indicators above. It’s a direction, not a verdict.',
  doughnut: 'Kate Raworth’s model: a safe & just space between a social floor (nobody left short) and an ecological ceiling (not overshooting the planet).',
  world_map: 'A live map of earthquakes and natural hazards happening on Earth right now.',
  law_tracker: 'How law is starting to protect nature — giving rivers rights, and making large-scale ecosystem destruction (ecocide) a crime.',
  seed_sovereignty: 'Who controls seed — the first link in the food chain. Below the line: corporate patents and uniformity enclosing it. Above: farmers and communities saving, sharing and renewing seed as a living commons (Vandana Shiva’s bija swaraj).',
  soil_not_oil: 'Vandana Shiva’s idea that the climate and food crises are one. Below the line: fossil-fed industrial farming that emits and degrades soil. Above: living, biodiverse soil that feeds us and pulls carbon back down.',

  // ── Vertical Politics (NOVA) ──
  the_line: 'Not left or right, but up or down: does a system regenerate or extract? The test is five questions — does it (1) regenerate what it uses, (2) grow diversity & resilience, (3) work with natural cycles, (4) need other life to flourish, and (5) let decision-makers feel the consequences? Mostly yes = above the line.',
  below_line: 'Below the line = extraction: systems that take more than they return, hide the consequences, and push past the planet’s limits. These are the degradation signals.',
  above_line: 'Above the line = regeneration: systems that give back more than they take and share the benefits widely. These are the signs of repair.',
  nature_rights: 'The movement to give rivers, forests and ecosystems legal rights — treating the living world as a subject, not property (Vandana Shiva’s Earth Democracy; NOVA’s Vertical Politics). Curated+cited figures: ~400+ Rights-of-Nature initiatives across ~39 countries, landmark ecosystems granted legal personhood (Whanganui, Atrato, Mar Menor…), and the push to criminalise ecocide. The full timeline is in the Law Tracker on the Planet tab.',
  animal_rights: 'How the other animals fare: the scale of farming (~80 billion land animals a year), the collapse of wild populations (WWF Living Planet Index: ~73% average decline since 1970), and the slow legal recognition that animals are sentient and can suffer. Curated+cited from FAO, WWF and World Animal Protection.',
  human_rights: 'Whether people can speak, assemble, vote and live free from repression. Figures are curated from the major monitors (no single live feed): Freedom House tracks consecutive years of declining global freedom and the share in “Not Free” countries; V-Dem estimates ~7 in 10 people now live under autocratic rule; CIVICUS finds only ~2% live where civic space is fully open. Check the linked sources for the latest.',
  childrens_rights: 'How the world is keeping its promise to children (the UN Convention on the Rights of the Child — the most ratified treaty on Earth). Curated UNICEF/ILO/UNESCO headline figures — children in child labour, out of school, and living in conflict zones — alongside one LIVE World Bank number: under-5 mortality (deaths per 1,000 births), which has more than halved since 2000.',
  active_conflicts: 'How many wars are being fought right now. “How many” depends on the definition: academics (UCDP/PRIO) counted 61 state-based armed conflicts in 2024 — the most since 1946 — while the ICRC counts 120+ once non-state and one-sided conflicts are included. Figures are curated from the major trackers (no free live war-count API exists); check the linked sources for the latest.',
  gender_equality: 'How equally power, work and opportunity are shared between women and men. The headline is the World Economic Forum’s Global Gender Gap (~68% closed, ~134 years to parity at today’s pace); the live bars below are World Bank data — women in parliament, women vs men in the paid workforce, and girls’ vs boys’ school enrolment (≈1.00 = equal).',
  planet_history: 'A quiet daily record of EarthPulse’s headline readings — ecological balance, the safe & just score, CO₂ and sea level — so the direction of travel becomes visible over weeks and months. One point is saved per day the site is visited; it’s just these few planetary numbers, not you.',
  doughnut_movement: 'The Doughnut isn’t just an idea — cities and regions are using it to set real policy, coordinated by the Doughnut Economics Action Lab (DEAL), founded in 2019 by Kate Raworth and team.',

  // ── Short per-number explanations (newer panels) ──
  // Wars
  conflicts_all: 'Every armed fight going on today, including ones between rebel groups or gangs — not just between governments. The widest count (ICRC).',
  conflicts_state: 'Wars where at least one side is a government. Researchers say there are more now than at any time since 1946.',
  displaced: 'People forced to leave their homes by war, violence or persecution. Many still live inside their own country.',
  largest_wars: 'The biggest wars right now, by deaths and people forced from home. A bright dot = full war; a dim dot = lower-level conflict.',
  // Human rights
  hr_decline: 'How many years in a row more countries lost freedom than gained it, according to Freedom House.',
  hr_not_free: 'The share of the world’s people living in countries where basic rights like free speech and fair votes are mostly denied.',
  hr_autocracy: 'The share of people living where leaders aren’t truly chosen or held in check by voters, courts and a free press.',
  hr_open_civic: 'The share of people who can freely protest, organise and speak out without fear. Very few.',
  hr_concerns: 'The problems human-rights groups are warning about most right now.',
  // Children
  child_labour: 'Children doing work that harms their health or keeps them out of school.',
  out_of_school: 'Children and teenagers who should be in school but aren’t.',
  child_conflict: 'Children growing up in places with active war — about 1 in 6 kids on Earth.',
  child_mortality: 'Out of every 1,000 babies born, how many die before turning 5. Live from the World Bank. It has more than halved since 2000.',
  // Gender
  gender_gap: 'A score of how equal women and men are in pay, jobs, school, health and politics. 100% would mean fully equal.',
  women_parliament: 'The share of seats in national parliaments held by women. Equal would be 50%.',
  women_workforce: 'The share of women vs men who work or look for paid work. The gap shows how far apart they are.',
  girls_school: 'Girls’ school enrolment compared to boys’. 1.00 means exactly equal.',
  // Nature rights
  ron_initiatives: 'Laws, court rulings and local rules that give nature its own rights.',
  ron_countries: 'Countries where some law or ruling recognises nature’s rights.',
  ron_personhood: 'Rivers, forests and lagoons that courts or laws now treat like a person — they can be defended in court.',
  // Animals
  animals_farmed: 'Land animals (chickens, pigs, cows…) killed for food every year. Fish not included.',
  wildlife_decline: 'On average, monitored wild animal populations are about this much smaller than in 1970.',
  sentience_law: 'Places whose laws say animals can feel pain and emotions — so their welfare must count.',
  animals_progress: 'A quick look at what’s improving for animals, and what isn’t.',
  // Planet over time
  hist_balance: 'Our 0–100 score of the planet’s ecological health, saved once a day. Higher is better.',
  hist_score: 'How well the world meets people’s needs without breaking nature’s limits, 0–100. Higher is better.',
  hist_co2: 'Carbon dioxide in the air, in parts per million. Lower is better; it keeps rising.',
  hist_sea: 'How much the sea has risen since 1880, in centimetres. Lower is better.',
  // Doughnut
  doughnut_score: 'One number, 0–100: how close the world is to meeting everyone’s basic needs while staying inside nature’s limits. Higher is better.',
  // World tab
  world_summary: 'This week’s short summary of the big forces shaping the world, written fresh every week.',
  world_tension: 'The average tension of all the forces below, from 0 (calm) to 10 (crisis). The arrow shows where we are.',
  world_forces: 'The big pressures shaping the world — like great-power rivalry, war, energy, AI and climate. Each gets a tension score from 0 (calm) to 10 (crisis).',
  scenario_lean: 'Four possible futures, and how much this week’s news points to each. An educated guess, not a forecast.',
  signpost_updates: 'Events we were watching that have now happened, and what came of them.',
  signposts: 'Upcoming dates and events worth watching — they could push the world one way or another.',
  // Your pulse
  your_pulse: 'Live conditions where you are — weather, air, heat, quakes nearby — plus local ways to get involved. Your location is only used to look these up, and only if you allow it. Nothing is saved.',
}
