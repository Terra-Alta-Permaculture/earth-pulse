import type { WorldSignpost } from '../../lib/types'
import { forceByKey } from '../../data/forces'
import { InfoDot } from '../InfoDot'

interface Props {
  signposts: WorldSignpost[]
}

const todayIso = () => new Date().toISOString().slice(0, 10)

function ForceIcons({ keys }: { keys: WorldSignpost['force_keys'] }) {
  return (
    <div className="mt-1 flex items-center gap-1">
      {keys.map((k) => {
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
  )
}

export function SignpostTimeline({ signposts }: Props) {
  const active = signposts.filter((s) => s.status !== 'cancelled')
  const today = todayIso()

  const happened = active
    .filter((s) => s.status === 'happened')
    .sort((a, b) => (b.event_date ?? '').localeCompare(a.event_date ?? ''))

  const upcoming = active
    .filter((s) => s.status !== 'happened')
    .sort((a, b) => {
      const ad = a.event_date ?? '9999'
      const bd = b.event_date ?? '9999'
      return ad.localeCompare(bd)
    })

  return (
    <section className="mt-6">
      {/* What just happened — the update log */}
      {happened.length > 0 && (
        <div className="mb-6">
          <span className="eyebrow text-moss-300">What just happened</span>
          <h2 className="mt-1 mb-4 flex items-center gap-2 font-display text-xl text-sand-100">
            Signpost updates
            <InfoDot topic="signpost_updates" label="Signpost updates" />
          </h2>
          <ol className="relative space-y-4 border-l border-moss-800/60 pl-5">
            {happened.map((s, i) => (
              <li key={s.id ?? `h${i}`} className="relative">
                <span className="absolute -left-[1.42rem] top-1.5 flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 border-moss-500 bg-moss-900" />
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-[0.68rem] font-medium uppercase tracking-wide text-sand-500">{s.date_label}</span>
                  <span className="rounded-full bg-moss-700/30 px-1.5 py-px text-[0.55rem] uppercase tracking-wide text-moss-200">
                    ✓ happened
                  </span>
                </div>
                <p className="mt-0.5 text-sm font-medium leading-snug text-sand-100">{s.title}</p>
                <ForceIcons keys={s.force_keys} />
                {s.outcome ? (
                  <p className="mt-1.5 rounded-lg border border-moss-900/60 bg-moss-950/20 px-2.5 py-1.5 text-xs leading-relaxed text-moss-100">
                    <span className="font-medium">What happened:</span> {s.outcome}
                  </p>
                ) : (
                  <p className="mt-1 text-xs leading-relaxed text-sand-500">{s.what_it_means}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Watch next — upcoming, with past-due flagged */}
      <span className="eyebrow">Watch next</span>
      <h2 className="mt-1 mb-4 flex items-center gap-2 font-display text-xl text-sand-100">
        Signposts
        <InfoDot topic="signposts" label="Signposts" />
      </h2>
      <ol className="relative space-y-4 border-l border-soil-700 pl-5">
        {upcoming.map((s, i) => {
          const pastDue = !!s.event_date && s.event_date < today
          return (
            <li key={s.id ?? i} className="relative">
              <span
                className={`absolute -left-[1.42rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 ${
                  pastDue ? 'border-sand-500 bg-soil-900' : 'border-ember-400 bg-soil-900'
                }`}
              />
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[0.68rem] font-medium uppercase tracking-wide text-sand-500">{s.date_label}</span>
                {pastDue && (
                  <span className="rounded-full bg-soil-700 px-1.5 py-px text-[0.55rem] uppercase tracking-wide text-sand-400">
                    date passed · update pending
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm font-medium leading-snug text-sand-100">{s.title}</p>
              <ForceIcons keys={s.force_keys} />
              <p className="mt-1 text-xs leading-relaxed text-sand-500">{s.what_it_means}</p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
