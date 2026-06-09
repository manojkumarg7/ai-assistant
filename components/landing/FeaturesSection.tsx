"use client";

import { motion } from "framer-motion";
import {
  Mic,
  Shield,
  MessageSquare,
  Zap,
  Headphones,
  Globe,
} from "lucide-react";
import { useClientMounted } from "@/hooks/use-client-mounted";

const FEATURES = [
  {
    icon: Mic,
    title: "Natural Voice Interaction",
    description:
      "Speak naturally and get instant responses with advanced speech recognition.",
  },
  {
    icon: MessageSquare,
    title: "Live Transcripts",
    description:
      "Real-time conversation transcripts with copy and export capabilities.",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description:
      "Enterprise-grade security with identity verification built in.",
  },
  {
    icon: Zap,
    title: "Instant Responses",
    description:
      "AI-powered answers to benefits, coverage, and case status questions.",
  },
  {
    icon: Headphones,
    title: "Multi-Engine Support",
    description:
      "Choose from Vapi, OpenAI, or ElevenLabs voice engines.",
  },
  {
    icon: Globe,
    title: "Text Fallback",
    description:
      "Type messages when a microphone isn't available — fully accessible.",
  },
];

export function FeaturesSection() {
  const mounted = useClientMounted();

  return (
    <section className="relative px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={mounted ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need for{" "}
            <span className="gradient-text">voice-first support</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A complete AI voice assistant platform designed for enterprise
            benefits and customer support workflows.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={mounted ? { opacity: 0, y: 20 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-colors group-hover:gradient-bg group-hover:text-white dark:bg-purple-950 dark:text-purple-400">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
