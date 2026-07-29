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
  hidden: { opacity: 0, y: 28 },
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
      animate={{ y: [0, -22, 0], opacity: [0.4, 0.8, 0.4] }}
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
      className="liquid-glass-card flex flex-col items-center sm:items-start text-center sm:text-left justify-center gap-0.5 px-6 py-4.5 w-full sm:w-48 min-w-[170px] max-w-[220px] shrink-0 flex-grow-0"
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

  const badgeWords = content.badgeDynamicWords && content.badgeDynamicWords.length > 0
    ? content.badgeDynamicWords
    : INITIAL_HERO_CONTENT.badgeDynamicWords;

  const headlineWords = content.headlineDynamicWords && content.headlineDynamicWords.length > 0
    ? content.headlineDynamicWords
    : INITIAL_HERO_CONTENT.headlineDynamicWords;

  const descriptionWords = content.descriptionDynamicWords && content.descriptionDynamicWords.length > 0
    ? content.descriptionDynamicWords
    : INITIAL_HERO_CONTENT.descriptionDynamicWords;

  const statsList = content.stats && content.stats.length > 0
    ? content.stats
    : INITIAL_HERO_CONTENT.stats;

  return (
    <section
      id="beranda"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-slate-50 dark:bg-[#0a0e1f] text-slate-900 dark:text-slate-100 pt-20 transition-colors duration-300 scroll-mt-28"
      aria-label="Beranda HIMSI UG"
    >
      {/* ── Hacker Matrix Background ── */}
      <HackerMatrixBackground />

      {/* ── Ambient Background ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(150,0,0,0.15),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <FloatingOrb className="w-[500px] h-[500px] bg-red-500/15 dark:bg-red-700/20 -top-48 -left-24" delay={0} />
        <FloatingOrb className="w-[400px] h-[400px] bg-rose-500/10 dark:bg-rose-800/15 top-1/3 -right-32" delay={2} />
        <FloatingOrb className="w-[300px] h-[300px] bg-red-600/15 dark:bg-red-900/20 bottom-0 left-1/3" delay={4} />
      </div>

      {/* ── Main Content ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center gap-7"
        >
          {/* Badge with Live Text */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-400 text-xs sm:text-sm font-semibold tracking-wide font-mono backdrop-blur shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 animate-pulse" />
              {content.badgePrefix || "Himpunan Mahasiswa "}
              <FlipWords words={badgeWords} duration={2000} className="font-bold font-mono text-red-600 dark:text-red-400" />
            </span>
          </motion.div>

          {/* Headline with Fast Smooth Live Text */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black font-heading text-slate-900 dark:text-slate-100 leading-[1.1] tracking-tight max-w-5xl"
          >
            {content.headlinePrefix || "Wadah "}
            <FlipWords
              words={headlineWords}
              duration={2000}
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-600 dark:from-red-500 dark:via-rose-400 dark:to-red-500"
            />{" "}
            {content.headlineSuffix}
          </motion.h1>

          {/* Subheadline with Live Text */}
          <motion.p
            variants={itemVariants}
            className="text-slate-600 dark:text-slate-400 text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed font-medium"
          >
            {content.descriptionBefore || "HIMSI UG adalah gerakan mahasiswa yang "}
            <FlipWords words={descriptionWords} duration={2000} className="font-bold text-slate-900 dark:text-slate-100 underline decoration-red-500/60" />
            {content.descriptionAfter}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
            <motion.a
              href="/#event"
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(150,0,0,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-rose-600 hover:from-red-600 hover:to-rose-500 text-white font-bold font-mono text-sm sm:text-base shadow-xl shadow-red-900/20 dark:shadow-red-900/30 transition-colors duration-200"
            >
              Jelajahi Event & Proker
              <ArrowRight size={18} />
            </motion.a>

            <motion.a
              href="/merchandise"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold font-mono text-sm sm:text-base border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-200"
            >
              <ShoppingBag size={18} className="text-red-500" />
              Merchandise Resmi
            </motion.a>
          </motion.div>

          {/* Stats Bar */}
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 dark:text-slate-600 text-xs font-semibold font-mono">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={18} />
        </motion.div>
      </div>
    </section>
  );
}
