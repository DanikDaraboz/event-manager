import { getTranslations } from "next-intl/server";
import { Icon, type IconName } from "./Icon";

const navItems: Array<{
  key: "dashboard" | "events" | "analytics" | "settings";
  icon: IconName;
  active?: boolean;
}> = [
  { key: "dashboard", icon: "dashboard", active: true },
  { key: "events", icon: "calendar" },
  { key: "analytics", icon: "chart" },
  { key: "settings", icon: "settings" },
];

export async function Sidebar() {
  const tNav = await getTranslations("nav");
  const tBrand = await getTranslations("brand");

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-[280px] flex-col border-r border-outline-variant bg-surface-container-lowest p-4">
      <div className="flex items-center gap-3 px-2 py-2 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary">
          <Icon name="logo" size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-on-surface">
            {tBrand("name")}
          </h1>
          <p className="text-xs text-on-surface-variant">{tBrand("tagline")}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.key}
            href="#"
            className={
              item.active
                ? "flex items-center gap-3 rounded-lg bg-primary-fixed/40 px-4 py-3 text-sm font-semibold text-primary"
                : "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            }
          >
            <Icon name={item.icon} size={20} />
            {tNav(item.key)}
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-outline-variant">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface">
          <Icon name="help" size={20} />
          {tNav("help")}
        </button>
      </div>
    </aside>
  );
}
