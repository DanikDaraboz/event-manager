"use client";

import { useEffect, type ReactNode } from "react";
import { Icon } from "./Icon";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Tailwind max-width override for the modal panel (defaults to `max-w-lg`). */
  maxWidth?: string;
  /** Hide the default close button when supplying your own header. */
  hideCloseButton?: boolean;
}

/** Accessible modal: ESC to close, focus trapping is browser-native via `dialog` styling. */
export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  hideCloseButton = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`animate-scale-in modal-shadow w-full ${maxWidth} overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-6 py-4">
            <h2 className="text-xl font-semibold tracking-tight text-on-surface">
              {title}
            </h2>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
              >
                <Icon name="close" size={20} />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
