import { format } from 'date-fns'

export type Tab = 'planet' | 'world' | 'nova'

interface Props {
  tab: Tab
  onTab: (t: Tab) => void
  showLive?: boolean
  lastUpdated?: string | null
  onRefresh?: () => void
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'planet', label: 'Planet' },
  { key: 'world', label: 'World' },
  { key: 'nova', label: 'NOVA' },
]

const SUBTITLE: Record<Tab, string> = {
  planet: 'Dual-stream planetary intelligence',
  world: 'Pressures on the planet',
  nova: 'The thinking behind this',
}

export function Header({ tab, onTab, showLive, onRefresh }: Props) {
  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-soil-600 bg-soil-800">
            <span className="absolute h-2.5 w-2.5 rounded-full bg-moss-400 animate-pulse-ring" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-gradient-to-br from-ember-400 to-moss-400" />
          </span>
          <div>
            <h1 className="font-display text-2xl leading-none tracking-tight text-sand-100">
              Earth<span className="text-moss-400">Pulse</span>
            </h1>
            <p className="mt-1 text-xs text-sand-500">{SUBTITLE[tab]}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab switch */}
          <div className="inline-flex rounded-xl border border-soil-600 bg-soil-800 p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => onTab(t.key)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  tab === t.key ? 'bg-moss-600 text-soil-950' : 'text-sand-400 hover:text-sand-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <span className="hidden text-xs text-sand-500 sm:inline">
            {format(new Date(), 'EEEE, d MMM yyyy')}
          </span>

          {showLive && (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-moss-700/50 bg-moss-700/10 px-2.5 py-1 text-[0.65rem] font-medium text-moss-200">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-moss-400 opacity-70 animate-pulse-ring" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-moss-400" />
                </span>
                live data
              </span>
              <button
                onClick={onRefresh}
                className="rounded-lg border border-soil-600 bg-soil-800 px-3 py-1.5 text-xs font-medium text-sand-300 transition-colors hover:bg-soil-700"
              >
                Refresh
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
