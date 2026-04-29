# Event Manager

A small CRUD dashboard for managing events (conferences, webinars, meetings,
workshops). Built as a frontend test task with **Next.js 16 (App Router) +
TypeScript + Tailwind CSS v4**, custom UI (no third-party component
libraries), `next-intl` internationalization, dark/light themes, and
`localStorage`-backed event persistence.

> Live data is stored only in the browser (`localStorage`) — there is no
> backend. The first time you open the app it is seeded with mock events.

---

## Getting started

```bash
# install
npm install

# run dev server (http://localhost:3000)
npm run dev

# production build
npm run build
npm start

# lint
npm run lint
```

Requires Node.js 18.18+ (Next.js 16 requirement).

---

## Features

### Required

- **Event list** rendered as cards with title, description, date/time, category
  and status badges.
- **Add event** via a modal form with validation:
  - title is required (min 2 characters);
  - date/time is required and a _Planned_ event cannot be in the past
    (Completed events may be in the past, since that's realistic).
- **Edit event** — same modal, prefilled with existing values.
- **Delete event** — destructive confirmation modal with the event preview.
- **Filtering** by category (`Conference / Webinar / Meeting / Workshop`) and
  by status (`Planned / Completed`).
- **Sorting** by date (asc / desc) and by title (A→Z / Z→A).
- **Form errors** surface inline; CRUD actions trigger toast notifications.
- **Responsive layout** — sidebar collapses on tablet/mobile; cards stack to
  a single column; topbar adapts; mobile gets a dedicated search field above
  the filters.

### Optional / extra

- **Search** events by title or description (live filtering).
- **Favorites** — heart toggle on each card and a dedicated _Favorites_ tab.
- **Export to JSON** — downloads the full event list as
  `events-YYYY-MM-DD.json`.
- **View modes** — switch between a two-column card grid and a compact
  one-column list view on tablet/desktop.
- **Animated layout switching** — event cards smoothly morph between grid and
  list layouts using the View Transitions API with a safe fallback.
- **Dark / light theme** — theme switcher with animated color transitions and
  cookie-backed persistence across reloads.
- **Internationalization** — English, Russian and Kazakh (`en`, `ru`, `kk`)
  are stored in separate JSON message files.
- **Toast notifications** for create / update / delete / export actions.
- **Empty state** with a "Clear Filters" shortcut when no events match.
- **Skeleton loading** while events hydrate from `localStorage`.

---

## Architecture

### Stack

- **Next.js 16** with the App Router (Server + Client Components).
- **React 19** (canary built into Next 16's App Router).
- **TypeScript** with strict mode.
- **Tailwind CSS v4** — design tokens defined in `app/globals.css` via
  `@theme`. Runtime color tokens power dark/light theme switching.
- **next-intl** — JSON-based translations and server/client translation hooks.
- **No external icon font / UI kit** — icons are inline SVGs in
  `app/components/Icon.tsx`.

### Component boundaries

```
app/
├─ layout.tsx           # Server — Inter font, i18n provider, theme cookie
├─ page.tsx             # Server Component — composes the shell
├─ globals.css          # Tailwind v4 theme + design tokens
├─ components/
│  ├─ AppShell.tsx           # Server — Sidebar + TopBar + main slot
│  ├─ Sidebar.tsx            # Server — fixed sidebar (lg+ only)
│  ├─ TopBar.tsx             # Server — sticky header w/ search slot
│  ├─ Icon.tsx               # Server — inline SVG icon set
│  ├─ LocaleSwitcher.tsx     # Client — cookie-backed language switcher
│  ├─ ThemeSwitcher.tsx      # Client — cookie-backed theme switcher
│  ├─ EventsProvider.tsx     # Client — useReducer + Context for state
│  ├─ EventDashboard.tsx     # Client — main interactive page body
│  ├─ StatsCards.tsx         # Client — derived counts (total/planned/…)
│  ├─ SearchInput.tsx        # Client — bound to provider's search filter
│  ├─ FilterBar.tsx          # Client — tabs, chips, sort, layout mode
│  ├─ EventCard.tsx          # Client — single event card
│  ├─ EmptyState.tsx         # Client — "no events / no matches" UI
│  ├─ Modal.tsx              # Client — accessible modal shell (ESC + backdrop)
│  ├─ EventModal.tsx         # Client — add/edit form with validation
│  ├─ DeleteConfirmModal.tsx # Client — destructive confirmation
│  └─ Toaster.tsx            # Client — toast notification host
└─ lib/
   ├─ types.ts          # EventItem, Filters, SortOption, etc.
   ├─ mockData.ts       # Initial seed events
   ├─ storage.ts        # localStorage load/save + UUID generator
   ├─ dateUtils.ts      # Format ISO ↔ datetime-local + isPastDate
   └─ styleHelpers.ts   # Category & status badge class maps
i18n/
├─ config.ts            # Supported locales, default locale, cookie name
└─ request.ts           # next-intl request config + cookie locale resolution
messages/
├─ en.json              # English UI strings
├─ ru.json              # Russian UI strings
└─ kk.json              # Kazakh UI strings
```

The **Server / Client split** follows the Next.js App Router pattern:

- `layout.tsx`, `page.tsx`, `AppShell`, `Sidebar`, `TopBar` and `Icon` are
  Server Components — they emit pure HTML, ship no JS.
- Anything interactive (filters, modals, the events store) lives behind the
  `'use client'` boundary and is mounted inside `EventsProvider`.

### State management

A single React Context (`EventsProvider`) backed by `useReducer` holds:

- the canonical list of events,
- the current filter/sort/tab/search state,
- ephemeral toast notifications.

Why this approach:

- The data graph is small and lives entirely in one tree — Redux/Zustand
  would be over-engineering.
- `useReducer` keeps the CRUD transitions explicit and easy to test.
- `Context` avoids prop-drilling into deeply nested children
  (`EventCard`, `FilterBar`, `EventModal`, `Toaster`).

### Persistence

- On first mount the provider tries to read events from `localStorage`
  (`event-manager:events:v1`).
- If nothing is stored, the seed `initialEvents` is used and saved.
- After hydration, every event mutation is mirrored back to `localStorage`.
- The selected locale is stored in the `NEXT_LOCALE` cookie.
- The selected theme is stored in the `event-manager-theme` cookie and mirrored
  to `localStorage` for client-side access.

The hydration flag prevents SSR/CSR mismatches: the dashboard renders skeleton
cards on the server, then swaps in the real list once the client has read
storage.

### Validation

`EventModal` validates on submit, then re-validates on every keystroke once
the user has tried to submit. Errors are shown inline with an icon, and
ARIA `aria-invalid` / `aria-describedby` are wired up for accessibility.

---

## Design

The visual direction follows the provided Stitch AI dashboard design: soft
surface colors, rounded cards, compact controls, semantic status/category
badges, and lightweight elevation. The implementation avoids third-party UI
libraries; all controls, icons, modals, toasts and responsive behavior are
custom-built with React and Tailwind utilities.

---

## Internationalization

The project uses `next-intl` without locale-prefixed routes. Instead, the
current locale is resolved from a cookie:

- supported app locales: `en`, `ru`, `kk`;
- default locale: `ru`;
- message files live in `messages/*.json`;
- server components use `getTranslations`;
- client components use `useTranslations`;
- changing language writes `NEXT_LOCALE` and calls `router.refresh()` so Server
  Components re-render with the new messages.

Kazakh uses the standard `kk` locale code. Event dates are displayed as
`DD.MM.YYYY, HH:mm` via a local helper instead of localized month names because
some browser builds can fall back to English for Kazakh `Intl.DateTimeFormat`
data.

---

## Theme System

The UI supports light and dark themes through CSS variables in
`app/globals.css`.

- Tailwind v4 tokens are declared with `@theme`, so utilities such as
  `bg-surface` and `text-on-surface` resolve through runtime CSS variables.
- Dark theme values are applied under `:root[data-theme="dark"]`.
- `layout.tsx` reads the `event-manager-theme` cookie and renders
  `data-theme` on `<html>` on the server, preventing hydration mismatches and
  reload flicker.
- `ThemeSwitcher` updates the cookie, `localStorage`, and `<html data-theme>`.
- Theme animation is applied only for manual user-triggered changes via the
  temporary `theme-transitioning` class, so reloads do not replay the animation.

---

## Layout, Responsiveness And Motion

- Desktop uses a fixed sidebar and sticky top bar.
- Tablet/mobile hide the sidebar, tighten the top bar, and show search above
  the filters.
- Stats cards adapt from one column on narrow screens to four columns on large
  screens.
- Filters stack on mobile/tablet; export and sort controls become full-width
  where needed.
- Event view mode switching is hidden on mobile and available from `md+`.
- Event cards support:
  - **Grid mode**: two-column card layout on desktop/tablet.
  - **List mode**: compact one-column row layout on wider screens.
- Layout mode changes use the View Transitions API so cards visibly move and
  morph between positions. Browsers without support simply switch instantly.

---

## Trade-offs / things I'd do next

- **Pagination / infinite scroll** — currently every event is rendered. For
  hundreds of events I'd add `IntersectionObserver`-based infinite scroll
  or a simple page-size cursor.
- **Optimistic delete with undo** instead of a confirmation modal.
- **Unit tests** for the reducer, filter pipeline and date helpers
  (`vitest` + `@testing-library/react`).
- **Storybook / Chromatic** for visual regression of the design tokens.
