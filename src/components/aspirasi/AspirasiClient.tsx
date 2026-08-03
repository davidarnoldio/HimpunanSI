"use client";

import { motion, Variants } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Navbar, Footer } from "@/components/landing";
import { FormAspirasi } from "./FormAspirasi";

// Variants untuk kontainer teks (stagger efek)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Variants Badtz UI Blur Reveal untuk setiap kata
const wordBlurVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(10px)",
    y: 12,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
};

export function AspirasiClient() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0e1f] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Sticky Top Navbar */}
      <Navbar />

      <main className="flex-1 pt-24 pb-20 relative overflow-hidden">
        {/* Ambient Subtle Grid & Soft Background Mask */}
        <div className="pointer-events-none absolute inset-0 select-none">
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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 z-10">
          {/* HERO HEADER */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-xs font-bold font-mono tracking-wide backdrop-blur-md shadow-sm"
            >
              <Sparkles size={13} className="animate-spin text-red-500" />
              Suara Mahasiswa Sistem Informasi
            </motion.div>

            {/* <h1> ANIMATED BLUR REVEAL (BADTZ UI) */}
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-slate-100 leading-[1.15] flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
            >
              <motion.span variants={wordBlurVariants} className="inline-block">
                Wadah
              </motion.span>

              <span className="inline-flex flex-wrap gap-x-3">
                <motion.span
                  variants={wordBlurVariants}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-600 dark:from-red-500 dark:via-rose-400 dark:to-red-500"
                >
                  Aspirasi
                </motion.span>

                <motion.span
                  variants={wordBlurVariants}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-600 dark:from-red-500 dark:via-rose-400 dark:to-red-500"
                >
                  Mahasiswa
                </motion.span>
              </span>

              <motion.span variants={wordBlurVariants} className="inline-block">
                📣
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium max-w-2xl mx-auto"
            >
              Sampaikan saran, keluhan, atau ide kreatif kamu demi kemajuan Sistem Informasi Gunadarma. Kamu bisa mengirim secara <strong className="text-slate-900 dark:text-slate-200">Anonim</strong> atau menggunakan identitas.
            </motion.p>
          </div>

          {/* EXTRACTED INTERACTIVE FORM COMPONENT */}
          <FormAspirasi />
        </div>
      </main>

      <Footer />
    </div>
  );
}
