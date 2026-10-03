-- World Pulse seed — "State of the World 2026", week of 28 Sep 2026.
-- Mirrors src/data/worldSeed.ts. Curly apostrophes (’) used to avoid escaping.

insert into public.world_weekly (week_start, summary, scenario_lean, lean_rationale) values
('2026-09-28',
 'The world is at its most dangerous in decades. The US–Israel war on Iran has kept the Strait of Hormuz shut or nearly shut for seven months, and the Houthis now hold the Bab al-Mandab coast. Russia’s war on Ukraine has no ceasefire and its drones and sabotage reach NATO soil. A possibly record El Niño is stressing harvests in the same regions already at war, while arms control, the UN and the ICC are weaker than at any time since 1945.',
 '{"A":45,"B":25,"C":20,"D":10}'::jsonb,
 'Both Washington and Tehran pay a high price for the Hormuz stalemate, and a phased deal is being discussed through Qatar, so managed bargaining (A) is most likely. The main risks are an Israeli strike on Iran’s nuclear work (B) and the collapse of the short US–China truces (C).')
on conflict (week_start) do nothing;

insert into public.world_readings (week_start, force_key, tension, direction, headline, what_changed, counterpoint, indicators, sources) values
('2026-09-28','us_power',8.0,'flat',
 'US power is used through pressure, tariffs and force',
 'The US captured Venezuela’s president in January, pressed Greenland into a defence deal in late September, and sanctions 13 ICC judges and prosecutors. The Supreme Court struck down the emergency tariffs in February, and midterm elections on 3 Nov may change Congress.',
 'The Supreme Court limited emergency tariff powers, showing domestic checks still work.',
 '[{"label":"Effective US tariff rate","value":7.1,"unit":"%","as_of":"2026-06","source_url":"https://budgetmodel.wharton.upenn.edu/p/2026-08-10-effective-tariff-rates-and-revenues-updated-august-10-2026/"},{"label":"US military spending","value":954,"unit":"US$bn","as_of":"2025","source_url":"https://www.sipri.org/media/press-release/2026/global-military-spending-rise-continues-european-and-asian-expenditures-surge"}]'::jsonb,
 '[{"title":"Penn Wharton Budget Model — tariffs","url":"https://budgetmodel.wharton.upenn.edu/p/2026-08-10-effective-tariff-rates-and-revenues-updated-august-10-2026/"},{"title":"SIPRI — global military spending","url":"https://www.sipri.org/media/press-release/2026/global-military-spending-rise-continues-european-and-asian-expenditures-surge"}]'::jsonb),
('2026-09-28','us_china',6.0,'flat',
 '“Hostile but hooked”: short truces hold for now',
 'Xi’s September state visit extended the trade truce by two months. Export controls were “off the table” and a new AI-incident channel was launched. Taiwan detected 176 Chinese aircraft and 242 vessels in August.',
 'A new US–China channel for reporting AI incidents was created.',
 '[{"label":"US tariff on Chinese goods (headline)","value":36.5,"unit":"%","as_of":"2026-09"},{"label":"US tariff on Chinese goods (effective)","value":23,"unit":"%","as_of":"2026-09"},{"label":"China rare-earth controls expire","value":"10 Nov 2026"}]'::jsonb,
 '[]'::jsonb),
('2026-09-28','chokepoints_energy',9.0,'flat',
 'Both Arabian sea gates are shut or threatened',
 'Hormuz has been shut or nearly shut since March under a US naval blockade of Iran. Iran’s 25 Sept offer to reopen it was rejected, though a phased deal is discussed. The Houthis seized Yemen’s Red Sea coast on 10–12 Sept.',
 'IEA countries released 400m barrels of emergency stocks, softening the shock.',
 '[{"label":"Brent crude (Sept range)","value":"91–113","unit":"US$/bbl","as_of":"2026-09","source_url":"https://www.iea.org/reports/oil-market-report-september-2026"},{"label":"EU gas storage","value":68,"unit":"% full","as_of":"2026-09"}]'::jsonb,
 '[{"title":"IEA Oil Market Report, Sept 2026","url":"https://www.iea.org/reports/oil-market-report-september-2026"}]'::jsonb),
