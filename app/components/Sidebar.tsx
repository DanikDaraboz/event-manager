import { Icon } from "./Icon";

const navItems = [
  { label: "Dashboard", icon: "dashboard" as const, href: "#", active: true },
  { label: "Events", icon: "calendar" as const, href: "#" },
  { label: "Analytics", icon: "chart" as const, href: "#" },
  { label: "Settings", icon: "settings" as const, href: "#" },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-[280px] flex-col border-r border-outline-variant bg-surface-container-lowest p-4">
      <div className="flex items-center gap-3 px-2 py-2 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary">
          <Icon name="logo" size={22} />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-on-surface">
            EventPro
          </h1>
          <p className="text-xs text-on-surface-variant">Management Suite</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={
              item.active
                ? "flex items-center gap-3 rounded-lg bg-primary-fixed/40 px-4 py-3 text-sm font-semibold text-primary"
                : "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            }
          >
            <Icon name={item.icon} size={20} />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-outline-variant">
        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface">
          <Icon name="help" size={20} />
          Help Center
        </button>
      </div>
    </aside>
  );
}
