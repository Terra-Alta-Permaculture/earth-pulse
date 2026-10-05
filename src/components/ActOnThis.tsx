import { emergeEvents, useEmergePlace } from '../lib/emerge'

/** A small "Act on this" link that opens matching events on Emerge. */
export function ActOnThis({ q, label }: { q: string; label: string }) {
  const here = useEmergePlace()
  return (
    <a
      href={emergeEvents({ q, ...here })}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-moss-700/60 bg-moss-900/30 px-3 py-1 text-[0.72rem] font-medium text-moss-200 transition-colors hover:border-moss-500 hover:bg-moss-900/60"
    >
      ✋ Act on this: {label} on Emerge →
    </a>
  )
}
