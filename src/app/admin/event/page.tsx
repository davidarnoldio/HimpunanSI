import { fetchEventsFromDB } from "@/lib/supabaseData";
import { AdminEventClient } from "@/components/admin/AdminEventClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CRUDEventPage() {
  const initialEvents = await fetchEventsFromDB();

  return <AdminEventClient initialEvents={initialEvents} />;
}
