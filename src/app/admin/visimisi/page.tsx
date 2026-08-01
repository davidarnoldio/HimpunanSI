import { fetchVisiMisiFromDB } from "@/lib/supabaseData";
import { AdminVisiMisiClient } from "@/components/admin/AdminVisiMisiClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminVisiMisiPage() {
  const initialVisiMisi = await fetchVisiMisiFromDB();

  return <AdminVisiMisiClient initialVisiMisi={initialVisiMisi} />;
}
