"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, type Variants } from "framer-motion";
import { Sparkles, ShieldQuestion, User, RotateCw, CheckCircle2 } from "lucide-react";
import type { PengurusItem, VisiMisiData } from "@/data/adminMockData";
import { INITIAL_PENGURUS, INITIAL_VISI_MISI } from "@/data/adminMockData";
import { useSharedStore } from "@/lib/sharedStore";
import { LiveText } from "@/components/ui/LiveText";

// GLOBAL PERIODE KONFIGURASI KEPENGURUSAN
export const TAHUN_KEPENGURUSAN = "PERIODE 2026/2027";

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

const dropVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -160,
    rotate: -6,
    scale: 0.85,
  },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 13,
      mass: 1.1,
      delay: idx * 0.16,
    },
  }),
};

export function KabinetCard3D({ item, index = 0 }: { item: PengurusItem; index?: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Framer motion values to track 2D drag position for dynamic lanyard strap physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Dynamic Bezier curves for the Left and Right Lanyard Straps
  const strapPathLeft = useTransform([x, y], ([latestX, latestY]) => {
    const lx = Number(latestX) || 0;
    const ly = Number(latestY) || 0;
    return `M 25 0 C ${32 + lx * 0.3} ${15 + ly * 0.3}, ${45 + lx * 0.7} ${35 + ly * 0.6}, ${50 + lx} ${52 + ly}`;
  });

  const strapPathRight = useTransform([x, y], ([latestX, latestY]) => {
    const lx = Number(latestX) || 0;
    const ly = Number(latestY) || 0;
    return `M 75 0 C ${68 + lx * 0.3} ${15 + ly * 0.3}, ${55 + lx * 0.7} ${35 + ly * 0.6}, ${50 + lx} ${52 + ly}`;
  });

  const isTBA =
    !item.nama ||
    item.nama.trim() === "" ||
    item.nama.toUpperCase().includes("TBA");

  const photoAvailable = hasRealPhoto(item.fotoUrl);
  const nameColorClass = isTBA
    ? "italic text-slate-400 dark:text-slate-500 font-bold"
    : getNameColorByRole(item.jabatan);

  return (
    <motion.div
      custom={index}
      variants={dropVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="flex flex-col items-center group w-full h-[550px] relative"
    >
      {/* ── DYNAMIC SVG LANYARD STRAP THAT FLEXES & SWAYS WITH CARD DRAG ── */}
      <div className="relative w-full h-16 -mb-4 pointer-events-none select-none z-20 overflow-visible">
        <svg viewBox="0 0 100 65" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`lanyardGrad-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#900A1E" />
              <stop offset="50%" stopColor="#C8102E" />
              <stop offset="100%" stopColor="#E31B3B" />
            </linearGradient>
            <linearGradient id={`metalGrad-${item.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <filter id={`strapShadow-${item.id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Left Red Lanyard Fabric Strap */}
          <motion.path
            d={strapPathLeft}
            stroke={`url(#lanyardGrad-${item.id})`}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            filter={`url(#strapShadow-${item.id})`}
          />
          <motion.path
            d={strapPathLeft}
            stroke="#ffffff"
            strokeWidth="1"
            strokeDasharray="2 3"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />

          {/* Right Red Lanyard Fabric Strap */}
          <motion.path
            d={strapPathRight}
            stroke={`url(#lanyardGrad-${item.id})`}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            filter={`url(#strapShadow-${item.id})`}
          />
          <motion.path
            d={strapPathRight}
            stroke="#ffffff"
            strokeWidth="1"
            strokeDasharray="2 3"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />

          {/* Metallic Connector Ring & Clip attached to moving x, y */}
          <motion.g style={{ x, y }}>
            {/* Metallic Clip Box */}
            <rect
              x="42"
              y="44"
              width="16"
              height="12"
              rx="1.5"
              fill={`url(#metalGrad-${item.id})`}
              stroke="#0f172a"
              strokeWidth="1"
            />
            {/* Slot Punch Connector Hole */}
            <rect x="46" y="52" width="8" height="3" rx="1" fill="#0f172a" />
          </motion.g>
        </svg>
      </div>

      {/* ── INTERACTIVE DRAGGABLE 3D ID CARD CONTAINER ── */}
      <motion.div
        drag
        style={{ x, y }}
        dragConstraints={{ left: -50, right: 50, top: -20, bottom: 60 }}
        dragElastic={0.3}
        dragSnapToOrigin={true}
        whileDrag={{ scale: 1.04, cursor: "grabbing" }}
        className="relative w-full h-[490px] [perspective:1200px] cursor-grab active:cursor-grabbing select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full [transform-style:preserve-3d] bg-white dark:bg-slate-950 border-2 border-slate-950 dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] dark:shadow-[6px_6px_0px_0px_rgba(227,27,59,0.3)] transition-shadow duration-300 hover:shadow-[10px_10px_0px_0px_rgba(200,16,46,1)]"
        >
          {/* ── FRONT FACE OF ID CARD ── */}
          <div className="absolute inset-0 w-full h-full p-5 pt-8 flex flex-col justify-between [backface-visibility:hidden] bg-white dark:bg-slate-950 border-t-8 border-t-[#C8102E]">
            {/* Lanyard Slot Hole Punch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-900 border border-slate-950 rounded-full" />

            {/* Top Tag */}
            <div className="flex items-center justify-between border-b border-slate-950/20 dark:border-white/20 pb-2 mb-2">
              <span className="px-2.5 py-0.5 bg-[#C8102E] text-white text-[10px] font-black font-mono tracking-widest uppercase border border-slate-950">
                {item.jabatan || "PENGURUS BPH"}
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                ID CARD • BPH
              </span>
            </div>

            {/* Photo Box */}
            <div className="relative w-full h-60 border-2 border-slate-950 dark:border-white/20 overflow-hidden bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center my-auto">
              {photoAvailable ? (
                <img
                  src={item.fotoUrl}
                  alt={item.nama}
                  className="w-full h-full object-cover transition-transform duration-300 scale-100 group-hover:scale-105 pointer-events-none"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-60 bg-slate-100 dark:bg-slate-900 text-center p-4 space-y-2 select-none w-full transition-colors duration-200">
                  <div className="p-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                    <User size={40} strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-bold font-mono uppercase text-slate-600 dark:text-slate-400 mt-2 tracking-wider">
                    Foto Belum Tersedia
                  </span>
                </div>
              )}

              {/* Flip Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                className="absolute bottom-2 right-2 px-2.5 py-1 bg-[#C8102E] text-white border border-slate-950 text-[10px] font-black font-mono flex items-center gap-1 hover:bg-slate-950 dark:hover:bg-white dark:hover:text-slate-950 transition-colors shadow-md"
              >
                <RotateCw size={11} /> BALIK KARTU
              </button>
            </div>

            {/* Member Details */}
            <div className="mt-2 flex flex-col justify-center text-center space-y-1 w-full">
              <h3 className={`text-base sm:text-lg font-black font-heading tracking-tight break-words line-clamp-2 leading-tight px-1 uppercase ${nameColorClass}`}>
                {isTBA ? "TBA (To Be Announced)" : item.nama}
              </h3>
              <p className="text-[10px] font-extrabold font-mono uppercase tracking-widest text-[#C8102E] dark:text-[#E31B3B]">
                {item.periode ? (item.periode.startsWith("PERIODE") || item.periode.startsWith("Periode") ? item.periode : `PERIODE ${item.periode}`) : TAHUN_KEPENGURUSAN}
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

          {/* ── BACK FACE OF ID CARD (PURE HIMASI LOGO CENTERED — ADAPTIVE LIGHT/DARK THEME) ── */}
          <div className="absolute inset-0 w-full h-full p-6 flex flex-col items-center justify-between text-center [transform:rotateY(180deg)] [backface-visibility:hidden] bg-white dark:bg-slate-950 text-slate-950 dark:text-white border-2 border-slate-950 dark:border-[#C8102E] overflow-hidden">
            {/* Red Radial Glow Background Accent */}
            <div className="absolute inset-0 bg-radial from-[#C8102E]/10 dark:from-[#C8102E]/30 via-transparent to-transparent pointer-events-none" />

            {/* Card Slot Punch on Back Face */}
            <div className="w-8 h-2 bg-slate-200 dark:bg-slate-900 border border-slate-950 dark:border-slate-700 rounded-full z-10" />

            {/* Top Red Header Badge */}
            <div className="z-10 w-full py-1.5 px-3 bg-[#C8102E] text-white font-mono font-black text-[11px] uppercase tracking-widest border border-slate-950 dark:border-slate-900 shadow-md">
              HIMPUNAN MAHASISWA SISTEM INFORMASI
            </div>

            {/* ── CENTER: PURE PROMINENT HIMASI LOGO IN THE MIDDLE ── */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              <div className="relative p-6 sm:p-7 bg-white dark:bg-slate-900/90 border-2 border-slate-950 dark:border-[#C8102E] rounded-full shadow-[0_0_20px_rgba(200,16,46,0.25)] dark:shadow-[0_0_35px_rgba(200,16,46,0.7)] group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/himsigundar.webp"
                  alt="Logo HIMASI UG"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain filter drop-shadow-[0_0_12px_rgba(227,27,59,0.9)] pointer-events-none"
                />
              </div>
            </div>

            {/* Bottom Card Footer Info */}
            <div className="z-10 w-full pt-3 border-t border-slate-950/20 dark:border-white/20 flex flex-col items-center justify-center space-y-1">
              <h4 className="text-sm sm:text-base font-black font-heading tracking-tight uppercase text-slate-950 dark:text-white truncate max-w-full px-1">
                {item.nama}
              </h4>
              <div className="flex flex-col items-center text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#C8102E] dark:text-[#E31B3B] leading-tight">
                <span>UNIVERSITAS GUNADARMA</span>
                <span>{item.periode ? (item.periode.startsWith("PERIODE") || item.periode.startsWith("Periode") ? item.periode : `PERIODE ${item.periode}`) : TAHUN_KEPENGURUSAN}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function KabinetSection({
  pengurus: serverPengurus = INITIAL_PENGURUS,
  visiMisi: serverVisiMisi = INITIAL_VISI_MISI,
}: {
  pengurus?: PengurusItem[];
  visiMisi?: VisiMisiData;
}) {
  const { pengurus: storePengurus, visiMisi: storeVisiMisi, mounted } = useSharedStore();
  const pengurus = mounted && storePengurus && storePengurus.length > 0 ? storePengurus : serverPengurus;
  const visiMisi = mounted && storeVisiMisi ? storeVisiMisi : serverVisiMisi;

  const bphItems = pengurus.filter((p) => p.divisi === "BPH");
  const displayItems = bphItems.length >= 1 ? bphItems : pengurus;
  const isDataEmpty = pengurus.length === 0;

  // Separate Kahim & Wakahim for Pyramid Top Tier (2 cards centered)
  const kahimItem = displayItems.find(
    (item) =>
      item.jabatan.toLowerCase().includes("ketua") &&
      !item.jabatan.toLowerCase().includes("wakil")
  );

  const wakahimItem = displayItems.find((item) =>
    item.jabatan.toLowerCase().includes("wakil ketua")
  );

  const topLeaders = [kahimItem, wakahimItem].filter(Boolean) as PengurusItem[];
  const topLeaderIds = topLeaders.map((l) => l.id);

  // Remaining BPH members (Sekretaris & Bendahara: 3 cards per row centered)
  const remainingBph = displayItems.filter((item) => !topLeaderIds.includes(item.id));

  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black text-slate-950 dark:text-slate-100 overflow-hidden border-t-2 border-slate-950 dark:border-white/20"
      aria-label="Pimpinan Kabinet HIMASI UG"
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
                <LiveText text={visiMisi?.visi || "Mewujudkan Himpunan Mahasiswa Sistem Informasi (HIMASI UG) yang solid, inovatif, adaptif, dan berdaya saing global serta menjadi pusat keunggulan."} />
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
                <LiveText text={visiMisi?.pilar || INITIAL_VISI_MISI.pilar || "Setiap gerakan HIMASI berpusat pada 3 pilar: Inovasi Digital, Kolaborasi Strategis, dan Integritas Akademik."} />
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
          className="text-center max-w-3xl mx-auto space-y-3 border-b-2 border-slate-950 dark:border-white/20 pb-6 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles size={12} />
            BPH HIMASI UG • {TAHUN_KEPENGURUSAN}
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-slate-950 dark:text-white tracking-tighter uppercase">
            PIMPINAN <span className="text-[#C8102E] dark:text-[#E31B3B]">HIMPUNAN</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed font-medium">
            Badan Pengurus Harian (BPH) yang memimpin dan mengarahkan gerakan HIMASI UG. Tarik kartu lanyard dengan kursor & klik untuk melihat visi & logo!
          </p>
        </motion.div>

        {/* KONDISI EMPTY STATE ATAU PIRAMIDA KABINET */}
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
                Struktur kepengurusan HIMASI UG periode ini sedang dalam proses penyusunan. Nantikan formasi pemimpin baru kita!
              </p>
            </div>
          </motion.div>
        ) : (
          /* STRUKTUR PIRAMIDA KABINET BPH */
          <div className="space-y-12">
            {/* BARIS 1 (PUNCAK PIRAMIDA): 2 KARTU CENTER (KAHIM & WAKAHIM) */}
            {topLeaders.length > 0 && (
              <div className="space-y-4 flex flex-col items-center">
                <span className="px-3 py-1 bg-[#C8102E] text-white font-mono font-black text-xs uppercase tracking-widest border border-slate-950">
                  PUNCAK PIMPINAN (KAHIM & WAKAHIM)
                </span>
                <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 pt-4 w-full max-w-4xl mx-auto">
                  {topLeaders.map((item, index) => (
                    <div key={item.id} className="w-full h-[550px] max-w-[280px] sm:max-w-[300px]">
                      <KabinetCard3D item={item} index={index} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BARIS 2+ (TINGKAT STRUKTURAL): 3 KARTU CENTER PER BARIS (SEKRETARIS & BENDAHARA) */}
            {remainingBph.length > 0 && (
              <div className="space-y-4 pt-6 flex flex-col items-center">
                <span className="px-3 py-1 bg-slate-950 text-white dark:bg-slate-800 font-mono font-black text-xs uppercase tracking-widest border border-slate-950">
                  JAJARAN SEKRETARIS & BENDAHARA BPH
                </span>
                <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-10 pt-4 w-full max-w-6xl mx-auto">
                  {remainingBph.map((item, index) => (
                    <div key={item.id} className="w-full h-[550px] max-w-[280px] sm:max-w-[290px]">
                      <KabinetCard3D item={item} index={topLeaders.length + index} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
