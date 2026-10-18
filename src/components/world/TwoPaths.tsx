import { BIOMIMICRY, TRANSHUMANISM, TWOPATHS_SOURCES, type Example } from '../../data/twoPaths'
import { InfoDot } from '../InfoDot'

function Col({ items, tone }: { items: Example[]; tone: 'above' | 'below' }) {
  const dot = tone === 'above' ? 'bg-moss-400' : 'bg-ember-500/70'
  return (
    <div className="space-y-2">
      {items.map((e) => (
        <div key={e.name} className="flex gap-2.5 rounded-lg border border-soil-800 bg-soil-900/40 p-3">
          <span className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
          <div>
            <span className="text-sm font-medium text-sand-100">{e.name}</span>
            <p className="mt-0.5 text-[0.76rem] leading-snug text-sand-400">{e.note}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function TwoPaths() {
  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🧬 Two paths for technology</h2>
          <InfoDot topic="two_paths" label="Biomimicry vs transhumanism" />
        </div>
        <span className="text-xs text-sand-500">the fork</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        How should technology relate to life? Two visions pull in opposite
        directions — the same above/below question, applied to science itself.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-[0.72rem] font-semibold uppercase tracking-wide text-moss-300">
            ↑ Biomimicry
          </div>
          <p className="mb-2 text-[0.78rem] leading-snug text-sand-400">
            Learn from and work <em>with</em> nature — nature as model, measure
            and mentor. Answers NOVA’s test: works with natural cycles, needs
            life to flourish.
          </p>
          <Col items={BIOMIMICRY} tone="above" />
        </div>
        <div>
          <div className="mb-1 text-[0.72rem] font-semibold uppercase tracking-wide text-ember-300">
            ↓ Transhumanism
          </div>
          <p className="mb-2 text-[0.78rem] leading-snug text-sand-400">
            Transcend and re-engineer the human and nature. Real healing uses —
            but risks concentration (enhancement for the few) and the domination
            of biology.
          </p>
          <Col items={TRANSHUMANISM} tone="below" />
        </div>
      </div>

      <p className="mt-4 text-[0.78rem] leading-snug text-sand-300">
        It isn’t simply good vs. bad — gene therapy cures disease, and not all
        biomimicry is benign. The real question is NOVA’s: does a technology{' '}
        <span className="text-moss-300">serve life and share its gifts</span>, or{' '}
        <span className="text-ember-300">concentrate power and control it?</span>
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {TWOPATHS_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
