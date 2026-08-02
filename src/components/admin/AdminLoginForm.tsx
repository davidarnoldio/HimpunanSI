"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@himsiug.ac.id";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "himsi2025!";

export function AdminLoginForm() {
  const router = useRouter();
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
      await new Promise((r) => setTimeout(r, 400));

      const emailMatch = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const passwordMatch = password === ADMIN_PASSWORD;

      if (!emailMatch || !passwordMatch) {
        setError("Email atau password salah. Silakan coba lagi.");
        return;
      }

      document.cookie =
        "himsi_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax";

      router.push("/admin/dashboard");
    } catch (err) {
      console.error("[AdminLogin] Error:", err);
      setError("Terjadi kesalahan sistem saat proses login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 dark:bg-red-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-rose-500/10 dark:bg-rose-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="p-8 sm:p-10 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-block">
              <BrandLogo size="lg" />
            </div>
            <div className="pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold">
                <Sparkles size={13} />
                Portal Autentikasi CMS Admin
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                Masuk untuk mengelola event, merchandise, pengurus, & aspirasi HIMSI UG.
              </p>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Email Admin *
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email admin"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
                Password Admin *
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-900/30 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Memverifikasi Akses...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Admin Panel</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400 font-bold transition-colors"
            >
              ← Kembali ke Halaman Utama Publik
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
