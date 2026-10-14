import { LANG_STATS, TOP_LANGUAGES, LANG_SOURCES } from '../../data/languages'
import type { WorldHuman } from '../../hooks/useWorldPulse'
import { InfoDot } from '../InfoDot'

const S = LANG_STATS
const MAX = TOP_LANGUAGES[0].speakersM

export function Languages({ live }: { live?: WorldHuman['culture'] }) {
  const note = live?.language_note
  const asOf = live?.as_of ?? S.asOf

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">🗣️ Tongues &amp; cultures</h2>
          <InfoDot topic="languages" label="Languages & cultures" />
        </div>
        <span className="text-xs text-sand-500">{note ? 'updated weekly · ' : ''}as of {asOf}</span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        Every language is a way of seeing the world. We’re losing them fast — the
        monoculture of the mind, in Vandana Shiva’s phrase.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-soil-700/50 bg-soil-900/40 p-4">
          <span className="stat-num block text-3xl text-sand-100">{S.total.toLocaleString()}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.totalNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.endangeredPct}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.endangeredNote}</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{S.deathRate}</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">{S.deathRateNote}</span>
        </div>
      </div>

      <h3 className="mt-5 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        Most spoken (first + second language)
        <InfoDot topic="top_languages" label="Most-spoken languages" />
      </h3>
      <div className="mt-2 space-y-1.5">
        {TOP_LANGUAGES.map((l) => (
          <div key={l.name} className="flex items-center gap-3">
            <span className="w-32 flex-shrink-0 text-[0.82rem] text-sand-200">{l.name}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-soil-800">
              <div className="h-full rounded-full bg-gradient-to-r from-moss-700 to-moss-400"
                style={{ width: `${(l.speakersM / MAX) * 100}%` }} />
            </div>
            <span className="stat-num w-14 flex-shrink-0 text-right text-[0.72rem] text-sand-500">
              {(l.speakersM / 1000).toFixed(2)}B
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[0.72rem] leading-snug text-sand-600">
        Just a few hundred languages have a million+ speakers; the long tail of
        thousands — most Indigenous — carries the world’s deepest knowledge of
        place, plants and medicine, and is the part most at risk.
      </p>

      {note && (
        <p className="mt-3 text-[0.82rem] leading-snug text-sand-300">
          <span className="font-medium text-sand-100">This week:</span> {note}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {LANG_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>
    </section>
  )
}
