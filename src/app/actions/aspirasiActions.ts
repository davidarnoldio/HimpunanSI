"use server";

import {
  insertAspirasiToDB,
  fetchAspirasiFromDB,
  updateAspirasiStatusInDB,
  deleteAspirasiFromDB,
} from "@/lib/supabaseData";
import { revalidatePath } from "next/cache";
import type { AspirasiAdminItem } from "@/data/adminMockData";

export async function submitAspirasiAction(payload: {
  pesan: string;
  isAnonim: boolean;
  nama?: string;
  npm?: string;
  email?: string;
}): Promise<{ success: boolean; data?: AspirasiAdminItem; error?: string }> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const newAspirasi: AspirasiAdminItem = {
      id: `asp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      pesan: payload.pesan.trim(),
      isAnonim: payload.isAnonim,
      nama: payload.isAnonim ? undefined : payload.nama?.trim() || "Mahasiswa SI",
      npm: payload.isAnonim ? undefined : payload.npm?.trim() || undefined,
      email: payload.email?.trim() || undefined,
      tanggal: today,
      status: "Baru",
    };

    const success = await insertAspirasiToDB(newAspirasi);
    if (success) {
      revalidatePath("/aspirasi");
      revalidatePath("/admin/aspirasi");
      return { success: true, data: newAspirasi };
    }
    return { success: false, error: "Gagal menyimpan ke database Supabase." };
  } catch (err) {
    console.error("[aspirasiActions] submitAspirasiAction error:", err);
    return { success: false, error: String(err) };
  }
}

export async function updateAspirasiStatusAction(
  id: string,
  status: "Baru" | "Diproses" | "Selesai"
): Promise<{ success: boolean }> {
  const success = await updateAspirasiStatusInDB(id, status);
  if (success) {
    revalidatePath("/aspirasi");
    revalidatePath("/admin/aspirasi");
  }
  return { success };
}

export async function deleteAspirasiAction(id: string): Promise<{ success: boolean }> {
  const success = await deleteAspirasiFromDB(id);
  if (success) {
    revalidatePath("/aspirasi");
    revalidatePath("/admin/aspirasi");
  }
  return { success };
}

export async function getLatestAspirasiAction(): Promise<AspirasiAdminItem[]> {
  return fetchAspirasiFromDB();
}
