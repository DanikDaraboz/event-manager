"use client";

import { useTranslations } from "next-intl";
import { Icon } from "./Icon";
import { useEvents } from "./EventsProvider";

interface EmptyStateProps {
  onCreate: () => void;
  hasEvents: boolean;
}

export function EmptyState({ onCreate, hasEvents }: EmptyStateProps) {
  const tEmpty = useTranslations("empty");
  const tActions = useTranslations("actions");
  const { resetFilters } = useEvents();

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-surface-container-low/40 px-6 py-16 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-surface-container-lowest text-on-surface-variant shadow-inner">
        <Icon name="calendar-off" size={42} />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-on-surface">
        {hasEvents ? tEmpty("noMatchTitle") : tEmpty("noEventsTitle")}
      </h2>
      <p className="mt-2 max-w-md text-sm text-on-surface-variant">
        {hasEvents ? tEmpty("noMatchHint") : tEmpty("noEventsHint")}
      </p>
      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-transform hover:brightness-110 active:scale-[0.98]"
        >
          <Icon name="plus" size={18} />
          {tActions("addEvent")}
        </button>
        {hasEvents && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface px-5 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high"
          >
            <Icon name="filter-off" size={16} />
            {tActions("clearFilters")}
          </button>
        )}
      </div>
    </div>
  );
}
