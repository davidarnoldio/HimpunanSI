import { fetchAspirasiFromDB } from "@/lib/supabaseData";
import { AdminAspirasiClient } from "@/components/admin/AdminAspirasiClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAspirasiPage() {
  const initialAspirasi = await fetchAspirasiFromDB();

  return <AdminAspirasiClient initialAspirasi={initialAspirasi} />;
}
