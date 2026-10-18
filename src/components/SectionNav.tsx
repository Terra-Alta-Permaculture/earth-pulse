/** A sticky row of chips that jump to (and auto-expand) a section. */
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const go = (id: string) => {
    // ask the matching Collapsible to open (and any lens filter to reset), then
    // scroll — a short delay lets a hidden band re-show before we scroll to it.
    window.dispatchEvent(new CustomEvent('ep-expand', { detail: id }))
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 110)
  }
  return (
    <nav className="sticky top-[env(safe-area-inset-top)] z-20 -mx-4 mb-5 border-b border-soil-800/80 bg-soil-950/85 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex gap-2 overflow-x-auto overscroll-x-contain whitespace-nowrap pb-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => go(it.id)}
            className="flex-shrink-0 rounded-full border border-soil-700 bg-soil-800/60 px-3 py-1.5 text-xs font-medium text-sand-300 transition-colors hover:border-moss-600 hover:text-sand-100"
          >
            {it.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
