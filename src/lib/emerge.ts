// Links into Emerge (emerge.terralta.org) — Terra Alta's app for finding
// regenerative events, learning quests and practitioners. EarthPulse shows
// what's happening; Emerge is where you go to do something about it.

import { useSyncExternalStore } from 'react'

export const EMERGE_URL = 'https://emerge.terralta.org'

/** Emerge events, optionally pre-searched and/or centred on a place. */
export function emergeEvents(opts: { q?: string; lat?: number; lng?: number; place?: string } = {}): string {
  const p = new URLSearchParams()
  if (opts.q) p.set('q', opts.q)
  if (opts.lat != null && opts.lng != null) {
    // ~1 km precision is plenty to find nearby events.
    p.set('lat', opts.lat.toFixed(2))
    p.set('lng', opts.lng.toFixed(2))
    if (opts.place) p.set('place', opts.place)
  }
  const qs = p.toString()
  return qs ? `${EMERGE_URL}/?${qs}` : `${EMERGE_URL}/`
}

export const EMERGE_QUESTS = `${EMERGE_URL}/quests`
export const EMERGE_GUILD = `${EMERGE_URL}/guild`

// ── Visitor location, shared across the app for this visit only ──
// Set when someone uses "Find events near me" or "Your pulse", so every Emerge
// link can open centred on them. Kept in memory — never saved; gone on reload.

export interface EmergePlace {
  lat: number
  lng: number
  place?: string
}

let here: EmergePlace | null = null
const listeners = new Set<() => void>()

export function setEmergePlace(p: EmergePlace) {
  here = p
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** The visitor's location if they've shared it this visit, else null. */
export function useEmergePlace(): EmergePlace | null {
  return useSyncExternalStore(subscribe, () => here)
}
