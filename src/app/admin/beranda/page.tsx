import { fetchHeroContentFromDB } from "@/lib/supabaseData";
import { AdminBerandaClient } from "@/components/admin/AdminBerandaClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBerandaCMSPage() {
  const initialHeroContent = await fetchHeroContentFromDB();

  return <AdminBerandaClient initialHeroContent={initialHeroContent} />;
}
