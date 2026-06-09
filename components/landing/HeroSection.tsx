"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useClientMounted } from "@/hooks/use-client-mounted";

export function LandingNav() {
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-4 sm:px-10">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg shadow-lg shadow-purple-500/25">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-foreground">VoiceAI</span>
      </div>
      <ThemeToggle />
    </nav>
  );
}

export function HeroSection() {
  const mounted = useClientMounted();

  // #region agent log
  if (typeof window !== "undefined") {
    const badge = document.querySelector("[data-debug-hero-badge]");
    fetch("http://127.0.0.1:7614/ingest/df98a9cd-ddfd-4b82-82a9-44e5c4a6af98", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "c2118a",
      },
      body: JSON.stringify({
        sessionId: "c2118a",
        runId: "post-fix",
        hypothesisId: "A",
        location: "HeroSection.tsx:render",
        message: "HeroSection client render - motion badge style",
        data: {
          badgeStyle: badge?.getAttribute("style") ?? null,
          badgeOpacity: badge ? window.getComputedStyle(badge).opacity : null,
          mounted,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
  // #endregion

  return (
    <section className="relative flex flex-col items-center px-6 pb-20 pt-8 text-center sm:px-10 sm:pt-16">
      <motion.div
        data-debug-hero-badge
        initial={mounted ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Enterprise AI Voice Assistant
      </motion.div>

      <motion.h1
        initial={mounted ? { opacity: 0, y: 24 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
      >
        Intelligent voice conversations{" "}
        <span className="gradient-text">powered by AI</span>
      </motion.h1>

      <motion.p
        initial={mounted ? { opacity: 0, y: 24 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed"
      >
        Meet Riley — your AI benefits assistant. Get instant answers through
        natural voice conversations with real-time transcripts and enterprise-grade
        security.
      </motion.p>

      <motion.div
        initial={mounted ? { opacity: 0, y: 24 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <Button size="xl" asChild className="group rounded-2xl px-8">
          <Link href="/assistant">
            Start AI Assistant
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </motion.div>

      <motion.div
        initial={mounted ? { opacity: 0, scale: 0.95 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative mt-16 w-full max-w-4xl"
      >
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-2xl" />
        <div className="relative overflow-hidden rounded-2xl border border-border/60 glass-panel shadow-2xl shadow-purple-500/10">
          <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <span className="ml-2 text-xs text-muted-foreground">
              Voice Assistant Dashboard
            </span>
          </div>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-[1fr_2fr]">
            <div className="border-b border-r-0 border-border/60 p-6 sm:border-b-0 sm:border-r">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-sm font-bold text-white">
                  R
                </div>
                <div>
                  <p className="font-semibold">Riley</p>
                  <p className="text-xs text-muted-foreground">
                    VCG Benefits Assistant
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full gradient-bg shadow-lg shadow-purple-500/30">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold">Live transcript</p>
              <div className="mt-4 space-y-3">
                <div className="flex justify-end">
                  <div className="rounded-2xl gradient-bg px-4 py-2 text-xs text-white">
                    My plan details
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-secondary px-4 py-2 text-xs text-secondary-foreground">
                    Your current plan is the VCG Premium Health Plan...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
