"use client";

import { useState, type FormEvent } from "react";
import {
  fromDatetimeLocalValue,
  isPastDate,
  toDatetimeLocalValue,
} from "../lib/dateUtils";
import {
  EVENT_CATEGORIES,
  EVENT_STATUSES,
  type EventCategory,
  type EventInput,
  type EventItem,
  type EventStatus,
} from "../lib/types";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
import { useEvents } from "./EventsProvider";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  /** When provided, the modal is in "edit" mode. */
  initialEvent: EventItem | null;
}

interface FormState {
  title: string;
  description: string;
  date: string;
  category: EventCategory;
  status: EventStatus;
}

interface FormErrors {
  title?: string;
  date?: string;
}

const blank: FormState = {
  title: "",
  description: "",
  date: "",
  category: "Conference",
  status: "Planned",
};

function buildFormState(event: EventItem | null): FormState {
  if (!event) return blank;
  return {
    title: event.title,
    description: event.description,
    date: toDatetimeLocalValue(event.date),
    category: event.category,
    status: event.status,
  };
}

export function EventModal({ open, onClose, initialEvent }: EventModalProps) {
  const { addEvent, updateEvent } = useEvents();
  const [form, setForm] = useState<FormState>(() => buildFormState(initialEvent));
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // "Adjusting state during render" — the React 19 idiomatic way to reset
  // form state when the modal is opened or the target event changes.
  // See https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [snapshot, setSnapshot] = useState({ open, eventId: initialEvent?.id });
  if (snapshot.open !== open || snapshot.eventId !== initialEvent?.id) {
    setSnapshot({ open, eventId: initialEvent?.id });
    if (open) {
      setForm(buildFormState(initialEvent));
      setErrors({});
      setSubmitted(false);
    }
  }

  function validate(state: FormState): FormErrors {
    const next: FormErrors = {};
    if (!state.title.trim()) {
      next.title = "Title is required";
    } else if (state.title.trim().length < 2) {
      next.title = "Title must be at least 2 characters";
    }
    if (!state.date) {
      next.date = "Date and time is required";
    } else {
      const iso = fromDatetimeLocalValue(state.date);
      if (!iso) {
        next.date = "Invalid date";
      } else if (state.status === "Planned" && isPastDate(iso)) {
        // We only enforce "no past dates" for planned events; completed events
        // are allowed to be in the past since that reflects reality.
        next.date = "Planned events cannot be in the past";
      }
    }
    return next;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const payload: EventInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: fromDatetimeLocalValue(form.date),
      category: form.category,
      status: form.status,
    };

    if (initialEvent) {
      updateEvent(initialEvent.id, payload);
    } else {
      addEvent(payload);
    }
    onClose();
  }

  // Re-validate when the user edits already-submitted fields for live feedback.
  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (submitted) setErrors(validate(next));
      return next;
    });
  }

  const isEdit = Boolean(initialEvent);

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Event" : "Add New Event"}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4 px-6 py-5">
          {/* Title */}
          <div className="space-y-1">
            <label htmlFor="event-title" className="block text-sm font-semibold text-on-surface">
              Title <span className="font-bold text-error">*</span>
            </label>
            <input
              id="event-title"
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Annual Product Keynote"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "event-title-error" : undefined}
              className={
                errors.title
                  ? "w-full rounded-lg border border-error bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-error/30"
                  : "w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              }
            />
            {errors.title && (
              <p id="event-title-error" className="flex items-center gap-1 text-xs font-medium text-error">
                <Icon name="alert" size={14} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="event-description" className="block text-sm font-semibold text-on-surface">
              Description{" "}
              <span className="font-normal text-on-surface-variant">(Optional)</span>
            </label>
            <textarea
              id="event-description"
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe the purpose of this event…"
              className="w-full resize-none rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label htmlFor="event-date" className="block text-sm font-semibold text-on-surface">
              Date and Time <span className="font-bold text-error">*</span>
            </label>
            <input
              id="event-date"
              type="datetime-local"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              aria-invalid={Boolean(errors.date)}
              aria-describedby={errors.date ? "event-date-error" : undefined}
              className={
                errors.date
                  ? "w-full rounded-lg border border-error bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-error/30"
                  : "w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              }
            />
            {errors.date && (
              <p id="event-date-error" className="flex items-center gap-1 text-xs font-medium text-error">
                <Icon name="calendar-off" size={14} />
                {errors.date}
              </p>
            )}
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label htmlFor="event-category" className="block text-sm font-semibold text-on-surface">
                Category
              </label>
              <div className="relative">
                <select
                  id="event-category"
                  value={form.category}
                  onChange={(e) => update("category", e.target.value as EventCategory)}
                  className="w-full appearance-none rounded-lg border border-outline-variant bg-surface px-4 py-2.5 pr-10 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {EVENT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="event-status" className="block text-sm font-semibold text-on-surface">
                Status
              </label>
              <div className="relative">
                <select
                  id="event-status"
                  value={form.status}
                  onChange={(e) => update("status", e.target.value as EventStatus)}
                  className="w-full appearance-none rounded-lg border border-outline-variant bg-surface px-4 py-2.5 pr-10 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {EVENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  size={18}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-outline-variant bg-surface-container-low px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary-container px-5 py-2 text-sm font-semibold text-on-primary shadow-md transition-transform hover:brightness-110 active:scale-[0.98]"
          >
            {isEdit ? "Save Changes" : "Save Event"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
