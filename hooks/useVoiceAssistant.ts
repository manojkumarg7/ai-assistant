"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { getPublicAgentSessionConfig } from "@/lib/elevenlabs";
import {
  formatDisconnectReason,
  type DisconnectionDetails,
} from "@/lib/elevenlabs-errors";
import { generateId } from "@/lib/utils";
import { logElevenLabsEnv } from "@/lib/env";
import { useAssistantStore } from "@/store/assistant.store";

type ElevenLabsMessagePayload = {
  message: string;
  role: "user" | "agent";
};

interface UseVoiceAssistantReturn {
  startSession: () => Promise<void>;
  endSession: () => void;
  elapsedSeconds: number;
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
  connectionMessage?: string;
  error: string | null;
  isStarting: boolean;
  clearError: () => void;
}

export type VoiceAssistantHandle = UseVoiceAssistantReturn;

/**
 * Bridges `@elevenlabs/react` conversation events into the Zustand store.
 * Must be rendered inside `ConversationProvider`.
 */
export function useVoiceAssistant(): UseVoiceAssistantReturn {
  const addMessage = useAssistantStore((state) => state.addMessage);
  const clearMessages = useAssistantStore((state) => state.clearMessages);
  const setStatus = useAssistantStore((state) => state.setStatus);
  const setConnected = useAssistantStore((state) => state.setConnected);
  const setListening = useAssistantStore((state) => state.setListening);
  const setSpeaking = useAssistantStore((state) => state.setSpeaking);
  const resetSession = useAssistantStore((state) => state.resetSession);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const intentionalEndRef = useRef(false);
  const wasConnectedRef = useRef(false);

  useEffect(() => {
    logElevenLabsEnv("useVoiceAssistant");
  }, []);

  const handleMessage = useCallback(
    (payload: ElevenLabsMessagePayload) => {
      const content = payload.message.trim();
      if (!content) return;

      addMessage({
        id: generateId(),
        role: payload.role === "user" ? "user" : "assistant",
        content,
        timestamp: new Date(),
      });
    },
    [addMessage]
  );

  const conversation = useConversation({
    onConnect: () => {
      wasConnectedRef.current = true;
      intentionalEndRef.current = false;
      setConnected(true);
      setStatus("connected");
      setError(null);
    },
    onDisconnect: (details: DisconnectionDetails) => {
      setConnected(false);
      setListening(false);
      setSpeaking(false);
      setStatus("ready");

      if (intentionalEndRef.current) {
        intentionalEndRef.current = false;
        wasConnectedRef.current = false;
        return;
      }

      const disconnectMessage = formatDisconnectReason(details);

      if (disconnectMessage) {
        setError(disconnectMessage);
      } else if (wasConnectedRef.current) {
        setError("The voice session ended unexpectedly.");
      }

      wasConnectedRef.current = false;
    },
    onError: (message) => {
      setError(message || "An unknown ElevenLabs error occurred.");
      setConnected(false);
      setListening(false);
      setSpeaking(false);
      setStatus("ready");
      wasConnectedRef.current = false;
    },
    onMessage: handleMessage,
    onModeChange: ({ mode }) => {
      if (mode === "listening") {
        setListening(true);
        setSpeaking(false);
        setStatus("listening");
        return;
      }

      setListening(false);
      setSpeaking(true);
      setStatus("speaking");
    },
  });

  useEffect(() => {
    if (conversation.status === "error" && conversation.message) {
      setError(conversation.message);
      setConnected(false);
      setListening(false);
      setSpeaking(false);
      setStatus("ready");
    }
  }, [
    conversation.message,
    conversation.status,
    setConnected,
    setListening,
    setSpeaking,
    setStatus,
  ]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setElapsedSeconds(0);
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    if (conversation.status === "connected") {
      startTimer();
      return stopTimer;
    }

    stopTimer();
    return undefined;
  }, [conversation.status, startTimer, stopTimer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startSession = useCallback(async () => {
    setError(null);
    clearMessages();
    intentionalEndRef.current = false;
    wasConnectedRef.current = false;

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Microphone access is not available in this browser.");
      }

      await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionConfig = getPublicAgentSessionConfig();

      conversation.startSession(sessionConfig);
    } catch (sessionError) {
      const message =
        sessionError instanceof Error
          ? sessionError.message
          : "Failed to start voice session.";
      setError(message);
      setStatus("ready");
    }
  }, [clearMessages, conversation, setStatus]);

  const endSession = useCallback(() => {
    intentionalEndRef.current = true;
    conversation.endSession();
    resetSession();
    clearMessages();
    stopTimer();
    setError(null);
    wasConnectedRef.current = false;
  }, [clearMessages, conversation, resetSession, stopTimer]);

  const clearError = useCallback(() => setError(null), []);

  const displayError =
    error ??
    (conversation.status === "error" ? conversation.message ?? null : null);

  return {
    startSession,
    endSession,
    elapsedSeconds,
    connectionStatus: conversation.status,
    connectionMessage: conversation.message,
    error: displayError,
    isStarting: conversation.status === "connecting",
    clearError,
  };
}
