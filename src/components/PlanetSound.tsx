import { useEffect, useRef, useState } from 'react'
import type { LiveSignal } from '../data/liveSources'
import { PlanetSoundEngine } from '../lib/planetSound'

export function PlanetSound({
  signals,
  balance,
}: {
  signals: LiveSignal[]
  balance: number
}) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const engineRef = useRef<PlanetSoundEngine | null>(null)

  // Push live-data changes into the running soundscape.
  useEffect(() => {
    if (playing) engineRef.current?.update(signals, balance)
  }, [signals, balance, playing])

  useEffect(() => {
    if (playing) engineRef.current?.setVolume(volume)
  }, [volume, playing])

  // Tear down the audio graph on unmount.
  useEffect(() => () => engineRef.current?.dispose(), [])

  async function toggle() {
    if (!engineRef.current) engineRef.current = new PlanetSoundEngine(signals, balance)
    if (playing) {
      await engineRef.current.pause()
      setPlaying(false)
    } else {
      engineRef.current.update(signals, balance)
      await engineRef.current.start(volume)
      setPlaying(true)
    }
  }

  return (
    <section className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-soil-700/60 bg-soil-900/50 px-4 py-3">
      <button
        onClick={toggle}
        aria-pressed={playing}
        className="flex items-center gap-2 rounded-lg border border-moss-700/60 bg-moss-900/40 px-3 py-1.5 text-xs font-medium text-moss-100 transition-colors hover:border-moss-600 hover:bg-moss-900/70"
      >
        {playing ? (
          <span className="flex h-3 items-end gap-[2px]" aria-hidden>
            <span className="h-full w-[3px] origin-bottom animate-eq bg-moss-300" style={{ animationDelay: '0ms' }} />
            <span className="h-full w-[3px] origin-bottom animate-eq bg-moss-300" style={{ animationDelay: '150ms' }} />
            <span className="h-full w-[3px] origin-bottom animate-eq bg-moss-300" style={{ animationDelay: '300ms' }} />
          </span>
        ) : (
          <span aria-hidden>▶</span>
        )}
        {playing ? 'Playing — the planet, right now' : 'Listen to the planet'}
      </button>

      {playing && (
        <label className="flex items-center gap-2 text-[0.7rem] text-sand-500">
          volume
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 w-24 cursor-pointer accent-moss-400"
          />
        </label>
      )}

      <span className="ml-auto text-[0.6rem] text-sand-700">
        An artistic rendering of the live data — warmer near balance, denser under strain
      </span>
    </section>
  )
}
