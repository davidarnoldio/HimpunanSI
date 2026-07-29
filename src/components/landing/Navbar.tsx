"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/data/landingPage";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandLogo } from "@/components/ui/BrandLogo";

const emptySubscribe = () => () => {};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [activeSection, setActiveSection] = useState("beranda");
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll(); // initial check
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── SCROLL SPY INTERSECTION OBSERVER ──
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["beranda", "kabinet", "divisi", "event"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-50/85 dark:bg-[#0a0e1f]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-md dark:shadow-xl dark:shadow-black/30"
          : "bg-slate-50/70 dark:bg-[#0a0e1f]/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[70px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="HIMSI UG — Kembali ke beranda"
          >
            <BrandLogo size="sm" />
            <div className="flex flex-col leading-none">
              <span className="text-slate-900 dark:text-slate-100 font-bold font-heading text-sm tracking-wide">
                HIMSI UG
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] font-mono font-medium tracking-wider">
                Sistem Informasi
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
            {NAV_LINKS.map((link) => {
              // Separate page route check vs Anchor section Scroll Spy check
              let isActive = false;

              if (mounted) {
                if (link.href.startsWith("/#")) {
                  const sectionId = link.href.replace("/#", "");
                  isActive = pathname === "/" && activeSection === sectionId;
                } else {
                  isActive = pathname === link.href;
                }
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold shadow-sm"
                      : "text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/aspirasi"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold font-mono shadow-lg shadow-red-900/20 dark:shadow-red-900/30 transition-colors duration-200"
              aria-label="Sampaikan aspirasi mahasiswa"
            >
              Aspirasi <ExternalLink size={13} />
            </Link>
          </div>

          {/* Mobile Actions (ThemeToggle + Hamburger) */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden border-t border-slate-200/80 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl"
          >
            <nav className="px-4 py-4 flex flex-col gap-1" aria-label="Navigasi mobile">
              {NAV_LINKS.map((link, i) => {
                let isActive = false;
                if (mounted) {
                  if (link.href.startsWith("/#")) {
                    const sectionId = link.href.replace("/#", "");
                    isActive = pathname === "/" && activeSection === sectionId;
                  } else {
                    isActive = pathname === link.href;
                  }
                }

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.22 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
                      }`}
                    >
                      {link.label}
                      <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.04 }}
                className="pt-2 border-t border-slate-200/80 dark:border-slate-800/60 mt-2"
              >
                <Link
                  href="/aspirasi"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold shadow-md shadow-red-900/20"
                >
                  Aspirasi Mahasiswa <ExternalLink size={13} />
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
