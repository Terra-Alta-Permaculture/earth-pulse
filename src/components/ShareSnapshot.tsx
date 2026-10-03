import { useState } from 'react'
import type { LiveSignal } from '../data/liveSources'
import { buildSnapshotData, renderSnapshotCanvas } from '../lib/snapshot'

export function ShareSnapshot({
  signals,
  balance,
}: {
  signals: LiveSignal[]
  balance: number
}) {
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  async function make() {
    if (busy) return
    setBusy(true)
    try {
      const data = buildSnapshotData(signals, balance)
      const canvas = await renderSnapshotCanvas(data)
      setPreview(canvas.toDataURL('image/png'))
      const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/png'))
      if (!blob) return
      const file = new File([blob], 'earthpulse-today.png', { type: 'image/png' })

      // Prefer the native share sheet when it can share files (mostly mobile).
      const nav = navigator as Navigator & {
        canShare?: (d: ShareData) => boolean
        share?: (d: ShareData) => Promise<void>
      }
      if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
        try {
          await nav.share({
            files: [file],
            title: 'EarthPulse — today',
            text: "The state of the planet today.",
          })
          return
        } catch {
          /* user cancelled → fall through to download */
        }
      }
      // Fallback: download the PNG.
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'earthpulse-today.png'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-soil-700/60 bg-soil-900/50 px-4 py-3">
      <button
        onClick={make}
        disabled={busy}
        className="flex items-center gap-2 rounded-lg border border-moss-700/60 bg-moss-900/40 px-3 py-1.5 text-xs font-medium text-moss-100 transition-colors hover:border-moss-600 hover:bg-moss-900/70 disabled:opacity-60"
      >
        <span aria-hidden>⇪</span>
        {busy ? 'Creating…' : 'Share today’s snapshot'}
      </button>

      {preview ? (
        <a href={preview} download="earthpulse-today.png" className="group">
          <img
            src={preview}
            alt="EarthPulse snapshot preview"
            className="h-12 rounded border border-soil-700/70 transition-transform group-hover:scale-105"
          />
        </a>
      ) : (
        <span className="ml-auto text-[0.6rem] text-sand-700">
          A shareable card of today’s planet — generated in your browser, nothing uploaded
        </span>
      )}
    </section>
  )
}
