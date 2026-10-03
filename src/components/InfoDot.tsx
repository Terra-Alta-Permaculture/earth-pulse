import { useEffect, useRef, useState } from 'react'
import { GLOSSARY } from '../data/glossary'

/**
 * A small tappable "i" that reveals a short plain-language explanation.
 * Click-toggled (works on touch), closes on outside tap or Escape, and calls
 * stopPropagation so it can live inside a clickable card without triggering it.
 */
export function InfoDot({ topic, label }: { topic: string; label?: string }) {
  const text = GLOSSARY[topic]
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!text) return null

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-label={label ? `What is ${label}?` : 'What is this?'}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-sand-700 text-[0.55rem] font-semibold leading-none text-sand-500 transition-colors hover:border-moss-500 hover:text-moss-300"
      >
        i
      </button>
      {open && (
        <span
          role="tooltip"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className="absolute left-1/2 top-5 z-50 w-56 -translate-x-1/2 rounded-lg border border-soil-600 bg-soil-950/95 p-2.5 text-left text-[0.68rem] font-normal leading-snug text-sand-200 shadow-xl backdrop-blur-sm"
        >
          {label && <span className="mb-0.5 block font-medium text-sand-100">{label}</span>}
          {text}
        </span>
      )}
    </span>
  )
}
