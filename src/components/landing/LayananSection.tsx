"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { LAYANAN_ITEMS } from "@/data/landingPage";

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: "easeOut" as const },
  }),
};

export function LayananSection() {
  return (
    <section
      id="layanan"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300 scroll-mt-28"
      aria-label="Layanan dan akses cepat mahasiswa HIMSI UG"
    >
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700/40 to-transparent" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-red-500/5 dark:bg-red-900/8 blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[250px] h-[250px] rounded-full bg-rose-500/5 dark:bg-rose-900/6 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-14 space-y-3"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 text-xs font-semibold tracking-widest uppercase">
            <Zap size={11} />
            Akses Cepat
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Layanan &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-500 dark:to-rose-400">
              Resource Mahasiswa
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Semua yang kamu butuhkan sebagai mahasiswa Sistem Informasi, tersedia dalam satu portal.
            Akses bank soal, layanan aspirasi, merchandise, hingga media partner.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {LAYANAN_ITEMS.map((layanan, i) => {
            const Icon = layanan.icon;
            return (
              <motion.a
                key={layanan.id}
                href={layanan.href}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                whileHover={{ y: -7, transition: { duration: 0.22 } }}
                className={`group relative flex flex-col gap-4 p-6 rounded-2xl border bg-white/90 dark:bg-slate-900/60 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-none cursor-pointer border-slate-200 dark:border-slate-800/80 ${layanan.accentColor}`}
                aria-label={layanan.ctaLabel}
              >
                {/* Top glow on hover */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-t-2xl" />

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-900/70 border ${layanan.accentColor.split(" ")[2]} transition-all duration-300 group-hover:scale-110`}>
                  <Icon size={22} className={layanan.accentColor.split(" ")[0]} />
                </div>

                {/* Badge */}
                {layanan.badgeText && (
                  <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold border ${layanan.accentColor.split(" ")[0]} bg-slate-100 dark:bg-slate-900/60 border-current`}>
                    {layanan.badgeText}
                  </span>
                )}

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base leading-snug">{layanan.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-1">{layanan.deskripsi}</p>
                </div>

                {/* CTA */}
                <div className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${layanan.accentColor.split(" ")[0]}`}>
                  <span>{layanan.ctaLabel}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-b-2xl" />
              </motion.a>
            );
          })}
        </div>

        {/* Linktree/Quick Links Banner */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 relative rounded-3xl overflow-hidden border border-red-200 dark:border-red-900/30 bg-gradient-to-r from-red-50/80 via-white to-red-100/40 dark:from-red-950/50 dark:via-slate-900/90 dark:to-slate-950/80 backdrop-blur-xl p-8 sm:p-12 shadow-sm dark:shadow-none"
        >
          {/* Inner glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
            <div className="absolute left-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-red-500/20 to-transparent" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                Quick Links{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-400 dark:to-rose-400">
                  HIMSI UG
                </span>{" "}
                🔗
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-lg">
                Akses semua tautan penting HIMSI dalam satu tempat — Google Form, Group WA, Drive
                Akademik, dan lebih banyak lagi.
              </p>
            </div>
            <motion.a
              href="/aspirasi"
              whileHover={{ scale: 1.05, boxShadow: "0 0 28px rgba(220,38,38,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-900/20 dark:shadow-red-900/30 transition-colors duration-200"
              aria-label="Buka portal Aspirasi HIMSI UG"
            >
              Kirim Aspirasi
              <ArrowRight size={17} />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
