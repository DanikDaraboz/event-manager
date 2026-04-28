"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "./Icon";

export type Theme = "light" | "dark";

const STORAGE_KEY = "event-manager-theme";
const COOKIE_KEY = "event-manager-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function writeThemeCookie(theme: Theme) {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_KEY}=${theme}; path=/; max-age=${oneYear}; samesite=lax`;
}

interface ThemeSwitcherProps {
  initialTheme: Theme;
}

export function ThemeSwitcher({ initialTheme }: ThemeSwitcherProps) {
  const t = useTranslations("topbar");
  const [theme, setTheme] = useState<Theme>(initialTheme);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    // Animate only user-initiated theme changes, not initial page load.
    root.classList.add("theme-transitioning");
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    writeThemeCookie(next);
    setTheme(next);
    window.setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 280);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      title={isDark ? t("switchToLight") : t("switchToDark")}
      className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
    >
      <Icon name={isDark ? "sun" : "moon"} size={20} />
    </button>
  );
}
