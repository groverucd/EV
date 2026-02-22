import { AppShell } from "@/components/app-shell";
import { ChargerDetailView } from "@/components/charger/charger-detail-view";

export default async function ChargerPage({
  params,
}: {
  params: Promise<{ chargerId: string }>;
}) {
  const { chargerId } = await params;

  return (
    <AppShell>
      <ChargerDetailView chargerId={chargerId} />
    </AppShell>
  );
}
