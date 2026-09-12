"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
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

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── SCROLL SPY INTERSECTION OBSERVER ──
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["beranda", "kabinet", "divisi", "event"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -40% 0px",
      threshold: 0.1,
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

  // Smooth scroll handler for anchor links (menggunakan Lenis scrollTo untuk mencegah shock scroll / auto-scroll liar)
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      if (pathname === "/") {
        e.preventDefault();
        const el = document.getElementById(targetId);
        if (el) {
          setActiveSection(targetId);
          const yOffset = -80;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

          const windowLenis = (window as unknown as Record<string, { scrollTo: (y: number, opts?: { duration: number }) => void }>).lenis;
          if (windowLenis && typeof windowLenis.scrollTo === "function") {
            windowLenis.scrollTo(y, { duration: 1.2 });
          } else {
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }
        setIsOpen(false);
      }
    }
  };

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
          ? "bg-slate-50/85 dark:bg-[#0a0e1f]/90 backdrop-blur-2xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-lg dark:shadow-2xl dark:shadow-black/40"
          : "bg-slate-50/60 dark:bg-[#0a0e1f]/60 backdrop-blur-xl border-b border-slate-200/40 dark:border-slate-800/40"
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="HIMSI UG — Kembali ke beranda"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 opacity-30 group-hover:opacity-100 blur transition duration-300" />
              <BrandLogo size="sm" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-slate-900 dark:text-slate-100 font-extrabold font-heading text-base tracking-tight group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                HIMSI UG
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] font-mono font-semibold tracking-wider">
                SI • GUNADARMA
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md" aria-label="Navigasi utama">
            {NAV_LINKS.map((link) => {
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
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-900/30"
                      : "text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/70"
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

            <div className="flex items-center pl-1 border-l border-slate-200 dark:border-slate-800/80">
              <img
                src="/logogundar.png"
                alt="Logo Universitas Gunadarma"
                className="h-9 sm:h-10 w-auto object-contain transition-transform hover:scale-110 duration-200"
              />
            </div>
          </div>

          {/* Mobile Actions (Gunadarma Logo + ThemeToggle + Hamburger) */}
          <div className="flex items-center gap-2 md:hidden">
            <img
              src="/logogundar.png"
              alt="Logo Gunadarma"
              className="h-7 w-auto object-contain mr-1"
            />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
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
            className="md:hidden overflow-hidden border-t border-slate-200/80 dark:border-slate-800/60 bg-white/95 dark:bg-[#0a0e1f]/95 backdrop-blur-2xl"
          >
            <nav className="px-4 py-4 flex flex-col gap-1.5" aria-label="Navigasi mobile">
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
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold font-mono transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md"
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
                className="pt-3 border-t border-slate-200/80 dark:border-slate-800/60 mt-2 flex items-center justify-center gap-2.5 py-2"
              >
                <img
                  src="/logogundar.png"
                  alt="Logo Universitas Gunadarma"
                  className="h-8 w-auto object-contain"
                />
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 font-heading">
                  Universitas Gunadarma
                </span>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
