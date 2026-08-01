import { fetchAnggotaDivisiFromDB, fetchDivisiFromDB } from "@/lib/supabaseData";
import { AdminAnggotaDivisiClient } from "@/components/admin/AdminAnggotaDivisiClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAnggotaDivisiPage() {
  const initialAnggota = await fetchAnggotaDivisiFromDB();
  const initialDivisi = await fetchDivisiFromDB();

  return (
    <AdminAnggotaDivisiClient initialAnggota={initialAnggota} initialDivisi={initialDivisi} />
  );
}
