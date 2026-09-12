"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldQuestion, User, Quote, RotateCw, CheckCircle2 } from "lucide-react";
import type { PengurusItem, VisiMisiData } from "@/data/adminMockData";
import { INITIAL_PENGURUS, INITIAL_VISI_MISI } from "@/data/adminMockData";
import { LiveText } from "@/components/ui/LiveText";

// GLOBAL PERIODE KONFIGURASI KEPENGURUSAN
export const TAHUN_KEPENGURUSAN = "Periode 2025/2026";

function SocialIcon({ href, type }: { href?: string; type: "linkedin" | "instagram" }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-950 dark:border-white/20 text-slate-900 dark:text-slate-100 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] hover:text-white transition-colors duration-150"
    >
      {type === "linkedin" ? (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ) : (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="0" ry="0" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      )}
    </a>
  );
}

function hasRealPhoto(fotoUrl?: string | null): boolean {
  if (!fotoUrl || typeof fotoUrl !== "string" || fotoUrl.trim() === "") return false;
  const trimmed = fotoUrl.trim();
  if (trimmed.includes("placehold.co")) return false;
  return true;
}

function getNameColorByRole(jabatan: string): string {
  const lower = jabatan.toLowerCase();
  if (lower.includes("kahim") || lower.includes("ketua")) {
    return "text-[#C8102E] dark:text-[#E31B3B]";
  }
  return "text-slate-950 dark:text-white";
}

