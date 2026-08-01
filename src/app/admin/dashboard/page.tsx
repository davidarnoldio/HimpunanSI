import {
  fetchPengurusFromDB,
  fetchEventsFromDB,
  fetchMerchandiseFromDB,
  fetchAspirasiFromDB,
} from "@/lib/supabaseData";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardOverviewPage() {
  const [initialPengurus, initialEvents, initialMerchandise, initialAspirasi] = await Promise.all([
    fetchPengurusFromDB(),
    fetchEventsFromDB(),
    fetchMerchandiseFromDB(),
    fetchAspirasiFromDB(),
  ]);

  return (
    <AdminDashboardClient
      initialPengurus={initialPengurus}
      initialEvents={initialEvents}
      initialMerchandise={initialMerchandise}
      initialAspirasi={initialAspirasi}
    />
  );
}
