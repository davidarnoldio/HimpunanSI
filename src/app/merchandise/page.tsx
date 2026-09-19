import type { Metadata } from "next";
import { fetchMerchandiseFromDB } from "@/lib/supabaseData";
import { MerchandiseClient } from "@/components/merchandise/MerchandiseClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Katalog Merchandise Resmi JAHIM",
  description:
    "Hoodie JAHIM, T-Shirt eksklusif, Lanyard premium, Totebag, dan Sticker Pack HIMASI UG. Tampil bangga dengan identitas Sistem Informasi Gunadarma!",
  alternates: {
    canonical: "/merchandise",
  },
  openGraph: {
    title: "Katalog Merchandise Resmi JAHIM | HIMASI UG",
    description:
      "Dapatkan apparel dan aksesoris resmi HIMASI Universitas Gunadarma.",
    url: "/merchandise",
  },
};

export default async function MerchandisePage() {
  const merchandise = await fetchMerchandiseFromDB();

  return <MerchandiseClient merchandise={merchandise} />;
}