export function KabinetCard3D({ item }: { item: PengurusItem }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const isTBA =
    !item.nama ||
    item.nama.trim() === "" ||
    item.nama.toUpperCase().includes("TBA");

  const photoAvailable = hasRealPhoto(item.fotoUrl);
  const nameColorClass = isTBA
    ? "italic text-slate-400 dark:text-slate-500 font-bold"
    : getNameColorByRole(item.jabatan);

  return (
    <div
      className="relative w-full h-full min-h-[470px] [perspective:1000px] cursor-pointer group"
      onDoubleClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-full h-full [transform-style:preserve-3d] bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]"
      >
        {/* ── BAGIAN DEPAN (FRONT FACE) ── */}
        <div className="absolute inset-0 w-full h-full p-5 pt-10 flex flex-col justify-between [backface-visibility:hidden] bg-white dark:bg-slate-950">
          {/* Badge Jabatan */}
          <span className="absolute -top-3 left-4 px-3 py-1 bg-[#C8102E] dark:bg-[#E31B3B] text-white text-[11px] font-black font-mono tracking-widest uppercase border border-slate-950 dark:border-white/20">
            {item.jabatan || "PENGURUS BPH"}
          </span>

          {/* Photo Box */}
          <div className="relative w-full h-64 border-2 border-slate-950 dark:border-white/20 overflow-hidden bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center">
            {photoAvailable ? (
              <img
                src={item.fotoUrl}
                alt={item.nama}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-slate-900 text-center p-4 space-y-2 select-none w-full">
                <div className="p-3 bg-slate-800 text-slate-400 border border-slate-700">
                  <User size={44} strokeWidth={1.5} />
                </div>
                <span className="text-[11px] font-bold font-mono uppercase text-slate-400 mt-2 tracking-wider">
                  Foto Belum Tersedia
                </span>
              </div>
            )}

            {/* Flip Hint Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
              className="absolute bottom-2 right-2 px-2.5 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 text-[10px] font-black font-mono flex items-center gap-1 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors"
            >
              <RotateCw size={11} /> FLIP CARD
            </button>
          </div>

          {/* Bottom Card Footer */}
          <div className="mt-3 flex flex-col justify-center text-center space-y-1.5 w-full">
            <h3 className={`text-lg sm:text-xl font-black font-heading tracking-tight truncate px-1 uppercase ${nameColorClass}`}>
              {isTBA ? "TBA (To Be Announced)" : item.nama}
            </h3>
            <p className="text-[11px] font-black font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {TAHUN_KEPENGURUSAN}
            </p>

            {/* Social links */}
            {!isTBA && (
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-950/20 dark:border-white/20">
                <SocialIcon href={item.linkedin} type="linkedin" />
                <SocialIcon href={item.instagram} type="instagram" />
              </div>
            )}
          </div>
        </div>

        {/* ── BAGIAN BELAKANG (BACK FACE) ── */}
        <div className="absolute inset-0 w-full h-full p-6 flex flex-col items-center justify-between text-center [transform:rotateY(180deg)] [backface-visibility:hidden] bg-slate-950 text-white border-2 border-slate-950">
          <div className="p-3 bg-[#C8102E] text-white font-mono font-bold text-xs uppercase tracking-wider">
            MOTTO & VISI
          </div>

          {/* Center Quotes */}
          <div className="flex-1 flex flex-col justify-center items-center px-2 py-4 space-y-3">
            <Quote size={28} className="text-[#E31B3B]" />
            <LiveText
              text={`"${item.visiMotto || "Mewujudkan HIMSI UG yang solid, unggul, dan berdaya saing tinggi dalam era digital."}"`}
              className="text-slate-200 text-sm sm:text-base font-semibold leading-relaxed italic text-center"
              wordDelay={0.06}
            />
          </div>

          <div className="w-full pt-4 border-t border-white/20 space-y-1">
            <h4 className="text-base font-black font-heading tracking-tight uppercase text-white">
              {item.nama}
            </h4>
            <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider truncate">
              {item.jabatan} • {TAHUN_KEPENGURUSAN}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function KabinetSection({
  pengurus = INITIAL_PENGURUS,
  visiMisi = INITIAL_VISI_MISI,
}: {
  pengurus?: PengurusItem[];
  visiMisi?: VisiMisiData;
}) {
  const bphItems = pengurus.filter((p) => p.divisi === "BPH");
  const displayItems = bphItems.length >= 1 ? bphItems : pengurus;
  const isDataEmpty = pengurus.length === 0;

  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black text-slate-950 dark:text-slate-100 overflow-hidden border-t-2 border-slate-950 dark:border-white/20"
      aria-label="Pimpinan Kabinet HIMSI UG"
    >
      <div className="relative max-w-7xl mx-auto space-y-20">
        {/* ── EXODA MANIFESTO 3-COLUMN GRID (VISI, MISI, PILAR GERAKAN) ── */}
        <div className="space-y-10">
          <div className="text-left space-y-2 border-b-2 border-slate-950 dark:border-white/20 pb-6">
            <span className="text-xs uppercase tracking-[0.3em] font-mono text-[#C8102E] dark:text-[#E31B3B] font-bold block">
              [ MANIFESTO KABINET ]
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl uppercase tracking-tighter text-slate-950 dark:text-white">
              KAMI BUKAN KEPENGURUSAN BIASA. <span className="text-[#C8102E] dark:text-[#E31B3B]">MENGAPA?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 01 VISI HIMPUNAN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-950 dark:border-white/20 flex flex-col gap-4"
            >
              <div className="font-heading font-black text-4xl text-[#C8102E] dark:text-[#E31B3B]">
                01
              </div>
              <h3 className="font-heading font-black text-xl uppercase tracking-tight text-slate-950 dark:text-white">
                <LiveText text="VISI HIMPUNAN" />
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                <LiveText text={visiMisi?.visi || "Mewujudkan Himpunan Mahasiswa Sistem Informasi (HIMSI UG) yang solid, inovatif, adaptif, dan berdaya saing global serta menjadi pusat keunggulan."} />
              </p>
            </motion.div>

            {/* 02 MISI UTAMA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-6 bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-950 dark:border-white/20 flex flex-col gap-4"
            >
              <div className="font-heading font-black text-4xl text-[#C8102E] dark:text-[#E31B3B]">
                02
              </div>
              <h3 className="font-heading font-black text-xl uppercase tracking-tight text-slate-950 dark:text-white">
                <LiveText text="MISI UTAMA" />
              </h3>
              <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium space-y-2.5">
                {(visiMisi?.misi || [
                  "Mengembangkan iklim akademik & non-akademik yang komunikatif, inklusif, dan solid.",
                  "Menyelenggarakan program pelatihan keterampilan digital & leadership.",
                  "Membangun jejaring kolaborasi strategis dengan dunia industri & alumni.",
                  "Mengoptimalkan tata kelola himpunan berbasis teknologi digital yang transparan.",
                ]).map((misi, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-[#C8102E] dark:text-[#E31B3B] flex-shrink-0 mt-0.5" />
                    <span><LiveText text={misi} /></span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 03 PILAR GERAKAN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-6 bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-950 dark:border-white/20 flex flex-col gap-4"
            >
              <div className="font-heading font-black text-4xl text-[#C8102E] dark:text-[#E31B3B]">
                03
              </div>
              <h3 className="font-heading font-black text-xl uppercase tracking-tight text-slate-950 dark:text-white">
                PILAR KABINET
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                Setiap gerakan HIMSI berpusat pada 3 pilar: <strong className="text-slate-950 dark:text-white font-bold">Inovasi Digital</strong>, <strong className="text-slate-950 dark:text-white font-bold">Kolaborasi Strategis</strong>, dan <strong className="text-slate-950 dark:text-white font-bold">Integritas Akademik</strong>.
              </p>
            </motion.div>
          </div>
        </div>

        {/* ── ANCHOR TERSEMBUNYI UNTUK SCROLL TEPAT KE "PIMPINAN HIMPUNAN" ── */}
        <div id="kabinet" className="scroll-mt-24 sm:scroll-mt-28 block" aria-hidden="true" />

        {/* ── SECTION HEADER KABINET ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-left space-y-3 border-b-2 border-slate-950 dark:border-white/20 pb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles size={12} />
            BPH HIMSI UG • {TAHUN_KEPENGURUSAN}
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-slate-950 dark:text-white tracking-tighter uppercase">
            PIMPINAN <span className="text-[#C8102E] dark:text-[#E31B3B]">HIMPUNAN</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed font-medium">
            Badan Pengurus Harian (BPH) yang memimpin dan mengarahkan gerakan HIMSI UG dengan komitmen tinggi. Double-click kartu untuk melihat visi & quotes.
          </p>
        </motion.div>

        {/* KONDISI EMPTY STATE ATAU GRID KABINET */}
        {isDataEmpty ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center p-8 sm:p-14 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 max-w-2xl mx-auto space-y-6"
          >
            <div className="p-4 bg-[#C8102E] text-white">
              <ShieldQuestion size={48} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-950 dark:text-white tracking-tight uppercase">
                Kabinet Sedang Dalam Masa Formatur
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-medium">
                Struktur kepengurusan HIMSI UG periode meini sedang dalam proses penyusunan. Nantikan formasi pemimpin baru kita!
              </p>
            </div>
          </motion.div>
        ) : (
          /* AUTO SCALING GRID 3D FLIP CARDS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayItems.map((item) => (
              <KabinetCard3D key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
