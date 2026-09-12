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
      title: "PENGURUS BPH",
      value: activePengurus.filter((p) => p.divisi === "BPH").length,
      unit: "ANGGOTA",
      icon: Users,
      href: "/admin/pengurus",
    },
    {
      title: "EVENT & PROKER",
      value: activeEvents.length,
      unit: "KEGIATAN",
      icon: Calendar,
      href: "/admin/event",
    },
    {
      title: "MERCHANDISE",
      value: activeMerchandise.length,
      unit: "PRODUK",
      icon: ShoppingBag,
      href: "/admin/merchandise",
    },
    {
      title: "ASPIRASI MASUK",
      value: activeAspirasi.length,
      unit: "PESAN",
      icon: MessageSquare,
      href: "/admin/aspirasi",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 bg-slate-950 text-white border-2 border-slate-950 dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8102E] text-white text-xs font-mono font-bold uppercase tracking-widest border border-slate-950">
              🚀 HIMSI CMS CONTROL PANEL
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-heading tracking-tight uppercase">
              SELAMAT DATANG DI DASHBOARD ADMIN!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Kelola data pengurus, event, merchandise, dan tanggapan aspirasi mahasiswa Sistem Informasi Gunadarma secara terpusat.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/event"
              className="px-4 py-2.5 bg-[#C8102E] hover:bg-white hover:text-slate-950 text-white font-black font-mono text-xs uppercase tracking-wider border-2 border-white flex items-center gap-1.5 transition-colors"
            >
              <Plus size={15} /> TAMBAH EVENT
            </Link>
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black font-mono text-xs uppercase tracking-wider border-2 border-white/20 flex items-center gap-1.5 transition-colors"
            >
              LIHAT PUBLIC WEB <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="group p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 hover:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all flex flex-col justify-between space-y-4 block"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950">
                    <Icon size={20} />
                  </div>
                  <span className="p-1.5 bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white group-hover:bg-[#C8102E] group-hover:text-white transition-colors">
                    <ArrowUpRight size={15} />
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-heading text-slate-950 dark:text-white tracking-tight">
                      {st.value}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase">{st.unit}</span>
                  </div>
                  <h3 className="text-xs font-black font-mono text-[#C8102E] dark:text-[#E31B3B] uppercase tracking-wider mt-1">
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
          <div className="flex items-center justify-between border-b-2 border-slate-950 dark:border-white/20 pb-3">
            <h2 className="text-base font-black font-heading uppercase text-slate-950 dark:text-white flex items-center gap-2 tracking-tight">
              <Calendar size={18} className="text-[#C8102E] dark:text-[#E31B3B]" /> EVENT & PROKER TERKINI
            </h2>
            <Link
              href="/admin/event"
              className="text-xs font-mono font-bold text-[#C8102E] dark:text-[#E31B3B] hover:underline uppercase"
            >
              KELOLA SEMUA →
            </Link>
          </div>

          {activeEvents.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-xs font-mono font-bold text-slate-400">
              BELUM ADA EVENT AKTIF.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeEvents.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 flex items-center gap-3.5"
                >
                  <div className="w-14 h-14 border border-slate-950 overflow-hidden bg-slate-950 shrink-0">
                    <img
                      src={getValidImageUrl(item.bannerUrl, item.title)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black font-heading text-xs text-slate-950 dark:text-white uppercase truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-bold truncate mt-0.5">
                      {item.tanggal}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-mono font-black uppercase bg-[#C8102E] text-white">
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
          <div className="flex items-center justify-between border-b-2 border-slate-950 dark:border-white/20 pb-3">
            <h2 className="text-base font-black font-heading uppercase text-slate-950 dark:text-white flex items-center gap-2 tracking-tight">
              <MessageSquare size={18} className="text-[#C8102E] dark:text-[#E31B3B]" /> ASPIRASI TERBARU
            </h2>
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">{activeAspirasi.length} MASUK</span>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 space-y-3">
            {activeAspirasi.length === 0 ? (
              <p className="text-xs text-slate-400 font-mono font-bold text-center py-4">BELUM ADA ASPIRASI MASUK.</p>
            ) : (
              activeAspirasi.slice(0, 3).map((asp) => (
                <div
                  key={asp.id}
                  className="p-3 bg-white dark:bg-slate-950 border border-slate-950 dark:border-white/20 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                    <span className="text-[#C8102E] dark:text-[#E31B3B]">
                      {asp.isAnonim ? "🔒 ANONIM" : asp.nama || "MAHASISWA SI"}
                    </span>
                    <span className="text-slate-500">{asp.tanggal}</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium line-clamp-2 text-[11px]">
                    &ldquo;{asp.pesan}&rdquo;
                  </p>
                </div>
              ))
            )}

            <Link
              href="/admin/aspirasi"
              className="block w-full py-2.5 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-center text-xs font-black font-mono uppercase tracking-wider border border-slate-950 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors"
            >
              LIHAT SEMUA ASPIRASI →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
