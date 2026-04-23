# Moontrack

A cycle tracker that respects your privacy and gives useful coaching — for energy, sleep, and training.

**Status:** v0 skeleton — landing page + localStorage cycle tracker. Full adaptive model not yet wired.

**Landing:** https://moontrack.vercel.app

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind v4 |
| Fonts | Inter via `next/font/google` |
| Hosting | Vercel (zero config) |
| Waitlist | https://waitlist-api-sigma.vercel.app |

## Run locally

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Deploy

Push to `main` — Vercel picks it up automatically. No environment variables required.

## Routes

| Route | Description |
|---|---|
| `/` | Landing page (original copy + design preserved) |
| `/try` | Log a cycle start date, see next predicted date (28 days), add mood notes for the week — localStorage only |
| `/api/waitlist` | `POST { email }` → forwards to waitlist-api-sigma with `product: "moontrack"` |

## Privacy

`/try` stores all data in the browser's `localStorage`. No account required, nothing sent to any server.

## What's next

- Adaptive cycle length (learn from multiple logged cycles)
- Phase-aware training and sleep recommendations
- Offline support (PWA / service worker)
