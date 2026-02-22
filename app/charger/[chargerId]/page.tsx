import { ChargerDetail } from "@/components/dashboard/ChargerDetail"

export default async function ChargerPage({
  params,
}: {
  params: Promise<{ chargerId: string }>
}) {
  const { chargerId } = await params
  return <ChargerDetail chargerId={chargerId} />
}
