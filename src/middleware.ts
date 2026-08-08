import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");

  let response: NextResponse | undefined;

  // ADMIN ROUTE AUTH GUARD:
  // Intercept all /admin routes except /admin/login
  if (isAdminRoute && path !== "/admin/login") {
    const session =
      req.cookies.get("himsi_admin_session")?.value ||
      req.cookies.get("sb-access-token")?.value ||
      req.cookies.get("admin_session")?.value;

    if (!session) {
      const loginUrl = new URL("/admin/login", req.url);
      response = NextResponse.redirect(loginUrl);
    }
  }

  // If user is already authenticated and visits /admin/login, redirect to /admin/dashboard
  if (!response && path === "/admin/login") {
    const session =
      req.cookies.get("himsi_admin_session")?.value ||
      req.cookies.get("sb-access-token")?.value ||
      req.cookies.get("admin_session")?.value;

    if (session) {
      const dashboardUrl = new URL("/admin/dashboard", req.url);
      response = NextResponse.redirect(dashboardUrl);
    }
  }

  if (!response) {
    response = NextResponse.next();
  }

  // ─── HTTP Security Headers ──────────────────────────────────────────────
  // Applied here (middleware) so Vercel Edge always includes them in every
  // response. The next.config.ts headers() alone gets overridden by
  // NextResponse.next().
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
  // Permissive CSP — allows inline styles (Framer Motion), inline scripts
  // (Next.js), Cloudflare Turnstile, Google Fonts, and image placeholders.
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https://*.supabase.co https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  );

  // Global Cross-Device Anti-Cache Headers: Ensure Vercel Edge & Mobile Browsers NEVER serve stale cached pages
  if (!isAdminRoute) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files & internal Next.js assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
