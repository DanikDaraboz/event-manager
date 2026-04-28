export const EVENT_CATEGORIES = [
  "Conference",
  "Webinar",
  "Meeting",
  "Workshop",
] as const;

export const EVENT_STATUSES = ["Planned", "Completed"] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];
export type EventStatus = (typeof EVENT_STATUSES)[number];

export interface EventItem {
  id: string;
  title: string;
  description: string;
  /** ISO 8601 datetime string */
  date: string;
  category: EventCategory;
  status: EventStatus;
  favorite: boolean;
}

/** Form payload — `id`, `favorite` are managed by the store. */
export type EventInput = Omit<EventItem, "id" | "favorite">;

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "title-asc"
  | "title-desc";

export type CategoryFilter = "All" | EventCategory;
export type StatusFilter = "All" | EventStatus;
export type ViewTab = "all" | "favorites";

export interface Filters {
  search: string;
  category: CategoryFilter;
  status: StatusFilter;
  tab: ViewTab;
  sort: SortOption;
}
