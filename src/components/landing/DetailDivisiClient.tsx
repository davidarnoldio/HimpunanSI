"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Crown,
  Users as UsersIcon,
  Sparkles,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LiveText } from "@/components/ui/LiveText";
import { HackerMatrixBackground } from "@/components/ui/HackerMatrixBackground";
import type { DivisiAdminItem, AnggotaDivisiItem } from "@/data/adminMockData";

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

interface DetailDivisiClientProps {
  targetDivisi: DivisiAdminItem;
  members: AnggotaDivisiItem[];
}

export function DetailDivisiClient({ targetDivisi, members }: DetailDivisiClientProps) {
  // Separate Leader vs Staff
  const leader = members.find((m) => m.role === "Ketua Divisi") || members[0];
  const staffList = members.filter((m) => m.id !== leader?.id);

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
          className="text-left max-w-3xl space-y-4 border-b-2 border-slate-950 dark:border-white/20 pb-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles size={12} />
            {targetDivisi ? targetDivisi.singkatan : "DIVISI HIMASI"}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tighter uppercase text-slate-950 dark:text-white">
            <LiveText text={targetDivisi ? targetDivisi.nama : "Detail Divisi"} />
          </h1>

          <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
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

        {/* ── SECTION 1: KETUA DIVISI ── */}
        {leader && (
          <div className="space-y-6">
            <div className="text-left border-b-2 border-slate-950 dark:border-white/20 pb-4">
              <h2 className="text-xl font-black font-heading uppercase text-slate-950 dark:text-white flex items-center gap-2 tracking-tight">
                <Crown className="text-[#C8102E] dark:text-[#E31B3B]" size={22} />
                KETUA DIVISI
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-md"
            >
              <div className="group relative flex flex-col p-6 bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-950 dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] space-y-5">
                {/* Badge */}
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-[#C8102E] text-white font-black font-mono text-xs uppercase tracking-widest border border-slate-950">
                    {leader.jabatanBadge || "KETUA DIVISI"}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                    PERIODE {leader.periode || "2025/2026"}
                  </span>
                </div>

                {/* Photo */}
                <div className="relative w-full aspect-[3/4] border-2 border-slate-950 dark:border-white/20 overflow-hidden bg-slate-950 flex items-center justify-center">
                  {hasRealPhoto(leader.fotoUrl) ? (
                    <img
                      src={leader.fotoUrl}
                      alt={leader.nama}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                      <User size={48} />
                      <span className="text-xs font-mono font-bold uppercase">Foto Belum Tersedia</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-left space-y-1.5 w-full">
                  <h3 className="text-xl font-black font-heading uppercase text-slate-950 dark:text-white tracking-tight">
                    {leader.nama}
                  </h3>
                  {leader.npm && (
                    <p className="text-xs font-black font-mono text-[#C8102E] dark:text-[#E31B3B]">
                      NPM: {leader.npm}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-950/20 dark:border-white/20">
                    <SocialIcon href={leader.linkedin} type="linkedin" />
                    <SocialIcon href={leader.instagram} type="instagram" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── SECTION 2: ANGGOTA DIVISI ── */}
        <div className="space-y-6 pt-6">
          <div className="text-left border-b-2 border-slate-950 dark:border-white/20 pb-4">
            <h2 className="text-2xl font-black font-heading uppercase text-slate-950 dark:text-white flex items-center gap-2 tracking-tight">
              <UsersIcon className="text-[#C8102E] dark:text-[#E31B3B]" size={24} />
              ANGGOTA & STAFF DIVISI
            </h2>
            <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 uppercase">
              Tim solid yang mendukung kelancaran seluruh proker divisi
            </p>
          </div>

          {staffList.length === 0 ? (
            <div className="p-10 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 text-center max-w-lg space-y-3">
              <Layers size={40} className="mx-auto text-slate-400" />
              <p className="text-slate-950 dark:text-white text-sm font-black font-heading uppercase">
                Belum ada data anggota staf untuk divisi ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {staffList.map((member, i) => (
                <motion.div
                  key={member.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="group flex flex-col justify-between p-5 bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-950 dark:border-white/20 hover:shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] transition-all duration-200"
                >
                  <div className="space-y-4">
                    {/* Badge Role */}
                    <div className="flex justify-start">
                      <span className="px-3 py-1 bg-slate-950 text-white dark:bg-slate-800 text-[10px] font-black font-mono tracking-widest uppercase border border-slate-950 truncate max-w-full">
                        {member.jabatanBadge || "STAFF DIVISI"}
                      </span>
                    </div>

                    {/* Photo Box */}
                    <div className="relative w-full aspect-[3/4] border-2 border-slate-950 dark:border-white/20 overflow-hidden bg-slate-950 flex items-center justify-center">
                      {hasRealPhoto(member.fotoUrl) ? (
                        <img
                          src={member.fotoUrl}
                          alt={member.nama}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 space-y-1.5 select-none">
                          <User size={38} />
                          <span className="text-[10px] font-mono font-bold uppercase">Foto Belum Tersedia</span>
                        </div>
                      )}
                    </div>

                    {/* Member Info */}
                    <div className="text-left space-y-1">
                      <h4 className="font-black font-heading text-base text-slate-950 dark:text-white uppercase tracking-tight line-clamp-1">
                        {member.nama}
                      </h4>
                      {member.npm && (
                        <p className="text-[11px] font-black font-mono text-[#C8102E] dark:text-[#E31B3B]">
                          NPM: {member.npm}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Socials */}
                  <div className="pt-3 mt-3 border-t border-slate-950/20 dark:border-white/20 flex items-center gap-2">
                    <SocialIcon href={member.linkedin} type="linkedin" />
                    <SocialIcon href={member.instagram} type="instagram" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
