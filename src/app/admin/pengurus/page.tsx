import { fetchPengurusFromDB } from "@/lib/supabaseData";
import { AdminPengurusClient } from "@/components/admin/AdminPengurusClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CRUDPengurusPage() {
  const initialPengurus = await fetchPengurusFromDB();

  return <AdminPengurusClient initialPengurus={initialPengurus} />;
}
