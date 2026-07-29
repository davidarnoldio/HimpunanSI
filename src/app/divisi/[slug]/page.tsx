import { notFound } from "next/navigation";
import { fetchDivisiFromDB, fetchAnggotaDivisiFromDB } from "@/lib/supabaseData";
import { DetailDivisiClient } from "@/components/landing/DetailDivisiClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DetailDivisiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [divisiData, anggotaDivisi] = await Promise.all([
    fetchDivisiFromDB(),
    fetchAnggotaDivisiFromDB(),
  ]);

  const targetDivisi = divisiData.find((d) => d.id === slug);

  if (!targetDivisi) {
    notFound();
  }

  const members = anggotaDivisi.filter((a) => a.divisiId === targetDivisi.id);

  return <DetailDivisiClient targetDivisi={targetDivisi} members={members} />;
}
