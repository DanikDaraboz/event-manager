"use client";

import { Icon, type IconName } from "./Icon";
import { useEvents } from "./EventsProvider";

interface StatCard {
  label: string;
  key: "total" | "planned" | "completed" | "favorites";
  icon: IconName;
  iconBg: string;
  iconColor: string;
}

const cards: StatCard[] = [
  {
    label: "Total Events",
    key: "total",
    icon: "calendar-event",
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
  },
  {
    label: "Planned",
    key: "planned",
    icon: "clock",
    iconBg: "bg-secondary-fixed",
    iconColor: "text-on-secondary-fixed-variant",
  },
  {
    label: "Completed",
    key: "completed",
    icon: "check-circle",
    iconBg: "bg-surface-container-highest",
    iconColor: "text-on-surface-variant",
  },
  {
    label: "Favorites",
    key: "favorites",
    icon: "heart-filled",
    iconBg: "bg-error-container",
    iconColor: "text-error",
  },
];

export function StatsCards() {
  const { stats } = useEvents();

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="card-shadow flex items-center gap-4 rounded-xl border border-outline-variant bg-surface p-4 sm:p-6"
        >
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${card.iconBg} ${card.iconColor}`}
          >
            <Icon name={card.icon} size={22} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              {card.label}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-on-surface sm:text-3xl">
              {stats[card.key]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
