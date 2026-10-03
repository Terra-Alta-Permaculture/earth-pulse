import { Component, type ReactNode } from 'react'

const LAST_RELOAD = 'ep_eb_last_reload'
// Don't auto-reload more than once per window — a persistent (non-stale) crash
// must fall through to the fallback card instead of reload-looping.
const RELOAD_COOLDOWN_MS = 30_000

interface Props {
  children: ReactNode
  /** Short name of the area, shown in the fallback. */
  area?: string
}
interface State {
  error: Error | null
}

/**
 * Catches render errors in a subtree so one broken view can't blank the whole
 * app. A crash that looks like a stale-bundle / chunk mismatch (common right
 * after a deploy, when an old cached chunk meets new data) triggers a single
 * automatic reload to pull the fresh build; anything else shows a reload card.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    const msg = `${error?.name ?? ''} ${error?.message ?? ''}`
    const looksStale =
      /is not a function|dynamically imported module|failed to fetch dynamically|importing a module|chunk|unexpected token|is not defined/i.test(
        msg,
      )
    let last = 0
    try {
      last = Number(sessionStorage.getItem(LAST_RELOAD) || 0)
    } catch {
      /* storage blocked */
    }
    const recentlyReloaded = Date.now() - last < RELOAD_COOLDOWN_MS
    if (looksStale && !recentlyReloaded) {
      try {
        sessionStorage.setItem(LAST_RELOAD, String(Date.now()))
      } catch {
        /* ignore */
      }
      window.location.reload()
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="rounded-2xl border border-soil-700/60 bg-soil-900/60 p-8 text-center">
          <p className="text-sm font-medium text-sand-200">
            This {this.props.area ?? 'view'} hit a snag.
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs text-sand-500">
            It's usually a just-deployed update that needs a fresh load. A reload
            normally fixes it.
          </p>
          <button
            onClick={() => {
              try {
                sessionStorage.removeItem(LAST_RELOAD)
              } catch {
                /* ignore */
              }
              window.location.reload()
            }}
            className="mt-4 rounded-lg border border-moss-700/60 bg-moss-900/40 px-4 py-1.5 text-xs font-medium text-moss-100 transition-colors hover:border-moss-600 hover:bg-moss-900/70"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
