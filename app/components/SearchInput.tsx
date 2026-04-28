"use client";

import { useTranslations } from "next-intl";
import { Icon } from "./Icon";
import { useEvents } from "./EventsProvider";

interface SearchInputProps {
  variant?: "topbar" | "inline";
}

/** Search input for events. Updates the global filter on every keystroke. */
export function SearchInput({ variant = "topbar" }: SearchInputProps) {
  const t = useTranslations("topbar");
  const { filters, setSearch } = useEvents();

  const baseClasses =
    "w-full rounded-full border border-outline-variant bg-surface-container-low pl-10 pr-4 py-2 text-sm placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

  const wrapperClass =
    variant === "topbar" ? "relative w-64" : "relative w-full";

  return (
    <div className={wrapperClass}>
      <Icon
        name="search"
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
      />
      <input
        type="search"
        value={filters.search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("searchAriaLabel")}
        className={baseClasses}
      />
    </div>
  );
}
