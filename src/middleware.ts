import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  let response: NextResponse | undefined;

  // ─── ADMIN AUTH GUARD (hanya untuk rute /admin/*) ───────────────────────
  if (path.startsWith("/admin")) {
    const session =
      request.cookies.get("HIMASI_admin_session")?.value ||
      request.cookies.get("sb-access-token")?.value ||
      request.cookies.get("admin_session")?.value;

    if (path !== "/admin/login" && !session) {
      // Belum login → redirect ke halaman login
      response = NextResponse.redirect(new URL("/admin/login", request.url));
    } else if (path === "/admin/login" && session) {
      // Sudah login tapi buka /admin/login → redirect ke dashboard
      response = NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }
  }

  // Jika tidak ada redirect, lanjutkan request normal
  if (!response) {
    response = NextResponse.next();
  }

  // ─── GLOBAL HTTP SECURITY HEADERS (berlaku untuk SEMUA rute) ───────────
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co https://placehold.co https://fonts.gstatic.com https:",
      "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match SEMUA rute KECUALI file statis, image, dan internal Next.js assets.
     * Ini memastikan homepage (/) dan semua halaman publik juga melewati middleware.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
