"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { EventItem } from "../lib/types";
import { useEvents } from "./EventsProvider";
import { Icon } from "./Icon";
import { StatsCards } from "./StatsCards";
import { FilterBar } from "./FilterBar";
import { EventCard } from "./EventCard";
import { EmptyState } from "./EmptyState";
import { EventModal } from "./EventModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { SearchInput } from "./SearchInput";

/** Top-level interactive dashboard. Composes every interactive piece. */
export function EventDashboard() {
  const tHeader = useTranslations("header");
  const tActions = useTranslations("actions");
  const { filteredEvents, events, hydrated } = useEvents();
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);

  function openCreate() {
    setEditingEvent(null);
    setEventModalOpen(true);
  }

  function openEdit(event: EventItem) {
    setEditingEvent(event);
    setEventModalOpen(true);
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface sm:text-3xl">
            {tHeader("title")}
          </h1>
          <p className="mt-1 text-base text-on-surface-variant">
            {tHeader("subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary shadow-md transition-transform hover:brightness-110 active:scale-[0.98] md:self-auto"
        >
          <Icon name="plus" size={18} />
          {tActions("addEvent")}
        </button>
      </div>

      <StatsCards />

      {/* Mobile-only search above the filters */}
      <div className="md:hidden">
        <SearchInput variant="inline" />
      </div>

      <FilterBar />

      {/* List */}
      {!hydrated ? (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="card-shadow h-56 animate-pulse rounded-xl border border-outline-variant bg-surface-container-low"
            />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState onCreate={openCreate} hasEvents={events.length > 0} />
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <EventModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        initialEvent={editingEvent}
      />
      <DeleteConfirmModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        target={deleteTarget}
      />
    </div>
  );
}
