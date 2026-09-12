"use client";

import { useState } from "react";

export function BrandLogo({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const [HIMASIError, setHIMASIError] = useState(false);
  const [gundarError, setGundarError] = useState(false);

  const dimMap = {
    sm: "h-7 sm:h-8",
    md: "h-8 sm:h-9",
    lg: "h-10 sm:h-12",
  };

  const currentHeight = dimMap[size] || dimMap.md;

  return (
    <div className={`flex items-center gap-2 shrink-0 ${className}`}>
      {/* HIMASI Logo */}
      {!HIMASIError ? (
        <div className={`relative ${currentHeight} w-auto flex items-center justify-center`}>
          <img
            src="/himsigundar.png"
            alt="Logo HIMASI UG"
            className={`${currentHeight} w-auto object-contain drop-shadow-md`}
            onError={() => setHIMASIError(true)}
          />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-none bg-[#C8102E] text-white font-black font-heading text-xs flex items-center justify-center border border-slate-950">
          HI
        </div>
      )}

      {/* Divider */}
      <span className="text-slate-400 dark:text-slate-600 font-mono text-xs font-bold">•</span>

      {/* Gunadarma Logo */}
      {!gundarError ? (
        <div className={`relative ${currentHeight} w-auto flex items-center justify-center`}>
          <img
            src="/logogundar.png"
            alt="Logo Universitas Gunadarma"
            className={`${currentHeight} w-auto object-contain drop-shadow-md`}
            onError={() => setGundarError(true)}
          />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-none bg-amber-500 text-slate-950 font-black font-heading text-xs flex items-center justify-center border border-slate-950">
          UG
        </div>
      )}
    </div>
  );
}

