"use client";

import React, { useRef, useEffect } from "react";
import { Message } from "./types";
import { MessageItem } from "./MessageItem";
import { EmptyState } from "./EmptyState";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onSelectPrompt: (prompt: string) => void;
  onRegenerate?: (messageId: string) => void;
}

export function MessageList({
  messages,
  isLoading,
  onSelectPrompt,
  onRegenerate,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <EmptyState onSelectPrompt={onSelectPrompt} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4 max-w-4xl mx-auto w-full">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          onSelectPrompt={onSelectPrompt}
          onRegenerate={onRegenerate}
        />
      ))}

      {isLoading && (
        <div className="flex justify-start py-2">
          <div className="p-3.5 bg-white border-2 border-[#09090B] rounded-xl shadow-hard-sm flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border-2 border-[#09090B] border-t-transparent animate-spin" />
            <div className="font-mono text-xs font-bold text-[#09090B]">
              Querying Carter textbook chapters &amp; formulating verified answer...
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
