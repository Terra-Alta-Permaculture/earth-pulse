# EarthPulse — working on this app from another computer

You don't need to copy anything by hand. The app lives in the cloud on GitHub:

**https://github.com/Terra-Alta-Permaculture/earth-pulse**

That cloud copy is the "repo." Any Mac can download it, change it, and upload it
back. Every upload (`push`) automatically rebuilds the live site at
**https://earthpulse.terralta.org** (via Vercel) — so you can edit and ship from
any computer.

The app is a React + Vite project and needs **Node.js 20** to run locally.

---

## The golden rule

Work on **one computer at a time**, and **always pull (download the latest)
before you start**. That way your two Macs never fight over the same file.
If you ever see a "conflict" warning, stop and ask Claude — don't force it.

The whole loop is: **pull → edit → commit → push.**

---

## Route A — GitHub Desktop (buttons, no commands)

**One-time setup**

1. Install **GitHub Desktop** from https://desktop.github.com and sign in with
   the GitHub account that owns the code (**TerraAlta**).
2. **File → Clone repository → GitHub.com**, pick
   `Terra-Alta-Permaculture/earth-pulse`, choose a folder, click **Clone**.
3. Install **Node.js (LTS, v20)** from https://nodejs.org (double-click the
   installer).
4. Install an editor if you don't have one: **VS Code** from
   https://code.visualstudio.com.

**Run it locally**

- In GitHub Desktop: **Repository → Open in Terminal**, then:
  ```bash
  npm install
  ```
  ```bash
  npm run dev
  ```
- Open the `http://localhost:5173` link it prints.
- **Repository → Open in Visual Studio Code** to edit the files.

**Save your work (and deploy)**

1. **Fetch origin**, then **Pull** (do this before you start editing).
2. Make your edits (keep `npm run dev` running to preview them).
3. In GitHub Desktop: type a short **Summary**, click **Commit to main**,
   then **Push origin**.
4. The live site updates in ~1–2 minutes.

---

## Route B — Terminal (git commands)

**One-time setup**

```bash
xcode-select --install
```
(installs git; download Node.js 20 LTS from https://nodejs.org separately)

```bash
git clone https://github.com/Terra-Alta-Permaculture/earth-pulse.git
```

```bash
cd earth-pulse && npm install
```

To be able to push, sign in once (GitHub CLI):

```bash
brew install gh && gh auth login
```

**Run it locally**

```bash
npm run dev
```

**Daily loop**

```bash
git pull
```
...make edits...
```bash
git add -A && git commit -m "describe what I changed" && git push
```

---

## Working with Claude on the other Mac

Install the **Claude desktop app** (or Claude Code) on the other Mac, open the
`earth-pulse` folder, and Claude will have the full project context — it can run
the commits and pushes for you, so the steps above become optional.

---

## Quick facts

- **Live site:** https://earthpulse.terralta.org
- **Repo:** https://github.com/Terra-Alta-Permaculture/earth-pulse (public)
- **Hosting:** Vercel — auto-deploys on every push to `main`
- **Node version:** 20
- **Common commands:** `npm run dev` (preview locally) · `npm run build` (check
  it compiles)
- **Backend:** none to set up — the app runs on free, keyless public data feeds,
  plus a few Vercel serverless functions already configured in the cloud.
