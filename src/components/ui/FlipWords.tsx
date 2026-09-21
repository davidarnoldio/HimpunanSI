"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function FlipWords({
  words,
  duration = 2000,
  className = "",
}: {
  words: string[];
  duration?: number;
  className?: string;
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words, duration]);

  const currentWord = words[currentWordIndex] || "";

  return (
    <span className="inline-block relative">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`inline-block whitespace-nowrap ${className}`}
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
