import { fetchDivisiFromDB, fetchAnggotaDivisiFromDB } from "@/lib/supabaseData";
import { AdminDivisiClient } from "@/components/admin/AdminDivisiClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDivisiPage() {
  const initialDivisi = await fetchDivisiFromDB();
  const initialAnggota = await fetchAnggotaDivisiFromDB();

  return <AdminDivisiClient initialDivisi={initialDivisi} initialAnggota={initialAnggota} />;
}
