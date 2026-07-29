"use client";

import { useState } from "react";
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
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { MaintenanceToggle } from "@/components/admin/MaintenanceToggle";
import { useSharedStore } from "@/lib/sharedStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { aspirasi } = useSharedStore();

  const handleLogout = () => {
    // Clear session cookie
    document.cookie = "himsi_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    router.push("/admin/login");
  };

  const unreadAspirasiCount = aspirasi.filter((a) => a.status === "Baru").length;

  const SIDEBAR_ITEMS = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Kelola Beranda", href: "/admin/beranda", icon: Sparkles },
    { label: "Kelola Visi & Misi", href: "/admin/visimisi", icon: Target },
    { label: "Kelola Pengurus (BPH)", href: "/admin/pengurus", icon: Users },
    { label: "Kelola Divisi & Anggota", href: "/admin/divisi", icon: Layers },
    { label: "Kelola Event", href: "/admin/event", icon: Calendar },
    { label: "Kelola Merchandise", href: "/admin/merchandise", icon: ShoppingBag },
    {
      label: "Aspirasi Masuk",
      href: "/admin/aspirasi",
      icon: MessageSquare,
      badge: unreadAspirasiCount > 0 ? `${unreadAspirasiCount} Baru` : undefined,
    },
  ];

  // If viewing admin login page, omit sidebar layout
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e1f]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e1f] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">
      {/* ── Sidebar (Desktop) ── */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#0a0e1f]/80 backdrop-blur-xl shrink-0 sticky top-0 h-screen z-30">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <BrandLogo size="md" />
            <div>
              <h1 className="font-extrabold font-heading text-sm text-slate-900 dark:text-slate-100 leading-tight">
                HIMSI UG Admin
              </h1>
              <span className="text-[11px] font-semibold font-mono text-red-600 dark:text-red-400 flex items-center gap-1">
                <Shield size={10} /> Control Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <span className="px-3 text-[10px] font-extrabold font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-2">
            Menu Utama
          </span>
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg shadow-red-900/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? "text-white" : "text-slate-400 group-hover:text-red-500"} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono shadow-sm ${
                      isActive
                        ? "bg-white text-red-600"
                        : "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20"
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
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
          <MaintenanceToggle />

          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60">
            <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">Mode Tampilan</span>
            <div className="shrink-0 scale-90 origin-right">
              <ThemeToggle />
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold font-mono text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} /> Lihat Public Web
            </span>
            <ChevronRight size={14} />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-bold font-mono text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut size={14} /> Logout Admin
          </button>
        </div>
      </aside>

      {/* ── Header Mobile ── */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0a0e1f]/90 backdrop-blur-xl sticky top-0 z-30">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <BrandLogo size="sm" />
          <span className="font-extrabold font-heading text-xs">HIMSI Admin</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
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
            className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0e1f] p-4 space-y-2 z-20"
          >
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold font-mono ${
                    isActive ? "bg-red-600 text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono bg-red-500 text-white">
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
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold font-mono text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
            >
              <LogOut size={16} /> Logout Admin
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-x-hidden">{children}</main>
    </div>
  );
}
