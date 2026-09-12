"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Wifi,
  WifiOff,
  Clock,
  Coffee,
  ArrowRight,
} from "lucide-react";
import type { EventAdminItem } from "@/data/adminMockData";
import { INITIAL_EVENTS } from "@/data/adminMockData";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

export function EventSection({ events = INITIAL_EVENTS }: { events?: EventAdminItem[] }) {
  return (
    <section
      id="event"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black text-slate-950 dark:text-slate-100 border-t-2 border-slate-950 dark:border-white/20 scroll-mt-28"
      aria-label="Event dan Program Kerja HIMSI UG"
    >
      <div className="relative max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-left space-y-3 border-b-2 border-slate-950 dark:border-white/20 pb-6"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-[#C8102E] dark:text-[#E31B3B] font-bold block">
            [ PROJECTS & EVENTS ]
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading text-slate-950 dark:text-white tracking-tighter uppercase">
            AGENDA & <span className="text-[#C8102E] dark:text-[#E31B3B]">PROGRAM KERJA</span>
          </h2>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
            Jadwal kegiatan HIMSI UG terdekat. Daftarkan dirimu dan jangan sampai ketinggalan!
          </p>
        </motion.div>

        {/* Dynamic Event Display */}
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center p-8 sm:p-12 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 max-w-2xl mx-auto space-y-5"
          >
            <div className="p-4 bg-[#C8102E] text-white">
              <Coffee size={40} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black font-heading uppercase text-slate-950 dark:text-white tracking-tight">
                Belum Ada Event Terdekat 🎯
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed max-w-lg mx-auto font-medium">
                Panitia sedang menyiapkan agenda kegiatan menarik berikutnya. Pantau terus kanal resmi HIMSI UG!
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://instagram.com/himsi.ug"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8102E] dark:bg-[#E31B3B] text-white font-black font-mono text-xs uppercase tracking-wider hover:bg-slate-950 dark:hover:bg-white dark:hover:text-slate-950 transition-colors"
              >
                Pantau Instagram @himsi.ug <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event, i) => {
              return (
                <motion.article
                  key={event.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="group bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-950 dark:border-white/20 flex flex-col justify-between gap-6 p-7 hover:shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] transition-all duration-200"
                >
                  <div className="space-y-5">
                    {/* Index & Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-heading font-black text-3xl text-[#C8102E] dark:text-[#E31B3B]">
                          0{i + 1}
                        </span>
                        <span className="px-3 py-1 bg-slate-950 text-white dark:bg-slate-800 text-xs font-black font-mono tracking-widest uppercase border border-slate-950 dark:border-white/20">
                          {event.kategori}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-[#C8102E] dark:bg-[#E31B3B] text-white text-xs font-black font-mono tracking-widest uppercase border border-slate-950 dark:border-white/20">
                        {event.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black font-heading uppercase text-slate-950 dark:text-white leading-tight group-hover:text-[#C8102E] dark:group-hover:text-[#E31B3B] transition-colors">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed line-clamp-2 font-medium">
                      {event.deskripsi}
                    </p>

                    {/* Meta info */}
                    <div className="flex flex-col gap-2.5 text-xs text-slate-800 dark:text-slate-200 pt-4 border-t border-slate-950/20 dark:border-white/20">
                      <div className="flex items-center gap-2 font-mono font-bold">
                        <Calendar size={14} className="text-[#C8102E] dark:text-[#E31B3B] flex-shrink-0" />
                        <span>{event.tanggal}</span>
                        <span className="text-slate-400">•</span>
                        <Clock size={14} className="text-[#C8102E] dark:text-[#E31B3B] flex-shrink-0" />
                        <span>{event.waktu}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono font-bold">
                        <MapPin size={14} className="text-[#C8102E] dark:text-[#E31B3B] flex-shrink-0" />
                        <span>{event.lokasi}</span>
                        <span className="text-slate-400">•</span>
                        {event.isOnline ? <Wifi size={14} className="text-[#C8102E] dark:text-[#E31B3B]" /> : <WifiOff size={14} className="text-[#C8102E] dark:text-[#E31B3B]" />}
                        <span>{event.isOnline ? "ONLINE" : "OFFLINE"}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  {event.linkPendaftaran && (
                    <a
                      href={event.linkPendaftaran}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center justify-center gap-2 py-3 px-4 font-black font-mono text-xs uppercase tracking-wider border-2 border-slate-950 dark:border-white/20 transition-colors ${
                        event.status === "Pendaftaran Dibuka"
                          ? "bg-[#C8102E] dark:bg-[#E31B3B] text-white hover:bg-slate-950 dark:hover:bg-white dark:hover:text-slate-950"
                          : "bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:bg-[#C8102E] dark:hover:bg-[#E31B3B] dark:hover:text-white"
                      }`}
                      aria-label={`${event.status === "Pendaftaran Dibuka" ? "Daftar" : "Detail"} ${event.title}`}
                    >
                      {event.status === "Pendaftaran Dibuka" ? "DAFTAR SEKARANG →" : "LIHAT DETAIL →"}
                    </a>
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