('2026-09-28','russia_europe',7.0,'flat',
 'Stuck front, no ceasefire, war creeping into NATO',
 'Zelensky rejected the US peace plan in September; talks in the UAE are pencilled in for October. ISW sees near-zero Russian gains since March, but civilian deaths are up 55% and Putin signals a winter drone campaign on Ukraine’s grid.',
 'Europe’s defence spending rose 14% in 2025; NATO reaffirmed Article 5 in Ankara.',
 '[{"label":"Ukraine civilian deaths (Jan–Aug)","value":2222,"as_of":"2026-08","source_url":"https://ukraine.ohchr.org/en/Protection-of-Civilians-in-Armed-Conflict-August-2026"},{"label":"Russian hybrid incidents vs NATO","value":"200+","as_of":"2026"}]'::jsonb,
 '[{"title":"UN Human Rights (HRMMU) — civilian casualties","url":"https://ukraine.ohchr.org/en/Protection-of-Civilians-in-Armed-Conflict-August-2026"}]'::jsonb),
('2026-09-28','institutions',8.0,'flat',
 'The post-1945 rules are at their weakest',
 'New START expired on 5 Feb with no replacement, the NPT review failed for the third time, the UN budget was cut 15%, and five states are leaving the ICC.',
 'The High Seas Treaty entered into force on 16 Jan 2026; Duterte’s ICC trial opens 30 Nov.',
 '[{"label":"US arrears to UN","value":"~4","unit":"US$bn","as_of":"2026"},{"label":"Binding US–Russia nuclear limits","value":0,"as_of":"2026","source_url":"https://www.armscontrol.org/act/2026-03/news/new-start-expires-us-urges-modernized-treaty"}]'::jsonb,
 '[{"title":"Arms Control Association — New START expiry","url":"https://www.armscontrol.org/act/2026-03/news/new-start-expires-us-urges-modernized-treaty"}]'::jsonb),
('2026-09-28','living_planet',8.0,'flat',
 'Record heat and El Niño hit the regions already at war',
 'August 2026 tied the hottest month ever measured (+1.65°C). A possibly record El Niño threatens harvests in the Sahel, Horn of Africa, Central America and South/Southeast Asia; 7.8m face acute hunger in South Sudan.',
 'Brazil’s Amazon clearing alerts are the lowest since records began in 2014.',
 '[{"label":"Global temp anomaly (Aug)","value":1.65,"unit":"°C","as_of":"2026-08","source_url":"https://climate.copernicus.eu/copernicus-august-was-worlds-joint-hottest-month-record-pushing-global-temperatures-back-above"},{"label":"Fish stocks overfished","value":37.6,"unit":"%","as_of":"2026","source_url":"https://www.msc.org/media-centre/news-opinion/news/2026/06/19/five-takeaways-from-the-fao-sofia-report-2026"}]'::jsonb,
 '[{"title":"Copernicus — August 2026 temperatures","url":"https://climate.copernicus.eu/copernicus-august-was-worlds-joint-hottest-month-record-pushing-global-temperatures-back-above"},{"title":"FAO SOFIA 2026 — fisheries","url":"https://www.msc.org/media-centre/news-opinion/news/2026/06/19/five-takeaways-from-the-fao-sofia-report-2026"},{"title":"Mongabay — Amazon alerts fall","url":"https://news.mongabay.com/2026/06/amazon-deforestation-alerts-fall-to-lowest-12-month-level-since-2014-show-brazilian-data/"}]'::jsonb),
('2026-09-28','identity_religion',6.0,'flat',
 'Religion rarely starts wars but hardens them',
 'Jihadist violence in Africa killed 23,872 in a year; Israel’s 27 Oct election is shaped by religious nationalism; India’s voter-roll changes and expulsions target Muslims.',
 'Hungary’s new government reversed its ICC exit after Orbán lost in April.',
 '[{"label":"Countries with high religious hostility","value":55,"as_of":"2023"},{"label":"Christians facing high persecution","value":388,"unit":"million","as_of":"2026"}]'::jsonb,
 '[]'::jsonb),
('2026-09-28','ai',6.0,'flat',
 'AI concentrates power and speeds up every other force',
 'The US holds ~73% of global AI compute and China ~14%. The US sells capped chips to China for a 25% fee while China mandates domestic chips. Russia reportedly used a fully autonomous attack drone in July; UN talks on autonomous weapons were watered down.',
 '76 states back negotiating a binding treaty on autonomous weapons; decision in Nov 2026.',
 '[{"label":"US share of global AI compute","value":73,"unit":"%","as_of":"2026","source_url":"https://www.aljazeera.com/news/2026/9/24/china-vs-us-who-is-winning-the-ai-race-in-four-charts"},{"label":"US hyperscaler AI capex","value":"~764","unit":"US$bn","as_of":"2026"},{"label":"Data-centre electricity","value":485,"unit":"TWh","as_of":"2025"}]'::jsonb,
 '[{"title":"Al Jazeera — the US–China AI race","url":"https://www.aljazeera.com/news/2026/9/24/china-vs-us-who-is-winning-the-ai-race-in-four-charts"}]'::jsonb),
