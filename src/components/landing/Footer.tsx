"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Clock, Send } from "lucide-react";
import Link from "next/link";
import { FOOTER_SOCIAL, FOOTER_INFO } from "@/data/landingPage";
import { BrandLogo } from "@/components/ui/BrandLogo";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.02-.07z" />
    </svg>
  );
}

const SOCIAL_ICON_MAP: Record<string, React.ElementType> = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
  tiktok: TikTokIcon,
};

const SOCIAL_HOVER: Record<string, string> = {
  instagram: "hover:bg-pink-500/15 hover:border-pink-500/40 hover:text-pink-600 dark:hover:text-pink-400",
  linkedin: "hover:bg-blue-500/15 hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400",
  youtube: "hover:bg-red-500/15 hover:border-red-500/40 hover:text-red-600 dark:hover:text-red-400",
  tiktok: "hover:bg-slate-400/15 hover:border-slate-400/40 hover:text-slate-900 dark:hover:text-slate-200",
};

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative bg-slate-50 dark:bg-[#0a0e1f] text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800/80 overflow-hidden transition-colors duration-300"
      aria-label="Footer HIMSI UG"
    >
      {/* Top accent glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-red-500/5 dark:bg-red-900/8 blur-[120px]" />
        <div className="absolute top-0 right-0 w-[350px] h-[250px] bg-rose-500/5 dark:bg-rose-900/6 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Grid 2-Kolom Ringkas (Left & Right Aligned) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 pb-12">
          {/* Kolom 1: Branding & About */}
          <div className="space-y-5 text-left">
            {/* Logo & Title */}
            <Link href="/" className="inline-flex items-center gap-3 group">
              <BrandLogo size="md" />
              <div className="flex flex-col leading-tight">
                <span className="text-slate-900 dark:text-slate-100 font-black font-heading text-lg group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  HIMSI UG
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs font-mono font-semibold">
                  Himpunan Mahasiswa Sistem Informasi
                </span>
              </div>
            </Link>

            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md font-medium">
              Organisasi kemahasiswaan resmi Sistem Informasi Universitas Gunadarma yang menggerakkan potensi mahasiswa melalui program akademik, pengembangan minat bakat, dan sosial yang berdampak.
            </p>

            {/* Social Media Icons */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Ikuti Media Sosial Kami:
              </span>
              <div className="flex items-center gap-2.5">
                {FOOTER_SOCIAL.map((s) => {
                  const Icon = SOCIAL_ICON_MAP[s.icon] ?? InstagramIcon;
                  const hoverCls = SOCIAL_HOVER[s.icon] ?? "";
                  return (
                    <motion.a
                      key={s.platform}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.12, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-all duration-200 shadow-sm dark:shadow-none ${hoverCls}`}
                      aria-label={`HIMSI UG di ${s.label}`}
                    >
                      <Icon size={16} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kolom 2: Sekretariat & Kontak */}
          <div className="space-y-4 text-left">
            <h3 className="text-slate-900 dark:text-slate-100 font-extrabold font-heading text-base tracking-tight">
              Sekretariat & Kontak
            </h3>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              {/* Alamat Rapi Ke Bawah */}
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  {FOOTER_INFO.sekretariat}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-red-600 dark:text-red-500 flex-shrink-0" />
                <a
                  href={`mailto:${FOOTER_INFO.email}`}
                  className="hover:text-red-600 dark:hover:text-red-400 font-semibold transition-colors duration-200"
                >
                  {FOOTER_INFO.email}
                </a>
              </div>

              {/* Jam Operasional */}
              <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                <Clock size={16} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <span>Senin - Jumat (09:00 - 17:00 WIB)</span>
              </div>
            </div>

            {/* CTA Kirim Aspirasi */}
            <div className="pt-2">
              <Link
                href="/#aspirasi"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold font-mono text-xs shadow-md shadow-red-900/20 transition-all"
              >
                <Send size={13} /> Kirim Aspirasi
              </Link>
            </div>
          </div>
        </div>

        {/* AURA Agency Giant Statement Typography */}
        <div className="py-8 my-4 border-y border-slate-200/80 dark:border-slate-800/80 text-center overflow-hidden">
          <span className="text-4xl sm:text-6xl lg:text-8xl font-black font-heading tracking-tighter text-slate-200 dark:text-slate-900/80 select-none block hover-outline-text transition-all duration-300">
            HIMSI GUNADARMA
          </span>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500 dark:text-slate-500 font-semibold">
          <p className="text-center sm:text-left">
            © 2026 HIMSI Universitas Gunadarma. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
