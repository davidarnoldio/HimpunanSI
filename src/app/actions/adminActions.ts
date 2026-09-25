"use server";

import {
  syncPengurusToDB,
  syncEventsToDB,
  syncMerchandiseToDB,
  syncHeroContentToDB,
  syncVisiMisiToDB,
  syncDivisiToDB,
  syncAnggotaDivisiToDB,
  syncKasTransactionsToDB,
  syncIuranAnggotaToDB,
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
  KasTransaction,
  IuranAnggota,
} from "@/data/adminMockData";

export async function savePengurusAction(data: PengurusItem[]): Promise<{ success: boolean }> {
  try {
    await syncPengurusToDB(data);
    // Revalidate di level layout agar Server Component halaman utama ikut ter-refresh
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
    await syncHeroContentToDB(data);
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
    await syncAnggotaDivisiToDB(data);
    revalidatePath("/");
    revalidatePath("/divisi/[slug]", "page");
    revalidatePath("/admin/anggota-divisi");
    return { success: true };
  } catch (err) {
    console.error("[adminActions] saveAnggotaDivisiAction error:", err);
    return { success: false };
  }
}

export async function saveKasTransactionsAction(data: KasTransaction[]): Promise<{ success: boolean }> {
  try {
    await syncKasTransactionsToDB(data);
    revalidatePath("/admin/bendahara");
    return { success: true };
  } catch (err) {
    console.error("[adminActions] saveKasTransactionsAction error:", err);
    return { success: false };
  }
}

export async function saveIuranAnggotaAction(data: IuranAnggota[]): Promise<{ success: boolean }> {
  try {
    await syncIuranAnggotaToDB(data);
    revalidatePath("/admin/bendahara");
    return { success: true };
  } catch (err) {
    console.error("[adminActions] saveIuranAnggotaAction error:", err);
    return { success: false };
  }
}
