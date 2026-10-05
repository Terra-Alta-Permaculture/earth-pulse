import { useState } from 'react'
import {
  emergeEvents,
  setEmergePlace,
  useEmergePlace,
  EMERGE_GUILD,
  EMERGE_QUESTS,
  EMERGE_URL,
} from '../lib/emerge'
import { InfoDot } from './InfoDot'

// The Act tab: from knowing to doing. Every action opens Emerge, Terra Alta's
// free app for regenerative events, learning quests and practitioners.
// Search words are ones that return real events on Emerge.
const ACTIONS: { icon: string; title: string; why: string; q: string }[] = [
  { icon: '🌱', title: 'Grow food the regenerative way', why: 'Living soil feeds us and pulls carbon back down.', q: 'permaculture' },
  { icon: '🔧', title: 'Repair, don’t replace', why: 'Every fixed thing is less mining, less waste.', q: 'repair' },
  { icon: '🥕', title: 'Garden with neighbours', why: 'Local food, shared work, stronger community.', q: 'garden' },
  { icon: '🌳', title: 'Care for nature nearby', why: 'Walks, clean-ups and restoration where you live.', q: 'nature' },
  { icon: '🫘', title: 'Save and swap seed', why: 'Keep seed in the hands of people, not patents.', q: 'seed' },
  { icon: '🤝', title: 'Join your local community', why: 'Change starts with the people around you.', q: 'community' },
]

type NearStatus = 'idle' | 'locating' | 'ready' | 'denied'

export function ActPage() {
  const here = useEmergePlace()
  const [near, setNear] = useState<{ status: NearStatus }>({ status: 'idle' })

  const findNear = () => {
    if (!('geolocation' in navigator)) {
      setNear({ status: 'denied' })
      return
    }
    setNear({ status: 'locating' })
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setEmergePlace({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setNear({ status: 'ready' })
      },
      () => setNear({ status: 'denied' }),
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 600_000 },
    )
  }

  return (
    <div>
      {/* Hero */}
      <section className="card mb-6 p-6">
        <div className="flex items-center gap-2">
          <span className="eyebrow">From knowing to doing</span>
          <InfoDot topic="act" label="Act" />
        </div>
        <h2 className="mt-2 font-display text-2xl text-sand-100">Do one thing this week</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-sand-300">
          The Planet and World tabs show what’s happening. This is where you do something about
          it. Every link opens <span className="text-sand-100">Emerge</span> — a free app from
          Terra Alta that finds regenerative events, courses and people near you. No ads, no
          algorithms.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {here ? (
            <a
              href={emergeEvents(here)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-moss-600 px-4 py-2 text-sm font-medium text-soil-950 transition-colors hover:bg-moss-500"
            >
              Open events near {here.place ?? 'you'} on Emerge →
            </a>
          ) : (
            <button
              onClick={findNear}
              disabled={near.status === 'locating'}
              className="rounded-lg bg-moss-600 px-4 py-2 text-sm font-medium text-soil-950 transition-colors hover:bg-moss-500 disabled:opacity-60"
            >
              {near.status === 'locating' ? 'Finding you…' : 'Find events near me'}
            </button>
          )}
          <a
            href={EMERGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-soil-600 bg-soil-800 px-4 py-2 text-sm font-medium text-sand-300 transition-colors hover:bg-soil-700"
          >
            Browse Emerge
          </a>
        </div>
        {near.status === 'denied' && (
          <p className="mt-2 text-xs text-sand-500">
            Couldn’t get your location — use “Browse Emerge” and pick your city there.
          </p>
        )}
        <p className="mt-2 text-[0.65rem] text-sand-700">
          Your location is rounded to ~1 km and only put in the link to Emerge. EarthPulse doesn’t save it.
        </p>
      </section>

      {/* Actions */}
      <div className="mb-2 flex items-center gap-2">
        <h2 className="font-display text-xl text-sand-100">Pick a way in</h2>
        <InfoDot topic="act_actions" label="Pick a way in" />
      </div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map((a) => (
          <a
            key={a.q}
            href={emergeEvents({ q: a.q, ...here })}
            target="_blank"
            rel="noopener noreferrer"
            className="card group block p-4 transition-colors hover:border-moss-700"
          >
            <span className="text-2xl">{a.icon}</span>
            <h3 className="mt-2 text-sm font-medium text-sand-100">{a.title}</h3>
            <p className="mt-1 text-[0.78rem] leading-snug text-sand-400">{a.why}</p>
            <span className="mt-2 block text-[0.72rem] text-moss-300 group-hover:text-moss-200">
              Find “{a.q}” events{here?.place ? ` near ${here.place}` : here ? ' near you' : ''} →
            </span>
          </a>
        ))}
      </div>

      {/* Learn + people */}
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={EMERGE_QUESTS}
          target="_blank"
          rel="noopener noreferrer"
          className="card group block p-5 transition-colors hover:border-moss-700"
        >
          <span className="eyebrow">Learn</span>
          <h3 className="mt-1 font-display text-lg text-sand-100">🌸 Permaculture, step by step</h3>
          <p className="mt-1 text-[0.8rem] leading-snug text-sand-400">
            Short learning quests you can do from home — with small real-world actions at the end of each.
          </p>
          <span className="mt-2 block text-[0.72rem] text-moss-300 group-hover:text-moss-200">Start a quest →</span>
        </a>
        <a
          href={EMERGE_GUILD}
          target="_blank"
          rel="noopener noreferrer"
          className="card group block p-5 transition-colors hover:border-moss-700"
        >
          <span className="eyebrow">Find people</span>
          <h3 className="mt-1 font-display text-lg text-sand-100">🌼 The Guild</h3>
          <p className="mt-1 text-[0.8rem] leading-snug text-sand-400">
            Regenerative practitioners who can help with your land or project — or join as one.
          </p>
          <span className="mt-2 block text-[0.72rem] text-moss-300 group-hover:text-moss-200">Visit the Guild →</span>
        </a>
      </div>
    </div>
  )
}
