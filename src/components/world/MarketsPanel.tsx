import { useEffect, useState } from 'react'
import { MARKETS_SEED, CRITICAL_MINERAL_USES, MARKETS_SOURCES } from '../../data/markets'
import type { WorldHuman } from '../../hooks/useWorldPulse'
import { InfoDot } from '../InfoDot'
import { ActOnThis } from '../ActOnThis'

interface LiveMarkets {
  btc?: number; btcChange?: number
  eth?: number; ethChange?: number
  mktCapT?: number; btcDom?: number
  gold?: number; silver?: number
  fng?: number; fngLabel?: string
  live: boolean
}

async function j(url: string): Promise<any> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

let cache: { at: number; data: LiveMarkets } | null = null
const FIVE_MIN = 5 * 60 * 1000

async function loadMarkets(): Promise<LiveMarkets> {
  if (cache && Date.now() - cache.at < FIVE_MIN) return cache.data
  const out: LiveMarkets = { live: false }
  const [price, global, gold, silver, fng] = await Promise.allSettled([
    j('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'),
    j('https://api.coingecko.com/api/v3/global'),
    j('https://api.gold-api.com/price/XAU'),
    j('https://api.gold-api.com/price/XAG'),
    j('https://api.alternative.me/fng/'),
  ])
  if (price.status === 'fulfilled') {
    out.btc = price.value?.bitcoin?.usd
    out.btcChange = price.value?.bitcoin?.usd_24h_change
    out.eth = price.value?.ethereum?.usd
    out.ethChange = price.value?.ethereum?.usd_24h_change
  }
  if (global.status === 'fulfilled') {
    const d = global.value?.data
    if (d?.total_market_cap?.usd) out.mktCapT = d.total_market_cap.usd / 1e12
    if (d?.market_cap_percentage?.btc) out.btcDom = d.market_cap_percentage.btc
  }
  if (gold.status === 'fulfilled') out.gold = gold.value?.price
  if (silver.status === 'fulfilled') out.silver = silver.value?.price
  if (fng.status === 'fulfilled') {
    const f = fng.value?.data?.[0]
    if (f) { out.fng = Number(f.value); out.fngLabel = f.value_classification }
  }
  out.live = out.btc != null || out.gold != null
  cache = { at: Date.now(), data: out }
  return out
}

const usd = (n?: number, d = 0) =>
  n == null ? '—' : '$' + n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d })

function Tile({
  label, value, sub, dot, accent = 'ember', change,
}: {
  label: string; value: string; sub?: string; dot?: string; accent?: 'ember' | 'moss'; change?: number
}) {
  const border = accent === 'moss' ? 'border-moss-800/40 bg-moss-950/20' : 'border-soil-700/50 bg-soil-900/40'
  const num = accent === 'moss' ? 'text-moss-200' : 'text-sand-100'
  return (
    <div className={`rounded-xl border p-4 ${border}`}>
      <span className="flex items-center gap-1.5">
        <span className="text-[0.75rem] uppercase tracking-wide text-sand-500">{label}</span>
        {dot && <InfoDot topic={dot} label={label} />}
      </span>
      <span className={`stat-num mt-1 block text-2xl ${num}`}>{value}</span>
      <span className="mt-0.5 block text-[0.72rem] leading-snug text-sand-500">
        {change != null && isFinite(change) && (
          <span className={change >= 0 ? 'text-moss-300' : 'text-ember-300'}>
            {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}% · {' '}
          </span>
        )}
        {sub}
      </span>
    </div>
  )
}

