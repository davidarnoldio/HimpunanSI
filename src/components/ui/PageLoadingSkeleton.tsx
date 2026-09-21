"use client";

import { Sparkles } from "lucide-react";

export function PageLoadingSkeleton({ title = "MEMUAT HALAMAN..." }: { title?: string }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-950 dark:text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(200,16,46,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-md w-full text-center">
        {/* Brutalist Spinner Box */}
        <div className="p-4 bg-slate-900 border-2 border-slate-950 dark:border-white/20 shadow-[6px_6px_0px_0px_rgba(200,16,46,1)] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#C8102E] dark:border-[#E31B3B] border-t-transparent animate-spin" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-[10px] font-mono font-bold tracking-widest uppercase">
            <Sparkles size={12} className="animate-pulse" />
            HIMASI UG PORTAL
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight uppercase text-slate-950 dark:text-white">
            {title}
          </h2>
          <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">
            SINKRONISASI DATA SERVER...
          </p>
        </div>

        {/* Loading Progress Bar Skeleton */}
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-900 border border-slate-950 dark:border-white/20 overflow-hidden">
          <div className="h-full bg-[#C8102E] dark:bg-[#E31B3B] w-2/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
