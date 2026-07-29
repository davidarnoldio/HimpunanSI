import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { path, paths, type } = body || {};

    if (path && typeof path === "string") {
      if (type === "layout" || type === "page") {
        revalidatePath(path, type);
      } else {
        revalidatePath(path);
      }
      return NextResponse.json({ revalidated: true, path, timestamp: Date.now() });
    }

    if (Array.isArray(paths)) {
      for (const p of paths) {
        if (typeof p === "string") {
          revalidatePath(p);
        }
      }
      return NextResponse.json({ revalidated: true, paths, count: paths.length, timestamp: Date.now() });
    }

    // Default fallback: revalidate major public routes
    revalidatePath("/");
    revalidatePath("/divisi");
    revalidatePath("/merchandise");
    revalidatePath("/aspirasi");

    return NextResponse.json({
      revalidated: true,
      message: "Public routes revalidated",
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("[API Revalidate Error]:", err);
    return NextResponse.json(
      { revalidated: false, message: "Failed to revalidate path", error: String(err) },
      { status: 500 }
    );
  }
}
