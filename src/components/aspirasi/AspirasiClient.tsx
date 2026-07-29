"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Sparkles,
  User,
  Hash,
  Send,
  Lock,
  CheckCircle2,
  Filter,
  Inbox,
  Clock,
  CheckCheck,
  ShieldCheck,
} from "lucide-react";
import { Navbar, Footer } from "@/components/landing";
import { submitAspirasiAction } from "@/app/actions/aspirasiActions";
import { type AspirasiAdminItem } from "@/data/adminMockData";

const CATEGORIES = ["Akademik", "Fasilitas Kampus", "Event & Proker", "Kritik & Saran", "Lainnya"];

export function AspirasiClient({ initialAspirasi }: { initialAspirasi: AspirasiAdminItem[] }) {
  const [aspirasi, setAspirasiList] = useState<AspirasiAdminItem[]>(initialAspirasi);

  // Form State
  const [kategori, setKategori] = useState(CATEGORIES[0]);
  const [isAnonim, setIsAnonim] = useState(false);
  const [nama, setNama] = useState("");
  const [npm, setNpm] = useState("");
  const [pesan, setPesan] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter feed
  const [filterStatus, setFilterStatus] = useState("Semua");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesan.trim()) return;

    setIsSubmitting(true);

    const res = await submitAspirasiAction({
      pesan: pesan.trim(),
      isAnonim,
      nama: isAnonim ? undefined : nama.trim() || "Mahasiswa SI",
      npm: isAnonim ? undefined : npm.trim() || undefined,
    });

    if (res.success && res.data) {
      setAspirasiList([res.data, ...aspirasi]);
      setIsSubmitted(true);

      // Reset form
      setPesan("");
      setNama("");
      setNpm("");

      // Hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      alert("Gagal mengirim aspirasi ke database. Silakan coba lagi.");
    }

    setIsSubmitting(false);
  };

  const filteredAspirasi = aspirasi.filter((item) => {
    if (filterStatus === "Semua") return true;
    return item.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* ── Sticky Top Navbar ── */}
      <Navbar />

      <main className="flex-1 pt-24 pb-20 relative overflow-hidden">
        {/* ── Ambient Background Glows ── */}
        <div className="pointer-events-none absolute inset-0 select-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/10 dark:bg-red-900/15 blur-[140px] rounded-full" />
          <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-rose-500/10 dark:bg-rose-900/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* ── HERO HEADER ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800/80 text-red-600 dark:text-red-400 text-xs font-bold tracking-wide backdrop-blur-md shadow-sm">
              <Sparkles size={13} className="animate-spin" />
              Suara Mahasiswa Sistem Informasi
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15]">
              Wadah{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-600 dark:from-red-500 dark:via-rose-400 dark:to-red-500">
                Aspirasi Mahasiswa
              </span>{" "}
              📣
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
              Sampaikan saran, keluhan, atau ide kreatif kamu demi kemajuan Sistem Informasi Gunadarma. Kamu bisa mengirim secara **Anonim** atau menggunakan identitas.
            </p>
          </motion.div>

          {/* ── FORM ASPIRASI CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 shadow-2xl space-y-6 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-red-900/20">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    Formulir Aspirasi
                  </h2>
                  <p className="text-xs text-slate-500">Langsung tersampaikan ke Supabase DB & Pengurus HIMSI UG.</p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck size={13} /> Live System Active
              </div>
            </div>

            {/* Success Toast Banner */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-xs sm:text-sm font-bold shadow-sm"
                >
                  <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />
                  <span>
                    Aspirasi kamu berhasil dikirim ke database Supabase! Data langsung masuk ke Admin CMS & akan segera diproses oleh tim terkait.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              {/* Category Pills */}
              <div className="space-y-2">
                <label className="block font-extrabold text-slate-700 dark:text-slate-300">
                  Kategori Aspirasi *
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setKategori(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        kategori === cat
                          ? "bg-red-600 text-white shadow-md shadow-red-900/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Anonymous Toggle Switch */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                    <Lock size={16} />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 text-xs sm:text-sm block">
                      Kirim secara Anonim
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Identitas nama & NPM kamu akan disembunyikan.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAnonim(!isAnonim)}
                  className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                    isAnonim ? "bg-red-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
                  }`}
                >
                  <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* Optional Name & npm Input if not Anonymous */}
              <AnimatePresence>
                {!isAnonim && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1"
                  >
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                        <User size={13} className="text-red-500" /> Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        placeholder="e.g. Fikri Ardiansyah"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                        <Hash size={13} className="text-red-500" /> NPM
                      </label>
                      <input
                        type="text"
                        value={npm}
                        onChange={(e) => setNpm(e.target.value)}
                        placeholder="e.g. 14121900"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message Textarea */}
              <div className="space-y-1.5">
                <label className="block font-extrabold text-slate-700 dark:text-slate-300">
                  Isi Aspirasi / Pesan *
                </label>
                <textarea
                  required
                  rows={4}
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  placeholder="Tuliskan ide, kritik, keluhan, atau harapan kamu secara jelas..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !pesan.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <Send size={16} /> Kirim Aspirasi Sekarang
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* ── PUBLIC ASPIRASI FEED & STATUS ── */}
          <div className="space-y-6 max-w-4xl mx-auto pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-slate-100">
                  Tanggapan Aspirasi Terkini
                </h2>
                <p className="text-xs text-slate-500">Transparansi tindak lanjut aspirasi oleh pengurus HIMSI UG.</p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400 text-xs font-bold mr-1 flex items-center gap-1">
                  <Filter size={12} /> Status:
                </span>
                {["Semua", "Baru", "Diproses", "Selesai"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      filterStatus === status
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspirasi List Cards */}
            {filteredAspirasi.length === 0 ? (
              <div className="p-12 text-center space-y-3 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800">
                <Inbox size={40} className="mx-auto text-slate-400" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Belum ada aspirasi untuk status ini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAspirasi.map((asp) => {
                  const isBaru = asp.status === "Baru";
                  const isDiproses = asp.status === "Diproses";
                  const isSelesai = asp.status === "Selesai";

                  return (
                    <motion.div
                      key={asp.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-red-600 dark:text-red-400">
                            {asp.isAnonim ? "🔒 Anonim" : asp.nama || "Mahasiswa SI"}
                          </span>
                          {asp.npm && !asp.isAnonim && (
                            <span className="text-[11px] font-semibold text-slate-400 font-mono">
                              ({asp.npm})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 font-medium">{asp.tanggal}</span>

                          {/* Status Pill */}
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 border ${
                              isBaru
                                ? "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                                : isDiproses
                                ? "bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                                : "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                            }`}
                          >
                            {isBaru && <Clock size={11} />}
                            {isDiproses && <Clock size={11} />}
                            {isSelesai && <CheckCheck size={11} />}
                            {asp.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        &ldquo;{asp.pesan}&rdquo;
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
