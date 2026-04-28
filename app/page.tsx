import { AppShell } from "./components/AppShell";
import { EventDashboard } from "./components/EventDashboard";
import { EventsProvider } from "./components/EventsProvider";
import { SearchInput } from "./components/SearchInput";
import { Toaster } from "./components/Toaster";

export default function Home() {
  return (
    <EventsProvider>
      <AppShell searchSlot={<SearchInput />}>
        <EventDashboard />
      </AppShell>
      <Toaster />
    </EventsProvider>
  );
}
