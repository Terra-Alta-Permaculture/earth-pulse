import { useEffect, useState, type ReactNode } from 'react'
import { InfoDot } from './InfoDot'

const isDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
  >
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface Props {
  children: ReactNode
  /** Anchor id, so the jump-nav can scroll to and auto-expand this section. */
  id?: string
  /** If given, Collapsible renders its OWN header + card (for content that
   *  isn't already a `<section className="card">`, e.g. the forces grid). */
  title?: ReactNode
  meta?: ReactNode
  infoTopic?: string
  infoLabel?: string
}

export function Collapsible({ children, id, title, meta, infoTopic, infoLabel }: Props) {
  const [open, setOpen] = useState(isDesktop)

  // Let the jump-nav open this section when the matching chip is tapped.
  useEffect(() => {
    if (!id) return
    const h = (e: Event) => {
      if ((e as CustomEvent).detail === id) setOpen(true)
    }
    window.addEventListener('ep-expand', h as EventListener)
    return () => window.removeEventListener('ep-expand', h as EventListener)
  }, [id])

  // Title mode — render our own header + body (no card chrome, so grids etc.
  // keep their own look).
  if (title) {
    return (
      <section id={id} className="collapsible-title mb-6 scroll-mt-20">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setOpen((o) => !o)
            }
          }}
          className="flex cursor-pointer select-none items-center justify-between gap-2"
        >
          <h2 className="flex items-center gap-2 font-display text-xl text-sand-100">
            {title}
            {infoTopic && <InfoDot topic={infoTopic} label={infoLabel ?? ''} />}
          </h2>
          <span className="flex items-center gap-2 text-xs text-sand-500">
            {meta}
            <Chevron open={open} />
          </span>
        </div>
        {open && <div className="mt-3">{children}</div>}
      </section>
    )
  }

  // Section mode — wrap an existing `<section className="card">`; the body is
  // hidden via CSS and the panel's own header is the tap target.
  return (
    <div
      id={id}
      className={`collapsible scroll-mt-20 ${open ? 'is-open' : 'is-collapsed'}`}
      onClick={() => {
        if (!open) setOpen(true)
      }}
    >
      {children}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        aria-label={open ? 'Collapse section' : 'Expand section'}
        aria-expanded={open}
        className="collapsible-toggle"
      >
        <Chevron open={open} />
      </button>
    </div>
  )
}
