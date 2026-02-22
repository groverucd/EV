import { AppShell } from "@/components/app-shell";
import { FleetDashboard } from "@/components/dashboard/fleet-dashboard";

export default function Home() {
  return (
    <AppShell>
      <FleetDashboard />
    </AppShell>
  );
}
