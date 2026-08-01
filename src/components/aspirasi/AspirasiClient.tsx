"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Navbar, Footer } from "@/components/landing";
import { FormAspirasi } from "./FormAspirasi";

export function AspirasiClient() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Sticky Top Navbar */}
      <Navbar />

      <main className="flex-1 pt-24 pb-20 relative overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="pointer-events-none absolute inset-0 select-none">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/10 dark:bg-red-900/15 blur-[140px] rounded-full" />
          <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-rose-500/10 dark:bg-rose-900/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* HERO HEADER */}
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

          {/* EXTRACTED INTERACTIVE FORM COMPONENT */}
          <FormAspirasi />
        </div>
      </main>

      <Footer />
    </div>
  );
}
