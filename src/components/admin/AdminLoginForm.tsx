"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { HackerMatrixBackground } from "@/components/ui/HackerMatrixBackground";

import { loginAdminAction } from "@/app/actions/adminAuthActions";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || loading) return;

    setError(null);
    setLoading(true);

    try {
      const res = await loginAdminAction(email, password);

      if (!res.success) {
        setError(res.error || "Email atau password salah. Silakan coba lagi.");
        return;
      }

      // Hard navigation: menghindari RSC reconciliation overhead dari router.push + router.refresh
      // Cookie sudah di-set server-side — middleware akan valid langsung setelah hard reload
      window.location.href = "/admin/dashboard";
      // Jangan set loading(false) — biarkan spinner aktif selama navigasi berlangsung
    } catch (err) {
      console.error("[AdminLogin] Error:", err);
      setError("Terjadi kesalahan sistem saat proses login.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      {/* Background Hacker Matrix & Subtle Red Radial Glow */}
      <HackerMatrixBackground className="opacity-[0.08] dark:opacity-[0.10]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(200,16,46,0.06)_0%,transparent_70%)]" />

      {/* Top Bar Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-8 sm:p-10 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] space-y-6">
          <div className="text-left space-y-3 border-b-2 border-slate-950 dark:border-white/20 pb-4">
            <BrandLogo size="lg" />
            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-mono font-bold tracking-widest uppercase">
                <Sparkles size={13} />
                PORTAL AUTENTIKASI CMS ADMIN
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 font-medium">
                Masuk untuk mengelola event, merchandise, pengurus, & aspirasi HIMASI UG.
              </p>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3.5 bg-[#C8102E] text-white border-2 border-slate-950 text-xs font-mono font-bold flex items-center gap-2 uppercase"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                EMAIL ADMIN *
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-950 dark:text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan Email Admin"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-black font-mono text-xs uppercase tracking-wider text-slate-950 dark:text-white mb-1">
                PASSWORD ADMIN *
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-950 dark:text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 text-slate-950 dark:text-white focus:outline-none focus:border-[#C8102E] font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full py-3.5 bg-[#C8102E] dark:bg-[#E31B3B] text-white font-black font-mono uppercase tracking-widest text-xs border-2 border-slate-950 hover:bg-slate-950 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
                  <span>MEMVERIFIKASI AKSES...</span>
                </>
              ) : (
                <>
                  <span>MASUK KE ADMIN PANEL</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t-2 border-slate-950 dark:border-white/20 text-left">
            <Link
              href="/"
              className="text-xs text-slate-950 dark:text-slate-200 hover:text-[#C8102E] font-mono font-bold uppercase tracking-wider transition-colors"
            >
              ← KEMBALI KE HALAMAN UTAMA PUBLIK
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
