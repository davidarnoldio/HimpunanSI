import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchDivisiFromDB, fetchAnggotaDivisiFromDB } from "@/lib/supabaseData";
import { DetailDivisiClient } from "@/components/landing/DetailDivisiClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const divisiData = await fetchDivisiFromDB();
  const targetDivisi = divisiData.find((d) => d.id === slug);

  if (!targetDivisi) {
    return {
      title: "Divisi Tidak Ditemukan",
    };
  }

  return {
    title: targetDivisi.nama,
    description: targetDivisi.deskripsi,
    alternates: {
      canonical: `/divisi/${targetDivisi.id}`,
    },
    openGraph: {
      title: `${targetDivisi.nama} | HIMASI UG`,
      description: targetDivisi.deskripsi,
      url: `/divisi/${targetDivisi.id}`,
    },
  };
}

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
