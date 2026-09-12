"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldQuestion, User, Quote, RotateCw, Target, Compass, CheckCircle2 } from "lucide-react";
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
      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
    >
      {type === "linkedin" ? (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ) : (
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
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
    return "text-red-600 dark:text-red-500";
  }
  if (lower.includes("sekretaris")) {
    return "text-blue-600 dark:text-blue-500";
  }
  if (lower.includes("bendahara")) {
    return "text-emerald-600 dark:text-emerald-500";
  }
  return "text-slate-900 dark:text-slate-100";
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
      className="relative w-full h-full min-h-[470px] [perspective:1000px] cursor-pointer"
      onDoubleClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative w-full h-full [transform-style:preserve-3d] shadow-lg hover:shadow-2xl dark:shadow-none border border-slate-200 dark:border-slate-800 rounded-3xl"
      >
        {/* ── BAGIAN DEPAN (FRONT FACE) ── */}
        <div className="absolute inset-0 w-full h-full liquid-glass-card p-5 pt-10 flex flex-col justify-between [backface-visibility:hidden]">
          {/* Badge Jabatan */}
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-max max-w-[95%] px-4 py-1.5 rounded-full text-xs font-bold font-mono text-center z-10 shadow-md whitespace-normal bg-slate-900 text-white dark:bg-slate-800 dark:text-white border border-slate-700">
            {item.jabatan || "Pengurus BPH"}
          </span>

          {/* Photo Box / Placeholder Container */}
          <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner flex flex-col items-center justify-center">
            {photoAvailable ? (
              <img
                src={item.fotoUrl}
                alt={item.nama}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-slate-900 text-center p-4 space-y-2 select-none w-full">
                <div className="p-3 rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700/60 shadow-inner">
                  <User size={44} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-semibold font-mono text-slate-400 mt-2">
                  Foto Belum Tersedia
                </span>
              </div>
            )}

            {/* Double Click Hint Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
              className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur border border-slate-700 text-slate-300 text-[10px] font-bold font-mono flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity hover:border-red-500"
            >
              <RotateCw size={11} /> Double Click
            </button>
          </div>

          {/* Bottom Card Footer: Nama Pengurus & Global Periode */}
          <div className="mt-3 flex flex-col justify-center text-center space-y-1.5 w-full">
            <h3 className={`text-xl sm:text-2xl font-bold font-heading tracking-tight truncate px-1 ${nameColorClass}`}>
              {isTBA ? "TBA (To Be Announced)" : item.nama}
            </h3>
            <p className="text-[11px] font-bold font-mono text-slate-500 dark:text-slate-400">
              {TAHUN_KEPENGURUSAN}
            </p>

            {/* Social links */}
            {!isTBA && (
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <SocialIcon href={item.linkedin} type="linkedin" />
                <SocialIcon href={item.instagram} type="instagram" />
              </div>
            )}
          </div>
        </div>

        {/* ── BAGIAN BELAKANG (BACK FACE) ── */}
        <div className="absolute inset-0 w-full h-full liquid-glass-card p-6 flex flex-col items-center justify-between text-center [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden">
          <div className="p-3 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20 mt-2">
            <Quote size={28} />
          </div>

          {/* Center Quotes */}
          <div className="flex-1 flex flex-col justify-center items-center px-2 py-4 space-y-3">
            <LiveText
              text={`"${item.visiMotto || "Mewujudkan HIMSI UG yang solid, unggul, dan berdaya saing tinggi dalam era digital."}"`}
              className="text-slate-800 dark:text-slate-200 text-sm sm:text-base font-semibold leading-relaxed italic text-center"
              wordDelay={0.06}
            />
          </div>

          <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <h4 className={`text-lg font-bold tracking-tight ${nameColorClass}`}>
              {item.nama}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate">
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
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300"
      aria-label="Pimpinan Kabinet HIMSI UG"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/5 dark:bg-red-900/10 blur-[140px]" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-800 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-16">
        {/* ── BOX VISI & MISI HIMPUNAN ── */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold font-mono tracking-widest uppercase">
              <Sparkles size={11} /> Visi & Misi HIMSI UG
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Box VISI */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="group p-8 rounded-3xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-red-600/10 text-red-600 dark:text-red-500 border border-red-500/20">
                    <Target size={26} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-heading text-slate-900 dark:text-white tracking-tight">
                      <LiveText text="VISI HIMPUNAN" />
                    </h3>
                    <span className="text-xs font-bold font-mono text-red-600 dark:text-red-400">{TAHUN_KEPENGURUSAN}</span>
                  </div>
                </div>

                <div className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium pt-2">
                  <LiveText text={visiMisi?.visi || "Mewujudkan Himpunan Mahasiswa Sistem Informasi (HIMSI UG) yang solid, inovatif, adaptif, dan berdaya saing global serta menjadi pusat keunggulan."} />
                </div>
              </div>
            </motion.div>

            {/* Box MISI */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
              className="group p-8 rounded-3xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:border-red-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-2xl bg-rose-600/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    <Compass size={26} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-heading text-slate-900 dark:text-white tracking-tight">
                      <LiveText text="MISI UTAMA" />
                    </h3>
                    <span className="text-xs font-bold font-mono text-rose-600 dark:text-rose-400">4 Pilar Gerakan</span>
                  </div>
                </div>

                <ul className="space-y-3 pt-2">
                  {(visiMisi?.misi || []).map((m, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <LiveText text={m} delay={idx * 0.05} />
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── ANCHOR TERSEMBUNYI UNTUK SCROLL TEPAT KE "PIMPINAN HIMPUNAN" ── */}
        {/* Diletakkan tepat di atas heading agar klik "Kabinet" di navbar mendarat akurat */}
        <div id="kabinet" className="scroll-mt-24 sm:scroll-mt-28 block" aria-hidden="true" />

        {/* ── SECTION HEADER KABINET ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center space-y-3 pt-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 text-xs font-bold font-mono tracking-widest uppercase">
            <Sparkles size={11} />
            Kabinet HIMSI UG {TAHUN_KEPENGURUSAN}
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tight hover-outline-text cursor-default transition-all duration-300">
            Pimpinan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-500 dark:to-rose-400">
              Himpunan
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
            Badan Pengurus Harian (BPH) yang memimpin dan mengarahkan gerakan HIMSI UG dengan komitmen tinggi. Double-click kartu untuk melihat visi & quotes.
          </p>
        </motion.div>

        {/* KONDISI EMPTY STATE ATAU GRID KABINET */}
        {isDataEmpty ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center text-center p-8 sm:p-14 rounded-3xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-2 border-dashed border-slate-300 dark:border-slate-800 max-w-2xl mx-auto space-y-6 shadow-2xl"
          >
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700/60 shadow-inner"
            >
              <ShieldQuestion size={56} />
            </motion.div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white tracking-tight">
                Kabinet Sedang Dalam Masa Formatur
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-medium">
                Struktur kepengurusan HIMSI UG periode ini sedang dalam proses penyusunan. Nantikan formasi pemimpin baru kita!
              </p>
            </div>
          </motion.div>
        ) : (
          /* AUTO SCALING GRID 3D FLIP CARDS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayItems.map((item) => (
              <KabinetCard3D key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
