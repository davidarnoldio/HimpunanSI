"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShoppingBag,
  MessageSquare,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Shield,
  Layers,
  Target,
  Sparkles,
  Wallet,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useSharedStore } from "@/lib/sharedStore";
import { Loader2 } from "lucide-react";

import { logoutAdminAction } from "@/app/actions/adminAuthActions";

// Module-level constant — stable reference, won't trigger ESLint exhaustive-deps
const PREFETCH_HREFS = [
  "/admin/dashboard",
  "/admin/beranda",
  "/admin/visimisi",
  "/admin/pengurus",
  "/admin/divisi",
  "/admin/event",
  "/admin/merchandise",
  "/admin/aspirasi",
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const { aspirasi } = useSharedStore();

  const handleLogout = async () => {
    try {
      await logoutAdminAction();
      // Clear client fallback cookie if any
      document.cookie = "HIMASI_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    } catch (e) {
      console.error("Logout error:", e);
    }
    // Hard navigation after logout: memastikan cookie HttpOnly sudah bersih
    window.location.href = "/admin/login";
  };

  const unreadAspirasiCount = aspirasi.filter((a) => a.status === "Baru").length;

  const SIDEBAR_ITEMS = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Kelola Beranda", href: "/admin/beranda", icon: Sparkles },
    { label: "Kelola Visi & Misi", href: "/admin/visimisi", icon: Target },
    { label: "Kelola Pengurus (BPH)", href: "/admin/pengurus", icon: Users },
    { label: "Kelola Divisi & Anggota", href: "/admin/divisi", icon: Layers },
    { label: "Kelola Bendahara", href: "/admin/bendahara", icon: Wallet },
    { label: "Kelola Event", href: "/admin/event", icon: Calendar },
    { label: "Kelola Merchandise", href: "/admin/merchandise", icon: ShoppingBag },
    {
      label: "Aspirasi Masuk",
      href: "/admin/aspirasi",
      icon: MessageSquare,
      badge: unreadAspirasiCount > 0 ? `${unreadAspirasiCount} Baru` : undefined,
    },
  ];

  // Prefetch all admin routes in background for instant subsecond tab switching
  useEffect(() => {
    PREFETCH_HREFS.forEach((href) => {
      try {
        router.prefetch(href);
      } catch {
        // ignore prefetch errors
      }
    });
  }, [router]);

  // If viewing admin login page, omit sidebar layout
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">
      {/* ── Sidebar (Desktop) ── */}
      <aside className="hidden md:flex flex-col w-64 border-r-2 border-slate-950 dark:border-white/20 bg-slate-50 dark:bg-slate-900 shrink-0 sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-6 border-b-2 border-slate-950 dark:border-white/20 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <BrandLogo size="md" />
            <div>
              <h1 className="font-black font-heading text-sm text-slate-950 dark:text-white uppercase leading-tight">
                HIMASI UG Admin
              </h1>
              <span className="text-[10px] font-black font-mono text-[#C8102E] dark:text-[#E31B3B] uppercase tracking-widest flex items-center gap-1">
                <Shield size={10} /> Control Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <span className="px-3 text-[10px] font-black font-mono tracking-widest text-[#C8102E] dark:text-[#E31B3B] uppercase block mb-2">
            [ MENU UTAMA ]
          </span>
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pendingHref === item.href;
            const isPending = pendingHref === item.href && pathname !== item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setPendingHref(item.href)}
                className={`group flex items-center justify-between px-3.5 py-3 text-xs font-black font-mono uppercase tracking-wider border-2 border-slate-950 transition-colors ${
                  isActive
                    ? "bg-[#C8102E] dark:bg-[#E31B3B] text-white shadow-[3px_3px_0px_0px_rgba(10,10,10,1)]"
                    : "bg-white dark:bg-slate-950 text-slate-950 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isPending ? (
                    <Loader2 size={16} className="text-white animate-spin" />
                  ) : (
                    <Icon size={16} className={isActive ? "text-white" : "text-slate-950 dark:text-white"} />
                  )}
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-black font-mono uppercase border border-slate-950 ${
                      isActive ? "bg-slate-950 text-white" : "bg-[#C8102E] text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t-2 border-slate-950 dark:border-white/20 space-y-3">
          <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20">
            <span className="text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white">TEMA</span>
            <div className="shrink-0 scale-90 origin-right">
              <ThemeToggle />
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 bg-slate-200 dark:bg-slate-800 text-xs font-black font-mono uppercase tracking-wider text-slate-950 dark:text-white border-2 border-slate-950 dark:border-white/20 hover:bg-[#C8102E] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} /> PUBLIC WEB
            </span>
            <ChevronRight size={14} />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 bg-[#C8102E] text-white text-xs font-black font-mono uppercase tracking-wider border-2 border-slate-950 hover:bg-slate-950 transition-colors"
          >
            <LogOut size={14} /> LOGOUT ADMIN
          </button>
        </div>
      </aside>

      {/* ── Header Mobile ── */}
      <div className="md:hidden flex items-center justify-between p-4 border-b-2 border-slate-950 dark:border-white/20 bg-white dark:bg-slate-950 sticky top-0 z-30">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <BrandLogo size="sm" />
          <span className="font-black font-heading text-xs uppercase tracking-wider">HIMASI Admin</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b-2 border-slate-950 dark:border-white/20 bg-slate-50 dark:bg-slate-900 p-4 space-y-2 z-20"
          >
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 text-xs font-black font-mono uppercase border-2 border-slate-950 ${isActive ? "bg-[#C8102E] text-white" : "bg-white dark:bg-slate-950 text-slate-950 dark:text-white"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-black font-mono bg-slate-950 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 bg-[#C8102E] text-white text-xs font-black font-mono uppercase border-2 border-slate-950"
            >
              <LogOut size={16} /> LOGOUT ADMIN
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-x-hidden">{children}</main>
    </div>
  );
}
