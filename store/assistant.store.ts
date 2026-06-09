import { create } from "zustand";
import type { AssistantMessage, AssistantStatus } from "@/types/assistant";

interface AssistantStoreState {
  messages: AssistantMessage[];
  status: AssistantStatus;
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;

  addMessage: (message: AssistantMessage) => void;
  clearMessages: () => void;
  setStatus: (status: AssistantStatus) => void;
  setConnected: (connected: boolean) => void;
  setListening: (listening: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
  resetSession: () => void;
}

const initialState = {
  messages: [] as AssistantMessage[],
  status: "ready" as AssistantStatus,
  isConnected: false,
  isListening: false,
  isSpeaking: false,
};

/** Global assistant UI state — decoupled from ElevenLabs SDK internals. */
export const useAssistantStore = create<AssistantStoreState>((set) => ({
  ...initialState,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearMessages: () => set({ messages: [] }),

  setStatus: (status) => set({ status }),

  setConnected: (isConnected) => set({ isConnected }),

  setListening: (isListening) => set({ isListening }),

  setSpeaking: (isSpeaking) => set({ isSpeaking }),

  resetSession: () => set({ ...initialState }),
}));
