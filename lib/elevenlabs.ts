import { MISSING_AGENT_ID_HINT } from "@/lib/elevenlabs-errors";
import { getPublicElevenLabsAgentId, logElevenLabsEnv } from "@/lib/env";

/** Minimal frontend session config — no overrides (agent config controls first message). */
export function getPublicAgentSessionConfig() {
  logElevenLabsEnv("getPublicAgentSessionConfig");

  const agentId = getPublicElevenLabsAgentId();

  if (!agentId) {
    throw new Error(
      `NEXT_PUBLIC_ELEVENLABS_AGENT_ID is not configured. ${MISSING_AGENT_ID_HINT}`
    );
  }

  return {
    agentId,
    connectionType: "webrtc" as const,
  };
}

export { MISSING_AGENT_ID_HINT };
