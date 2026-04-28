"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  APP_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_LABELS,
  isAppLocale,
  type AppLocale,
} from "../../i18n/config";
import { Icon } from "./Icon";

/* ------------------------------------------------------------------ */
/* Cookie helpers                                                     */
/* ------------------------------------------------------------------ */

function readLocaleCookie(): AppLocale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`));
  const value = match?.split("=")[1];
  return isAppLocale(value) ? value : DEFAULT_LOCALE;
}

function writeLocaleCookie(value: AppLocale): void {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=${oneYear}; samesite=lax`;
}

const subscribeNoop = () => () => {};

/** Reads the locale cookie on the client; falls back to DEFAULT_LOCALE on server. */
function useCurrentLocale(): AppLocale {
  return useSyncExternalStore(
    subscribeNoop,
    readLocaleCookie,
    () => DEFAULT_LOCALE,
  );
}

/* ------------------------------------------------------------------ */
/* Switcher                                                           */
/* ------------------------------------------------------------------ */

export function LocaleSwitcher() {
  const router = useRouter();
  const current = useCurrentLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function selectLocale(next: AppLocale) {
    if (next === current) {
      setOpen(false);
      return;
    }
    writeLocaleCookie(next);
    setOpen(false);
    // Re-runs Server Components with the new cookie.
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-low px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
      >
        <span>{current.toUpperCase()}</span>
        <Icon name="chevron-down" size={14} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="animate-fade-in modal-shadow absolute right-0 top-[calc(100%+6px)] z-40 min-w-[160px] overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest py-1 text-sm"
        >
          {APP_LOCALES.map((loc) => {
            const active = loc === current;
            return (
              <li key={loc}>
                <button
                  type="button"
                  onClick={() => selectLocale(loc)}
                  role="option"
                  aria-selected={active}
                  className={
                    active
                      ? "flex w-full items-center justify-between gap-3 bg-primary-fixed/40 px-3 py-2 text-left font-semibold text-primary"
                      : "flex w-full items-center justify-between gap-3 px-3 py-2 text-left font-medium text-on-surface transition-colors hover:bg-surface-container-high"
                  }
                >
                  <span>{LOCALE_LABELS[loc]}</span>
                  <span className="text-xs uppercase tracking-wider text-on-surface-variant">
                    {loc}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
