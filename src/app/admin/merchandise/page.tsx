import { fetchMerchandiseFromDB } from "@/lib/supabaseData";
import { AdminMerchandiseClient } from "@/components/admin/AdminMerchandiseClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CRUDMerchandisePage() {
  const initialMerchandise = await fetchMerchandiseFromDB();

  return <AdminMerchandiseClient initialMerchandise={initialMerchandise} />;
}
