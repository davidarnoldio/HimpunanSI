"use client";

import React from "react";

interface LineWavesProps {
  className?: string;
  accentColor?: string;
}

export function LineWaves({
  className = "",
  accentColor = "#960000",
}: LineWavesProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none opacity-30 dark:opacity-25 transition-opacity duration-500 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full min-w-[800px] min-h-[400px]"
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-100 150C200 80 450 320 800 200C1150 80 1350 280 1600 180"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="animate-pulse duration-1000"
        />
        <path
          d="M-100 250C250 180 500 420 850 280C1200 140 1400 380 1600 280"
          stroke={accentColor}
          strokeWidth="1"
          opacity="0.6"
        />
        <path
          d="M-100 350C150 280 400 500 750 380C1100 260 1300 480 1600 350"
          stroke={accentColor}
          strokeWidth="2"
          opacity="0.4"
        />
        <path
          d="M-100 450C300 380 550 580 900 480C1250 380 1450 550 1600 450"
          stroke="#5B7FFF"
          strokeWidth="1"
          opacity="0.25"
        />
      </svg>
    </div>
  );
}
