"use client";

import { Loader2, Mic, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceControlsProps {
  isConnected: boolean;
  isStarting: boolean;
  onStart: () => Promise<void>;
  onEnd: () => void;
  fullWidth?: boolean;
}

/** Primary voice session actions — start/end conversation. */
export function VoiceControls({
  isConnected,
  isStarting,
  onStart,
  onEnd,
  fullWidth = false,
}: VoiceControlsProps) {
  const widthClass = fullWidth ? "w-full" : "w-full max-w-[220px]";

  if (isConnected) {
    return (
      <Button
        variant="destructive"
        size="lg"
        onClick={onEnd}
        className={`${widthClass} rounded-2xl`}
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
      className={`${widthClass} rounded-2xl`}
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
