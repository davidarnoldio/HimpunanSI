"use client";

import { motion } from "framer-motion";
import { Sparkles, Flame } from "lucide-react";
import { Navbar, Footer } from "@/components/landing";
import { FormAspirasi } from "./FormAspirasi";
import { HackerMatrixBackground } from "@/components/ui/HackerMatrixBackground";

export function AspirasiClient() {
  const MARQUEE_ITEMS = [
    "HIMASI UG",
    "SUARA MAHASISWA SISTEM INFORMASI",
    "TRANSPARAN & INOVATIF",
    "UNIVERSITAS GUNADARMA",
    "ASPIRASI TERDENGAR",
    "KABINET FORMASI",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Sticky Top Navbar */}
      <Navbar />

      <main className="flex-1 pt-24 pb-20 relative overflow-hidden">
        {/* Ambient Subtle Grid & Soft Background Mask */}
        <div className="pointer-events-none absolute inset-0 select-none">
          <HackerMatrixBackground />
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 dark:bg-red-900/12 blur-[140px] rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 z-10">
          {/* HERO HEADER — Format Standar Landing Page */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-left space-y-4 max-w-3xl border-b-2 border-slate-950 dark:border-white/20 pb-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles size={12} />
              PORTAL ASPIRASI MAHASISWA
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tighter uppercase text-slate-950 dark:text-white">
              WADAH <span className="text-[#C8102E] dark:text-[#E31B3B]">ASPIRASI MAHASISWA</span> 📣
            </h1>

            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium max-w-2xl">
              Sampaikan saran, keluhan, atau ide kreatif kamu demi kemajuan Sistem Informasi Universitas Gunadarma. Kamu bisa mengirimkan aspirasi secara <strong className="text-slate-950 dark:text-white">Anonim</strong> atau menggunakan identitas resmi.
            </p>
          </motion.div>

          {/* FORM ASPIRASI */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <FormAspirasi />
          </motion.div>
        </div>

        {/* MARQUEE LIVE TEXT (FULL WIDTH EDGE TO EDGE) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full overflow-hidden py-3.5 mt-12 bg-[#C8102E] text-white border-y-2 border-slate-950 dark:border-white/20 shadow-[0px_4px_0px_0px_rgba(10,10,10,1)] relative z-10"
        >
          <div className="flex animate-marquee whitespace-nowrap gap-8 select-none">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-black font-mono text-white tracking-widest uppercase">
                <Flame size={14} className="text-white animate-pulse" />
                <span>{item}</span>
                <span className="text-white/40">•</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
