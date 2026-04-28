# Event Manager

A small CRUD dashboard for managing events (conferences, webinars, meetings,
workshops). Built as a frontend test task with **Next.js 16 (App Router) +
TypeScript + Tailwind CSS v4**, custom UI (no third-party component
libraries), and `localStorage`-backed persistence.

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
  - date/time is required and a *Planned* event cannot be in the past
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
- **Favorites** — heart toggle on each card and a dedicated *Favorites* tab.
- **Export to JSON** — downloads the full event list as
  `events-YYYY-MM-DD.json`.
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
  `@theme inline`. No third-party UI libraries.
- **No external icon font / UI kit** — icons are inline SVGs in
  `app/components/Icon.tsx`.

### Component boundaries

```
app/
├─ layout.tsx           # Server Component — Inter font + global styles
├─ page.tsx             # Server Component — composes the shell
├─ globals.css          # Tailwind v4 theme + design tokens
├─ components/
│  ├─ AppShell.tsx           # Server — Sidebar + TopBar + main slot
│  ├─ Sidebar.tsx            # Server — fixed sidebar (lg+ only)
│  ├─ TopBar.tsx             # Server — sticky header w/ search slot
│  ├─ Icon.tsx               # Server — inline SVG icon set
│  ├─ EventsProvider.tsx     # Client — useReducer + Context for state
│  ├─ EventDashboard.tsx     # Client — main interactive page body
│  ├─ StatsCards.tsx         # Client — derived counts (total/planned/…)
│  ├─ SearchInput.tsx        # Client — bound to provider's search filter
│  ├─ FilterBar.tsx          # Client — tabs, category & status chips, sort
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

The hydration flag prevents SSR/CSR mismatches: the dashboard renders skeleton
cards on the server, then swaps in the real list once the client has read
storage.

### Validation

`EventModal` validates on submit, then re-validates on every keystroke once
the user has tried to submit. Errors are shown inline with an icon, and
ARIA `aria-invalid` / `aria-describedby` are wired up for accessibility.

---

## Design

The visual design is based on the Stitch concept stored in
`stitch_event_manager_dashboard/` (see `event_management_system/DESIGN.md`).
The Material 3-inspired token palette (indigo primary, teal secondary, soft
surface tones) is reproduced in `app/globals.css` as Tailwind v4 theme
variables, so utilities like `bg-primary`, `text-on-surface-variant`,
`border-outline-variant` work out of the box.

---

## Trade-offs / things I'd do next

- **Pagination / infinite scroll** — currently every event is rendered. For
  hundreds of events I'd add `IntersectionObserver`-based infinite scroll
  or a simple page-size cursor.
- **Optimistic delete with undo** instead of a confirmation modal.
- **Unit tests** for the reducer, filter pipeline and date helpers
  (`vitest` + `@testing-library/react`).
- **Storybook / Chromatic** for visual regression of the design tokens.
