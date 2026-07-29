"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/ui/BrandLogo";

const emptySubscribe = () => () => {};

export function SplashScreen() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [dismissed, setDismissed] = useState<boolean>(false);

  const hasSeenSplash =
    typeof window !== "undefined" &&
    sessionStorage.getItem("himsi_splash_shown") === "true";

  const isVisible = isMounted && !hasSeenSplash && !dismissed;

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!sessionStorage.getItem("himsi_splash_shown")) {
      document.body.style.overflow = "hidden";

      const timer = setTimeout(() => {
        sessionStorage.setItem("himsi_splash_shown", "true");
        setDismissed(true);
        document.body.style.overflow = "";
      }, 3000);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    }
  }, []);

  // Render light overlay placeholder before JS hydration to eliminate white flash
  if (!isMounted) {
    return <div className="fixed inset-0 z-[9999] bg-slate-50" />;
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
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 text-slate-900 overflow-hidden select-none"
        >
          {/* Glowing Background Radial Effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-400/15 rounded-full blur-[90px] pointer-events-none" />

          {/* Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.4) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 max-w-2xl px-6 text-center flex flex-col items-center">
            {/* Animated Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mb-8 p-3.5 rounded-2xl bg-white/90 border border-slate-200 shadow-xl backdrop-blur-md"
            >
              <BrandLogo size="lg" />
            </motion.div>

            {/* Subtitle Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider text-red-600 bg-red-50 border border-red-200/60 uppercase mb-4 shadow-inner"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              Selamat Datang
            </motion.div>

            {/* Main Welcome Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 leading-relaxed md:leading-snug"
            >
              The Official Website of Himpunan Sistem Informasi Universitas Gunadarma
            </motion.h1>

            {/* Subtle Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-48 h-1 bg-slate-200 rounded-full mt-8 overflow-hidden relative"
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.4, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
