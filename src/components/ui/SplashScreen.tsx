"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { HackerMatrixBackground } from "@/components/ui/HackerMatrixBackground";

const emptySubscribe = () => () => {};

export function SplashScreen() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [dismissed, setDismissed] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const alreadySeen = sessionStorage.getItem("himsi_splash_shown") === "true";
    if (!alreadySeen) {
      document.body.style.overflow = "hidden";

      // Progress animation counter
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      const timer = setTimeout(() => {
        sessionStorage.setItem("himsi_splash_shown", "true");
        setDismissed(true);
        document.body.style.overflow = "";
      }, 2400);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, []);

  const hasSeenSplash =
    isMounted && typeof window !== "undefined"
      ? sessionStorage.getItem("himsi_splash_shown") === "true"
      : true;

  const isVisible = isMounted && !hasSeenSplash && !dismissed;

  if (!isMounted) {
    return <div className="fixed inset-0 z-[9999] bg-black" />;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-black text-white p-6 sm:p-12 overflow-hidden select-none"
        >
          {/* Background Hacker Matrix & Grid Ticks */}
          <HackerMatrixBackground />

          <div className="absolute inset-0 bg-radial from-red-600/10 via-transparent to-transparent pointer-events-none" />

          {/* Top Bar Tech Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl flex items-center justify-between z-10 font-mono text-xs text-slate-400 border-b border-white/10 pb-4"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E31B3B] animate-pulse" />
              <span className="font-bold text-white uppercase tracking-wider">
                SYS // HIMSI_UG_PORTAL
              </span>
            </div>
            <span className="hidden sm:inline font-mono tracking-widest text-slate-500">
              STATUS: INITIALIZING_CORE_MODULES
            </span>
          </motion.div>

          {/* Main Hero Card Container */}
          <div className="relative z-10 max-w-3xl w-full text-center flex flex-col items-center justify-center my-auto space-y-8">
            {/* Brutalist Twin Logo Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="p-5 sm:p-7 bg-slate-950 border-2 border-white/20 shadow-[8px_8px_0px_0px_rgba(227,27,59,1)]"
            >
              <BrandLogo size="lg" />
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C8102E] text-white text-xs font-mono font-bold uppercase tracking-[0.25em] border border-white/20">
                <span className="w-1.5 h-1.5 bg-white animate-ping" />
                SELAMAT DATANG
              </span>
            </motion.div>

            {/* Title Copy */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="space-y-3"
            >
              <span className="block text-xs sm:text-sm font-mono font-bold text-slate-400 uppercase tracking-[0.3em]">
                [ THE OFFICIAL WEBSITE OF ]
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tighter uppercase leading-[1.05] text-white">
                HIMPUNAN <span className="text-[#E31B3B]">SISTEM INFORMASI</span>
              </h1>
              <h2 className="text-lg sm:text-2xl font-black font-heading tracking-tight uppercase text-slate-300">
                UNIVERSITAS GUNADARMA
              </h2>
            </motion.div>

            {/* Brutalist Loading Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="w-full max-w-md space-y-2 pt-2"
            >
              <div className="flex items-center justify-between font-mono text-xs text-slate-400 font-bold uppercase">
                <span>LOADING CORE ASSETS</span>
                <span className="text-[#E31B3B]">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-900 border-2 border-white/30 p-0.5 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                  className="h-full bg-[#E31B3B]"
                />
              </div>
            </motion.div>
          </div>

          {/* Bottom Footer Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="w-full max-w-5xl flex items-center justify-between z-10 font-mono text-[11px] text-slate-500 border-t border-white/10 pt-4"
          >
            <span>KABINET FORMASI • PERIODE 2025/2026</span>
            <span>VERIFIED PORTAL • HIMSI UG</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

