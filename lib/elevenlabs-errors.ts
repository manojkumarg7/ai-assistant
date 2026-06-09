export type DisconnectionDetails = {
  reason: "error" | "agent" | "user";
  message?: string;
  closeReason?: string;
};

const AUTH_ERROR_PATTERNS = [
  "401",
  "authentication",
  "signed url",
  "conversation token",
  "failed to fetch conversation token",
] as const;

function isAuthRelatedError(message: string): boolean {
  const lower = message.toLowerCase();
  return AUTH_ERROR_PATTERNS.some((pattern) => lower.includes(pattern));
}

/** Converts SDK disconnect events into user-facing copy. */
export function formatDisconnectReason(details: DisconnectionDetails): string | null {
  if (details.reason === "user") {
    return null;
  }

  if (details.reason === "error") {
    const message = details.message ?? "The voice session ended due to a connection error.";

    if (isAuthRelatedError(message)) {
      return `${message} This agent has authentication enabled in ElevenLabs. Frontend-only connections require a public (unauthenticated) agent, or a server-issued signed URL / conversation token.`;
    }

    return message;
  }

  return (
    details.closeReason ??
    "The agent ended the conversation. Check agent configuration in ElevenLabs."
  );
}

export const MISSING_AGENT_ID_HINT =
  "Add NEXT_PUBLIC_ELEVENLABS_AGENT_ID to .env.local and restart the dev server.";
