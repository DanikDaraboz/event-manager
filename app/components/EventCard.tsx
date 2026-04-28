"use client";

import type { EventItem } from "../lib/types";
import { formatEventDate } from "../lib/dateUtils";
import { categoryBadgeStyles, statusBadgeStyles } from "../lib/styleHelpers";
import { Icon } from "./Icon";
import { useEvents } from "./EventsProvider";

interface EventCardProps {
  event: EventItem;
  onEdit: (event: EventItem) => void;
  onDelete: (event: EventItem) => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const { toggleFavorite } = useEvents();

  return (
    <article className="card-shadow group flex flex-col rounded-xl border border-outline-variant bg-surface transition-colors hover:border-primary/50">
      {/* Header strip with category gradient */}
      <div className="relative h-2 rounded-t-xl bg-primary/70" />

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryBadgeStyles[event.category]}`}
            >
              {event.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeStyles[event.status]}`}
            >
              {event.status}
            </span>
          </div>
          <button
            type="button"
            onClick={() => toggleFavorite(event.id)}
            aria-label={
              event.favorite ? "Remove from favorites" : "Add to favorites"
            }
            aria-pressed={event.favorite}
            className={
              event.favorite
                ? "flex h-9 w-9 items-center justify-center rounded-full bg-error-container text-error transition-transform hover:scale-105"
                : "flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-error-container hover:text-error"
            }
          >
            <Icon name={event.favorite ? "heart-filled" : "heart"} size={18} />
          </button>
        </div>

        <div>
          <h3 className="text-xl font-semibold tracking-tight text-on-surface">
            {event.title}
          </h3>
          <p className="mt-1 text-xs font-medium text-on-surface-variant">
            {formatEventDate(event.date)}
          </p>
        </div>

        {event.description && (
          <p className="text-sm leading-relaxed text-on-surface-variant line-clamp-3">
            {event.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-1 rounded-b-xl border-t border-outline-variant bg-surface-container-lowest px-4 py-3">
        <button
          type="button"
          onClick={() => onEdit(event)}
          aria-label={`Edit ${event.title}`}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
        >
          <Icon name="edit" size={16} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(event)}
          aria-label={`Delete ${event.title}`}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-error-container hover:text-error"
        >
          <Icon name="trash" size={16} />
          Delete
        </button>
      </div>
    </article>
  );
}
