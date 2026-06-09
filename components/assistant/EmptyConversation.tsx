"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useClientMounted } from "@/hooks/use-client-mounted";

/** Shown before any user speech — intentionally no greeting or placeholder messages. */
export function EmptyConversation() {
  const mounted = useClientMounted();

  return (
    <motion.div
      initial={mounted ? { opacity: 0, scale: 0.95 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center"
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-2xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl glass-panel shadow-lg">
          <MessageSquare className="h-9 w-9 text-purple-500/70" />
        </div>
      </div>

      <div className="max-w-sm space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          No conversation yet
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Start a voice session and speak. Messages appear here only after you
          begin talking.
        </p>
      </div>
    </motion.div>
  );
}
