"use server";

import {
  syncPengurusToDB,
  syncEventsToDB,
  syncMerchandiseToDB,
  syncHeroContentToDB,
  syncVisiMisiToDB,
  syncDivisiToDB,
  syncAnggotaDivisiToDB,
} from "@/lib/supabaseData";
import { revalidatePath } from "next/cache";
import type {
  PengurusItem,
  EventAdminItem,
  MerchandiseAdminItem,
  HeroContentData,
  VisiMisiData,
  DivisiAdminItem,
  AnggotaDivisiItem,
} from "@/data/adminMockData";

// Fungsi pendukung untuk meng-upload foto
export async function uploadFotoStorageAction(
  dataUrlOrFormData: string | FormData,
  fileName?: string
): Promise<{ success: boolean; url?: string }> {
  try {
    // Jika input berupa string base64/dataUrl
    if (typeof dataUrlOrFormData === "string") {
      return { success: true, url: dataUrlOrFormData };
    }
    return { success: true, url: "" };
  } catch (err) {
    console.error("[adminActions] uploadFotoStorageAction error:", err);
    return { success: false };
  }
}

export async function savePengurusAction(data: PengurusItem[]): Promise<{ success: boolean }> {
  try {
    const processedData = await Promise.all(
      data.map(async (item) => {
        if (item.fotoUrl && item.fotoUrl.startsWith("data:")) {
          try {
            const res = await uploadFotoStorageAction(item.fotoUrl, item.nama || "pengurus");
            if (res.success && res.url) {
              return { ...item, fotoUrl: res.url };
            }
          } catch (err) {
            console.warn(`[adminActions] Auto-upload foto BPH ${item.nama} failed:`, err);
          }
        }
        return item;
      })
    );

    await syncPengurusToDB(processedData);
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/admin/pengurus");
    return { success: true };
  } catch (err) {
    console.error("[adminActions] savePengurusAction error:", err);
    return { success: false };
  }
}

export async function saveEventsAction(data: EventAdminItem[]): Promise<{ success: boolean }> {
  try {
    await syncEventsToDB(data);
    revalidatePath("/");
    revalidatePath("/admin/event");
    return { success: true };
  } catch (err) {
    console.error("[adminActions] saveEventsAction error:", err);
    return { success: false };
  }
}

export async function saveMerchandiseAction(data: MerchandiseAdminItem[]): Promise<{ success: boolean }> {
  try {
    await syncMerchandiseToDB(data);
    revalidatePath("/merchandise");
    revalidatePath("/admin/merchandise");
    return { success: true };
  } catch (err) {
    console.error("[adminActions] saveMerchandiseAction error:", err);
    return { success: false };
  }
}

export async function saveHeroContentAction(data: HeroContentData): Promise<{ success: boolean }> {
  try {
    const payload = { ...data };
    if (payload.heroImageUrl && payload.heroImageUrl.startsWith("data:")) {
      try {
        const uploadRes = await uploadFotoStorageAction(payload.heroImageUrl, "hero-editorial");
        if (uploadRes.success && uploadRes.url) {
          payload.heroImageUrl = uploadRes.url;
        }
      } catch (err) {
        console.warn("[adminActions] Auto-upload hero image failed:", err);
      }
    }

    await syncHeroContentToDB(payload);
    revalidatePath("/");
    revalidatePath("/admin/beranda");
    return { success: true };
  } catch (err) {
    console.error("[adminActions] saveHeroContentAction error:", err);
    return { success: false };
  }
}

export async function saveVisiMisiAction(data: VisiMisiData): Promise<{ success: boolean }> {
  try {
    await syncVisiMisiToDB(data);
    revalidatePath("/");
    revalidatePath("/admin/visimisi");
    return { success: true };
  } catch (err) {
    console.error("[adminActions] saveVisiMisiAction error:", err);
    return { success: false };
  }
}

export async function saveDivisiAction(data: DivisiAdminItem[]): Promise<{ success: boolean }> {
  try {
    await syncDivisiToDB(data);
    revalidatePath("/");
    revalidatePath("/divisi/[slug]", "page");
    revalidatePath("/admin/divisi");
    return { success: true };
  } catch (err) {
    console.error("[adminActions] saveDivisiAction error:", err);
    return { success: false };
  }
}

export async function saveAnggotaDivisiAction(data: AnggotaDivisiItem[]): Promise<{ success: boolean }> {
  try {
    const processedData = await Promise.all(
      data.map(async (item) => {
        if (item.fotoUrl && item.fotoUrl.startsWith("data:")) {
          try {
            const res = await uploadFotoStorageAction(item.fotoUrl, item.nama || "anggota");
            if (res.success && res.url) {
              return { ...item, fotoUrl: res.url };
            }
          } catch (err) {
            console.warn(`[adminActions] Auto-upload foto ${item.nama} failed:`, err);
          }
        }
        return item;
      })
    );

    await syncAnggotaDivisiToDB(processedData);
    revalidatePath("/");
    revalidatePath("/divisi/[slug]", "page");
    revalidatePath("/admin/anggota-divisi");
    revalidatePath("/admin/divisi");
    return { success: true };
  } catch (err) {
    console.error("[adminActions] saveAnggotaDivisiAction error:", err);
    return { success: false };
  }
}