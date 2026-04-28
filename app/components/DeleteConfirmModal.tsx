"use client";

import type { EventItem } from "../lib/types";
import { formatEventDate } from "../lib/dateUtils";
import { Icon } from "./Icon";
import { Modal } from "./Modal";
import { useEvents } from "./EventsProvider";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  target: EventItem | null;
}

export function DeleteConfirmModal({
  open,
  onClose,
  target,
}: DeleteConfirmModalProps) {
  const { deleteEvent } = useEvents();

  function handleConfirm() {
    if (!target) return;
    deleteEvent(target.id);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center px-6 pt-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-container text-error">
          <Icon name="trash" size={26} />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-on-surface">
          Delete event?
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
          Are you sure you want to delete this event? This action cannot be
          undone.
        </p>
      </div>

      {target && (
        <div className="px-6 pt-4">
          <div className="flex items-center gap-3 rounded-lg border border-outline-variant/60 bg-surface-container p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
              <Icon name="calendar-event" size={20} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-on-surface">
                {target.title}
              </p>
              <p className="text-xs text-on-surface-variant">
                {formatEventDate(target.date)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t border-outline-variant bg-surface-container-low px-6 py-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-5 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="rounded-lg bg-error px-5 py-2.5 text-sm font-semibold text-on-error shadow-sm transition-transform hover:brightness-110 active:scale-[0.98]"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
