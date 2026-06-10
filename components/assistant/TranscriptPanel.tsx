"use client";

import { useEffect, useRef } from "react";
import { useAssistantStore } from "@/store/assistant.store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyConversation } from "./EmptyConversation";
import { MessageBubble } from "./MessageBubble";

/** Right panel — live transcript with auto-scroll and empty state. */
export function TranscriptPanel() {
  const messages = useAssistantStore((state) => state.messages);
  const status = useAssistantStore((state) => state.status);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  return (
    <section className="hidden h-full flex-1 flex-col bg-background/50 lg:flex lg:w-[70%]">
      <header className="border-b border-border/60 px-6 py-4">
        <h2 className="text-lg font-bold text-foreground">Live Transcript</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time conversation captured from your voice session.
        </p>
      </header>

      <ScrollArea className="flex-1">
        <div className="flex min-h-[320px] flex-col p-6 lg:min-h-0">
          {!hasMessages ? (
            <EmptyConversation />
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
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
      </ScrollArea>
    </section>
  );
}
