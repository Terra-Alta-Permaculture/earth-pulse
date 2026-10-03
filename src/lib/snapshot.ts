import type { LiveSignal } from '../data/liveSources'
import { buildBriefing } from './briefing'

export interface SnapshotData {
  date: string
  balance: number
  balanceWord: string
  stats: { label: string; value: string }[]
  takeaway: string
}

const C = {
  bg0: '#0f1a14',
  bg1: '#0a110d',
  sand: '#ece3d0',
  sandDim: '#b8ab90',
  muted: '#7d735d',
  moss: '#7bc063',
  ember: '#e0a852',
}

export function buildSnapshotData(signals: LiveSignal[], balance: number): SnapshotData {
  const by = new Map(signals.map((s) => [s.key, s]))
  const num = (k: string): number | null => {
    const s = by.get(k)
    if (!s) return null
    const n = typeof s.value === 'number' ? s.value : parseFloat(String(s.value).replace(/,/g, ''))
    return Number.isNaN(n) ? null : n
  }
  const stats: { label: string; value: string }[] = []
  const push = (label: string, v: number | null, unit: string) => {
    if (v != null) stats.push({ label, value: `${v.toLocaleString()} ${unit}` })
  }
  push('CO₂', num('co2'), 'ppm')
  push('Sea level', num('sea_level'), 'cm')
  push('Renewable power', num('renewable_electricity'), '%')
  push('Quakes · 24h', num('earthquakes'), '')
  push('Active hazards', num('natural_events'), '')

  const balanceWord =
    balance >= 60 ? 'leaning toward recovery' : balance >= 45 ? 'near equilibrium' : 'under strain'

  const briefing = buildBriefing(signals, balance)
  const takeaway = briefing?.sentences[briefing.sentences.length - 1] ?? ''

  const date = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return { date, balance, balanceWord, stats: stats.slice(0, 5), takeaway }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

/** Renders a 1200×630 shareable card to a canvas (2× for crisp text). */
export async function renderSnapshotCanvas(data: SnapshotData): Promise<HTMLCanvasElement> {
  const W = 1200
  const H = 630
  const scale = 2
  const canvas = document.createElement('canvas')
  canvas.width = W * scale
  canvas.height = H * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)

  try {
    await (document as any).fonts?.ready
  } catch {
    /* fonts optional */
  }

  const display = 'Fraunces, Georgia, serif'
  const sans = 'ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif'

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, C.bg0)
  bg.addColorStop(1, C.bg1)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = 'rgba(123,192,99,0.18)'
  ctx.lineWidth = 2
  roundRect(ctx, 12, 12, W - 24, H - 24, 22)
  ctx.stroke()

  const PAD = 64

  // Header
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = C.moss
  ctx.beginPath()
  ctx.arc(PAD + 8, 66, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = `600 40px ${display}`
  ctx.fillStyle = C.sand
  ctx.fillText('EarthPulse', PAD + 28, 78)
  ctx.font = `400 24px ${sans}`
  ctx.fillStyle = C.sandDim
  ctx.textAlign = 'right'
  ctx.fillText(data.date, W - PAD, 74)
  ctx.textAlign = 'left'

  // Balance block
  ctx.font = `600 22px ${sans}`
  ctx.fillStyle = C.muted
  ctx.fillText('PLANETARY BALANCE', PAD, 190)
  ctx.font = `600 150px ${display}`
  ctx.fillStyle = C.sand
  ctx.fillText(String(data.balance), PAD, 320)
  const bw = ctx.measureText(String(data.balance)).width
  ctx.font = `400 44px ${display}`
  ctx.fillStyle = C.muted
  ctx.fillText('/100', PAD + bw + 12, 320)
  ctx.font = `400 28px ${sans}`
  ctx.fillStyle = C.sandDim
  ctx.fillText(data.balanceWord, PAD, 362)

  // Balance bar
  const barX = PAD
  const barY = 392
  const barW = 500
  const barH = 16
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  roundRect(ctx, barX, barY, barW, barH, 8)
  ctx.fill()
  const fillW = Math.max(barH, (data.balance / 100) * barW)
  const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0)
  grad.addColorStop(0, C.ember)
  grad.addColorStop(1, C.moss)
  ctx.fillStyle = grad
  roundRect(ctx, barX, barY, fillW, barH, 8)
  ctx.fill()

  // Stats column (right)
  const sx = 680
  let sy = 170
  for (const s of data.stats) {
    ctx.font = `500 22px ${sans}`
    ctx.fillStyle = C.muted
    ctx.fillText(s.label, sx, sy)
    ctx.font = `600 40px ${display}`
    ctx.fillStyle = C.sand
    ctx.fillText(s.value, sx, sy + 42)
    sy += 88
  }

  // Takeaway (bottom-left)
  ctx.font = `400 26px ${sans}`
  ctx.fillStyle = C.sandDim
  const lines = wrap(ctx, data.takeaway, 560)
  let ty = 470
  for (const l of lines.slice(0, 3)) {
    ctx.fillText(l, PAD, ty)
    ty += 34
  }

  // Footer
  ctx.font = `400 20px ${sans}`
  ctx.fillStyle = C.muted
  ctx.fillText('earthpulse.terralta.org · live data from NOAA · USGS · NASA · World Bank', PAD, H - 40)

  return canvas
}
