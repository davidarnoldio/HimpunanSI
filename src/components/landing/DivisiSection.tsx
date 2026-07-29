"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Award,
  BookOpen,
  Megaphone,
  Users,
  Globe,
  Code,
  Sparkles,
  Shield,
  Heart,
  Briefcase,
  Layers,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { DivisiAdminItem, AnggotaDivisiItem } from "@/data/adminMockData";
import { INITIAL_DIVISI_FULL, INITIAL_ANGGOTA_DIVISI } from "@/data/adminMockData";

const ICON_MAP: Record<string, LucideIcon> = {
  Award,
  BookOpen,
  Megaphone,
  Users,
  Globe,
  Code,
  Sparkles,
  Shield,
  Heart,
  Briefcase,
  Layers,
};

const THEME_ACCENTS: Record<string, string> = {
  red: "text-red-600 dark:text-red-400 border-red-500/40",
  blue: "text-blue-600 dark:text-blue-400 border-blue-500/40",
  violet: "text-violet-600 dark:text-violet-400 border-violet-500/40",
  emerald: "text-emerald-600 dark:text-emerald-400 border-emerald-500/40",
  amber: "text-amber-600 dark:text-amber-400 border-amber-500/40",
  cyan: "text-cyan-600 dark:text-cyan-400 border-cyan-500/40",
};

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function DivisiSection({
  divisiData = INITIAL_DIVISI_FULL.filter((d) => d.id !== "bph" && d.singkatan.toLowerCase() !== "bph"),
  anggotaDivisi = INITIAL_ANGGOTA_DIVISI,
}: {
  divisiData?: DivisiAdminItem[];
  anggotaDivisi?: AnggotaDivisiItem[];
}) {
  const displayDivisi = divisiData.filter((d) => d.id !== "bph" && d.singkatan.toLowerCase() !== "bph");

  return (
    <section
      id="divisi"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300 scroll-mt-28"
      aria-label="Divisi-divisi HIMSI UG"
    >
      {/* Ambient glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-80 bg-red-500/5 dark:bg-red-900/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-14 space-y-3"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 text-xs font-semibold tracking-widest uppercase">
            Struktur Organisasi
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Divisi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-500 dark:to-rose-400">
              Utama
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
            Setiap divisi memiliki peran strategis dalam menjalankan visi dan misi HIMSI UG sebagai
            organisasi kemahasiswaan yang progresif dan berdampak.
          </p>
        </motion.div>

        {displayDivisi.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-16 px-8 max-w-lg mx-auto mt-2
            bg-white dark:bg-slate-900
            rounded-3xl border-2 border-dashed border-red-200 dark:border-red-900/60
            shadow-lg shadow-red-50 dark:shadow-none text-center"
          >
            {/* Icon with pulse */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-2xl bg-red-100 dark:bg-red-900/30 animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-300 dark:shadow-red-900/50">
                <Layers size={30} className="text-white" strokeWidth={1.5} />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <p className="text-slate-900 dark:text-slate-100 font-extrabold text-lg tracking-tight">
                Belum ada divisi yang ditambahkan.
              </p>
            </div>

            {/* Hint chip */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                Stay Tuned.
              </span>
            </div>
          </div>
        ) : (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="flex flex-wrap justify-center gap-6"
          >
            {displayDivisi.map((divisi) => {
              const Icon = ICON_MAP[divisi.iconName] || Layers;
              const accentColor = THEME_ACCENTS[divisi.colorTheme] || "text-red-600 dark:text-red-400 border-red-500/40";

              // SINKRONISASI ANGKA ANGGOTA: Hitung langsung dari array anggotaDivisi di Global State!
              const realMemberCount = anggotaDivisi.filter((a) => a.divisiId === divisi.id).length;

              return (
                <motion.div
                  key={divisi.id}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.22 } }}
                  className={`group relative liquid-glass-card flex flex-col justify-between gap-5 p-7 transition-all duration-300 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] min-w-[280px] max-w-[360px] flex-grow-0 flex-shrink-0`}
                >
                  <div className="space-y-4">
                    {/* Icon + Singkatan Badge */}
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-900/60 border ${accentColor} transition-colors duration-300`}>
                        <Icon size={22} className={accentColor.split(" ")[0]} />
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-xs font-extrabold font-mono bg-slate-100 dark:bg-slate-900/60 border ${accentColor}`}>
                        {divisi.singkatan}
                      </span>
                    </div>

                    {/* Name & Description */}
                    <div className="space-y-2">
                      <h3 className="text-slate-900 dark:text-slate-100 font-black font-heading text-xl leading-snug">
                        {divisi.nama}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3 font-medium">
                        {divisi.deskripsi}
                      </p>
                    </div>

                    {/* Tugas List */}
                    {divisi.tugas && divisi.tugas.length > 0 && (
                      <ul className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                        {divisi.tugas.map((t, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                            <CheckCircle2 size={13} className={`mt-0.5 flex-shrink-0 ${accentColor.split(" ")[0]}`} />
                            <span className="truncate">{t}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* SINKRONISASI ANGKA ANGGOTA (DINAMIS DARI GLOBAL STATE) */}
                  <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400">
                      {realMemberCount} Anggota Tim
                    </span>
                    <Link
                      href={`/divisi/${divisi.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white font-bold text-xs hover:bg-red-600 dark:hover:bg-red-600 transition-colors shadow-md group-hover:scale-[1.02]"
                    >
                      Lihat Anggota <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
