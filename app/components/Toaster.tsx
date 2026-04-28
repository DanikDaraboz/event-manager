"use client";

import { useTranslations } from "next-intl";
import { Icon } from "./Icon";
import { useEvents } from "./EventsProvider";

export function Toaster() {
  const tToast = useTranslations("toast");
  const tActions = useTranslations("actions");
  const { toasts, dismissToast } = useEvents();

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-6 right-6 z-[60] flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={
            toast.variant === "error"
              ? "animate-slide-up modal-shadow pointer-events-auto flex items-center gap-3 rounded-lg border border-error/30 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface"
              : "animate-slide-up modal-shadow pointer-events-auto flex items-center gap-3 rounded-lg border border-secondary/30 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface"
          }
        >
          <span
            className={
              toast.variant === "error"
                ? "flex h-7 w-7 items-center justify-center rounded-full bg-error-container text-error"
                : "flex h-7 w-7 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container"
            }
          >
            <Icon
              name={toast.variant === "error" ? "alert" : "check-circle"}
              size={16}
            />
          </span>
          <span className="font-medium">{tToast(toast.key)}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label={tActions("dismissNotification")}
            className="ml-2 rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
