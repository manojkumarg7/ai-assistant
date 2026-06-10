"use client";

import { motion } from "framer-motion";
import type { AssistantMessage } from "@/types/assistant";
import { SpeakingWaveform } from "./SpeakingWaveform";

interface MessageBubbleProps {
  message: AssistantMessage;
  isSpeaking?: boolean;
  variant?: "desktop" | "mobile";
}

/** Single transcript bubble — user messages right, assistant messages left. */
export function MessageBubble({
  message,
  isSpeaking = false,
  variant = "desktop",
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isMobile = variant === "mobile";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex flex-col ${isMobile ? "gap-0" : "gap-1.5"} ${isUser ? "items-end" : "items-start"}`}
    >
      {!isMobile && (
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider ${
            isUser
              ? "text-purple-600 dark:text-purple-400"
              : "text-muted-foreground"
          }`}
        >
          {isUser ? "You" : "Assistant"}
        </span>
      )}

      <div
        className={`text-sm leading-relaxed shadow-sm ${
          isMobile
            ? `max-w-[82%] px-3.5 py-2.5 ${
                isUser
                  ? "rounded-2xl rounded-br-md gradient-bg text-white"
                  : "rounded-2xl rounded-bl-md bg-card text-card-foreground ring-1 ring-border/40"
              }`
            : `max-w-[85%] rounded-2xl px-4 py-3 ${
                isUser
                  ? "gradient-bg text-white shadow-purple-500/20"
                  : "bg-secondary text-secondary-foreground"
              }`
        }`}
      >
        {message.content}
        {!isUser && isSpeaking && (
          <div className="mt-2 border-t border-border/50 pt-2">
            <SpeakingWaveform active />
          </div>
        )}
      </div>
    </motion.div>
  );
}
