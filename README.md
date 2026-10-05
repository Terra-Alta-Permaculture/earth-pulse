# 🌍 EarthPulse

**Planetary intelligence, all live and free.** EarthPulse reads the real state of
the planet — and the human systems pressing on it — the way NOVA's *Vertical
Politics* frames it: not left vs right, but **above the line** (regeneration) vs
**below the line** (extraction). Everything is fetched live, in your browser, from
free public data feeds. No account, no database, nothing to configure.

Part of the Terra Alta portfolio, built on the thinking in the book **NOVA** by
Pedro Valdjiu. Stack: **React 18 · Vite · TypeScript · Tailwind v3 · Vercel**,
with a few serverless functions calling the **Claude API** (`claude-sonnet-5`).

**Live at → https://earthpulse.terralta.org** · installable as an app (PWA).

> 💻 **Working on this app from another computer?** See **[SETUP.md](SETUP.md)** —
> a beginner-friendly guide to cloning and running EarthPulse, via GitHub Desktop
> (buttons) or the Terminal.

---

## Quick start

```bash
npm install
```
```bash
npm run dev
```

Open http://localhost:5173. **No environment variables are needed** — the whole
dashboard runs on live, keyless public APIs. (The optional AI panels and weekly
writers only run on the deployed Vercel app; locally they fall back gracefully.)

```bash
npm run build
```
builds the production bundle to `dist/` and type-checks the project.

---

## The three tabs

### 🪐 Planet — the living planet, right now
Driven entirely by live client-side feeds (6-hour cache on the slow ones):

- **Daily briefing** — a plain-language state-of-the-planet paragraph, composed
  deterministically from the live signals (zero cost, no LLM).
- **Vitals + dual streams** — ~30 indicators split into *below the line*
  (extraction) and *above the line* (regeneration), each with a sparkline and a
  tap-for-plain-English "i".
- **Live world map** — real-time earthquakes (USGS) and natural events (NASA
  EONET), drawn on a bundled equirectangular projection.
- **Your Pulse** — opt-in, location-aware local conditions + nearby regenerative
  places to plug into (geolocation stays in the browser).
- **The Doughnut** — Kate Raworth's safe-&-just space with a live score, plus the
  Doughnut-in-practice movement.
- **Two maps** — a curated degradation layer and a regeneration-hubs layer.
- **The law catching up** — a Rights-of-Nature & ecocide Law Tracker (auto-updated
  weekly) with a country filter.
- **Seed sovereignty / Soil not oil** — Vandana Shiva's framing.
- **The planet over time** — a small daily record of the headline numbers so a
  trend line builds up.
- **Sonification** and a **shareable snapshot**, both generated in-browser.

### 🌐 World — the human systems pressing on the planet
- **12 geopolitical forces**, each with a 0–10 tension score, direction, a
  regeneration counterpoint, indicators and sources — plus a weekly brief, a
  world-tension meter, an A/B/C/D scenario lean and a signpost timeline.
- **The widening circle of rights** — standalone panels for **wars & armed
  conflicts**, **gender equality**, **human rights & freedom**, **children's
  rights**, **Rights of Nature**, and **animal rights**. Live World Bank data
  where a clean keyless source exists, curated-and-cited figures (with source
  links) where it doesn't.
- Updates **weekly** (Planet is live every visit). Renders fully from bundled
  seed data with a "sample data" badge until the first live write lands.

### 📖 NOVA — the thinking behind it
The philosophy that steers the app: *The Inversion*, *Vertical Politics* and the
Five Questions, the Six Bridges, Earth Democracy & Ecofeminism (Vandana Shiva),
and a personal note on why it was built.

---

## Architecture

All-live, no database. The browser fetches public feeds directly; a handful of
Vercel serverless functions add the (optional) AI panels and the weekly writers,
using **Vercel Blob** for the little state that must persist.

```
Browser (React/Vite)
  ├── live feeds (keyless, CORS): NOAA · USGS · NASA EONET · Open-Meteo ·
  │     GBIF · iNaturalist · World Bank · sea-level · reverse-geocode · OSM
  ├── /api/ai        ─▶ Claude ─▶ scenarios + advice (per visit)
  ├── /api/world     ─▶ reads World Pulse from Vercel Blob
  ├── /api/law       ─▶ reads the law-watch from Vercel Blob
  └── /api/history   ─▶ reads/appends the daily "planet over time" record

Vercel Cron (weekly, Sundays):
  /api/world-refresh ─▶ Claude + web search ─▶ Vercel Blob (world/latest.json)
  /api/law-refresh   ─▶ Claude + web search ─▶ Vercel Blob (law/latest.json)
```

The Claude API key lives **only** in the serverless functions — never in the
browser.

---

## Environment variables

The dashboard needs **none**. These only power the serverless extras on Vercel
(see [`.env.example`](.env.example)):

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | AI panels + the weekly World Pulse / law writers |
| `ANTHROPIC_MODEL` | optional — defaults to a current Claude model in code |
| `CRON_SECRET` | optional — if set, cron endpoints require it as a bearer token |
| `BLOB_READ_WRITE_TOKEN` | injected automatically by Vercel Blob — don't set it |
| `VITE_*_ENDPOINT` | optional — point the client at different API routes |

The weekly writers can be triggered manually (small Claude cost) with
`…/api/world-refresh?force=1` and `…/api/law-refresh?force=1`.

---

## Deploy (Vercel)

Standard Vite build (`npm run build` → `dist/`). The repo is connected to Vercel,
so **every push to `main` auto-deploys** to https://earthpulse.terralta.org. The
two weekly crons are declared in [`vercel.json`](vercel.json); set
`ANTHROPIC_API_KEY` in the Vercel project and connect a Blob store for the live
World Pulse, law watch and history to persist.

---

_Built on the thinking in NOVA by Pedro Valdjiu · Terra Alta, Sintra ·
auto-deployed from `main` via Vercel._
