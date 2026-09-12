"use client";

import { motion } from "framer-motion";
import { Layers, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { DivisiAdminItem, AnggotaDivisiItem } from "@/data/adminMockData";
import { INITIAL_DIVISI_FULL, INITIAL_ANGGOTA_DIVISI } from "@/data/adminMockData";

export function DivisiSection({
  divisiData = INITIAL_DIVISI_FULL,
  anggotaDivisi = INITIAL_ANGGOTA_DIVISI,
}: {
  divisiData?: DivisiAdminItem[];
  anggotaDivisi?: AnggotaDivisiItem[];
}) {
  const displayDivisi = (divisiData || []).filter(
    (d) => d.id !== "bph" && d.singkatan.toLowerCase() !== "bph"
  );

  return (
    <section
      id="divisi"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black text-slate-950 dark:text-slate-100 border-t-2 border-slate-950 dark:border-white/20 scroll-mt-28 overflow-hidden"
      aria-label="Divisi HIMSI UG"
    >
      <div className="relative max-w-7xl mx-auto space-y-16 z-10">
        {/* Section Header — Format sama persis dengan Agenda & Program Kerja */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-left space-y-3 border-b-2 border-slate-950 dark:border-white/20 pb-6"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-[#C8102E] dark:text-[#E31B3B] font-bold block">
            [ DEPARTEMEN & DIVISI ]
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-slate-950 dark:text-white tracking-tighter uppercase">
            STRUKTUR <span className="text-[#C8102E] dark:text-[#E31B3B]">DIVISI HIMSI</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed font-medium">
            Setiap divisi di HIMSI UG memiliki peran strategis untuk menggerakkan potensi, inovasi digital, kepemimpinan, dan minat bakat mahasiswa Sistem Informasi Universitas Gunadarma.
          </p>
        </motion.div>

        {/* Dynamic Division Display: Centered Empty Banner or 6 Division Grid */}
        {displayDivisi.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center p-8 sm:p-14 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 max-w-2xl mx-auto space-y-5 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)]"
          >
            <div className="p-4 bg-[#C8102E] text-white">
              <Layers size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-950 dark:text-white tracking-tight uppercase">
                Kabinet & Divisi Belum Dibentuk
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-medium">
                Struktur kepengurusan & divisi HIMSI UG periode ini sedang dalam proses penyusunan oleh tim formatur.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayDivisi.map((divisi, index) => {
              const realMemberCount = anggotaDivisi.filter((a) => a.divisiId === divisi.id).length;

              return (
                <div
                  key={divisi.id}
                  className="group bg-slate-50 dark:bg-slate-900/80 border-2 border-slate-950 dark:border-white/20 p-7 flex flex-col justify-between gap-6 hover:bg-slate-950 hover:text-white dark:hover:bg-slate-950 hover:border-[#C8102E] transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-3xl text-[#C8102E] dark:text-[#E31B3B] block">
                        0{index + 1}
                      </span>
                      <span className="px-2.5 py-1 bg-slate-950 text-white dark:bg-slate-800 group-hover:bg-[#C8102E] group-hover:text-white text-xs font-mono font-bold uppercase tracking-widest border border-slate-950">
                        {divisi.singkatan}
                      </span>
                    </div>

                    <h3 className="text-xl font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white group-hover:text-white transition-colors">
                      {divisi.nama}
                    </h3>

                    <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-medium group-hover:text-slate-300 transition-colors line-clamp-3">
                      {divisi.deskripsi}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-950/20 dark:border-white/20 group-hover:border-white/20 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-400 uppercase tracking-wider">
                      {realMemberCount} ANGGOTA STAFF
                    </span>
                    <Link
                      href={`/divisi/${divisi.id}`}
                      className="p-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 group-hover:bg-[#C8102E] group-hover:text-white transition-colors border border-slate-950 flex items-center gap-1 font-mono text-xs font-black uppercase"
                      aria-label={`Lihat detail divisi ${divisi.nama}`}
                    >
                      DETAIL <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
