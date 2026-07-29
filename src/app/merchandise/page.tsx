import { fetchMerchandiseFromDB } from "@/lib/supabaseData";
import { MerchandiseClient } from "@/components/merchandise/MerchandiseClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MerchandisePage() {
  const merchandise = await fetchMerchandiseFromDB();

  return <MerchandiseClient merchandise={merchandise} />;
}
