"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  ArrowLeft,
  User,
  Crown,
  Users as UsersIcon,
  Sparkles,
  Layers,
  RotateCw,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LiveText } from "@/components/ui/LiveText";
import { HackerMatrixBackground } from "@/components/ui/HackerMatrixBackground";
import type { DivisiAdminItem, AnggotaDivisiItem } from "@/data/adminMockData";
import { useSharedStore } from "@/lib/sharedStore";

function hasRealPhoto(fotoUrl?: string | null): boolean {
  if (!fotoUrl || typeof fotoUrl !== "string" || fotoUrl.trim() === "") return false;
  return !fotoUrl.trim().includes("placehold.co");
}

function SocialIcon({ href, type }: { href?: string; type: "linkedin" | "instagram" }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-950 dark:border-white/20 text-slate-950 dark:text-white hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] hover:text-white transition-colors"
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

// ─── 3D LANYARD ID CARD FOR DIVISION MEMBERS ─────────────────────────────────
export function DivisiMemberCard3D({
  member,
  index = 0,
  singkatanDivisi = "DIVISI",
}: {
  member: AnggotaDivisiItem;
  index?: number;
  singkatanDivisi?: string;
}) {
  const { pengurus } = useSharedStore();
  const activeBphPeriode = pengurus.find((p) => p.divisi === "BPH" && p.periode)?.periode || "2026/2027";
  const [isFlipped, setIsFlipped] = useState(false);

  // Framer motion drag lanyard physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

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

  const photoAvailable = hasRealPhoto(member.fotoUrl);
  const badgeText = member.jabatanBadge || member.role || "STAFF DIVISI";

  const isKadiv =
    member.role === "Ketua Divisi" ||
    (member.jabatanBadge &&
      member.jabatanBadge.toLowerCase().includes("kadiv") &&
      !member.jabatanBadge.toLowerCase().includes("wakadiv"));

  const isWakadiv =
    member.jabatanBadge && member.jabatanBadge.toLowerCase().includes("wakadiv");

  const badgeBgClass = isKadiv
    ? "bg-[#C8102E] text-white"
    : isWakadiv
      ? "bg-[#C8102E] text-white"
      : "bg-slate-950 text-white dark:bg-slate-800";

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: -60, rotate: -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 13,
        mass: 1.1,
        delay: index * 0.1,
      }}
      className="flex flex-col items-center group w-full h-[550px] relative"
    >
      {/* Dynamic SVG Lanyard Fabric Strap */}
      <div className="relative w-full h-16 -mb-4 pointer-events-none select-none z-20 overflow-visible">
        <svg viewBox="0 0 100 65" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`lanyardGrad-${member.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#900A1E" />
              <stop offset="50%" stopColor="#C8102E" />
              <stop offset="100%" stopColor="#E31B3B" />
            </linearGradient>
            <linearGradient id={`metalGrad-${member.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>

          <motion.path
            d={strapPathLeft}
            stroke={`url(#lanyardGrad-${member.id})`}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
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

          <motion.path
            d={strapPathRight}
            stroke={`url(#lanyardGrad-${member.id})`}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
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

          <motion.g style={{ x, y }}>
            <rect
              x="42"
              y="44"
              width="16"
              height="12"
              rx="1.5"
              fill={`url(#metalGrad-${member.id})`}
              stroke="#0f172a"
              strokeWidth="1"
            />
            <rect x="46" y="52" width="8" height="3" rx="1" fill="#0f172a" />
          </motion.g>
        </svg>
      </div>

      {/* Draggable 3D ID Card Container */}
      <motion.div
        drag
        style={{ x, y }}
        dragConstraints={{ left: -40, right: 40, top: -15, bottom: 45 }}
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
          {/* FRONT FACE OF CARD */}
          <div className="absolute inset-0 w-full h-full p-5 pt-8 flex flex-col justify-between [backface-visibility:hidden] bg-white dark:bg-slate-950 border-t-8 border-t-[#C8102E]">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-slate-900 border border-slate-950 rounded-full" />

            <div className="flex items-center justify-between border-b border-slate-950/20 dark:border-white/20 pb-2 mb-2">
              <span className={`px-2.5 py-0.5 text-[10px] font-black font-mono tracking-widest uppercase border border-slate-950 ${badgeBgClass}`}>
                {badgeText}
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                ID CARD • {singkatanDivisi}
              </span>
            </div>

            <div className="relative w-full h-60 border-2 border-slate-950 dark:border-white/20 overflow-hidden bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center my-auto">
              {photoAvailable ? (
                <img
                  src={member.fotoUrl}
                  alt={member.nama}
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

            <div className="mt-2 flex flex-col justify-center text-center space-y-1 w-full">
              <h3 className="text-base sm:text-lg font-black font-heading tracking-tight break-words line-clamp-2 leading-tight px-1 uppercase text-slate-950 dark:text-white">
                {member.nama}
              </h3>
              <p className="text-[10px] font-extrabold font-mono uppercase tracking-widest text-[#C8102E] dark:text-[#E31B3B]">
                {member.periode ? (member.periode.startsWith("PERIODE") ? member.periode : `PERIODE ${member.periode}`) : `PERIODE ${activeBphPeriode}`}
              </p>

              {(member.linkedin || member.instagram) && (
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-950/20 dark:border-white/20">
                  <SocialIcon href={member.linkedin} type="linkedin" />
                  <SocialIcon href={member.instagram} type="instagram" />
                </div>
              )}
            </div>
          </div>

          {/* BACK FACE OF CARD (ADAPTIVE LIGHT/DARK THEME) */}
          <div className="absolute inset-0 w-full h-full p-6 flex flex-col items-center justify-between text-center [transform:rotateY(180deg)] [backface-visibility:hidden] bg-white dark:bg-slate-950 text-slate-950 dark:text-white border-2 border-slate-950 dark:border-[#C8102E] overflow-hidden">
            <div className="absolute inset-0 bg-radial from-[#C8102E]/10 dark:from-[#C8102E]/30 via-transparent to-transparent pointer-events-none" />

            <div className="w-8 h-2 bg-slate-200 dark:bg-slate-900 border border-slate-950 dark:border-slate-700 rounded-full z-10" />

            <div className="z-10 w-full py-1.5 px-3 bg-[#C8102E] text-white font-mono font-black text-[11px] uppercase tracking-widest border border-slate-950 dark:border-slate-900 shadow-md">
              HIMPUNAN MAHASISWA SISTEM INFORMASI
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              <div className="relative p-6 sm:p-7 bg-white dark:bg-slate-900/90 border-2 border-slate-950 dark:border-[#C8102E] rounded-full shadow-[0_0_20px_rgba(200,16,46,0.25)] dark:shadow-[0_0_35px_rgba(200,16,46,0.7)] group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/himsigundar.webp"
                  alt="Logo HIMASI UG"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain filter drop-shadow-[0_0_12px_rgba(227,27,59,0.9)] pointer-events-none"
                />
              </div>
            </div>

            <div className="z-10 w-full pt-3 border-t border-slate-950/20 dark:border-white/20 flex flex-col items-center justify-center space-y-1">
              <h4 className="text-sm sm:text-base font-black font-heading tracking-tight uppercase text-slate-950 dark:text-white truncate max-w-full px-1">
                {member.nama}
              </h4>
              <div className="flex flex-col items-center text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#C8102E] dark:text-[#E31B3B] leading-tight">
                <span>UNIVERSITAS GUNADARMA</span>
                <span>{member.periode ? (member.periode.startsWith("PERIODE") ? member.periode : `PERIODE ${member.periode}`) : `PERIODE ${activeBphPeriode}`}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

interface DetailDivisiClientProps {
  targetDivisi: DivisiAdminItem;
  members: AnggotaDivisiItem[];
}

export function DetailDivisiClient({ targetDivisi, members: serverMembers }: DetailDivisiClientProps) {
  const { anggotaDivisi, mounted } = useSharedStore();
  const members =
    mounted && anggotaDivisi && anggotaDivisi.length > 0
      ? anggotaDivisi.filter((m) => m.divisiId === targetDivisi?.id)
      : serverMembers;

  // Separate Kadiv vs Wakadiv vs Staff List
  const kadiv = members.find(
    (m) =>
      m.role === "Ketua Divisi" ||
      (m.jabatanBadge &&
        m.jabatanBadge.toLowerCase().includes("kadiv") &&
        !m.jabatanBadge.toLowerCase().includes("wakadiv"))
  );

  const wakadiv = members.find(
    (m) =>
      m.role === "Wakil Ketua Divisi" ||
      (m.jabatanBadge && m.jabatanBadge.toLowerCase().includes("wakadiv")) ||
      (m.jabatanBadge && m.jabatanBadge.toLowerCase().includes("wakil"))
  );

  const leaders = [kadiv, wakadiv].filter(Boolean) as AnggotaDivisiItem[];
  const leaderIds = leaders.map((l) => l.id);

  const staffList = members.filter((m) => !leaderIds.includes(m.id));

  return (
    <div className="relative min-h-screen bg-white dark:bg-black text-slate-950 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      <Navbar />
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <HackerMatrixBackground />
      </div>

      <main className="relative pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* Back Link */}
        <div>
          <Link
            href="/#divisi"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-black font-mono uppercase tracking-widest border border-slate-950 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> KEMBALI KE BERANDA
          </Link>
        </div>

        {/* ── HEADER HALAMAN DETIL DIVISI ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-4xl mx-auto space-y-4 border-b-2 border-slate-950 dark:border-white/20 pb-8 flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles size={12} />
            {targetDivisi ? targetDivisi.singkatan : "DIVISI HIMASI"}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tighter uppercase text-slate-950 dark:text-white">
            <LiveText text={targetDivisi ? targetDivisi.nama : "Detail Divisi"} />
          </h1>

          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium max-w-2xl">
            <LiveText
              text={
                targetDivisi
                  ? targetDivisi.deskripsi
                  : "Mengenal para pengurus dan staff yang mengabdi pada divisi ini untuk kemajuan HIMASI UG."
              }
              delay={0.1}
            />
          </p>
        </motion.div>

        {/* ── SECTION 1: PIMPINAN DIVISI (KETUA & WAKIL KETUA DIVISI) ── */}
        {leaders.length > 0 && (
          <div className="space-y-8 flex flex-col items-center text-center">
            <div className="w-full border-b-2 border-slate-950 dark:border-white/20 pb-4 flex flex-col items-center">
              <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase text-slate-950 dark:text-white flex items-center justify-center gap-2 tracking-tight">
                <Crown className="text-[#C8102E] dark:text-[#E31B3B]" size={26} />
                PIMPINAN DIVISI (KADIV & WAKADIV)
              </h2>
              <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase mt-1">
                Ketua dan Wakil Ketua Divisi yang memimpin arah gerak divisi
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-10 pt-4 w-full max-w-5xl mx-auto">
              {leaders.map((leaderItem, idx) => (
                <div key={leaderItem.id || idx} className="w-full h-[550px] max-w-[280px] sm:max-w-[300px]">
                  <DivisiMemberCard3D
                    member={leaderItem}
                    index={idx}
                    singkatanDivisi={targetDivisi?.singkatan || "DIVISI"}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION 2: ANGGOTA & STAFF DIVISI ── */}
        <div className="space-y-8 pt-8 flex flex-col items-center text-center">
          <div className="w-full border-b-2 border-slate-950 dark:border-white/20 pb-4 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl font-black font-heading uppercase text-slate-950 dark:text-white flex items-center justify-center gap-2 tracking-tight">
              <UsersIcon className="text-[#C8102E] dark:text-[#E31B3B]" size={26} />
              ANGGOTA & STAFF DIVISI
            </h2>
            <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase mt-1">
              Tim solid yang mendukung kelancaran seluruh proker divisi
            </p>
          </div>

          {staffList.length === 0 ? (
            <div className="p-10 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-center max-w-lg space-y-3 mx-auto">
              <Layers size={40} className="mx-auto text-slate-400" />
              <p className="text-slate-950 dark:text-white text-sm font-black font-heading uppercase">
                Belum ada data anggota staf untuk divisi ini.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-10 pt-4 w-full max-w-7xl mx-auto">
              {staffList.map((member, i) => (
                <div key={member.id || i} className="w-full h-[550px] max-w-[280px] sm:max-w-[290px]">
                  <DivisiMemberCard3D
                    member={member}
                    index={i}
                    singkatanDivisi={targetDivisi?.singkatan || "DIVISI"}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
