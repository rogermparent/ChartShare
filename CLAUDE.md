# ChartShare Workspace

## Overview

pnpm monorepo with two Next.js 16 PWA apps that share code via an internal package. Both apps render AmCharts 5 charts from JSON stored in SQLite via Drizzle ORM.

## Workspace structure

```
chartshare-webapp/     — Full-stack Next.js app (SSR, full CRUD)
chartshare-static/     — Static export for CDN/Cloudflare Pages (read-only)
packages/chartshare-common/  — Shared components, hooks, types, db layer (no build step)
```

## Key differences between apps

| | webapp | static |
|---|---|---|
| Next.js output | default (SSR) | `output: "export"` |
| API routes | Full CRUD (`force-dynamic`) | Read-only GET (`force-static` + `generateStaticParams`) |
| `page.tsx` | Create, edit, delete charts | Read-only viewer |
| Sidebar | "New" button (passes `onNew` to shared Sidebar) | No `onNew` prop, no "New" button |
| Edit button | Present in chart view header | Absent |
| Deploy target | Node.js server | Cloudflare Pages (`.wrangler/` dir) |

## chartshare-common (internal package pattern)

- **No build step** — exports raw `.tsx`/`.ts` source files via `package.json` `"exports"` field
- Both apps use `transpilePackages: ["chartshare-common"]` in `next.config.ts` so Next.js bundles it
- Both apps have a tsconfig path alias: `"chartshare-common/*" -> "../packages/chartshare-common/*"`
- Peer dependencies (react, next, amcharts, drizzle, better-sqlite3) are resolved from the consuming app

### What's shared

- **Components**: `Sidebar` (onNew is optional), `ChartRenderer`, `ChartForm`, `BookmarkManager`
- **Hooks**: `useCharts` (fetch/CRUD via REST), `useBookmarks` (localStorage-backed groups)
- **Types**: `ChartRecord`, `BookmarkGroup`, `BookmarkState`
- **DB**: Drizzle schema + better-sqlite3 connection (`getDb`, `openDb`, `closeDb`)
- **Manifest**: `baseManifest` object spread in each app's `manifest.ts`
- **Layout**: `RootLayout` component, `layoutMetadata`, `layoutViewport` — each app's `layout.tsx` re-exports metadata/viewport and wraps children in `<RootLayout fontClassName={...}>`

### What stays per-app

- `app/page.tsx` — fundamentally different UI/behavior
- `app/globals.css` — Tailwind `@import` must resolve from app's node_modules
- `app/layout.tsx` — thin wrapper: font init (`next/font/google`), CSS import, re-exports shared metadata/viewport, renders shared `RootLayout`
- `app/sw.ts`, `app/~offline/page.tsx` — Next.js-specific, trivial
- `app/api/` routes — different per app
- `next.config.ts` — different output modes
- `drizzle.config.ts` — identical but schema path points to `../packages/chartshare-common/db/schema.ts`
- `cypress/` — tests and fixtures
- `public/` — app-specific assets (static has extra PWA screenshots)

## Build commands

```sh
# From workspace root
pnpm install

# Build individual apps (run from their directories)
cd chartshare-webapp && pnpm build
cd chartshare-static && pnpm build

# Dev server
pnpm dev              # default Next.js dev (port 3000)
pnpm dev:test         # with TEST_MODE=true (enables test-invalidate-cache route)

# Database
pnpm db:push          # push schema to sqlite.db
pnpm db:generate      # generate migration
pnpm db:studio        # Drizzle Studio GUI

# Tests (Cypress E2E)
pnpm cypress:open     # interactive
pnpm cypress:run      # headless
pnpm test:e2e         # start server + run tests
```

## Tech stack

- **Next.js 16** with `--webpack` flag (not Turbopack)
- **React 19**, **TypeScript 5** (strict)
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **AmCharts 5** — charts rendered via `JsonParser` from JSON config
- **Drizzle ORM** + **better-sqlite3** — SQLite with WAL mode
- **Serwist** (PWA service worker) — offline fallback to `/~offline`
- **Cypress 15** — E2E tests with fixture databases
- **pnpm 10** workspaces

## Important patterns

- `ChartRenderer` is always loaded with `dynamic(() => import(...), { ssr: false })` because AmCharts requires the DOM
- The `useCharts` hook includes write methods (create/update/delete) even in the static app — they're just unused. This keeps the shared code simple.
- Sidebar's `onNew` prop is optional. When provided, the "New" button renders; when omitted, it doesn't. This is how the same component serves both apps.
- Each app has its own `sqlite.db` file in its directory. The db connection uses a relative path (`"sqlite.db"`), so it resolves relative to the app's working directory at runtime.
- Cypress fixture databases live in `cypress/fixtures/databases/` and are swapped in via `scripts/load-fixture.ts` or the `test-invalidate-cache` API route (webapp only).
