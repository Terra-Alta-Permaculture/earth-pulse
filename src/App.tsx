import { useEffect, useState } from 'react'
import { useLiveSignals } from './hooks/useLiveSignals'
import { Header, type Tab } from './components/Header'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PlanetPulsePage } from './components/PlanetPulsePage'
import { WorldPulsePage } from './components/world/WorldPulsePage'
import { NovaPage } from './components/NovaPage'

function currentTab(): Tab {
  if (typeof window === 'undefined') return 'planet'
  if (window.location.hash === '#world') return 'world'
  if (window.location.hash === '#nova') return 'nova'
  return 'planet'
}

export default function App() {
  const [tab, setTab] = useState<Tab>(currentTab)
  const live = useLiveSignals()

  useEffect(() => {
    const onHash = () => setTab(currentTab())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const changeTab = (t: Tab) => {
    window.location.hash = t === 'planet' ? '' : t
    setTab(t)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Header
        tab={tab}
        onTab={changeTab}
        showLive={tab === 'planet'}
        lastUpdated={live.lastUpdated}
        onRefresh={live.refresh}
      />

      <ErrorBoundary area={`${tab} view`} key={tab}>
        {tab === 'world' ? (
          <WorldPulsePage />
        ) : tab === 'nova' ? (
          <NovaPage />
        ) : (
          <PlanetPulsePage live={live} />
        )}
      </ErrorBoundary>

      <footer className="mt-14 border-t border-soil-800 pt-6 text-center text-xs text-sand-700">
        {tab === 'world'
          ? 'EarthPulse · World Pulse · weekly readings of the human systems pressing on the planet'
          : tab === 'nova'
          ? 'EarthPulse · built on the thinking in NOVA by Pedro Valdoleiros · Terra Alta, Sintra'
          : 'EarthPulse · live data from NOAA, USGS, NASA, Open-Meteo, GBIF & iNaturalist · scenarios & advice by Claude'}
      </footer>
    </div>
  )
}
