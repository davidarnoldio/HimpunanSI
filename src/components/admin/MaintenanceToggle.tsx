"use client";

import { useSharedStore } from "@/lib/sharedStore";
import { ShieldAlert, ShieldCheck, RefreshCw } from "lucide-react";
import { useState } from "react";

export function MaintenanceToggle() {
  const { isMaintenance, setMaintenance, mounted } = useSharedStore();
  const [loading, setLoading] = useState(false);

  if (!mounted) return null;

  const handleToggle = () => {
    setLoading(true);
    const nextState = !isMaintenance;
    setMaintenance(nextState);
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`p-1.5 rounded-xl shrink-0 flex items-center justify-center ${
              isMaintenance
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
            }`}
          >
            {isMaintenance ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 truncate">
              Maintenance
            </span>
            <span
              className={`w-fit px-1.5 py-0.5 rounded-md text-[9px] font-extrabold font-mono uppercase tracking-wider ${
                isMaintenance
                  ? "bg-amber-500 text-white animate-pulse"
                  : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {isMaintenance ? "Aktif" : "Non-Aktif"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isMaintenance ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
          }`}
          role="switch"
          aria-checked={isMaintenance}
          title={isMaintenance ? "Matikan Maintenance Mode" : "Aktifkan Maintenance Mode"}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isMaintenance ? "translate-x-4" : "translate-x-0"
            } flex items-center justify-center`}
          >
            {loading && <RefreshCw size={9} className="animate-spin text-slate-600" />}
          </span>
        </button>
      </div>

      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
        {isMaintenance
          ? "Public web dialihkan ke halaman maintenance"
          : "Public web dapat diakses normal oleh pengunjung"}
      </p>
    </div>
  );
}
