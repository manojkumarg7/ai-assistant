"use client";

import { motion } from "framer-motion";

interface SpeakingWaveformProps {
  active?: boolean;
}

export function SpeakingWaveform({ active = false }: SpeakingWaveformProps) {
  if (!active) return null;

  return (
    <div className="flex items-center gap-1 h-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full gradient-bg"
          animate={{
            height: [4, 16, 8, 14, 4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
