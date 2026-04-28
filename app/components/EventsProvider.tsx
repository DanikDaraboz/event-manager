"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { initialEvents } from "../lib/mockData";
import { generateId, loadEvents, saveEvents } from "../lib/storage";
import type {
  EventInput,
  EventItem,
  Filters,
  SortOption,
  CategoryFilter,
  StatusFilter,
  ViewTab,
} from "../lib/types";

/* ------------------------------------------------------------------ */
/* Reducer                                                            */
/* ------------------------------------------------------------------ */

type Action =
  | { type: "hydrate"; events: EventItem[] }
  | { type: "add"; event: EventItem }
  | { type: "update"; event: EventItem }
  | { type: "delete"; id: string }
  | { type: "toggleFavorite"; id: string };

function reducer(state: EventItem[], action: Action): EventItem[] {
  switch (action.type) {
    case "hydrate":
      return action.events;
    case "add":
      return [action.event, ...state];
    case "update":
      return state.map((e) => (e.id === action.event.id ? action.event : e));
    case "delete":
      return state.filter((e) => e.id !== action.id);
    case "toggleFavorite":
      return state.map((e) =>
        e.id === action.id ? { ...e, favorite: !e.favorite } : e,
      );
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/* Toast                                                              */
/* ------------------------------------------------------------------ */

export interface Toast {
  id: string;
  message: string;
  variant: "success" | "error";
}

/* ------------------------------------------------------------------ */
/* Context                                                            */
/* ------------------------------------------------------------------ */

interface EventsContextValue {
  events: EventItem[];
  filteredEvents: EventItem[];
  filters: Filters;
  setSearch: (value: string) => void;
  setCategory: (value: CategoryFilter) => void;
  setStatus: (value: StatusFilter) => void;
  setTab: (value: ViewTab) => void;
  setSort: (value: SortOption) => void;
  resetFilters: () => void;
  stats: { total: number; planned: number; completed: number; favorites: number };
  hydrated: boolean;
  addEvent: (input: EventInput) => EventItem;
  updateEvent: (id: string, input: EventInput) => void;
  deleteEvent: (id: string) => void;
  toggleFavorite: (id: string) => void;
  exportToJson: () => void;
  toasts: Toast[];
  showToast: (message: string, variant?: Toast["variant"]) => void;
  dismissToast: (id: string) => void;
}

const EventsContext = createContext<EventsContextValue | null>(null);

const defaultFilters: Filters = {
  search: "",
  category: "All",
  status: "All",
  tab: "all",
  sort: "date-desc",
};

/**
 * `useSyncExternalStore` is the recommended React 19 way to detect that we're
 * on the client without producing an "external state in effect" lint warning.
 * The server snapshot is `false`, the client snapshot is `true`.
 */
const subscribeNoop = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, dispatch] = useReducer(reducer, initialEvents);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const hydrated = useIsClient();

  // Hydrate the reducer from localStorage on the client.
  useEffect(() => {
    const stored = loadEvents();
    if (stored && stored.length > 0) {
      dispatch({ type: "hydrate", events: stored });
    } else {
      saveEvents(initialEvents);
    }
  }, []);

  // Persist any change once hydrated.
  useEffect(() => {
    if (hydrated) saveEvents(events);
  }, [events, hydrated]);

  /* ------------------ Toasts ------------------ */
  const showToast = useCallback(
    (message: string, variant: Toast["variant"] = "success") => {
      const id = generateId();
      setToasts((t) => [...t, { id, message, variant }]);
      setTimeout(() => {
        setToasts((t) => t.filter((toast) => toast.id !== id));
      }, 3200);
    },
    [],
  );
  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  /* ------------------ CRUD ------------------ */
  const addEvent = useCallback(
    (input: EventInput) => {
      const event: EventItem = { ...input, id: generateId(), favorite: false };
      dispatch({ type: "add", event });
      showToast("Event created");
      return event;
    },
    [showToast],
  );

  const updateEvent = useCallback(
    (id: string, input: EventInput) => {
      const existing = events.find((e) => e.id === id);
      if (!existing) return;
      dispatch({ type: "update", event: { ...existing, ...input } });
      showToast("Event updated");
    },
    [events, showToast],
  );

  const deleteEvent = useCallback(
    (id: string) => {
      dispatch({ type: "delete", id });
      showToast("Event deleted", "error");
    },
    [showToast],
  );

  const toggleFavorite = useCallback((id: string) => {
    dispatch({ type: "toggleFavorite", id });
  }, []);

  const exportToJson = useCallback(() => {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({ events }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `events-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Events exported");
  }, [events, showToast]);

  /* ------------------ Filters ------------------ */
  const setSearch = useCallback(
    (value: string) => setFilters((f) => ({ ...f, search: value })),
    [],
  );
  const setCategory = useCallback(
    (value: CategoryFilter) => setFilters((f) => ({ ...f, category: value })),
    [],
  );
  const setStatus = useCallback(
    (value: StatusFilter) => setFilters((f) => ({ ...f, status: value })),
    [],
  );
  const setTab = useCallback(
    (value: ViewTab) => setFilters((f) => ({ ...f, tab: value })),
    [],
  );
  const setSort = useCallback(
    (value: SortOption) => setFilters((f) => ({ ...f, sort: value })),
    [],
  );
  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  /* ------------------ Derived ------------------ */
  const filteredEvents = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const list = events.filter((e) => {
      if (filters.tab === "favorites" && !e.favorite) return false;
      if (filters.category !== "All" && e.category !== filters.category)
        return false;
      if (filters.status !== "All" && e.status !== filters.status) return false;
      if (term) {
        const haystack = `${e.title} ${e.description}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      switch (filters.sort) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "date-desc":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [events, filters]);

  const stats = useMemo(
    () => ({
      total: events.length,
      planned: events.filter((e) => e.status === "Planned").length,
      completed: events.filter((e) => e.status === "Completed").length,
      favorites: events.filter((e) => e.favorite).length,
    }),
    [events],
  );

  const value: EventsContextValue = {
    events,
    filteredEvents,
    filters,
    setSearch,
    setCategory,
    setStatus,
    setTab,
    setSort,
    resetFilters,
    stats,
    hydrated,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleFavorite,
    exportToJson,
    toasts,
    showToast,
    dismissToast,
  };

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return ctx;
}
