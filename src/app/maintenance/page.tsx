"use client";

import { motion } from "framer-motion";
import { Wrench, RefreshCw } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Dynamic Glowing Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-xl w-full text-center flex flex-col items-center">
        {/* Animated Brand Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl"
        >
          <BrandLogo size="lg" />
        </motion.div>

        {/* Maintenance Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-amber-400 bg-amber-950/50 border border-amber-800/50 uppercase tracking-wider mb-6 shadow-inner"
        >
          <Wrench size={14} className="animate-spin text-amber-400" />
          <span>Pemeliharaan Sistem Berkala</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug mb-4"
        >
          Sistem Dalam Pemeliharaan
        </motion.h1>

        {/* Required Maintenance Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed mb-8 max-w-lg"
        >
          Website HIMSI UG sedang dalam pemeliharaan berkala. Silakan kembali beberapa saat lagi!
        </motion.p>

        {/* Status Card Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4 mb-8 text-left"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-2">
              <RefreshCw size={12} className="animate-spin text-red-500" /> Maintenance Status
            </span>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              In Progress
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Organisasi:</span>
              <span className="text-slate-200 font-semibold">HIMSI Universitas Gunadarma</span>
            </div>
            <div className="flex justify-between">
              <span>Maintenance:</span>
              <span className="text-slate-200 font-semibold">Segera Datang Kembali!</span>
            </div>
          </div>
        </motion.div>

        {/* Footer Actions & Contact Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400"
        >

          <a
            href="https://instagram.com/himsi_ug"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current text-pink-500" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>@himsi_ug</span>
          </a>
        </motion.div>
      </div>

      {/* Bottom Copyright Notice */}
      <div className="absolute bottom-6 text-[11px] font-medium text-slate-600">
        &copy; {new Date().getFullYear()} HIMSI Universitas Gunadarma. All rights reserved.
      </div>
    </div>
  );
}
