"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, ChevronDown } from "lucide-react";
import type { HeroContentData } from "@/data/adminMockData";
import { INITIAL_HERO_CONTENT } from "@/data/adminMockData";
import { FlipWords } from "@/components/ui/FlipWords";
import { HackerMatrixBackground } from "@/components/ui/HackerMatrixBackground";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

function FloatingOrb({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[90px] pointer-events-none ${className}`}
      animate={{ y: [0, -22, 0], opacity: [0.35, 0.7, 0.35] }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      variants={itemVariants}
      className="liquid-glass-card flex flex-col items-center sm:items-start text-center sm:text-left justify-center gap-0.5 px-6 py-4.5 w-full sm:w-48 min-w-[170px] max-w-[220px] shrink-0 flex-grow-0 rounded-2xl bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800 shadow-sm backdrop-blur-md"
    >
      <span className="text-2xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500 dark:from-red-500 dark:to-rose-400 tabular-nums">
        {value}
      </span>
      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-tight">
        {label}
      </span>
    </motion.div>
  );
}

export function HeroSection({ heroContent }: { heroContent?: HeroContentData }) {
  const content = heroContent || INITIAL_HERO_CONTENT;

  const badgeWords =
    content.badgeDynamicWords && content.badgeDynamicWords.length > 0
      ? content.badgeDynamicWords
      : INITIAL_HERO_CONTENT.badgeDynamicWords;

  const headlineWords =
    content.headlineDynamicWords && content.headlineDynamicWords.length > 0
      ? content.headlineDynamicWords
      : INITIAL_HERO_CONTENT.headlineDynamicWords;

  const descriptionWords =
    content.descriptionDynamicWords && content.descriptionDynamicWords.length > 0
      ? content.descriptionDynamicWords
      : INITIAL_HERO_CONTENT.descriptionDynamicWords;

  const statsList =
    content.stats && content.stats.length > 0 ? content.stats : INITIAL_HERO_CONTENT.stats;

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-slate-50 dark:bg-[#0a0e1f] text-slate-900 dark:text-slate-100 pt-20 pb-16 transition-colors duration-300 scroll-mt-28"
      aria-label="Beranda HIMSI UG"
    >
      {/* ── Hacker Matrix Background Teks Kode (Samar & Eleggan) ── */}
      <HackerMatrixBackground />

      {/* ── Radial Mask Center Fade (Optimasi Keterbacaan Teks Utama) ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(248,250,252,0.92)_0%,rgba(248,250,252,0.6)_50%,transparent_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(10,14,31,0.92)_0%,rgba(10,14,31,0.6)_50%,transparent_100%)]" />

        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <FloatingOrb className="w-[500px] h-[500px] bg-red-500/12 dark:bg-red-700/15 -top-40 -left-20" delay={0} />
        <FloatingOrb className="w-[400px] h-[400px] bg-rose-500/10 dark:bg-rose-800/12 top-1/3 -right-28" delay={2} />
        <FloatingOrb className="w-[300px] h-[300px] bg-red-600/12 dark:bg-red-900/15 bottom-0 left-1/3" delay={4} />
      </div>

      {/* ── FORMAT CENTERED LAYOUT (Satu Kolom Terpusat & Simetris) ── */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 z-10 flex flex-col items-center text-center justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center gap-7 max-w-4xl"
        >
          {/* Top Pill Badge (Live Text) */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-xs sm:text-sm font-semibold tracking-wide font-mono backdrop-blur shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 animate-pulse" />
              {content.badgePrefix || "Himpunan Mahasiswa "}
              <FlipWords words={badgeWords} duration={2000} className="font-bold font-mono text-red-600 dark:text-red-400" />
            </span>
          </motion.div>

          {/* Headline Centered (Live Text FlipWords) */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-black font-heading text-slate-900 dark:text-slate-100 leading-[1.12] tracking-tight max-w-4xl"
          >
            {content.headlinePrefix || "Wadah "}
            <FlipWords
              words={headlineWords}
              duration={2000}
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-600 dark:from-red-500 dark:via-rose-400 dark:to-red-500"
            />{" "}
            {content.headlineSuffix}
          </motion.h1>

          {/* Subheadline Copywriting (Live Text) */}
          <motion.p
            variants={itemVariants}
            className="text-slate-600 dark:text-slate-400 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed font-medium"
          >
            {content.descriptionBefore || "HIMSI UG adalah gerakan mahasiswa yang "}
            <FlipWords
              words={descriptionWords}
              duration={2000}
              className="font-bold text-slate-900 dark:text-slate-100 underline decoration-red-500/60"
            />
            {content.descriptionAfter}
          </motion.p>

          {/* CTA Action Buttons (Centered Row) */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
            <motion.a
              href="/#event"
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(220,38,38,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-bold font-mono text-sm sm:text-base shadow-xl shadow-red-900/20 dark:shadow-red-900/30 transition-colors duration-200"
            >
              Jelajahi Event & Proker
              <ArrowRight size={18} />
            </motion.a>

            <motion.a
              href="/merchandise"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold font-mono text-sm sm:text-base border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200"
            >
              <ShoppingBag size={18} className="text-red-500" />
              Merchandise Resmi
            </motion.a>
          </motion.div>

          {/* Centered Statistics Bar */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="pt-6 flex flex-wrap justify-center items-center gap-4 w-full max-w-4xl mx-auto"
          >
            {statsList.map((stat, idx) => (
              <StatCard key={idx} value={stat.value} label={stat.label} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600 text-xs font-semibold font-mono">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={18} />
        </motion.div>
      </div>
    </section>
  );
}
