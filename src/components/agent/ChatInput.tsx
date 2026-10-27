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
    <div className="shrink-0 p-2.5 sm:p-3.5 bg-gradient-to-t from-[#F8F4E8] via-[#F8F4E8] to-transparent z-20">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (inputQuery.trim() && !isLoading) {
              onSend();
            }
          }}
          className="bg-white border-2 border-[#09090B] rounded-2xl shadow-hard-lg focus-within:ring-2 focus-within:ring-[#D2E823] transition-all p-3 sm:p-3.5 space-y-2.5"
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
            className="w-full bg-transparent resize-none font-grotesk text-sm sm:text-base text-[#09090B] placeholder:text-slate-400 focus:outline-none leading-relaxed"
          />

          {/* Bottom Controls Bar */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
            {/* Mode Selector Dropdown */}
            <ModeSelectorDropdown
              currentMode={currentMode}
              onSelectMode={onSelectMode}
              examSubtype={examSubtype}
              onSelectExamSubtype={onSelectExamSubtype}
            />

            <div className="flex items-center gap-2">
              <span className="hidden md:inline font-mono text-[10px] text-slate-400 select-none">
                <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-300 rounded text-[9px]">Shift</kbd> + <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-300 rounded text-[9px]">Enter</kbd> for newline
              </span>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#D2E823] hover:bg-[#c2d815] text-[#09090B] border-2 border-[#09090B] rounded-xl font-display font-black shadow-hard-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-hard-xs transition-all flex items-center justify-center shrink-0 select-none"
                title="Send message (Enter)"
              >
                {isLoading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-[#09090B] border-t-transparent animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </form>

        <p className="text-[10px] font-mono text-center text-slate-500 pt-2 select-none">
          TEM-AI is grounded in Williams &amp; Carter. Always cross-verify critical operating parameters with instrument manufacturer manuals.
        </p>
      </div>
    </div>
  );
}
