"use server";

import { revalidatePath } from "next/cache";

/**
 * Server Action to revalidate a single route path
 */
export async function revalidateRoute(path: string, type?: "page" | "layout") {
  try {
    if (type) {
      revalidatePath(path, type);
    } else {
      revalidatePath(path);
    }
    return { success: true, path, timestamp: Date.now() };
  } catch (error) {
    console.error(`[Revalidate Action] Error revalidating ${path}:`, error);
    return { success: false, error: String(error) };
  }
}

/**
 * Server Action to revalidate multiple route paths simultaneously
 */
export async function revalidateRoutes(paths: string[]) {
  try {
    for (const p of paths) {
      revalidatePath(p);
    }
    return { success: true, count: paths.length, timestamp: Date.now() };
  } catch (error) {
    console.error("[Revalidate Action] Error batch revalidating:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Specialized Server Actions for each entity in HIMSI CMS
 */
export async function triggerRevalidateDivisi(slug?: string) {
  try {
    revalidatePath("/");
    revalidatePath("/divisi");
    if (slug) {
      revalidatePath(`/divisi/${slug}`);
    }
    return { success: true };
  } catch (error) {
    console.error("[Revalidate Divisi] Error:", error);
    return { success: false };
  }
}

export async function triggerRevalidateMerchandise() {
  try {
    revalidatePath("/");
    revalidatePath("/merchandise");
    return { success: true };
  } catch (error) {
    console.error("[Revalidate Merchandise] Error:", error);
    return { success: false };
  }
}

export async function triggerRevalidateEvent() {
  try {
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[Revalidate Event] Error:", error);
    return { success: false };
  }
}

export async function triggerRevalidateBeranda() {
  try {
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("[Revalidate Beranda] Error:", error);
    return { success: false };
  }
}

export async function triggerRevalidateVisiMisi() {
  try {
    revalidatePath("/");
    revalidatePath("/divisi");
    return { success: true };
  } catch (error) {
    console.error("[Revalidate VisiMisi] Error:", error);
    return { success: false };
  }
}

export async function triggerRevalidatePengurus() {
  try {
    revalidatePath("/");
    revalidatePath("/divisi");
    return { success: true };
  } catch (error) {
    console.error("[Revalidate Pengurus] Error:", error);
    return { success: false };
  }
}

export async function triggerRevalidateAspirasi() {
  try {
    revalidatePath("/");
    revalidatePath("/aspirasi");
    return { success: true };
  } catch (error) {
    console.error("[Revalidate Aspirasi] Error:", error);
    return { success: false };
  }
}
