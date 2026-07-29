import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function getIsMaintenance(req: NextRequest): Promise<boolean> {
  // 1. Primary Check: Fetch directly from Supabase REST API (Global Real-time Source of Truth across all devices)
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && anonKey) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/settings?select=value&key=eq.is_maintenance`,
        {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
          },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && typeof data[0].value === "boolean") {
          return data[0].value;
        }
      }
    }
  } catch (err) {
    console.warn("[Middleware] Supabase maintenance mode fetch fallback warning:", err);
  }

  // 2. Secondary Fallback Check: High-performance cookie set by Admin CMS
  const cookieValue = req.cookies.get("himsi_maintenance_mode")?.value;
  if (cookieValue !== undefined) {
    return cookieValue === "true";
  }

  return false;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check Maintenance Mode (Real-time global check)
  const isMaintenance = await getIsMaintenance(req);

  // EXCEPTIONS FOR MAINTENANCE MODE:
  // 1. Admin panel (/admin/*) MUST ALWAYS BE ACCESSIBLE
  // 2. /maintenance page itself MUST be accessible
  // 3. API routes and Next.js internal static assets
  const isAdminRoute = path.startsWith("/admin");
  const isMaintenancePage = path === "/maintenance" || path.startsWith("/maintenance/");
  const isApiRoute = path.startsWith("/api");

  let response: NextResponse | undefined;

  if (isMaintenance) {
    // If maintenance mode is ACTIVE and visitor is trying to access a public route:
    if (!isAdminRoute && !isMaintenancePage && !isApiRoute) {
      const maintenanceUrl = new URL("/maintenance", req.url);
      response = NextResponse.redirect(maintenanceUrl);
    }
  } else {
    // If maintenance mode is OFF and visitor accesses /maintenance, redirect back to home
    if (isMaintenancePage) {
      const homeUrl = new URL("/", req.url);
      response = NextResponse.redirect(homeUrl);
    }
  }

  // ADMIN ROUTE AUTH GUARD:
  // Intercept all /admin routes except /admin/login
  if (!response && isAdminRoute && path !== "/admin/login") {
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

  // Global Cross-Device Anti-Cache Headers: Ensure Vercel Edge & Mobile Browsers (Chrome, Edge, Safari, iOS, Android) NEVER serve stale cached pages
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
