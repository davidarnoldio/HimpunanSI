import { fetchAspirasiFromDB } from "@/lib/supabaseData";
import { AspirasiClient } from "@/components/aspirasi/AspirasiClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AspirasiPage() {
  const initialAspirasi = await fetchAspirasiFromDB();

  return <AspirasiClient initialAspirasi={initialAspirasi} />;
}
