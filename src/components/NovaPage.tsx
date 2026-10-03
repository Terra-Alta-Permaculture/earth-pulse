import { REGEN_DIRECTORIES } from '../data/maps'

const BRIDGES: { n: string; title: string; blurb: string; app: string }[] = [
  {
    n: '1', title: 'Philosophy',
    blurb: 'Reading the living world as a subject that speaks, not an object to use — Tao, Kimmerer, Thomas Berry.',
    app: 'The whole stance: EarthPulse listens to the planet before it judges it.',
  },
  {
    n: '2', title: 'Anthropology',
    blurb: 'The old wound — when we stopped belonging to the whole and started controlling it. Norberg-Hodge in Ladakh.',
    app: 'Your Pulse — the planet’s signals where you are, and the living economy to plug into.',
  },
  {
    n: '3', title: 'Sociology',
    blurb: 'How societies actually change — not top-down, but from the meal outward. Transition Towns, Zapatistas, the Haudenosaunee.',
    app: 'The above-the-line map — real communities, mapped and linked.',
  },
  {
    n: '4', title: 'Psychology',
    blurb: 'The tree as a pattern for a settled mind: roots in relationship, a trunk with ethics, a canopy open to the unknown.',
    app: 'The non-alarmist, non-naive voice of the daily briefing.',
  },
  {
    n: '5', title: 'Economics',
    blurb: 'Does money circulate or accumulate? From the ayllu and Mondragón to Kate Raworth’s Doughnut.',
    app: 'The Doughnut — a safe & just space, with a live score — and its movement.',
  },
  {
    n: '6', title: 'Politics',
    blurb: 'Making consequences visible: who controls land, seeds and water; rivers with rights; ecocide as a crime.',
    app: 'Below/above-the-line streams, the maps, and The law catching up.',
  },
]

const FIVE_QUESTIONS = [
  'Does it regenerate what it uses, or honestly account for what it cannot?',
  'Does it increase diversity and resilience, or narrow them?',
  'Does it work with natural cycles, or fight them?',
  'Does other life need to flourish for it to work?',
  'Can the people making decisions see and live the consequences?',
]

const READING: { part: string; idea: string }[] = [
  { part: 'Daily briefing', idea: 'The state of the world in plain language — strain and repair, side by side.' },
  { part: 'Below / above the line', idea: 'Vertical Politics: extraction vs regeneration, not left vs right.' },
  { part: 'The two maps', idea: 'Where the world is breaking, and where it’s being built back.' },
  { part: 'The Doughnut', idea: 'Economics as maternity: a floor no one falls below, a ceiling we don’t overshoot.' },
  { part: 'The law catching up', idea: 'Rights of Nature & ecocide — consequences made visible by law.' },
  { part: 'Your Pulse', idea: 'The anthropological wound healed at the smallest scale: belonging, where you are.' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl text-sand-100">{title}</h2>
      <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-sand-300">{children}</div>
    </section>
  )
}

