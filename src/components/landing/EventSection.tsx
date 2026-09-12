"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Wifi,
  WifiOff,
  Clock,
  ArrowRight,
  Sparkles,
  Coffee,
} from "lucide-react";
import { EVENT_STATUS_STYLE } from "@/data/landingPage";
import type { EventAdminItem } from "@/data/adminMockData";
import { INITIAL_EVENTS } from "@/data/adminMockData";

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const KATEGORI_COLORS: Record<string, string> = {
  Workshop: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  Lomba: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  "Event Himpunan": "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
  Webinar: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
};

export function EventSection({ events = INITIAL_EVENTS }: { events?: EventAdminItem[] }) {

  return (
    <section
      id="event"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300 scroll-mt-28"
      aria-label="Event dan Program Kerja HIMSI UG"
    >
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700/40 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-rose-500/5 dark:bg-rose-900/8 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Centered Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col items-center text-center space-y-3 mb-12 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 text-xs font-bold font-mono tracking-widest uppercase">
            <Sparkles size={11} />
            Upcoming Events
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tight hover-outline-text cursor-default transition-all duration-300">
            Event &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-500 dark:to-rose-400">
              Program Kerja
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-medium">
            Jadwal kegiatan HIMSI UG terdekat. Daftarkan dirimu dan jangan sampai ketinggalan!
          </p>
        </motion.div>

        {/* Dynamic Event Display or Casual Campus Vibe Empty State */}
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center text-center p-8 sm:p-12 liquid-glass-card max-w-2xl mx-auto space-y-5"
          >
            <div className="relative p-5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Coffee size={40} className="animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-slate-100 tracking-tight">
                Wah, belum ada event terdekat nih! 🎯
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-medium">
                Panitia lagi sibuk nyeduh kopi sambil nyiapin acara keren selanjutnya buat kamu. Pantengin terus ya biar nggak ketinggalan!
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://instagram.com/himsi.ug"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold font-mono text-xs sm:text-sm shadow-lg shadow-red-900/30 transition-all"
              >
                Pantau Instagram @himsi.ug
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {events.map((event, i) => {
              const kategoriCls = KATEGORI_COLORS[event.kategori] ?? "bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30";
              const statusCls = EVENT_STATUS_STYLE[event.status] || "bg-emerald-500/15 text-emerald-600 border-emerald-500/30";

              return (
                <motion.article
                  key={event.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                  whileHover={{ y: -5, transition: { duration: 0.22 } }}
                  className="group relative flex flex-col gap-4 p-6 liquid-glass-card hover:border-red-500/40 dark:hover:border-red-500/30 transition-all duration-300"
                >
                  {/* Hover top line */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

                  {/* Badges row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${kategoriCls}`}>
                      {event.kategori}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${statusCls}`}>
                      {event.status}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-500">
                      {event.isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
                      {event.isOnline ? "Online" : "Offline"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-slate-900 dark:text-slate-100 font-bold font-heading text-lg leading-snug group-hover:text-red-600 dark:group-hover:text-red-100 transition-colors duration-200">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 font-medium">
                    {event.deskripsi}
                  </p>

                  {/* Meta info */}
                  <div className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400 dark:text-slate-600 flex-shrink-0" />
                      <span>{event.tanggal}</span>
                      <span className="text-slate-400 dark:text-slate-700">•</span>
                      <Clock size={12} className="text-slate-400 dark:text-slate-600 flex-shrink-0" />
                      <span>{event.waktu}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-400 dark:text-slate-600 flex-shrink-0" />
                      <span>{event.lokasi}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  {event.linkPendaftaran && (
                    <motion.a
                      href={event.linkPendaftaran}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                        event.status === "Pendaftaran Dibuka"
                          ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-900/20"
                          : "bg-slate-200/80 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                      aria-label={`${event.status === "Pendaftaran Dibuka" ? "Daftar" : "Detail"} ${event.title}`}
                    >
                      {event.status === "Pendaftaran Dibuka" ? "Daftar Sekarang" : "Lihat Detail"}
                      <ArrowRight size={14} />
                    </motion.a>
                  )}
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
