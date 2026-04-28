import type { EventCategory, EventStatus } from "./types";

/** Visual treatment for each category badge — kept in one place for reuse. */
export const categoryBadgeStyles: Record<EventCategory, string> = {
  Conference: "bg-primary-fixed-dim/30 text-primary",
  Webinar: "bg-primary-fixed/60 text-on-primary-fixed-variant",
  Meeting: "bg-surface-container-highest text-on-surface-variant",
  Workshop: "bg-secondary-container/40 text-on-secondary-container",
};

export const statusBadgeStyles: Record<EventStatus, string> = {
  Planned: "bg-secondary-container/40 text-on-secondary-container",
  Completed: "bg-surface-dim text-on-surface-variant",
};