export function NovaPage() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Hero */}
      <div className="rounded-2xl border border-moss-800/50 bg-gradient-to-br from-soil-900/70 to-soil-900/40 p-6 sm:p-8">
        <p className="eyebrow text-moss-300">The thinking behind EarthPulse</p>
        <h1 className="mt-2 font-display text-4xl text-sand-100">NOVA</h1>
        <p className="mt-2 text-sand-300">Toward a culture that regenerates from stability, not from crisis.</p>
        <p className="mt-3 text-sm text-sand-500">A book by Pedro Valdoleiros · Terra Alta Permaculture, Sintra</p>
      </div>

      <Section title="In one breath">
        <p>
          Our civilisation is technically brilliant and humanly impoverished because we run the right
          values through the wrong domains, driven by a fear of not having enough. The way back isn’t a
          revolution that circles to the start — it’s a <em>spiralution</em>: returning to the same
          questions a turn higher, changed by having lived them. EarthPulse is that way of seeing, made
          into a dashboard.
        </p>
        <p className="text-sand-400">The ethic throughout is simple: <strong className="text-sand-200">direction, not purity.</strong></p>
      </Section>

      <Section title="The Inversion">
        <p>The three great values aren’t wrong. Their placement is. Move the tree, and the force reverses — from compression to expansion, extraction to regeneration.</p>
        <div className="mt-2 overflow-hidden rounded-xl border border-soil-700/60">
          {[
            ['Economics', 'ruled by freedom → extraction', 'ruled by maternity — is life flourishing?'],
            ['Politics', 'ruled by fraternity → corruption', 'ruled by equality — of consequences'],
            ['Culture', 'ruled by equality → monoculture', 'ruled by freedom — real diversity'],
          ].map(([domain, now, then], i) => (
            <div key={domain} className={`grid grid-cols-1 gap-1 p-3 sm:grid-cols-[7rem_1fr_1fr] sm:gap-3 ${i > 0 ? 'border-t border-soil-800' : ''}`}>
              <span className="font-medium text-sand-100">{domain}</span>
              <span className="text-[0.8rem] text-ember-200/80">{now}</span>
              <span className="text-[0.8rem] text-moss-200">{then}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Vertical Politics — above & below the line">
        <p>
          Not left or right, but up or down: <span className="text-moss-200">above the line</span> are
          systems that regenerate, distribute power and make consequences visible;{' '}
          <span className="text-ember-200">below the line</span> are systems that extract, concentrate
          and hide them. The test is five questions:
        </p>
        <ol className="mt-1 space-y-1.5">
          {FIVE_QUESTIONS.map((q, i) => (
            <li key={i} className="flex gap-2 text-[0.9rem]">
              <span className="stat-num text-moss-400">{i + 1}</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
        <p className="text-sand-400">Answer yes to most: above the line.</p>
      </Section>

      <Section title="The Six Bridges">
        <p className="text-sand-400">Where permaculture’s way of seeing meets other great fields — and where each one lives in this app.</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {BRIDGES.map((b) => (
            <div key={b.n} className="rounded-xl border border-soil-700/60 bg-soil-800/40 p-4">
              <div className="flex items-baseline gap-2">
                <span className="stat-num text-moss-400">{b.n}</span>
                <h3 className="font-display text-lg text-sand-100">{b.title}</h3>
              </div>
              <p className="mt-1 text-[0.8rem] leading-snug text-sand-400">{b.blurb}</p>
              <p className="mt-2 text-[0.75rem] leading-snug text-moss-200">In EarthPulse: {b.app}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How to read this dashboard">
        <div className="overflow-hidden rounded-xl border border-soil-700/60">
          {READING.map((r, i) => (
            <div key={r.part} className={`grid grid-cols-1 gap-0.5 p-3 sm:grid-cols-[11rem_1fr] sm:gap-3 ${i > 0 ? 'border-t border-soil-800' : ''}`}>
              <span className="font-medium text-sand-100">{r.part}</span>
              <span className="text-[0.85rem] text-sand-400">{r.idea}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Go deeper — the living networks">
        <p>The alternatives aren’t waiting to be invented. They exist, scattered across time and geography, running quietly alongside the dominant system. Find them:</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {REGEN_DIRECTORIES.map((d) => (
            <a
              key={d.label}
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-moss-800/60 bg-moss-950/20 px-3 py-1.5 text-xs text-moss-200 transition-colors hover:border-moss-600"
            >
              {d.label} ↗
            </a>
          ))}
        </div>
      </Section>

      <div className="mt-10 rounded-2xl border border-soil-700/60 bg-soil-900/50 p-6 text-center">
        <p className="font-display text-lg text-sand-100">The point is to begin.</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-sand-400">
          Not to save the world, but to add our thread to the fabric being woven by people who decided
          that stability was worth building, even in unstable times.
        </p>
      </div>
    </div>
  )
}
