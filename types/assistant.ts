/** Conversation lifecycle status surfaced in the UI. */
export type AssistantStatus = "ready" | "connected" | "listening" | "speaking";

export type MessageRole = "user" | "assistant";

/** A single transcript message shown after the user starts speaking. */
export interface AssistantMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

/** Static agent display metadata for the sidebar (ID lives in env). */
export interface AssistantAgentConfig {
  name: string;
  avatarInitial: string;
}

export const ASSISTANT_AGENT: AssistantAgentConfig = {
  name: "Voice Assistant",
  avatarInitial: "V",
};

/** Human-readable labels for each status badge. */
export const STATUS_LABELS: Record<AssistantStatus, string> = {
  ready: "Ready",
  connected: "Connected",
  listening: "Listening",
  speaking: "Speaking",
};
