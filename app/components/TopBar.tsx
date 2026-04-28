import type { ReactNode } from "react";
import { Icon } from "./Icon";

interface TopBarProps {
  /** Slot for the client-side search input. */
  searchSlot?: ReactNode;
}

export function TopBar({ searchSlot }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant bg-surface/80 px-4 backdrop-blur-md sm:px-6 lg:pl-8 lg:pr-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-container text-on-primary lg:hidden">
          <Icon name="logo" size={18} />
        </div>
        <h2 className="text-base font-semibold text-on-surface sm:text-lg">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden md:block">{searchSlot}</div>
        <button
          aria-label="Notifications"
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
