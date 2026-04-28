import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppShellProps {
  children: ReactNode;
  searchSlot?: ReactNode;
}

/**
 * Server Component layout shell. Wraps every page with the
 * fixed sidebar + sticky top bar. Interactive content (the dashboard,
 * search input, modals) is supplied via children/searchSlot.
 */
export function AppShell({ children, searchSlot }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-[280px]">
        <TopBar searchSlot={searchSlot} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
