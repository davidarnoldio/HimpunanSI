"use client";

import React from "react";

export function MarqueeTicker() {
  const TICKER_ITEMS = [
    "ORGANISASI",
    "KOLABORASI",
    "INOVASI",
    "KABINET FORMASI",
    "SISTEM INFORMASI",
    "UNIVERSITAS GUNADARMA",
    "WADAH KREATIVITAS",
    "TEKNOLOGI DIGITAL",
  ];

  return (
    <div className="relative border-y-2 border-slate-950 dark:border-white/20 bg-[#C8102E] text-white dark:bg-black dark:text-white py-5 sm:py-6 overflow-hidden z-20 transition-colors duration-300">
      <div className="flex gap-10 whitespace-nowrap w-max animate-marquee">
        {[...Array(4)].map((_, groupIdx) => (
          <div key={groupIdx} className="flex items-center gap-10">
            {TICKER_ITEMS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-10">
                <span className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-wider text-white">
                  {item}
                </span>
                <span className="text-white dark:text-[#E31B3B] text-3xl sm:text-4xl select-none animate-pulse">
                  ✦
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
