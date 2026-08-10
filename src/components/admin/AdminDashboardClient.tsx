"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Calendar,
  ShoppingBag,
  MessageSquare,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useSharedStore, getValidImageUrl } from "@/lib/sharedStore";
import type {
  PengurusItem,
  EventAdminItem,
  MerchandiseAdminItem,
  AspirasiAdminItem,
} from "@/data/adminMockData";

interface AdminDashboardClientProps {
  initialPengurus: PengurusItem[];
  initialEvents: EventAdminItem[];
  initialMerchandise: MerchandiseAdminItem[];
  initialAspirasi: AspirasiAdminItem[];
}

export function AdminDashboardClient({
  initialPengurus,
  initialEvents,
  initialMerchandise,
  initialAspirasi,
}: AdminDashboardClientProps) {
  const { pengurus, events, aspirasi, merchandise, mounted } = useSharedStore();

  const activePengurus = mounted ? pengurus : initialPengurus;
  const activeEvents = mounted ? events : initialEvents;
  const activeMerchandise = mounted ? merchandise : initialMerchandise;
  const activeAspirasi = mounted ? aspirasi : initialAspirasi;

  const stats = [
    {
      title: "Total Pengurus Kabinet",
      value: activePengurus.filter((p) => p.divisi === "BPH").length,
      unit: "Anggota",
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
      href: "/admin/pengurus",
    },
    {
      title: "Event & Proker",
      value: activeEvents.length,
      unit: "Kegiatan",
      icon: Calendar,
      color: "from-red-600 to-rose-600",
      accent: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800",
      href: "/admin/event",
    },
    {
      title: "Official Merchandise",
      value: activeMerchandise.length,
      unit: "Produk",
      icon: ShoppingBag,
      color: "from-rose-600 to-pink-600",
      accent: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800",
      href: "/admin/merchandise",
    },
    {
      title: "Aspirasi Masuk",
      value: activeAspirasi.length,
      unit: "Pesan",
      icon: MessageSquare,
      color: "from-amber-600 to-orange-600",
      accent: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
      href: "/admin/aspirasi",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
              <span>🚀 HIMSI CMS Admin Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Selamat Datang di Panel Control Admin!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Kelola data pengurus, event, merchandise, dan tanggapan aspirasi mahasiswa Sistem Informasi Gunadarma secara terpusat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/event"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/30 flex items-center gap-1.5 transition-all"
            >
              <Plus size={15} /> Tambah Event
            </Link>
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              Lihat Web Utama <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <motion.div
              key={st.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Link
                href={st.href}
                className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 block"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl border ${st.accent}`}>
                    <Icon size={20} />
                  </div>
                  <span className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-red-500 transition-colors">
                    <ArrowUpRight size={15} />
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      {st.value}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{st.unit}</span>
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 mt-1">
                    {st.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Content Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events Quick Overview (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar size={18} className="text-red-500" /> Event & Proker Terkini
            </h2>
            <Link
              href="/admin/event"
              className="text-xs font-extrabold text-red-600 dark:text-red-400 hover:underline"
            >
              Kelola Semua →
            </Link>
          </div>

          {activeEvents.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              Belum ada event aktif.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeEvents.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3.5 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                    <img
                      src={getValidImageUrl(item.bannerUrl, item.title)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                      {item.tanggal}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aspirasi Quick Overview (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare size={18} className="text-amber-500" /> Aspirasi Terbaru
            </h2>
            <span className="text-xs font-bold text-slate-400">{activeAspirasi.length} Masuk</span>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            {activeAspirasi.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada aspirasi masuk.</p>
            ) : (
              activeAspirasi.slice(0, 3).map((asp) => (
                <div
                  key={asp.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-red-600 dark:text-red-400">
                      {asp.isAnonim ? "🔒 Anonim" : asp.nama || "Mahasiswa SI"}
                    </span>
                    <span className="text-slate-400">{asp.tanggal}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium line-clamp-2 text-[11px]">
                    &ldquo;{asp.pesan}&rdquo;
                  </p>
                </div>
              ))
            )}

            <Link
              href="/admin/aspirasi"
              className="block w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-center text-xs font-extrabold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Lihat Semua Aspirasi →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
