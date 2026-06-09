"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav, HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { useClientMounted } from "@/hooks/use-client-mounted";

const CURRENT_YEAR = 2026;

export function LandingPage() {
  const mounted = useClientMounted();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-pink-500/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <LandingNav />
      <HeroSection />
      <FeaturesSection />

      <section className="relative px-6 pb-20 sm:px-10">
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl rounded-2xl border border-border/60 gradient-bg p-10 text-center shadow-2xl shadow-purple-500/20"
        >
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to experience AI voice support?
          </h2>
          <p className="mt-3 text-purple-100">
            Start a conversation with Riley and get instant benefits assistance.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="mt-8 rounded-xl bg-white text-purple-700 hover:bg-white/90"
          >
            <Link href="/assistant">
              Start AI Assistant
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      <footer className="border-t border-border/60 px-6 py-8 text-center text-sm text-muted-foreground">
        © {CURRENT_YEAR} VoiceAI. Enterprise AI Voice Assistant.
      </footer>
    </div>
  );
}
