"use client";

import { useTranslations } from "next-intl";
import { Icon, type IconName } from "./Icon";
import { useEvents } from "./EventsProvider";

interface StatCard {
  labelKey: "totalEvents" | "planned" | "completed" | "favorites";
  statKey: "total" | "planned" | "completed" | "favorites";
  icon: IconName;
  iconBg: string;
  iconColor: string;
}

const cards: StatCard[] = [
  {
    labelKey: "totalEvents",
    statKey: "total",
    icon: "calendar-event",
    iconBg: "bg-primary-fixed",
    iconColor: "text-primary",
  },
  {
    labelKey: "planned",
    statKey: "planned",
    icon: "clock",
    iconBg: "bg-secondary-fixed",
    iconColor: "text-on-secondary-fixed-variant",
  },
  {
    labelKey: "completed",
    statKey: "completed",
    icon: "check-circle",
    iconBg: "bg-surface-container-highest",
    iconColor: "text-on-surface-variant",
  },
  {
    labelKey: "favorites",
    statKey: "favorites",
    icon: "heart-filled",
    iconBg: "bg-error-container",
    iconColor: "text-error",
  },
];

export function StatsCards() {
  const t = useTranslations("stats");
  const { stats } = useEvents();

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.statKey}
          className="card-shadow flex items-center gap-4 rounded-xl border border-outline-variant bg-surface p-4 sm:p-6"
        >
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${card.iconBg} ${card.iconColor}`}
          >
            <Icon name={card.icon} size={22} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              {t(card.labelKey)}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-on-surface sm:text-3xl">
              {stats[card.statKey]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
