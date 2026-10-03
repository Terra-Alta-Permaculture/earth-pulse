/** Compact human number: 128000 → 128K, 2400000 → 2.4M. */
export function compact(n: number | null): string {
  if (n === null || Number.isNaN(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`
  if (abs >= 1_000) return `${(n / 1_000).toFixed(abs >= 10_000 ? 0 : 1)}K`
  if (abs < 10 && !Number.isInteger(n)) return n.toFixed(1)
  return `${Math.round(n)}`
}

export function signedPct(n: number | null): string {
  if (n === null || Number.isNaN(n)) return '—'
  const s = n >= 0 ? '+' : ''
  return `${s}${n.toFixed(1)}%`
}

export function relativeTime(iso: string | null): string {
  if (!iso) return 'no data'
  const diff = Date.now() - +new Date(iso)
  const h = Math.floor(diff / 3_600_000)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}