('2026-09-28','money_trade',6.0,'flat',
 'The dollar rules, but its edges are wearing',
 'The dollar holds 57% of reserves (vs ~71% in 2000). The Fed raised rates in September to fight oil-driven inflation. €210bn of Russian assets stay frozen; the EU decides again on 15–16 Oct. China’s surplus hit a record $1.2tn in 2025.',
 'World goods trade proved resilient despite the oil shock (WTO).',
 '[{"label":"Dollar share of reserves","value":57.1,"unit":"%","as_of":"2026 Q1","source_url":"https://data.imf.org/en/news/imf%20data%20brief%20july%201"},{"label":"US net interest","value":">1","unit":"US$tn/yr","source_url":"https://www.cbo.gov/publication/62105"}]'::jsonb,
 '[{"title":"IMF COFER — reserve currencies","url":"https://data.imf.org/en/news/imf%20data%20brief%20july%201"},{"title":"CBO — net interest outlook","url":"https://www.cbo.gov/publication/62105"}]'::jsonb)
on conflict (week_start, force_key) do nothing;

-- Signposts: insert the batch only if the table is empty (idempotent seed).
insert into public.world_signposts (event_date, date_label, title, force_keys, what_it_means, status)
select * from (values
  ('2026-09-30'::date, '~30 Sep 2026', 'IMF releases mid-2026 reserve-currency data', array['money_trade'], 'A further drop in the dollar’s share → C', 'upcoming'),
  ('2026-09-30'::date, '30 Sep 2026', 'UN Security Council vote on Haiti’s Gang Suppression Force', array['institutions'], 'Renewal shows the Council still acts where big powers agree → A/D', 'upcoming'),
  (null, 'Early Oct 2026', 'US answer to Iran’s phased Hormuz plan; any Israeli strike', array['chokepoints_energy'], 'Deal → A; strike → B', 'upcoming'),
  (null, 'Oct 2026', 'US–Ukraine–Russia talks in the UAE', array['russia_europe'], 'Ceasefire framework → A; collapse + winter grid strikes → B/C', 'upcoming'),
  ('2026-10-04'::date, '4 Oct 2026', 'Brazil’s general election', array['living_planet','money_trade'], 'Shapes Amazon protection and BRICS direction', 'upcoming'),
  ('2026-10-15'::date, '15–16 Oct 2026', 'EU summit on Ukraine financing and frozen Russian assets', array['money_trade','russia_europe'], 'Confiscation → C; another compromise → A', 'upcoming'),
  ('2026-10-27'::date, '27 Oct 2026', 'Israeli election', array['identity_religion','chokepoints_energy'], 'Shapes Gaza disarmament, Lebanon talks and new Iran-strike risk', 'upcoming'),
  ('2026-11-03'::date, '3 Nov 2026', 'US midterm elections', array['us_power'], 'A new Congress could restrain tariffs and force → D', 'upcoming'),
  ('2026-11-10'::date, '10 Nov 2026', 'China’s suspended rare-earth controls expire (may extend to Jan 2027)', array['us_china','ai'], 'Extension → A; reimposition → C', 'upcoming'),
  ('2026-11-09'::date, '9–20 Nov 2026', 'COP31 climate summit, Antalya', array['living_planet','institutions'], 'Real adaptation money → D', 'upcoming'),
  (null, 'Nov 2026', 'UN review conference on autonomous weapons (CCW)', array['ai','institutions'], 'Negotiating mandate → D; failure = military AI unregulated', 'upcoming'),
  ('2026-11-30'::date, '30 Nov 2026', 'Duterte trial opens at the ICC', array['institutions'], 'Shows whether the court still works under US sanctions', 'upcoming'),
  ('2026-12-14'::date, '14–15 Dec 2026', 'G20 summit in Miami (South Africa excluded)', array['us_power','institutions'], 'Global forum or US-led club?', 'upcoming'),
  (null, 'Winter 2026–27', 'Russian drone campaign on Ukraine’s grid; EU gas levels', array['russia_europe','chokepoints_energy'], 'Energy stress in Europe; pressure on Kyiv', 'upcoming'),
  (null, 'Winter 2026–27', 'El Niño peak; harvests in Horn of Africa, Sahel, South Asia', array['living_planet'], 'Famine or food export bans → B', 'upcoming'),
  ('2027-01-16'::date, '16 Jan 2027', 'Nigeria’s presidential election', array['identity_religion'], 'Religious framing and jihadist violence in Africa’s largest country', 'upcoming')
) as v(event_date, date_label, title, force_keys, what_it_means, status)
where not exists (select 1 from public.world_signposts);
