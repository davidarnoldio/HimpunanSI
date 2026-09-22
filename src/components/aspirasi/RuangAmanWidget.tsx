"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  HeartHandshake,
  ShieldCheck,
  Lock,
  X,
  ArrowUpRight,
} from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/sharedStore";

interface RuangAmanWidgetProps {
  whatsappNumber?: string;
}

export function RuangAmanWidget({ whatsappNumber = "6289669139907" }: RuangAmanWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMessage =
    "Halo Tim Pendampingan & Ruang Aman HIMASI UG, saya membutuhkan teman cerita / pendampingan privat mengenai situasi yang sedang saya alami.";
  const waUrl = formatWhatsAppUrl(whatsappNumber, defaultMessage);

  return (
    <>
      {/* ── 1. INLINE BANNER ADAPTIF DI HALAMAN ASPIRASI ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="p-6 sm:p-8 bg-white dark:bg-slate-950 text-slate-950 dark:text-white border-2 border-slate-950 dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] relative overflow-hidden space-y-5 transition-colors duration-300"
      >
        {/* Background Decorative Accent */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#C8102E]/10 dark:bg-[#C8102E]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-950/10 dark:border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#C8102E] text-white border border-slate-950 dark:border-white/20 shrink-0 shadow-sm">
              <HeartHandshake size={24} />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black tracking-widest uppercase text-[#C8102E] dark:text-red-400 block">
                [ 100% PRIVAT & BEBAS HUKUMAN ]
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-heading uppercase tracking-tight text-slate-950 dark:text-white flex items-center gap-2">
                RUANG AMAN <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400" />
              </h2>
            </div>
          </div>
        </div>

        <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-medium max-w-3xl">
          Mengalami tindakan kurang menyenangkan, intimidasi, pelecehan seksual, atau butuh teman cerita privat mengenai masalah berat yang sedang kamu hadapi? <strong className="text-slate-950 dark:text-white font-black">Tim Pendampingan Mahasiswa HIMASI UG</strong> menyediakan ruang aman (*safe space*) untuk mendengar tanpa menghakimi dan memberikan bantuan pendampingan resmi secara penuh.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black font-mono text-xs uppercase tracking-wider border-2 border-slate-950 transition-all shadow-[3px_3px_0px_0px_rgba(10,10,10,1)] hover:translate-x-0.5 hover:translate-y-0.5 cursor-pointer"
          >
            <MessageCircle size={18} className="fill-slate-950 stroke-none" />
            <span>HUBUNGI VIA WHATSAPP (CONFIDENTIAL)</span>
            <ArrowUpRight size={16} />
          </a>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs font-mono font-bold">
            <Lock size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span>Identitas & Percakapan Dijamin Rahasia</span>
          </div>
        </div>
      </motion.div>

      {/* ── 2. FLOATING BUBBLE WHATSAPP (POJOK KANAN BAWAH) ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="w-80 p-5 bg-white dark:bg-slate-950 text-slate-950 dark:text-white border-2 border-slate-950 dark:border-[#25D366] shadow-[6px_6px_0px_0px_rgba(10,10,10,1)] dark:shadow-[6px_6px_0px_0px_rgba(37,211,102,0.4)] space-y-4 transition-colors duration-300"
            >
              <div className="flex items-start justify-between border-b border-slate-950/10 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black font-heading uppercase text-slate-950 dark:text-white tracking-wider">
                      RUANG AMAN HIMASI
                    </h3>
                    <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Pendampingan & Deep Talk
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                Butuh tempat cerita yang aman tentang pelecehan, masalah pribadi berat, atau situasi darurat kampus? Hubungi tim pendampingan resmi kami via WhatsApp.
              </p>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black font-mono text-xs uppercase tracking-wider border-2 border-slate-950 transition-colors cursor-pointer shadow-sm"
              >
                <MessageCircle size={16} /> CHAT SEKARANG VIA WA
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bubble Button with Pulsating Notification Ring */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative p-3.5 sm:p-4 bg-[#25D366] text-slate-950 border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] flex items-center gap-2.5 cursor-pointer font-black font-mono text-xs uppercase tracking-wider"
          title="Ruang Aman & Deep Talk WhatsApp HIMASI UG"
        >
          {/* Notification Ping Badge */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#C8102E] border-2 border-slate-950 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#C8102E] border-2 border-slate-950 rounded-full" />

          <MessageCircle size={22} className="fill-slate-950 stroke-none shrink-0" />
          <span className="hidden sm:inline font-mono font-black text-xs text-slate-950">
            RUANG AMAN WA
          </span>
        </motion.button>
      </div>
    </>
  );
}
