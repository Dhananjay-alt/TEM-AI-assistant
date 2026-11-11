"use client";

import React, { useEffect, useRef } from "react";
import { Message } from "./types";
import { MessageItem } from "./MessageItem";
import { EmptyState } from "./EmptyState";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  bookTitle?: string;
  activeCitation: { messageId: string; index: number } | null;
  onOpenCitation: (messageId: string, index: number) => void;
  onSelectPrompt: (prompt: string) => void;
  onRegenerate: (messageId: string) => void;
}

export function MessageList({
  messages,
  isLoading,
  bookTitle,
  activeCitation,
  onOpenCitation,
  onSelectPrompt,
  onRegenerate,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <EmptyState onSelectPrompt={onSelectPrompt} bookTitle={bookTitle} />
      </div>
    );
  }

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-8 sm:px-6">
        {messages.map((m) => (
          <MessageItem
            key={m.id}
            message={m}
            activeCitation={activeCitation?.messageId === m.id ? activeCitation.index : null}
            onOpenCitation={onOpenCitation}
            onSelectPrompt={m.id === lastAssistantId && !isLoading ? onSelectPrompt : undefined}
            onRegenerate={m.id === lastAssistantId && !isLoading ? onRegenerate : undefined}
          />
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted" role="status">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Searching the text and writing an answer…
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
