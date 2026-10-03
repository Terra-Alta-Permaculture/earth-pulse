// Compresses raw snapshot rows into a compact per-indicator summary suitable
// for a model prompt. Shared by the scenarios and advice functions.

export interface SnapshotRow {
  indicator_name: string
  value: number
  unit: string
  source: string
  stream: 'crisis' | 'regeneration'
  region: string
  fetched_at: string
}

export interface IndicatorSummary {
  indicator: string
  stream: string
  unit: string
  source: string
  latest: number
  earliest: number
  changePct: number | null
  points: number
}

export function summarize(rows: SnapshotRow[]): IndicatorSummary[] {
  const byKey = new Map<string, SnapshotRow[]>()
  for (const r of rows) {
    const arr = byKey.get(r.indicator_name) ?? []
    arr.push(r)
    byKey.set(r.indicator_name, arr)
  }

  const out: IndicatorSummary[] = []
  for (const [key, series] of byKey) {
    series.sort((a, b) => +new Date(a.fetched_at) - +new Date(b.fetched_at))
    const first = series[0]
    const last = series[series.length - 1]
    const changePct =
      first.value !== 0
        ? ((last.value - first.value) / Math.abs(first.value)) * 100
        : null
    out.push({
      indicator: key,
      stream: last.stream,
      unit: last.unit,
      source: last.source,
      latest: last.value,
      earliest: first.value,
      changePct: changePct === null ? null : Number(changePct.toFixed(1)),
      points: series.length,
    })
  }
  return out
}

/** A short text digest for embedding in a prompt. */
export function digest(summaries: IndicatorSummary[]): string {
  return summaries
    .map((s) => {
      const dir =
        s.changePct === null ? 'flat' : s.changePct >= 0 ? 'up' : 'down'
      const chg = s.changePct === null ? 'n/a' : `${s.changePct}%`
      return `- [${s.stream}] ${s.indicator}: ${s.latest} ${s.unit} (${dir} ${chg} over ${s.points} days, source ${s.source})`
    })
    .join('\n')
}
