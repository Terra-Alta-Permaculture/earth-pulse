// Shared "safe & just space" score, used by both the Doughnut ring and the
// daily briefing so they can never disagree. Each dimension scores 1 if it's
// within the space (social floor met / ecological boundary safe), 0.5 if
// borderline, 0 if beyond a limit. 100 = fully inside the Doughnut.

const W: Record<string, number> = {
  met: 1,
  safe: 1,
  moderate: 0.5,
  risk: 0.5,
  severe: 0,
  crossed: 0,
}

export interface DoughnutScore {
  score: number
  fullyIn: number
  beyond: number
  total: number
}

export function doughnutScore(
  social: { status: string }[],
  eco: { status: string }[],
): DoughnutScore | null {
  if (!social.length || !eco.length) return null
  const total = social.length + eco.length
  const earned = [...social, ...eco].reduce((a, x) => a + (W[x.status] ?? 0), 0)
  const fullyIn =
    social.filter((s) => s.status === 'met').length + eco.filter((e) => e.status === 'safe').length
  const beyond =
    social.filter((s) => s.status === 'severe').length + eco.filter((e) => e.status === 'crossed').length
  return { score: Math.round((earned / total) * 100), fullyIn, beyond, total }
}
