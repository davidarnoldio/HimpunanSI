import { Sparkles } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-950 dark:border-white/20 shadow-[4px_4px_0px_0px_rgba(200,16,46,1)] flex items-center gap-3">
        <span className="w-5 h-5 border-2 border-[#C8102E] dark:border-[#E31B3B] border-t-transparent animate-spin shrink-0" />
        <span className="text-xs font-mono font-black uppercase tracking-widest text-slate-950 dark:text-white flex items-center gap-1.5">
          <Sparkles size={14} className="text-[#C8102E] dark:text-[#E31B3B] animate-pulse" />
          MEMUAT MODUL CMS...
        </span>
      </div>
    </div>
  );
}
