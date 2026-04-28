"use client";

import { Icon } from "./Icon";
import { useEvents } from "./EventsProvider";
import { EVENT_CATEGORIES, EVENT_STATUSES } from "../lib/types";
import type {
  CategoryFilter,
  SortOption,
  StatusFilter,
} from "../lib/types";

const sortLabels: Record<SortOption, string> = {
  "date-desc": "Date (newest first)",
  "date-asc": "Date (oldest first)",
  "title-asc": "Title (A–Z)",
  "title-desc": "Title (Z–A)",
};

export function FilterBar() {
  const {
    filters,
    setCategory,
    setStatus,
    setTab,
    setSort,
    exportToJson,
  } = useEvents();

  const categoryOptions: CategoryFilter[] = ["All", ...EVENT_CATEGORIES];
  const statusOptions: StatusFilter[] = ["All", ...EVENT_STATUSES];

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-surface-container-low p-4 sm:p-5">
      {/* Tabs + sort + export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Event view"
          className="inline-flex items-center gap-1 rounded-lg bg-surface-container-high p-1"
        >
          <button
            role="tab"
            aria-selected={filters.tab === "all"}
            onClick={() => setTab("all")}
            className={
              filters.tab === "all"
                ? "rounded-md bg-surface px-4 py-1.5 text-sm font-semibold text-on-surface shadow-sm"
                : "rounded-md px-4 py-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
            }
          >
            All Events
          </button>
          <button
            role="tab"
            aria-selected={filters.tab === "favorites"}
            onClick={() => setTab("favorites")}
            className={
              filters.tab === "favorites"
                ? "flex items-center gap-1.5 rounded-md bg-surface px-4 py-1.5 text-sm font-semibold text-on-surface shadow-sm"
                : "flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
            }
          >
            <Icon name="heart" size={14} /> Favorites
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              aria-label="Sort by"
              value={filters.sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="appearance-none rounded-lg border border-outline-variant bg-surface px-4 py-2 pr-10 text-sm font-medium text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                <option key={opt} value={opt}>
                  Sort: {sortLabels[opt]}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              size={18}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
          </div>
          <button
            onClick={exportToJson}
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high"
          >
            <Icon name="download" size={16} />
            Export JSON
          </button>
        </div>
      </div>

      {/* Category + status chips */}
      <div className="flex flex-col gap-3 border-t border-outline-variant pt-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            Category:
          </span>
          {categoryOptions.map((option) => {
            const active = filters.category === option;
            return (
              <button
                key={option}
                onClick={() => setCategory(option)}
                className={
                  active
                    ? "shrink-0 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-on-primary"
                    : "shrink-0 rounded-full border border-outline-variant bg-surface px-4 py-1 text-xs font-medium text-on-surface-variant transition-colors hover:border-primary hover:text-on-surface"
                }
              >
                {option}
              </button>
            );
          })}
        </div>

        <div className="hidden h-6 w-px bg-outline-variant lg:block" />

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            Status:
          </span>
          {statusOptions.map((option) => {
            const active = filters.status === option;
            return (
              <button
                key={option}
                onClick={() => setStatus(option)}
                className={
                  active
                    ? "shrink-0 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-on-primary"
                    : "shrink-0 rounded-full border border-outline-variant bg-surface px-4 py-1 text-xs font-medium text-on-surface-variant transition-colors hover:border-primary hover:text-on-surface"
                }
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
