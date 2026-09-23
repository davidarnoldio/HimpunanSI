"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "@/data/landingPage";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const emptySubscribe = () => () => { };

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
  const router = useRouter();

  useEffect(() => {
    // Prefetch home page so subpage navigation to / is 100% instant from memory
    router.prefetch("/");
  }, [router]);

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

    const sections = ["beranda", "kabinet", "divisi", "legalitas", "event"];
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

          const windowLenis = (window as unknown as Record<string, { scrollTo: (y: number, opts?: { immediate?: boolean }) => void }>).lenis;
          if (windowLenis && typeof windowLenis.scrollTo === "function") {
            windowLenis.scrollTo(y, { immediate: true });
          } else {
            window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
          }
        }
        setIsOpen(false);
      } else {
        e.preventDefault();
        if (typeof window !== "undefined") {
          sessionStorage.setItem("HIMASI_pending_scroll", targetId);
        }
        setIsOpen(false);
        router.push("/");
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
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 border-b ${scrolled
          ? "bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-slate-950 dark:border-white/20 shadow-sm"
          : "bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm border-slate-200 dark:border-white/10"
        }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left: HIMASI Student Community Branding */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, "/#beranda")}
            className="flex items-center gap-3 group"
            aria-label="HIMASI UG — Kembali ke beranda"
          >
            <img
              src="/himsigundar.webp"
              alt="Logo HIMASI UG"
              className="h-8 sm:h-9 w-auto object-contain drop-shadow-md"
            />
            <div className="flex flex-col leading-tight hidden sm:flex">
              <span className="text-slate-950 dark:text-white font-black font-heading text-xs sm:text-sm tracking-tight uppercase group-hover:text-[#c8102e] dark:group-hover:text-[#e31b3b] transition-colors">
                HIMPUNAN MAHASISWA
              </span>
              <span className="text-[#c8102e] dark:text-[#e31b3b] text-[10px] sm:text-[11px] font-mono font-extrabold tracking-wider uppercase">
                SISTEM INFORMASI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 border border-slate-950/20 dark:border-white/20 p-1 bg-slate-50 dark:bg-black rounded-sm" aria-label="Navigasi utama">
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
                  className={`px-4 py-1.5 text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200 ${isActive
                      ? "bg-[#c8102e] dark:bg-[#e31b3b] text-white"
                      : "text-slate-950 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right: Theme Toggle + Gunadarma Logo & Branding */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <div className="flex items-center gap-2.5">
              <img
                src="/logogundar.webp"
                alt="Logo Universitas Gunadarma"
                className="h-8 sm:h-9 w-auto object-contain drop-shadow-md"
              />
              <div className="flex flex-col leading-tight hidden lg:flex">
                <span className="text-slate-950 dark:text-white font-black font-heading text-xs sm:text-sm tracking-tight uppercase">
                  UNIVERSITAS
                </span>
                <span className="text-[#c8102e] dark:text-[#e31b3b] text-[10px] sm:text-[11px] font-mono font-extrabold tracking-wider uppercase">
                  GUNADARMA
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border-2 border-slate-950 dark:border-white text-slate-950 dark:text-white bg-slate-100 dark:bg-slate-900 transition-all"
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
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
                      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold font-mono transition-all duration-200 ${isActive
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
