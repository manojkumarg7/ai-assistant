"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ConversationProvider } from "@elevenlabs/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { VoiceSidebar } from "./VoiceSidebar";
import { TranscriptPanel } from "./TranscriptPanel";
import { MobileChatPanel } from "./MobileChatPanel";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { logElevenLabsEnv } from "@/lib/env";

/** Inner shell — consumes the voice hook inside the ElevenLabs provider. */
function AssistantShell() {
  const voice = useVoiceAssistant();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
      <VoiceSidebar voice={voice} />
      <TranscriptPanel />
      <MobileChatPanel voice={voice} />
    </div>
  );
}

/** Two-column assistant layout with ElevenLabs session context. */
export function AssistantLayout() {
  useEffect(() => {
    logElevenLabsEnv("AssistantLayout");
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <header className="flex items-center justify-between border-b border-border/60 px-4 py-3 glass-panel sm:px-6">
        <Button variant="ghost" size="sm" asChild className="rounded-lg">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <ThemeToggle />
      </header>

      <ConversationProvider>
        <AssistantShell />
      </ConversationProvider>
    </div>
  );
}
