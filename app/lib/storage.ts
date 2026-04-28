import type { EventItem } from "./types";

const STORAGE_KEY = "event-manager:events:v1";

export function loadEvents(): EventItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    // Defensive normalisation — older payloads may be missing `favorite`.
    return parsed.map((raw) => {
      const e = raw as Partial<EventItem>;
      return {
        id: e.id ?? "",
        title: e.title ?? "",
        description: e.description ?? "",
        date: e.date ?? "",
        category: e.category ?? "Conference",
        status: e.status ?? "Planned",
        favorite: e.favorite ?? false,
      } satisfies EventItem;
    });
  } catch {
    return null;
  }
}

export function saveEvents(events: EventItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Storage might be unavailable (private mode, quota) — fail silently.
  }
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
