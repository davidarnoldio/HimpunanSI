"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface SmoothScrollingProps {
  children: React.ReactNode;
}

export function SmoothScrolling({ children }: SmoothScrollingProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Skip Lenis smooth scroll on mobile touch devices to eliminate CPU main-thread TBT
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) return;

    // Initialize Lenis with fast, responsive smooth scroll settings
    const lenis = new Lenis({
      lerp: 0.12,
      duration: 0.8,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    // Expose lenis to window object for smooth navbar anchor navigation without jitter
    (window as unknown as Record<string, unknown>).lenis = lenis;

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      delete (window as unknown as Record<string, unknown>).lenis;
      lenis.destroy();
    };
  }, []);

  // Synchronous pre-paint scroll positioning on route changes to eliminate visual flash
  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const pendingTarget = sessionStorage.getItem("HIMASI_pending_scroll");
    const urlHash = window.location.hash ? window.location.hash.replace("#", "") : "";
    const targetId = pendingTarget || urlHash;

    if (!targetId || targetId === "beranda") {
      if (pendingTarget === "beranda") {
        sessionStorage.removeItem("HIMASI_pending_scroll");
      }
      if (pathname === "/") {
        const windowLenis = (window as unknown as Record<string, { scrollTo: (y: number, opts?: { immediate?: boolean }) => void }>).lenis;
        if (windowLenis && typeof windowLenis.scrollTo === "function") {
          windowLenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      }
      return;
    }

    // Target is a specific section like "event", "kabinet", "divisi"
    let attempts = 0;
    const maxAttempts = 20;

    const performSectionScroll = () => {
      const targetEl = document.getElementById(targetId);
      const windowLenis = (
        window as unknown as Record<
          string,
          { scrollTo: (target: number | HTMLElement, opts?: { immediate?: boolean }) => void }
        >
      ).lenis;

      if (targetEl) {
        const yOffset = -80;
        const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
        if (windowLenis && typeof windowLenis.scrollTo === "function") {
          windowLenis.scrollTo(y, { immediate: true });
        } else {
          window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
        }

        attempts++;
        // Repeat scroll 6 times over 300ms to override Next.js App Router scroll restoration to (0,0)
        if (attempts < 6) {
          setTimeout(performSectionScroll, 40);
        } else {
          sessionStorage.removeItem("HIMASI_pending_scroll");
        }
        return;
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(performSectionScroll, 30);
      } else {
        sessionStorage.removeItem("HIMASI_pending_scroll");
      }
    };

    // Execute immediately on layout effect before browser paint to prevent flash
    performSectionScroll();
  }, [pathname]);

  return <>{children}</>;
}
