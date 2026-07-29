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
  CalendarX,
} from "lucide-react";
import { useSharedStore } from "@/lib/sharedStore";

export default function AdminDashboardOverview() {
  const { pengurus, events, aspirasi, merchandise } = useSharedStore();

  const stats = [
    {
      title: "Total Pengurus Kabinet",
      value: pengurus.filter((p) => p.divisi === "BPH").length,
      unit: "Anggota",
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800",
      href: "/admin/pengurus",
    },
    {
      title: "Event & Proker",
      value: events.length,
      unit: "Kegiatan",
      icon: Calendar,
      color: "from-red-600 to-rose-600",
      accent: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800",
      href: "/admin/event",
    },
    {
      title: "Official Merchandise",
      value: merchandise.length,
      unit: "Produk",
      icon: ShoppingBag,
      color: "from-rose-600 to-pink-600",
      accent: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800",
      href: "/admin/merchandise",
    },
    {
      title: "Aspirasi Masuk",
      value: aspirasi.length,
      unit: "Pesan",
      icon: MessageSquare,
      color: "from-amber-600 to-orange-600",
      accent: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
      href: "/admin/aspirasi",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#0a0e1f] to-red-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold font-mono tracking-widest bg-red-600/30 text-red-400 border border-red-500/30 uppercase">
            Control Center Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Selamat Datang di Admin Panel HIMSI UG
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Kelola data pengurus, event, merchandise, dan tanggapan aspirasi mahasiswa Sistem Informasi Gunadarma secara terpusat.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid (4 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="glass-card p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl border ${stat.accent}`}>
                  <Icon size={20} />
                </div>
                <Link
                  href={stat.href}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {stat.title}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-400">{stat.unit}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="glass-card p-6 space-y-4">
        <h2 className="font-extrabold font-heading text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
          Aksi Cepat Admin
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/pengurus"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-red-500/40 transition-colors text-xs font-bold font-mono text-slate-800 dark:text-slate-200"
          >
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Plus size={16} />
            </div>
            <span>Tambah Pengurus BPH</span>
          </Link>

          <Link
            href="/admin/event"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-red-500/40 transition-colors text-xs font-bold font-mono text-slate-800 dark:text-slate-200"
          >
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <Plus size={16} />
            </div>
            <span>Buat Event Proker Baru</span>
          </Link>

          <Link
            href="/admin/merchandise"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-red-500/40 transition-colors text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Plus size={16} />
            </div>
            <span>Tambah Merchandise</span>
          </Link>
        </div>
      </div>

      {/* Content Overview: Events Grid & Aspirasi List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events Table (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Event & Proker Terbaru
              </h2>
              <p className="text-xs text-slate-500">Daftar kegiatan dan status pendaftaran proker.</p>
            </div>
            <Link
              href="/admin/event"
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
            >
              Kelola Semua <ArrowUpRight size={14} />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
              <CalendarX size={32} className="text-slate-400" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Belum ada event terdaftar</p>
              <p className="text-[11px] text-slate-500">Semua event telah dihapus atau belum ditambahkan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">
                    <th className="pb-3 pr-4">Nama Event</th>
                    <th className="pb-3 px-3">Kategori</th>
                    <th className="pb-3 px-3">Tanggal</th>
                    <th className="pb-3 pl-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {events.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-slate-100 max-w-[200px] truncate">
                        {item.title}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px]">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 font-medium">
                        {item.tanggal}
                      </td>
                      <td className="py-3.5 pl-3 text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          item.status === "Pendaftaran Dibuka"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                            : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                        }`}>
                          {item.status === "Pendaftaran Dibuka" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Aspirasi Masuk & Status Card (1 col) */}
        <div className="space-y-6">
          {/* Aspirasi Quick List */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Aspirasi Terbaru
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 text-[10px] font-bold">
                {aspirasi.length} Masuk
              </span>
            </div>

            <div className="space-y-3">
              {aspirasi.slice(0, 3).map((asp) => (
                <div
                  key={asp.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {asp.isAnonim ? "🔒 Anonim" : asp.nama}
                    </span>
                    <span className="text-slate-400">{asp.tanggal}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2 mt-0.5">
                    &ldquo;{asp.pesan}&rdquo;
                  </p>
                </div>
              ))}
            </div>

            <Link
              href="/admin/aspirasi"
              className="block w-full text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Lihat Semua Aspirasi →
            </Link>
          </div>

          {/* System Status Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sistem Database Active
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prisma ORM connected ke Supabase PostgreSQL. Semua data tersinkronisasi otomatis dengan portal public.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
