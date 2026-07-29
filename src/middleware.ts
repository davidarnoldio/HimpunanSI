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
