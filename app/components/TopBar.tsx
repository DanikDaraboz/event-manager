import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Icon } from "./Icon";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeSwitcher, type Theme } from "./ThemeSwitcher";

interface TopBarProps {
  /** Slot for the client-side search input. */
  searchSlot?: ReactNode;
}

export async function TopBar({ searchSlot }: TopBarProps) {
  const t = await getTranslations("topbar");
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("event-manager-theme")?.value;
  const initialTheme: Theme = themeCookie === "dark" ? "dark" : "light";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant bg-surface/80 px-4 backdrop-blur-md sm:px-6 lg:pl-8 lg:pr-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container text-on-primary lg:hidden">
          <Icon name="logo" size={18} />
        </div>
        <h2 className="text-base font-semibold text-on-surface sm:text-lg">
          {t("pageTitle")}
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden md:block">{searchSlot}</div>
        <LocaleSwitcher />
        <ThemeSwitcher initialTheme={initialTheme} />
        <button
          aria-label={t("notifications")}
          className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
        >
          <Icon name="bell" size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-surface-container-highest text-on-surface-variant">
          <Icon name="user" size={20} />
        </div>
      </div>
    </header>
  );
}
