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

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function ensureStorageBucketAndPolicy() {
  try {
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('pengurus-photos', 'pengurus-photos', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Insert Pengurus Photos'
        ) THEN
          CREATE POLICY "Public Insert Pengurus Photos" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'pengurus-photos');
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Select Pengurus Photos'
        ) THEN
          CREATE POLICY "Public Select Pengurus Photos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'pengurus-photos');
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public Update Pengurus Photos'
        ) THEN
          CREATE POLICY "Public Update Pengurus Photos" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'pengurus-photos');
        END IF;
      END $$;
    `);
  } catch (err) {
    console.warn("[adminActions] ensureStorageBucketAndPolicy error:", err);
  }
}

export async function uploadFotoStorageAction(
  base64DataUrl: string,
  pengurusNama: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // 1. Ensure bucket and public RLS policies exist in Supabase DB via Prisma
    await ensureStorageBucketAndPolicy();

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://avkfevavjdgcbfleqxmn.supabase.co";
    const SUPABASE_KEY =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2a2ZldmF2amRnY2JmbGVxeG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNDY0MjksImV4cCI6MjEwMDgyMjQyOX0.Ds5dLTviUjvQOfaeDK3zur3K0zl5i_Qjd-Dsp7KT79g";

    let buffer: Buffer;
    let contentType = "image/avif";

    if (base64DataUrl.startsWith("data:")) {
      const parts = base64DataUrl.split(",");
      const mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) contentType = mimeMatch[1];
      buffer = Buffer.from(parts[1], "base64");
    } else {
      buffer = Buffer.from(base64DataUrl, "base64");
    }

    const slugNama = pengurusNama
      ? pengurusNama
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .slice(0, 30)
      : "pengurus";
    const fileName = `profile/${Date.now()}_${slugNama}.avif`;

    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/pengurus-photos/${fileName}`;
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": contentType,
        "x-upsert": "true",
      },
      body: new Uint8Array(buffer),
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("[adminActions] Storage upload failed:", uploadRes.status, errText);
      return { success: false, error: `Gagal mengunggah foto ke Supabase Storage (${uploadRes.status}): ${errText}` };
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/pengurus-photos/${fileName}`;
    return { success: true, url: publicUrl };
  } catch (err) {
    console.error("[adminActions] uploadFotoStorageAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}


