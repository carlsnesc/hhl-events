# HHL Events — Deploy & Embed Runbook

This gets the app live on Vercel and embedded in Notion in under 20 minutes.
No coding knowledge required.

---

## Files in this package

```
hhl-events/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    └── App.jsx        ← the full application
```

---

## Step 1 — Create GitHub repo

1. Go to **github.com** → sign in
2. Click **+** (top right) → **New repository**
3. Name: `hhl-events`
4. Visibility: **Private** (recommended) or Public
5. Click **Create repository**
6. On the next screen, click **uploading an existing file**
7. Drag and drop **all files** from this folder, keeping the folder structure:
   - `index.html` → root
   - `package.json` → root
   - `vite.config.js` → root
   - `src/main.jsx` → when uploading, rename to `src/main.jsx` (GitHub auto-creates the folder)
   - `src/App.jsx` → same, rename to `src/App.jsx`
8. Commit message: `Initial deploy`
9. Click **Commit changes**

---

## Step 2 — Deploy to Vercel

1. Go to **vercel.com** → sign up / sign in (free)
2. Click **Add New Project**
3. Click **Import** next to your `hhl-events` GitHub repo
4. Settings:
   - Framework: **Vite** (Vercel auto-detects this)
   - Build command: `npm run build` (auto-filled)
   - Output directory: `dist` (auto-filled)
5. Click **Deploy**
6. Wait ~60 seconds
7. ✅ You'll get a URL like: `https://hhl-events-abc123.vercel.app`

> **Custom domain (optional):** In Vercel project settings → Domains → add `events.healthcarehomeloans.com.au` if you want a branded URL.

---

## Step 3 — Configure Zapier

1. Go to **zapier.com** → **Create Zap**
2. **Trigger:** Webhooks by Zapier → Catch Hook
3. Copy the webhook URL (looks like `https://hooks.zapier.com/hooks/catch/12345/abcdef/`)
4. Open the HHL Events app → click **⚙️ Settings** (top right of nav)
5. Paste the webhook URL into the Zapier field → it saves automatically
6. Back in Zapier, click **Test trigger** — create or edit any event in the app to fire a test payload
7. **Action:** choose what happens next:
   - **Notion** → Create Database Item (new event goes straight into Notion DB)
   - **Slack** → Send channel message (alert team when event added)
   - **Google Sheets** → Add row (auto-log all events)
   - **Gmail** → Send email (notify hospital contact)
8. Turn on the Zap

### Payload fields sent to Zapier

| Field | Example |
|-------|---------|
| `event_name` | Westmead — Vaccination |
| `event_type` | Vaccination |
| `status` | Confirmed |
| `date` | 2026-05-29 |
| `time` | 07:00 |
| `end_time` | 16:00 |
| `hospital` | Westmead |
| `address` | WECC level 1 L103 & L104 |
| `lead` | Georgia |
| `team` | Georgia, Emma |
| `expected_attendees` | 400 |
| `budget` | A$800.00 |
| `site_contact_name` | — |
| `site_contact_phone` | — |
| `site_contact_email` | — |
| `notes` | — |
| `timestamp` | 2026-05-17T02:30:00.000Z |

---

## Step 4 — Embed in Notion

1. Open the Notion page where you want the app (e.g. your Events hub page)
2. Click into the page body → type `/embed` → select **Embed**
3. Paste your Vercel URL (e.g. `https://hhl-events-abc123.vercel.app`)
4. Click **Embed link**
5. Drag the bottom edge of the embed block to make it taller (aim for ~800px)
6. Click the `⋮⋮` handle on the left → **Turn into full width** for best display
7. ✅ Done — the full HHL Events app is now live inside Notion

> **Tip:** Pin this Notion page to your sidebar so the team can access it in one click.

---

## Updating the app

When you get an updated `App.jsx` file:
1. Go to your GitHub repo → `src/App.jsx`
2. Click the pencil (edit) icon → delete all content → paste the new file
3. Click **Commit changes**
4. Vercel auto-deploys within ~60 seconds
5. Refresh Notion — the embed updates automatically

---

## Notes on shared state

Currently all data (events, marketing tasks, inventory) saves to **localStorage** — meaning it's per-device and per-browser. This is fine for a single-operator setup.

If you want the whole team to see the same data in real time, the upgrade path is:
- **Supabase** (free Postgres backend) — ask Claude to add Supabase sync
- Takes ~2 hours to add; data then syncs across all devices instantly

---

*Built by Claude (claude.ai) for Healthcare Home Loans*
