import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    // 🔒 Security Check: Must provide REVALIDATE_SECRET token or possess active admin session
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    const querySecret = req.nextUrl.searchParams.get("secret");
    const token = bearerToken || querySecret;

    const expectedSecret = process.env.REVALIDATE_SECRET || process.env.ADMIN_PASSWORD;
    const isSecretValid = expectedSecret ? token === expectedSecret : false;

    const adminSessionCookie = req.cookies.get("HIMASI_admin_session")?.value;
    const isAdminSessionValid = adminSessionCookie === "authenticated";

    if (!isSecretValid && !isAdminSessionValid) {
      return NextResponse.json(
        { error: "Unauthorized. Missing or invalid revalidate secret / admin session." },
        { status: 401 }
      );
    }

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
