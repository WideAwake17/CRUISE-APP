# 🛳️ Cruise App — Deployment Package

Your group cruise companion app, ready to deploy.

## Project Structure

```
cruise-deploy/
├── index.html          ← App entry point
├── package.json        ← Dependencies
├── vite.config.js      ← Build config
├── .gitignore
└── src/
    ├── main.jsx        ← Loads storage shim + mounts app
    ├── storage.js      ← localStorage shim (replaces Claude's window.storage)
    └── App.jsx         ← Your full cruise app
```

## Quick Start (Local)

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Vercel auto-detects Vite — just click Deploy
4. Done. You get a live URL instantly.

## Important Note on Real-Time Sync

The photo feed and meet-up alerts currently store data per-device only
(using localStorage). This means each person's phone shows their own posts.

To enable real-time sharing across devices, swap `src/storage.js` for
a Supabase or Firebase client. The rest of the app code doesn't change.

Ask Claude: "Add Supabase real-time storage to my cruise app"
