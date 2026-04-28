import type { EventItem } from "./types";

/**
 * Initial seed data used the first time a user opens the app.
 * After the first run, events are persisted in localStorage.
 */
export const initialEvents: EventItem[] = [
  {
    id: "evt-1",
    title: "Tech Conference 2026",
    description:
      "Annual tech conference exploring the future of AI, ML and modern web development.",
    date: "2026-05-15T10:00:00.000Z",
    category: "Conference",
    status: "Planned",
    favorite: true,
  },
  {
    id: "evt-2",
    title: "Product Webinar",
    description:
      "A deep dive into the upcoming product roadmap and feature releases for Q3.",
    date: "2026-06-03T14:00:00.000Z",
    category: "Webinar",
    status: "Planned",
    favorite: false,
  },
  {
    id: "evt-3",
    title: "Team Meetup",
    description:
      "Monthly team catch-up to discuss progress, celebrate wins and align on goals.",
    date: "2026-04-20T16:00:00.000Z",
    category: "Meeting",
    status: "Completed",
    favorite: true,
  },
  {
    id: "evt-4",
    title: "Frontend Workshop",
    description:
      "Hands-on session covering React hooks, Next.js routing and performance patterns.",
    date: "2026-07-12T11:00:00.000Z",
    category: "Workshop",
    status: "Planned",
    favorite: false,
  },
];
