"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clock, ExternalLink, Maximize2, X, ShieldCheck } from "lucide-react";
import type { VisiMisiData } from "@/data/adminMockData";
import { useSharedStore } from "@/lib/sharedStore";

interface LegalitasSectionProps {
  visiMisi?: VisiMisiData;
}

export function LegalitasSection({ visiMisi }: LegalitasSectionProps) {
  const { visiMisi: storeVisiMisi } = useSharedStore();
  const activeData = storeVisiMisi || visiMisi;
  const suratUrl = activeData?.suratLegalitasUrl?.trim() || "";

  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <section
      id="legalitas"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-slate-100 border-t-2 border-slate-950 dark:border-white/20 scroll-mt-28"
      aria-label="Surat Legalitas Himpunan Sistem Informasi"
    >
      <div className="relative max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-left space-y-3 border-b-2 border-slate-950 dark:border-white/20 pb-6"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.3em] font-mono text-[#C8102E] dark:text-[#E31B3B] font-bold block">
              [ LEGALITAS & SK RESMI ]
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-slate-950 dark:text-white tracking-tighter uppercase leading-tight">
            SURAT LEGALITAS <span className="text-[#C8102E] dark:text-[#E31B3B]">HIMPUNAN SISTEM INFORMASI</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
            Dokumen resmi Surat Keputusan (SK) dan keabsahan Himpunan Mahasiswa Sistem Informasi (HIMASI) Universitas Gunadarma.
          </p>
        </motion.div>

        {/* Section Body */}
        {suratUrl ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Action & Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono font-black text-xs uppercase tracking-wider">
                <ShieldCheck size={18} />
                <span>STATUS: SK LEGALITAS RESMI TERTERA</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-mono font-black text-xs uppercase tracking-wider border border-slate-950 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Maximize2 size={14} /> PERBESAR FOTO
                </button>
                <a
                  href={suratUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8102E] text-white font-mono font-black text-xs uppercase tracking-wider border border-slate-950 hover:bg-slate-950 transition-colors"
                >
                  <ExternalLink size={14} /> BUKA BERKAS ASLI
                </a>
              </div>
            </div>

            {/* Document Display Box */}
            <div className="relative p-3 sm:p-6 bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] overflow-hidden flex justify-center">
              <div className="relative max-w-4xl w-full flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={suratUrl}
                  alt="Surat Legalitas Himpunan Sistem Informasi"
                  className="w-full h-auto object-contain max-h-[850px] border border-slate-200 dark:border-slate-800"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        ) : (
          /* Fallback Notice Box when no surat legalitas is input */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center p-8 sm:p-14 bg-white dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] max-w-2xl mx-auto space-y-6"
          >
            <div className="p-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-2 border-amber-500 rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
              <Clock size={36} className="animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500 font-mono text-[11px] font-bold uppercase tracking-wider inline-block">
                STATUS DOKUMEN: BELUM DITERBITKAN
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-mono text-slate-950 dark:text-white uppercase tracking-tight">
                Belum ada surat yang dimasukkan, harap ditunggu.
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                Surat Keputusan (SK) Legalitas Himpunan Sistem Informasi sedang dalam tahap administrasi/penginputan berkas oleh pengurus.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 w-full flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <FileText size={14} />
              <span>HIMASI UNIVERSITAS GUNADARMA</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && suratUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFullscreen(false)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center cursor-zoom-out"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-3 bg-[#C8102E] text-white border-2 border-white font-mono text-xs font-black uppercase flex items-center gap-1 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-slate-900 transition-colors"
              >
                <X size={18} /> TUTUP
              </button>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[90vh] w-full overflow-auto bg-slate-900 border-2 border-white p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={suratUrl}
                alt="Surat Legalitas Fullscreen"
                className="w-full h-auto object-contain mx-auto"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
