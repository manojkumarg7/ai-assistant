"use client";

import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { ASSISTANT_AGENT, STATUS_LABELS } from "@/types/assistant";
import { useAssistantStore } from "@/store/assistant.store";
import { formatCallDuration } from "@/lib/utils";
import type { VoiceAssistantHandle } from "@/hooks/useVoiceAssistant";
import { Badge } from "@/components/ui/badge";
import { MessageBubble } from "./MessageBubble";
import { VoiceControls } from "./VoiceControls";
import { SpeakingWaveform } from "./SpeakingWaveform";

interface MobileChatPanelProps {
  voice: VoiceAssistantHandle;
}

/** Mobile-only WhatsApp-style chat with fixed bottom voice control. */
export function MobileChatPanel({ voice }: MobileChatPanelProps) {
  const messages = useAssistantStore((state) => state.messages);
  const status = useAssistantStore((state) => state.status);
  const isConnected = useAssistantStore((state) => state.isConnected);
  const isSpeaking = useAssistantStore((state) => state.isSpeaking);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;
  const statusLabel = STATUS_LABELS[status];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col lg:hidden">
      <div className="flex items-center gap-3 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-bg text-sm font-bold text-white">
          {ASSISTANT_AGENT.avatarInitial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-foreground">
            {ASSISTANT_AGENT.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {voice.connectionStatus === "connecting"
              ? "Connecting..."
              : isConnected
                ? `${statusLabel}${voice.elapsedSeconds > 0 ? ` · ${formatCallDuration(voice.elapsedSeconds)}` : ""}`
                : "Tap Start Voice to begin"}
          </p>
        </div>
        {isConnected && (
          <Badge
            variant={
              status === "speaking"
                ? "speaking"
                : status === "listening"
                  ? "listening"
                  : "connected"
            }
          >
            {status === "speaking" ? (
              <span className="flex items-center gap-1">
                <SpeakingWaveform active />
                Live
              </span>
            ) : (
              statusLabel
            )}
          </Badge>
        )}
      </div>

      <div className="chat-wallpaper relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        {voice.connectionStatus === "connecting" && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-full bg-background/80 px-4 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Connecting to agent...
          </div>
        )}

        {!hasMessages && !isConnected && (
          <div className="flex h-full min-h-[200px] flex-col items-center justify-center px-4 text-center">
            <p className="text-sm font-medium text-foreground/80">
              No messages yet
            </p>
            <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-muted-foreground">
              Start a voice session and your conversation will appear here.
            </p>
          </div>
        )}

        {!hasMessages && isConnected && (
          <div className="flex h-full min-h-[120px] flex-col items-center justify-center px-4 text-center">
            <p className="text-sm text-muted-foreground">
              {isSpeaking
                ? "Assistant is speaking..."
                : "Listening — start speaking"}
            </p>
          </div>
        )}

        {hasMessages && (
          <div className="flex flex-col gap-2 pb-2">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                variant="mobile"
                isSpeaking={
                  status === "speaking" &&
                  message.role === "assistant" &&
                  index === messages.length - 1
                }
              />
            ))}
            <div ref={bottomRef} aria-hidden />
          </div>
        )}
      </div>

      {voice.error && (
        <div className="border-t border-destructive/20 bg-destructive/10 px-4 py-2 text-xs text-destructive">
          <p className="line-clamp-3">{voice.error}</p>
          <button
            type="button"
            onClick={voice.clearError}
            className="mt-1 underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="shrink-0 border-t border-border/60 bg-background/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm">
        <VoiceControls
          isConnected={isConnected}
          isStarting={voice.isStarting}
          onStart={voice.startSession}
          onEnd={voice.endSession}
          fullWidth
        />
      </div>
    </div>
  );
}
