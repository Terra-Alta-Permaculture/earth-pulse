import { useState, type ReactNode } from 'react'

const isDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches

/**
 * Wraps a panel (`<section className="card">…`) in a collapse control so the
 * mobile scroll stays short: open on desktop, collapsed on phones/tablets.
 * Low-touch — it hides the panel body with CSS and keeps the panel's own
 * header row as the tap target, so no panel internals need to change.
 */
export function Collapsible({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(isDesktop)
  return (
    <div
      className={`collapsible ${open ? 'is-open' : 'is-collapsed'}`}
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
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
