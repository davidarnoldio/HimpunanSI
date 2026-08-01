"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  User,
  Hash,
  Send,
  Lock,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { submitAspirasiAction } from "@/app/actions/aspirasiActions";

const CATEGORIES = ["Akademik", "Fasilitas Kampus", "Event & Proker", "Kritik & Saran", "Lainnya"];

export function FormAspirasi() {
  const [kategori, setKategori] = useState(CATEGORIES[0]);
  const [isAnonim, setIsAnonim] = useState(false);
  const [nama, setNama] = useState("");
  const [npm, setNpm] = useState("");
  const [pesan, setPesan] = useState("");

  // Turnstile Token State
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Anti-lag instant toggle handler
  const handleToggleAnonim = () => {
    setIsAnonim((prev) => !prev);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesan.trim() || !turnstileToken || isLoading) return;

    // Validasi Wajib Nama & NPM jika TIDAK memilih anonim
    if (!isAnonim && (!nama.trim() || !npm.trim())) {
      setErrorMessage("Nama Lengkap dan NPM wajib diisi jika tidak memilih Kirim secara Anonim.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setIsSuccess(false);

    try {
      const res = await submitAspirasiAction({
        pesan: `[${kategori}] ${pesan.trim()}`,
        isAnonim,
        nama: isAnonim ? undefined : nama.trim(),
        npm: isAnonim ? undefined : npm.trim(),
        turnstileToken,
      });

      if (res.success) {
        setIsSuccess(true);
        setPesan("");
        setNama("");
        setNpm("");
        setTurnstileToken(null);
        setTimeout(() => setIsSuccess(false), 6000);
      } else {
        setErrorMessage(
          res.error || "Gagal mengirim aspirasi ke database. Silakan coba beberapa saat lagi."
        );
      }
    } catch (err) {
      console.error("[FormAspirasi] Submit error:", err);
      setErrorMessage("Terjadi kesalahan sistem saat mengirimkan aspirasi.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    Boolean(pesan.trim()) &&
    Boolean(turnstileToken) &&
    (isAnonim || (Boolean(nama.trim()) && Boolean(npm.trim())));

  return (
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
            <p className="text-xs text-slate-500">Langsung tersampaikan secara rahasia ke Pengurus HIMSI UG.</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck size={13} /> Cloudflare Protected
        </div>
      </div>

      {/* Success Notification Banner */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-xs sm:text-sm font-bold shadow-sm"
          >
            <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />
            <span>
              Aspirasi Anda telah berhasil dikirimkan secara aman ke Admin & Pengurus HIMSI UG! Terima kasih atas partisipasi Anda.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Notification Banner */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center gap-3 text-xs sm:text-sm font-bold shadow-sm"
          >
            <ShieldAlert size={20} className="shrink-0 text-red-500" />
            <span>{errorMessage}</span>
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

        {/* Instant Anonymous Toggle Switch */}
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
                Aktifkan jika tidak ingin mencantumkan Nama & NPM.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleAnonim}
            className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
              isAnonim ? "bg-red-600 justify-end" : "bg-slate-300 dark:bg-slate-700 justify-start"
            }`}
          >
            <motion.div layout className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Name & NPM Input (Mandatory when not anonymous) */}
        <AnimatePresence>
          {!isAnonim && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1"
            >
              <div>
                <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <User size={13} className="text-red-500" /> Nama Lengkap *
                </label>
                <input
                  type="text"
                  required={!isAnonim}
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="e.g. Fikri Ardiansyah"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-semibold"
                />
              </div>
              <div>
                <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Hash size={13} className="text-red-500" /> NPM *
                </label>
                <input
                  type="text"
                  required={!isAnonim}
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

        {/* Cloudflare Turnstile Anti-Spam Widget */}
        <div className="flex justify-center py-2 overflow-hidden">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
          />
        </div>

        {/* Protected Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all cursor-pointer text-sm"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Mengirim Aspirasi...</span>
            </>
          ) : (
            <>
              <Send size={16} /> Kirim Aspirasi Sekarang
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
