import { AssistantLayout } from "@/components/assistant/AssistantLayout";
import { logElevenLabsEnv } from "@/lib/env";

export default function AssistantPage() {
  logElevenLabsEnv("assistant/page");

  return <AssistantLayout />;
}
