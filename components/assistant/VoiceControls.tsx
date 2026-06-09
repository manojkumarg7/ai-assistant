"use client";

import { Loader2, Mic, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceControlsProps {
  isConnected: boolean;
  isStarting: boolean;
  onStart: () => Promise<void>;
  onEnd: () => void;
}

/** Primary voice session actions — start/end conversation. */
export function VoiceControls({
  isConnected,
  isStarting,
  onStart,
  onEnd,
}: VoiceControlsProps) {
  if (isConnected) {
    return (
      <Button
        variant="destructive"
        size="lg"
        onClick={onEnd}
        className="w-full max-w-[220px] rounded-2xl"
      >
        <PhoneOff className="h-4 w-4" />
        End Conversation
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      onClick={() => void onStart()}
      disabled={isStarting}
      className="w-full max-w-[220px] rounded-2xl"
    >
      {isStarting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Mic className="h-4 w-4" />
          Start Voice
        </>
      )}
    </Button>
  );
}
