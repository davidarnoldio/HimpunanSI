"use client";

import { MapPin, Mail, Clock, Send } from "lucide-react";
import Link from "next/link";
import { FOOTER_SOCIAL, FOOTER_INFO } from "@/data/landingPage";
import { BrandLogo } from "@/components/ui/BrandLogo";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="0" ry="0" />
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

export function Footer() {
  return (
    <footer
      id="footer"
      className="relative bg-slate-100 dark:bg-black text-slate-950 dark:text-white border-t-2 border-slate-950 dark:border-white/20 transition-colors duration-300"
      aria-label="Footer HIMSI UG"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Grid 2-Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 pb-12">
          {/* Kolom 1: Branding & About */}
          <div className="space-y-5 text-left">
            <Link href="/" className="inline-flex items-center gap-3">
              <BrandLogo size="md" />
              <div className="flex flex-col leading-tight">
                <span className="text-slate-950 dark:text-white font-black font-heading text-xl uppercase tracking-wider">
                  HIMSI UG
                </span>
                <span className="text-slate-600 dark:text-slate-400 text-xs font-mono font-bold uppercase tracking-widest">
                  Himpunan Mahasiswa Sistem Informasi
                </span>
              </div>
            </Link>

            <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md font-medium">
              Organisasi kemahasiswaan resmi Sistem Informasi Universitas Gunadarma yang menggerakkan potensi mahasiswa melalui program akademik, pengembangan minat bakat, dan sosial yang berdampak.
            </p>

            {/* Social Media Icons */}
            <div className="pt-2 space-y-3">
              <span className="text-[11px] font-black font-mono uppercase tracking-widest text-[#C8102E] dark:text-[#E31B3B] block">
                MEDIA SOSIAL RESMI:
              </span>
              <div className="flex items-center gap-3">
                {FOOTER_SOCIAL.map((s) => {
                  const Icon = SOCIAL_ICON_MAP[s.icon] ?? InstagramIcon;
                  return (
                    <a
                      key={s.platform}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-950 text-white dark:bg-white dark:text-slate-950 border border-slate-950 flex items-center justify-center hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] hover:text-white dark:hover:text-white transition-colors"
                      aria-label={`HIMSI UG di ${s.label}`}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kolom 2: Sekretariat & Kontak */}
          <div className="space-y-5 text-left">
            <h3 className="text-[#C8102E] dark:text-[#E31B3B] font-black font-heading text-lg uppercase tracking-wider">
              SEKRETARIAT & KONTAK
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
              {/* Alamat */}
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#C8102E] dark:text-[#E31B3B] mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  {FOOTER_INFO.sekretariat}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#C8102E] dark:text-[#E31B3B] flex-shrink-0" />
                <a
                  href={`mailto:${FOOTER_INFO.email}`}
                  className="hover:text-[#C8102E] dark:hover:text-[#E31B3B] font-mono font-bold transition-colors"
                >
                  {FOOTER_INFO.email}
                </a>
              </div>

              {/* Jam Operasional */}
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-mono font-bold">
                <Clock size={18} className="text-[#C8102E] dark:text-[#E31B3B] flex-shrink-0" />
                <span>SENIN - JUMAT (09:00 - 17:00 WIB)</span>
              </div>
            </div>

            {/* CTA Kirim Aspirasi */}
            <div className="pt-2">
              <Link
                href="/aspirasi"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8102E] dark:bg-[#E31B3B] text-white font-black font-mono text-xs uppercase tracking-widest border border-slate-950 dark:border-transparent hover:bg-slate-950 dark:hover:bg-white dark:hover:text-slate-950 transition-colors"
              >
                <Send size={13} /> KIRIM ASPIRASI SEKARANG
              </Link>
            </div>
          </div>
        </div>

        {/* Giant Statement Typography */}
        <div className="py-8 my-4 border-y border-slate-950/20 dark:border-white/20 text-center overflow-hidden">
          <span className="text-4xl sm:text-6xl lg:text-8xl font-black font-heading tracking-tighter text-slate-950/90 dark:text-white/90 select-none block uppercase">
            HIMSI GUNADARMA
          </span>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
          <p className="text-center sm:text-left">
            © 2026 HIMSI UNIVERSITAS GUNADARMA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
