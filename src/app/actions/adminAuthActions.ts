"use server";

import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@HIMASIug.ac.id";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "HIMASI2025!";

export async function loginAdminAction(
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanEmail = (emailInput || "").trim().toLowerCase();
    const targetEmail = ADMIN_EMAIL.trim().toLowerCase();

    const emailMatch = cleanEmail === targetEmail;
    const passwordMatch = passwordInput === ADMIN_PASSWORD;

    if (!emailMatch || !passwordMatch) {
      return { success: false, error: "Email atau password salah. Silakan coba lagi." };
    }

    // Set secure, HttpOnly session cookie server-side
    const cookieStore = await cookies();
    cookieStore.set("HIMASI_admin_session", "authenticated", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400, // 24 jam
      sameSite: "lax",
    });

    return { success: true };
  } catch (err) {
    console.error("[adminAuthActions] loginAdminAction error:", err);
    return { success: false, error: "Terjadi kesalahan sistem saat proses login." };
  }
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("HIMASI_admin_session");
    return { success: true };
  } catch (err) {
    console.error("[adminAuthActions] logoutAdminAction error:", err);
    return { success: false };
  }
}
