import type { IndicatorMeta } from '../lib/types'

/**
 * The canonical set of indicators tracked by EarthPulse, used by the browser
 * to render the dashboard.
 */
export const INDICATORS: IndicatorMeta[] = [
  // ── Crisis stream ────────────────────────────────────────────────
  {
    key: 'forest_loss_alerts',
    label: 'Deforestation alerts',
    stream: 'crisis',
    unit: 'alerts / week',
    source: 'Global Forest Watch',
    blurb: 'Integrated tree-cover-loss alerts detected across tropical forests.',
    higherIsBetter: false,
    region: 'Global',
  },
  {
    key: 'air_pm25',
    label: 'Air pollution (PM2.5)',
    stream: 'crisis',
    unit: 'µg/m³',
    source: 'OpenAQ',
    blurb: 'Average fine-particulate concentration across active monitors.',
    higherIsBetter: false,
    region: 'Global',
  },
  {
    key: 'natural_events',
    label: 'Active natural events',
    stream: 'crisis',
    unit: 'events',
    source: 'NASA EONET',
    blurb: 'Open wildfires, storms and other hazards currently being tracked.',
    higherIsBetter: false,
    region: 'Global',
  },

  // ── Regeneration stream ──────────────────────────────────────────
  {
    key: 'biodiversity_obs',
    label: 'Biodiversity observations',
    stream: 'regeneration',
    unit: 'records / day',
    source: 'GBIF',
    blurb: 'Living species occurrences logged by scientists and naturalists.',
    higherIsBetter: true,
    region: 'Global',
  },
  {
    key: 'species_richness',
    label: 'Species observed',
    stream: 'regeneration',
    unit: 'distinct species',
    source: 'GBIF',
    blurb: 'Distinct species recorded in the latest observation window.',
    higherIsBetter: true,
    region: 'Global',
  },
  {
    key: 'clean_air_sites',
    label: 'Clean-air locations',
    stream: 'regeneration',
    unit: 'sites',
    source: 'OpenAQ',
    blurb: 'Monitors reporting PM2.5 below the WHO 15 µg/m³ guideline.',
    higherIsBetter: true,
    region: 'Global',
  },
  {
    key: 'forest_restoration',
    label: 'Forest under restoration',
    stream: 'regeneration',
    unit: 'Mha',
    source: 'Global Forest Watch',
    blurb: 'Committed restoration area under the Bonn Challenge pledges.',
    higherIsBetter: true,
    region: 'Global',
  },
]

export const crisisIndicators = INDICATORS.filter((i) => i.stream === 'crisis')
export const regenIndicators = INDICATORS.filter((i) => i.stream === 'regeneration')

export const indicatorByKey = Object.fromEntries(
  INDICATORS.map((i) => [i.key, i]),
) as Record<string, IndicatorMeta>
