"use client";

import { useState } from "react";

export function BrandLogo({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const [imgError, setImgError] = useState(false);

  const dimMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const currentDim = dimMap[size] || dimMap.md;

  if (imgError) {
    return (
      <div className={`${currentDim} rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-900/30 text-white font-black text-xs shrink-0 ${className}`}>
        <span className="leading-none text-center">
          HI<br />MS
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${currentDim} rounded-xl overflow-hidden shadow-md shrink-0 bg-transparent flex items-center justify-center ${className}`}>
      <img
        src="/himsigundar.png"
        alt="Logo HIMSI UG"
        className="w-full h-full object-contain"
        onError={() => setImgError(true)}
      />
    </div>
  );
}
