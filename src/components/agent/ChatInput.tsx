"use client";

import React, { useRef, useEffect } from "react";
import { ArrowUp, CornerDownLeft, Sparkles } from "lucide-react";
import { ChatMode } from "@/lib/ai/chat";
import { ModeSelectorDropdown } from "./ModeSelectorDropdown";

interface ChatInputProps {
  inputQuery: string;
  setInputQuery: (val: string) => void;
  onSend: (text?: string) => void;
  isLoading: boolean;
  currentMode: ChatMode;
  onSelectMode: (mode: ChatMode) => void;
  examSubtype?: "2mark" | "5mark" | "10mark" | "viva" | "mcq";
  onSelectExamSubtype?: (sub: "2mark" | "5mark" | "10mark" | "viva" | "mcq") => void;
}

export function ChatInput({
  inputQuery,
  setInputQuery,
  onSend,
  isLoading,
  currentMode,
  onSelectMode,
  examSubtype,
  onSelectExamSubtype,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputQuery]);

  // Auto-focus textarea on mount and after sending/loading completes
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputQuery.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className="shrink-0 p-2.5 sm:p-4 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-20">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputQuery.trim() && !isLoading) {
              onSend();
            }
          }}
          className="bg-[#111111]/90 backdrop-blur-xl border border-white/15 focus-within:border-[#FF4500] focus-within:shadow-[0_0_25px_rgba(255,69,0,0.25)] rounded-2xl transition-all p-3 sm:p-3.5 space-y-2.5 shadow-2xl"
        >
          {/* Multiline Textarea */}
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ask Carter about TEM (e.g., 'Explain Scherzer defocus' or 'How does diffraction contrast occur?')..."
            className="w-full bg-transparent resize-none font-sans text-sm sm:text-base text-white placeholder:text-white/35 focus:outline-none leading-relaxed"
          />

          {/* Bottom Controls Bar */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
            {/* Mode Selector Dropdown */}
            <ModeSelectorDropdown
              currentMode={currentMode}
              onSelectMode={onSelectMode}
              examSubtype={examSubtype}
              onSelectExamSubtype={onSelectExamSubtype}
            />

            <div className="flex items-center gap-2">
              <span className="hidden md:inline font-mono text-[10px] text-white/40 select-none">
                <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[9px] text-white/70">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded text-[9px] text-white/70">Enter</kbd> for newline
              </span>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#FF4500] hover:bg-[#ff5c26] text-black font-bold rounded-xl shadow-[0_0_15px_rgba(255,69,0,0.4)] disabled:opacity-20 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0 select-none cursor-pointer"
                title="Send message (Enter)"
              >
                {isLoading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </form>

        <p className="text-[10px] font-mono text-center text-white/40 pt-2 select-none">
          TEM-AI is grounded in Williams &amp; Carter. Always cross-verify critical operating parameters with instrument manufacturer manuals.
        </p>
      </div>
    </div>
  );
}
