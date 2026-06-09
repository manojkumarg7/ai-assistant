const AGENT_ID_ENV_KEY = "NEXT_PUBLIC_ELEVENLABS_AGENT_ID";

/** Public ElevenLabs agent ID — available on client via NEXT_PUBLIC_ prefix. */
export function getPublicElevenLabsAgentId(): string | undefined {
  return process.env[AGENT_ID_ENV_KEY]?.trim() || undefined;
}

/** Dev-only logging to verify env loading in hooks and pages. */
export function logElevenLabsEnv(context: string): void {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.log(`[ElevenLabs:${context}] Agent ID:`, process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID);
}

export { AGENT_ID_ENV_KEY };
