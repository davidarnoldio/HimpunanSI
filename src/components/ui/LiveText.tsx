"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";

const emptySubscribe = () => () => {};

interface LiveTextProps {
  text: string;
  className?: string;
  delay?: number;
  wordDelay?: number;
  once?: boolean;
}

export function LiveText({
  text,
  className = "",
  delay = 0,
  wordDelay = 0.05,
  once = true,
}: LiveTextProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!text) return null;

  // Fallback to static text during SSR / pre-hydration to avoid text disappearing on refresh
  if (!mounted) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: wordDelay, delayChildren: delay * i },
    }),
  };

  const childVariants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 12,
      filter: "blur(4px)",
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      className={`inline-block flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.28em] whitespace-nowrap"
          variants={childVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
