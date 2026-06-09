"use client";

import { motion } from "framer-motion";

interface VoicePulseProps {
  active?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-32 w-32",
};

export function VoicePulse({ active = false, size = "lg" }: VoicePulseProps) {
  if (!active) return null;

  return (
    <div className={`relative ${sizeMap[size]}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full bg-purple-500/20"
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
