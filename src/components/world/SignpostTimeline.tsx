import type { WorldSignpost } from '../../lib/types'
import { forceByKey } from '../../data/forces'

interface Props {
  signposts: WorldSignpost[]
}

const STATUS_ORDER = { upcoming: 0, happened: 1, cancelled: 2 } as const

export function SignpostTimeline({ signposts }: Props) {
  const items = [...signposts]
    .filter((s) => s.status !== 'cancelled')
    .sort((a, b) => {
      if (a.status !== b.status) return STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
      const ad = a.event_date ? +new Date(a.event_date) : Infinity
      const bd = b.event_date ? +new Date(b.event_date) : Infinity
      return ad - bd
    })

  return (
    <section className="mt-6">
      <span className="eyebrow">Watch next</span>
      <h2 className="mt-1 mb-4 font-display text-xl text-sand-100">Signposts</h2>

      <ol className="relative space-y-4 border-l border-soil-700 pl-5">
        {items.map((s, i) => {
          const happened = s.status === 'happened'
          return (
            <li key={s.id ?? i} className="relative">
              <span
                className={`absolute -left-[1.42rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 ${
                  happened
                    ? 'border-soil-600 bg-soil-800'
                    : 'border-ember-400 bg-soil-900'
                }`}
              />
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[0.68rem] font-medium uppercase tracking-wide text-sand-500">
                  {s.date_label}
                </span>
                {happened && (
                  <span className="rounded-full bg-soil-700 px-1.5 py-px text-[0.55rem] uppercase tracking-wide text-sand-400">
                    happened
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm font-medium leading-snug text-sand-100">{s.title}</p>

              <div className="mt-1 flex items-center gap-1">
                {s.force_keys.map((k) => {
                  const m = forceByKey[k]
                  return (
                    <span
                      key={k}
                      title={m?.title}
                      aria-label={m?.title}
                      className="flex h-5 w-5 items-center justify-center rounded-full border border-soil-700 bg-soil-800 text-[0.7rem]"
                    >
                      {m?.icon}
                    </span>
                  )
                })}
              </div>

              <p className="mt-1 text-xs leading-relaxed text-sand-500">{s.what_it_means}</p>
              {happened && s.outcome && (
                <p className="mt-1 text-xs leading-relaxed text-moss-300">→ {s.outcome}</p>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
