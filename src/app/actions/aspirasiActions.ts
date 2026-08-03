"use server";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import {
  insertAspirasiToDB,
  fetchAspirasiFromDB,
  updateAspirasiStatusInDB,
  deleteAspirasiFromDB,
} from "@/lib/supabaseData";
import { revalidatePath } from "next/cache";
import type { AspirasiAdminItem } from "@/data/adminMockData";

// ─── INSTANCE RATE LIMITER (UPSTASH REDIS) ─────────────────────────────────
// Hanya dibuat jika env var tersedia — mencegah error "Failed to parse URL from /pipeline"
// saat UPSTASH_REDIS_REST_URL tidak dikonfigurasi (dev lokal tanpa Redis).
const hasRedisConfig =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit = hasRedisConfig
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(3, "1 m"),
      analytics: true,
      prefix: "himsi_ratelimit_aspirasi",
    })
  : null; // Redis tidak dikonfigurasi — rate limiting di-skip (dev mode)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validasi Token Cloudflare Turnstile di Server-Side
 */
async function verifyTurnstile(token: string): Promise<boolean> {
  if (!token) return false;

  const secretKey =
    process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA"; // Dummy testing fallback

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const outcome = await res.json();
    return Boolean(outcome.success);
  } catch (err) {
    console.error("[Turnstile Backend Verification Error]:", err);
    return false;
  }
}

export async function submitAspirasiAction(payload: {
  pesan: string;
  isAnonim: boolean;
  nama?: string;
  npm?: string;
  email?: string;
  turnstileToken: string;
}): Promise<{ success: boolean; data?: AspirasiAdminItem; error?: string }> {
  try {
    // 1. Tangkap IP Pengguna dari headers
    const headerList = await headers();
    const rawIp = headerList.get("x-forwarded-for") ?? "127.0.0.1";
    const ip = rawIp.split(",")[0].trim();

    // 2. Rate Limiting Check (hanya jika Redis dikonfigurasi)
    if (ratelimit) {
      const { success: isRateLimitOk } = await ratelimit.limit(ip);
      if (!isRateLimitOk) {
        return {
          success: false,
          error: "Sabar bos! Kamu terlalu banyak mengirim aspirasi. Tunggu 1 menit lagi ya.",
        };
      }
    }

    // 3. Verifikasi token Turnstile ke Cloudflare siteverify API
    const isValidHuman = await verifyTurnstile(payload.turnstileToken);
    if (!isValidHuman) {
      return {
        success: false,
        error: "Verifikasi keamanan Turnstile gagal. Akses bot/spam ditolak.",
      };
    }

    // 4. Validasi Nama & NPM jika tidak anonim
    if (!payload.isAnonim) {
      if (!payload.nama?.trim() || !payload.npm?.trim()) {
        return {
          success: false,
          error: "Nama Lengkap dan NPM wajib diisi jika tidak memilih Kirim secara Anonim.",
        };
      }
    }

    // 5. Simpan ke database Supabase
    const today = new Date().toISOString().slice(0, 10);
    const newAspirasi: AspirasiAdminItem = {
      id: `asp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      pesan: payload.pesan.trim(),
      isAnonim: payload.isAnonim,
      // B3 FIX: nama tidak boleh fallback ke hardcoded string jika sudah divalidasi
      nama: payload.isAnonim ? undefined : payload.nama?.trim() || undefined,
      npm: payload.isAnonim ? undefined : payload.npm?.trim() || undefined,
      // B3 FIX: email field selalu dimasukkan agar ter-insert ke Supabase
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
