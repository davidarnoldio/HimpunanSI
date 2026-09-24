"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, ChevronDown } from "lucide-react";
import type { HeroContentData } from "@/data/adminMockData";
import { INITIAL_HERO_CONTENT } from "@/data/adminMockData";
import { FlipWords } from "@/components/ui/FlipWords";
import { HackerMatrixBackground } from "@/components/ui/HackerMatrixBackground";
import { useSharedStore } from "@/lib/sharedStore";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export function HeroSection({ heroContent }: { heroContent?: HeroContentData }) {
  const { heroContent: sharedHero } = useSharedStore();
  const content = sharedHero || heroContent || INITIAL_HERO_CONTENT;

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
      className="relative min-h-screen flex flex-col justify-center items-center bg-white dark:bg-black text-slate-950 dark:text-white pt-28 pb-16 transition-colors duration-300 border-b-2 border-slate-950 dark:border-white/20 overflow-hidden"
      aria-label="Beranda HIMASI UG"
    >
      <HackerMatrixBackground />

      {/* ── ASYMMETRIC 12-COLUMN EDITORIAL HERO LAYOUT ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column (7 cols): Oversized Headline & Copywriting */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start text-left gap-6"
        >
          {/* Tagline Pill */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#c8102e] dark:bg-[#e31b3b] text-white text-xs font-bold font-mono uppercase tracking-widest border border-slate-950 dark:border-transparent">
              <span className="w-2 h-2 rounded-none bg-white animate-pulse" />
              {content.badgePrefix || "HIMPUNAN MAHASISWA "}
              <FlipWords words={badgeWords} duration={2000} className="font-bold font-mono text-white" />
            </span>
          </motion.div>

          {/* Oversized Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black font-heading leading-[0.98] tracking-tighter text-slate-950 dark:text-white uppercase"
          >
            {content.headlinePrefix || "WADAH "}
            <FlipWords
              words={headlineWords}
              duration={2000}
              className="text-[#c8102e] dark:text-[#e31b3b]"
            />{" "}
            <span className="block">{content.headlineSuffix || "SISTEM INFORMASI."}</span>
          </motion.h1>

          {/* Subheadline Copywriting */}
          <motion.p
            variants={itemVariants}
            className="text-slate-700 dark:text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed font-medium"
          >
            {content.descriptionBefore || "HIMASI UG adalah gerakan mahasiswa yang "}
            <FlipWords
              words={descriptionWords}
              duration={2000}
              className="font-bold text-slate-950 dark:text-white underline decoration-[#c8102e] dark:decoration-[#e31b3b]"
            />
            {content.descriptionAfter}
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-2">
            <motion.a
              href="/#event"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-[#c8102e] dark:bg-[#e31b3b] hover:bg-[#a00c24] dark:hover:bg-[#ff2d4d] text-white font-bold font-mono text-xs uppercase tracking-wider border-2 border-slate-950 dark:border-transparent transition-all"
            >
              JELAJAHI EVENT & PROKER
              <ArrowRight size={16} />
            </motion.a>

            <motion.a
              href="/merchandise"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 text-slate-950 dark:text-white font-bold font-mono text-xs uppercase tracking-wider border-2 border-slate-950 dark:border-white/20 transition-all"
            >
              <ShoppingBag size={16} />
              MERCHANDISE RESMI
            </motion.a>
          </motion.div>

          {/* Statistics Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full"
          >
            {statsList.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-slate-900/90 border-2 border-slate-950 dark:border-white/20 flex flex-col items-start gap-1"
              >
                <span className="font-heading font-black text-2xl sm:text-3xl text-[#c8102e] dark:text-[#e31b3b]">
                  {stat.value}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column (5 cols): Editorial Photography Visual Anchor */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-5 relative flex items-center justify-center"
        >
          <div className="relative w-full aspect-[4/3] sm:aspect-[4/3.2] border-2 border-slate-950 dark:border-white/30 bg-slate-950 overflow-hidden shadow-[10px_10px_0px_0px_rgba(200,16,46,1)] dark:shadow-[10px_10px_0px_0px_rgba(227,27,59,0.85)] transition-all duration-300 group">
            {/* Top HMSI Red Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#C8102E] dark:bg-[#E31B3B] z-20" />

            {/* Editorial Photograph */}
            {(() => {
              const rawUrl = content.heroImageUrl;
              const isDefault = !rawUrl || rawUrl === "/hero-editorial.jpg" || rawUrl === "/hero-editorial.webp";
              if (isDefault) {
                return (
                  <picture className="absolute inset-0 w-full h-full">
                    <source srcSet="/hero-editorial-mobile.webp" media="(max-width: 640px)" type="image/webp" />
                    <source srcSet="/hero-editorial.webp" type="image/webp" />
                    <img
                      src="/hero-editorial.webp"
                      alt="Indonesian Information Systems Students Collaborating — HIMASI UG"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      fetchPriority="high"
                      decoding="async"
                      width={800}
                      height={600}
                    />
                  </picture>
                );
              }
              return (
                <img
                  src={rawUrl}
                  alt="Indonesian Information Systems Students Collaborating — HIMASI UG"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  fetchPriority="high"
                  decoding="async"
                  width={800}
                  height={600}
                />
              );
            })()}

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            {/* Editorial Tag Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10 gap-2">
              <div className="space-y-0.5">
                <div className="font-heading font-black text-xl text-white tracking-tight flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#C8102E] dark:bg-[#E31B3B] inline-block" />
                  INFORMATION SYSTEMS
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-300 font-mono font-bold">
                  STUDENT COMMUNITY • HIMASI UG
                </div>
              </div>
              <span className="px-2.5 py-1 bg-[#C8102E] text-white font-mono font-bold text-[10px] uppercase tracking-widest border border-slate-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                EDITORIAL
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-mono font-bold uppercase tracking-widest">
        <span>SCROLL DOWN</span>
        <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={14} />
        </motion.div>
      </div>
    </section>
  );
}
