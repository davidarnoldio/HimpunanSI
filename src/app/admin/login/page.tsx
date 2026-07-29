"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";

// ─── ADMIN CREDENTIALS (Fix #1) ────────────────────────────────────────────
// OPTION A (current): Hard-coded fallback for demo/local use.
// OPTION B (production): Set NEXT_PUBLIC_ADMIN_EMAIL & NEXT_PUBLIC_ADMIN_PASSWORD
//   in your .env.local and Vercel environment variables instead.
// TODO: Replace this entire block with Supabase Auth once @supabase/supabase-js is installed:
//   import { createClient } from "@supabase/supabase-js";
//   const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
//   const { error } = await supabase.auth.signInWithPassword({ email, password });
const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@himsiug.ac.id";
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "himsi2025!";
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate async validation delay (replace with Supabase call when ready)
    await new Promise((r) => setTimeout(r, 600));

    // ── VALIDATION ─────────────────────────────────────────────────────────
    const emailMatch = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const passwordMatch = password === ADMIN_PASSWORD;

    if (!emailMatch || !passwordMatch) {
      setLoading(false);
      setError("Email atau password salah. Silakan coba lagi.");
      return;
    }
    // ───────────────────────────────────────────────────────────────────────

    // Set secure session cookie only AFTER successful validation
    document.cookie =
      "himsi_admin_session=authenticated; path=/; max-age=86400; SameSite=Lax";

    setLoading(false);
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient radial glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-red-600/10 dark:bg-red-900/15 blur-[140px]" />
      </div>

      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-2xl space-y-6"
      >
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="lg" className="shadow-lg shadow-red-900/30" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Admin CMS Login
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Portal Pengelolaan Data Himpunan Mahasiswa Sistem Informasi
            </p>
          </div>
        </div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error-banner"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-400"
            >
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <p className="text-xs font-semibold leading-snug">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Administrator
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Masukkan email administrator..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Masukkan password..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </div>

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-900/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memverifikasi Akses..." : "Masuk ke Control Panel"}
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <Link href="/" className="text-xs text-slate-500 hover:text-red-600 dark:hover:text-red-400 font-semibold">
            ← Kembali ke Website Public HIMSI UG
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
