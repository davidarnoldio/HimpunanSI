"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Halaman Modul/Bank Soal telah dihapus dari sistem.
// Redirect ke dashboard jika ada yang masih mengakses URL lama.
export default function RemovedModulPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);
  return null;
}
