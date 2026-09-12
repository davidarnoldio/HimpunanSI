"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { LAYANAN_ITEMS } from "@/data/landingPage";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

export function LayananSection() {
  return (
    <section
      id="layanan"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black text-slate-950 dark:text-slate-100 border-t-2 border-slate-950 dark:border-white/20 scroll-mt-28"
      aria-label="Layanan dan akses cepat mahasiswa HIMSI UG"
    >
      <div className="relative max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-left space-y-3 border-b-2 border-slate-950 dark:border-white/20 pb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-mono font-bold tracking-widest uppercase">
            <Zap size={12} />
            AKSES CEPAT MAHASISWA
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-slate-950 dark:text-white tracking-tighter uppercase">
            LAYANAN & <span className="text-[#C8102E] dark:text-[#E31B3B]">RESOURCE</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed font-medium">
            Semua yang kamu butuhkan sebagai mahasiswa Sistem Informasi, tersedia dalam satu portal.
            Akses bank soal, layanan aspirasi, merchandise, hingga media partner.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                viewport={{ once: true }}
                className="group relative flex flex-col justify-between gap-6 p-6 bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-950 dark:border-white/20 hover:shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] transition-all duration-200 cursor-pointer"
                aria-label={layanan.ctaLabel}
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-slate-950 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center border border-slate-950">
                    <Icon size={22} />
                  </div>
                  {layanan.badgeText && (
                    <span className="px-2.5 py-1 bg-[#C8102E] text-white text-[10px] font-black font-mono tracking-widest uppercase border border-slate-950">
                      {layanan.badgeText}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-slate-950 dark:text-white font-black font-heading text-lg uppercase tracking-tight group-hover:text-[#C8102E] dark:group-hover:text-[#E31B3B] transition-colors">
                    {layanan.title}
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed flex-1 font-medium">
                    {layanan.deskripsi}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-950/20 dark:border-white/20 font-black font-mono text-xs uppercase tracking-wider text-[#C8102E] dark:text-[#E31B3B]">
                  <span>{layanan.ctaLabel}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-12 bg-slate-100 dark:bg-slate-900/90 text-slate-950 dark:text-white border-2 border-slate-950 dark:border-white/20 transition-colors duration-300"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] font-mono text-[#C8102E] dark:text-[#E31B3B] font-bold block">
                [ PORTAL ASPIRASI ]
              </span>
              <h3 className="text-2xl sm:text-4xl font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white">
                QUICK LINKS & <span className="text-[#C8102E] dark:text-[#E31B3B]">ASPIRASI MAHASISWA</span>
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base max-w-xl font-medium">
                Punya masukan, ide, atau kendala akademik? Sampaikan suara kamu secara langsung dan ter-rekam melalui Portal Aspirasi HIMSI UG.
              </p>
            </div>
            <a
              href="/aspirasi"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C8102E] dark:bg-[#E31B3B] text-white font-black font-mono text-xs uppercase tracking-widest hover:bg-slate-950 dark:hover:bg-white dark:hover:text-slate-950 transition-colors border-2 border-slate-950 dark:border-transparent"
              aria-label="Buka portal Aspirasi HIMSI UG"
            >
              KIRIM ASPIRASI <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
