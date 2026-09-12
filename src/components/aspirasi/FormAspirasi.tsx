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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 sm:p-8 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] space-y-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between pb-4 border-b-2 border-slate-950 dark:border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C8102E] text-white flex items-center justify-center border border-slate-950">
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 className="font-black font-heading text-lg uppercase tracking-tight text-slate-950 dark:text-white">
              FORMULIR ASPIRASI
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono font-bold">LANGSUNG TERSAMPAIKAN SECARA RAHASIA</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-[10px] font-black font-mono tracking-widest uppercase border border-slate-950">
          <ShieldCheck size={13} /> SECURE
        </div>
      </div>

      {/* Success Notification Banner */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-[#C8102E] text-white border-2 border-slate-950 flex items-center gap-3 text-xs sm:text-sm font-black font-mono uppercase"
          >
            <CheckCircle2 size={20} className="shrink-0 text-white" />
            <span>
              Aspirasi Anda telah berhasil dikirimkan secara aman ke Admin & Pengurus HIMASI UG!
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
            className="p-4 bg-[#C8102E] text-white border-2 border-slate-950 flex items-center gap-3 text-xs sm:text-sm font-black font-mono uppercase"
          >
            <ShieldAlert size={20} className="shrink-0 text-white" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
        {/* Category Pills */}
        <div className="space-y-2">
          <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white">
            KATEGORI ASPIRASI *
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setKategori(cat)}
                className={`px-3.5 py-1.5 text-xs font-mono font-black uppercase tracking-wider border-2 border-slate-950 transition-colors ${kategori === cat
                  ? "bg-[#C8102E] text-white"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-950 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Instant Anonymous Toggle Switch */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Lock size={16} />
            </div>
            <div>
              <span className="font-black font-heading uppercase text-slate-950 dark:text-white text-sm block">
                KIRIM SECARA ANONIM
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono font-bold">
                Aktifkan jika tidak ingin mencantumkan Nama & NPM.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleAnonim}
            className={`w-12 h-6 border-2 border-slate-950 transition-colors p-0.5 cursor-pointer flex items-center ${isAnonim ? "bg-[#C8102E] justify-end" : "bg-slate-300 dark:bg-slate-800 justify-start"
              }`}
          >
            <div className="w-4 h-4 bg-slate-950 dark:bg-white" />
          </button>
        </div>

        {/* Name & NPM Input */}
        <AnimatePresence>
          {!isAnonim && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1"
            >
              <div>
                <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <User size={14} className="text-[#C8102E] dark:text-[#E31B3B]" /> NAMA LENGKAP *
                </label>
                <input
                  type="text"
                  required={!isAnonim}
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama Lengkap Kamu..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                />
              </div>
              <div>
                <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <Hash size={14} className="text-[#C8102E] dark:text-[#E31B3B]" /> NPM *
                </label>
                <input
                  type="text"
                  required={!isAnonim}
                  value={npm}
                  onChange={(e) => setNpm(e.target.value)}
                  placeholder="8 digit NPM..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono font-bold"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Textarea */}
        <div className="space-y-1.5">
          <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white">
            ISI ASPIRASI / PESAN *
          </label>
          <textarea
            required
            rows={4}
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
            placeholder="Tuliskan ide, kritik, keluhan, atau harapan kamu secara jelas..."
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] resize-none font-medium leading-relaxed"
          />
        </div>

        {/* Cloudflare Turnstile */}
        <div className="flex justify-center py-2 overflow-hidden">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full py-4 bg-[#C8102E] dark:bg-[#E31B3B] hover:bg-slate-950 dark:hover:bg-white dark:hover:text-slate-950 text-white font-black font-mono uppercase tracking-widest text-xs border-2 border-slate-950 dark:border-white/20 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
              <span>MENGIRIM ASPIRASI...</span>
            </>
          ) : (
            <>
              <Send size={16} /> KIRIM ASPIRASI SEKARANG
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
