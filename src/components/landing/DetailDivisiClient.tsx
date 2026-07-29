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
      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
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

interface DetailDivisiClientProps {
  targetDivisi: DivisiAdminItem;
  members: AnggotaDivisiItem[];
}

export function DetailDivisiClient({ targetDivisi, members }: DetailDivisiClientProps) {
  // Separate Leader vs Staff
  const leader = members.find((m) => m.role === "Ketua Divisi") || members[0];
  const staffList = members.filter((m) => m.id !== leader?.id);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      <main className="pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* Back Link */}
        <div>
          <Link
            href="/#divisi"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors shadow-sm"
          >
            <ArrowLeft size={14} /> Kembali ke Halaman Utama
          </Link>
        </div>

        {/* ── HEADER HALAMAN DETIL DIVISI (WITH LIVE TEXT) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-extrabold tracking-widest uppercase">
            <Sparkles size={12} />
            {targetDivisi ? targetDivisi.singkatan : "DIVISI HIMSI"}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white">
            <LiveText text={targetDivisi ? targetDivisi.nama : "Detail Divisi"} />
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed font-medium">
            <LiveText
              text={
                targetDivisi
                  ? targetDivisi.deskripsi
                  : "Mengenal para pengurus dan staff yang mengabdi pada divisi ini untuk kemajuan HIMSI UG."
              }
              delay={0.1}
            />
          </p>
        </motion.div>

        {/* ── SECTION 1: KETUA DIVISI (1 CARD KHUSUS DI ATAS) ── */}
        {leader && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                <Crown className="text-amber-500" size={22} />
                Ketua Divisi
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto"
            >
              <div className="group relative flex flex-col items-center p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-500/40 shadow-2xl space-y-5 hover:-translate-y-2 transition-all duration-300">
                {/* Floating Badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-md uppercase tracking-wider flex items-center gap-1.5">
                    <Crown size={12} /> {leader.jabatanBadge || "Ketua Divisi"}
                  </span>
                </div>

                {/* Photo */}
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                  {hasRealPhoto(leader.fotoUrl) ? (
                    <img
                      src={leader.fotoUrl}
                      alt={leader.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
                      <User size={48} />
                      <span className="text-xs font-semibold">Foto Belum Tersedia</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center space-y-1.5 w-full">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {leader.nama}
                  </h3>
                  {leader.npm && (
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                      NPM: {leader.npm}
                    </p>
                  )}
                  <p className="text-xs font-semibold text-slate-400">
                    Periode {leader.periode || "2025/2026"}
                  </p>

                  <div className="flex items-center justify-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <SocialIcon href={leader.linkedin} type="linkedin" />
                    <SocialIcon href={leader.instagram} type="instagram" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── SECTION 2: ANGGOTA DIVISI (GRID AUTO SCALING) ── */}
        <div className="space-y-8 pt-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <UsersIcon className="text-red-600 dark:text-red-500" size={24} />
              Anggota & Staff Divisi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tim solid yang mendukung kelancaran seluruh proker divisi
            </p>
          </div>

          {staffList.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white/70 dark:bg-slate-900/60 border-2 border-dashed border-slate-300 dark:border-slate-800 text-center max-w-lg mx-auto space-y-3">
              <Layers size={40} className="mx-auto text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">
                Belum ada data anggota staf untuk divisi ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {staffList.map((member, i) => (
                <motion.div
                  key={member.id || i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="group relative flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full"
                >
                  <div className="space-y-4">
                    {/* Badge Role */}
                    <div className="flex justify-center">
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-[11px] border border-slate-200 dark:border-slate-700 truncate max-w-full">
                        {member.jabatanBadge || "Staff Divisi"}
                      </span>
                    </div>

                    {/* Photo Box */}
                    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                      {hasRealPhoto(member.fotoUrl) ? (
                        <img
                          src={member.fotoUrl}
                          alt={member.nama}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500 space-y-1.5 select-none">
                          <User size={38} />
                          <span className="text-[10px] font-semibold">Belum Ada Foto</span>
                        </div>
                      )}
                    </div>

                    {/* Member Info */}
                    <div className="text-center space-y-1">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight line-clamp-1">
                        {member.nama}
                      </h4>
                      {member.npm && (
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                          NPM: {member.npm}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Socials */}
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
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
