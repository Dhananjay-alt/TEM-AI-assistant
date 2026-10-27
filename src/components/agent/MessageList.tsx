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
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-2 w-full flex flex-col justify-center items-center">
        <EmptyState onSelectPrompt={onSelectPrompt} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 overflow-y-auto w-full px-3 sm:px-6 py-4"
    >
      <div className="max-w-4xl mx-auto space-y-4 w-full">
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
            <div className="p-3.5 bg-[#111111]/90 backdrop-blur-md border border-white/15 rounded-xl shadow-[0_0_20px_rgba(255,69,0,0.15)] flex items-center gap-3">
              <div className="w-4 h-4 rounded-full border-2 border-[#FF4500] border-t-transparent animate-spin" />
              <div className="font-mono text-xs font-medium text-white/80">
                Querying Carter textbook chapters &amp; synthesizing answer...
              </div>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}
