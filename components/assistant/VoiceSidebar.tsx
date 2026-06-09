"use client";

import { Loader2, Mic, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";
import { ASSISTANT_AGENT, STATUS_LABELS } from "@/types/assistant";
import { useAssistantStore } from "@/store/assistant.store";
import { formatCallDuration } from "@/lib/utils";
import { useClientMounted } from "@/hooks/use-client-mounted";
import type { VoiceAssistantHandle } from "@/hooks/useVoiceAssistant";
import { Badge } from "@/components/ui/badge";
import { VoiceControls } from "./VoiceControls";
import { SpeakingWaveform } from "./SpeakingWaveform";

type VoiceAssistantApi = VoiceAssistantHandle;

interface VoiceSidebarProps {
  voice: VoiceAssistantApi;
}

const STATUS_BADGE_VARIANT = {
  ready: "ready",
  connected: "connected",
  listening: "listening",
  speaking: "speaking",
} as const;

/** Left panel — agent identity, connection state, controls, and timer. */
export function VoiceSidebar({ voice }: VoiceSidebarProps) {
  const mounted = useClientMounted();
  const status = useAssistantStore((state) => state.status);
  const isConnected = useAssistantStore((state) => state.isConnected);
  const isSpeaking = useAssistantStore((state) => state.isSpeaking);

  const statusLabel = STATUS_LABELS[status];
  const badgeVariant = STATUS_BADGE_VARIANT[status];

  return (
    <aside className="flex h-full w-full flex-col border-r border-border/60 glass-panel lg:w-[30%] lg:min-w-[320px] lg:max-w-[400px]">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 scrollbar-thin">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full gradient-bg text-lg font-bold text-white shadow-lg shadow-purple-500/30">
              {ASSISTANT_AGENT.avatarInitial}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {ASSISTANT_AGENT.name}
              </h2>
              <p className="text-sm text-muted-foreground">ElevenLabs Agent</p>
            </div>
          </div>

          <Badge variant={badgeVariant} className="shrink-0">
            {status === "speaking" ? (
              <span className="flex items-center gap-1.5">
                <SpeakingWaveform active />
                {statusLabel}
              </span>
            ) : (
              statusLabel
            )}
          </Badge>
        </div>

        <ConnectionSummary
          isConnected={isConnected}
          connectionStatus={voice.connectionStatus}
          connectionMessage={voice.connectionMessage}
        />

        <div className="flex flex-col items-center gap-4 py-2">
          <VoiceControls
            isConnected={isConnected}
            isStarting={voice.isStarting}
            onStart={voice.startSession}
            onEnd={voice.endSession}
          />

          <motion.p
            key={voice.elapsedSeconds}
            initial={mounted ? { opacity: 0.5 } : false}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold tabular-nums text-foreground"
          >
            {formatCallDuration(voice.elapsedSeconds)}
          </motion.p>

          {isSpeaking && (
            <div className="flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">
              <Mic className="h-4 w-4" />
              Assistant is speaking
              <SpeakingWaveform active />
            </div>
          )}
        </div>

        {voice.error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <p className="font-medium">Connection error</p>
            <p className="mt-1 text-destructive/90">{voice.error}</p>
            <button
              type="button"
              onClick={voice.clearError}
              className="mt-2 text-xs underline underline-offset-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {isConnected && (
          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <PhoneOff className="h-3.5 w-3.5" />
            End the conversation when you are finished.
          </p>
        )}
      </div>
    </aside>
  );
}

function ConnectionSummary({
  isConnected,
  connectionStatus,
  connectionMessage,
}: {
  isConnected: boolean;
  connectionStatus: VoiceAssistantApi["connectionStatus"];
  connectionMessage?: string;
}) {
  if (connectionStatus === "connecting") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Connecting to agent...
      </div>
    );
  }

  if (connectionStatus === "error") {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {connectionMessage ?? "Unable to connect to the voice agent."}
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        Live voice session active
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
      Start a voice session to begin. Your transcript stays empty until you speak.
    </div>
  );
}
