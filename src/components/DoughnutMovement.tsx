import { InfoDot } from './InfoDot'
import { ActOnThis } from './ActOnThis'

// Curated, cited: cities & regions putting the Doughnut into practice, via the
// Doughnut Economics Action Lab (DEAL). Not a live feed.
const CITIES: { place: string; note: string; year?: string }[] = [
  { place: 'Amsterdam', note: 'First city to adopt the Doughnut as its development model', year: '2020' },
  { place: 'Brussels', note: 'Regional Doughnut strategy' },
  { place: 'Copenhagen', note: 'DEAL “City Portrait”' },
  { place: 'Portland, OR', note: 'DEAL “City Portrait”' },
  { place: 'Nanaimo', note: 'Council-adopted, Canada' },
  { place: 'Cornwall', note: 'Regional, UK' },
  { place: 'Melbourne', note: 'City Portrait, Australia' },
  { place: 'Costa Rica', note: 'National-level exploration' },
]

export function DoughnutMovement() {
  return (
    <section className="mt-6 rounded-2xl border border-soil-700/60 bg-soil-900/50 p-5 sm:p-6">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="flex items-center gap-2 font-display text-xl text-sand-100">
          <span className="text-[#7ac7d4]">◉</span> The Doughnut, in practice
          <InfoDot topic="doughnut_movement" label="The Doughnut movement" />
        </h2>
        <span className="text-xs text-sand-500">from model to policy</span>
      </div>
      <p className="mb-4 max-w-2xl text-sm text-sand-500">
        The Doughnut isn't only a picture of the problem — it's becoming a tool for governing. Cities
        and regions are using it to set budgets and strategy, coordinated by the{' '}
        <a
          href="https://doughnuteconomics.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#7ac7d4] underline decoration-[#355f68] hover:decoration-[#7ac7d4]"
        >
          Doughnut Economics Action Lab
        </a>{' '}
        (DEAL).
      </p>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <Stat value="2020" label="Amsterdam — first city to adopt it" />
        <Stat value="dozens" label="of cities & regions now using it" />
        <Stat value="100+" label="countries in the DEAL community" />
      </div>

      <div className="flex flex-wrap gap-2">
        {CITIES.map((c) => (
          <span
            key={c.place}
            className="group relative rounded-lg border border-soil-700/60 bg-soil-800/40 px-2.5 py-1.5 text-xs text-sand-200"
          >
            {c.place}
            {c.year && <span className="ml-1 text-[0.6rem] text-[#7ac7d4]">{c.year}</span>}
            <span className="pointer-events-none absolute left-1/2 top-full z-40 mt-1 w-44 -translate-x-1/2 rounded-lg border border-soil-600 bg-soil-950/95 p-2 text-left text-[0.65rem] leading-snug text-sand-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
              {c.note}
            </span>
          </span>
        ))}
      </div>

      <p className="mt-4 text-[0.6rem] text-sand-700">
        Curated (not a live feed) · source: Doughnut Economics Action Lab. These cities also appear on
        the above-the-line map.
      </p>
      <div className="mt-4">
        <ActOnThis q="community" label="community events" />
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 rounded-xl border border-soil-700/60 bg-soil-800/40 p-4">
      <div className="stat-num text-xl text-sand-100">{value}</div>
      <p className="mt-1 text-[0.7rem] leading-snug text-sand-500">{label}</p>
    </div>
  )
}