export function MarketsPanel({ live: writ }: { live?: WorldHuman['markets'] }) {
  const [m, setM] = useState<LiveMarkets>({ live: false })
  useEffect(() => {
    let cancelled = false
    loadMarkets().then((d) => !cancelled && setM(d)).catch(() => {})
    return () => { cancelled = true }
  }, [])

  const stocksNote = writ?.stocks_note ?? MARKETS_SEED.stocksNote
  const mineralsNote = writ?.minerals_note ?? MARKETS_SEED.mineralsNote
  const chinaMining = writ?.china_mining_pct ?? MARKETS_SEED.chinaMiningPct
  const chinaProcessing = writ?.china_processing_pct ?? MARKETS_SEED.chinaProcessingPct
  const asOf = writ?.as_of ?? MARKETS_SEED.asOf
  const isLive = m.live || Boolean(writ && (writ.stocks_note || writ.minerals_note))

  return (
    <section className="card mb-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl text-sand-100">💰 Markets, metals &amp; crypto</h2>
          <InfoDot topic="markets_watch" label="Markets, metals & crypto" />
        </div>
        <span className="text-xs text-sand-500">
          {m.live ? 'live · ' : isLive ? 'updated weekly · ' : ''}as of {asOf}
        </span>
      </div>
      <p className="mt-1 text-sm text-sand-400">
        The money layer — where capital flows, what it’s betting on, and the
        scramble for the metals behind every screen, turbine and weapon. Markets
        allocate, but they also <em>concentrate</em>.
      </p>

      {/* Live ticker */}
      <div className="mt-4 grid gap-3 grid-cols-2 lg:grid-cols-3">
        <Tile label="Bitcoin" value={usd(m.btc)} change={m.btcChange} sub="24h" dot="mkt_btc" />
        <Tile label="Ethereum" value={usd(m.eth)} change={m.ethChange} sub="24h" dot="mkt_eth" />
        <Tile label="Crypto market cap" value={m.mktCapT != null ? `$${m.mktCapT.toFixed(2)}T` : '—'}
          sub={m.btcDom != null ? `BTC ${m.btcDom.toFixed(0)}% of it` : 'all coins'} dot="mkt_cap" />
        <Tile label="Gold" value={m.gold != null ? `${usd(m.gold)}/oz` : '—'} sub="spot" dot="mkt_gold" />
        <Tile label="Silver" value={m.silver != null ? `${usd(m.silver, 2)}/oz` : '—'} sub="spot" dot="mkt_silver" />
        <Tile label="Fear & Greed" value={m.fng != null ? String(m.fng) : '—'}
          sub={m.fngLabel ?? 'crypto sentiment'} accent={m.fng != null && m.fng >= 50 ? 'moss' : 'ember'} dot="mkt_fng" />
      </div>

      {/* Stocks — writer one-liner */}
      <div className="mt-3 flex items-start gap-2 rounded-xl border border-soil-800 bg-soil-900/40 p-3">
        <span className="mt-0.5 text-sm">📈</span>
        <p className="text-[0.82rem] leading-snug text-sand-300">
          <span className="font-medium text-sand-100">Stocks:</span> {stocksNote}
        </p>
      </div>

      {/* Rare earths & critical minerals */}
      <h3 className="mt-5 flex items-center gap-1.5 text-[0.8rem] uppercase tracking-wide text-sand-500">
        Rare earths &amp; critical minerals
        <InfoDot topic="rare_earths" label="Rare earths & critical minerals" />
      </h3>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{chinaMining}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">of rare-earth mining is in China</span>
        </div>
        <div className="rounded-xl border border-ember-800/40 bg-ember-950/20 p-4">
          <span className="stat-num block text-3xl text-ember-200">{chinaProcessing}%</span>
          <span className="mt-1 block text-[0.78rem] leading-snug text-sand-400">of the refining & processing too</span>
        </div>
      </div>
      <p className="mt-2 text-[0.82rem] leading-snug text-sand-300">{mineralsNote}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {CRITICAL_MINERAL_USES.map((u) => (
          <span key={u} className="rounded-full border border-soil-700 bg-soil-800/50 px-2 py-0.5 text-[0.68rem] text-sand-400">
            {u}
          </span>
        ))}
      </div>
      <p className="mt-3 text-[0.72rem] leading-snug text-sand-600">
        The “weightless” digital economy and the “clean” green transition both rest
        on vast tonnages of dug-up rock — the quiet extraction below the line.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[0.7rem] text-sand-600">Sources:</span>
        {MARKETS_SOURCES.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
            className="text-[0.7rem] text-moss-300 underline underline-offset-2 hover:text-moss-200">
            {s.label} ↗
          </a>
        ))}
      </div>

      <div className="mt-4">
        <ActOnThis q="regenerative economy" label="new-economy events" />
      </div>
    </section>
  )
}
