import type { Metadata } from "next";
import { AspirasiClient } from "@/components/aspirasi/AspirasiClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Portal Aspirasi Mahasiswa",
  description:
    "Sampaikan saran, keluhan, atau ide kreatif kamu demi kemajuan Sistem Informasi Universitas Gunadarma. Kirimkan aspirasi secara anonim atau terverifikasi.",
  alternates: {
    canonical: "/aspirasi",
  },
  openGraph: {
    title: "Portal Aspirasi Mahasiswa | HIMASI UG",
    description:
      "Wadah aspirasi terbuka & anonim mahasiswa Sistem Informasi Universitas Gunadarma.",
    url: "/aspirasi",
  },
};

export default function AspirasiPage() {
  return <AspirasiClient />;
}
