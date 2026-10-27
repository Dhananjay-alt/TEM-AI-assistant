"use client";

import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  User,
  GraduationCap,
  Award,
  Wrench,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Message } from "./types";
import { CitationCard } from "./CitationCard";
import { ToolLauncher } from "./ToolLauncher";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { parseGroundedResponse } from "@/lib/ai/chat-parser";

interface MessageItemProps {
  message: Message;
  onSelectPrompt?: (prompt: string) => void;
  onRegenerate?: (messageId: string) => void;
}

export function MessageItem({ message, onSelectPrompt, onRegenerate }: MessageItemProps) {
  const [copied, setCopied] = useState(false);
  const [showAllCitations, setShowAllCitations] = useState(false);

  const isAssistant = message.role === "assistant";

  // Assistant Message: dynamically split if old or unsplit response in localStorage
  const parsed = isAssistant && (!message.fromCarter && !message.additionalExplanation && message.content)
    ? parseGroundedResponse(message.content)
    : { fromCarter: message.fromCarter || "", additionalExplanation: message.additionalExplanation || "" };

  const carterText = parsed.fromCarter || message.fromCarter;
  const additionalText = parsed.additionalExplanation || message.additionalExplanation;
  const hasDedicatedCarter = Boolean(carterText && carterText.trim().length > 0);
  const hasAdditional = Boolean(additionalText && additionalText.trim().length > 0);
  const hasSplitContent = hasDedicatedCarter || hasAdditional;
  const primarySource = message.citations?.[0];

  const handleCopy = () => {
    const fullText = [
      message.content,
      carterText ? `\n\n--- FROM CARTER ---\n${carterText}` : "",
      additionalText ? `\n\n--- SCIENTIFIC EXPLANATION ---\n${additionalText}` : "",
    ].join("");

    navigator.clipboard.writeText(fullText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // User Message
  if (!isAssistant) {
    return (
      <div className="flex justify-end select-text py-2">
        <div className="max-w-[85%] sm:max-w-[75%] space-y-1.5">
          <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-white/40 font-bold uppercase">
            <span>{message.timestamp}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#FF4500]">
              <User className="w-3 h-3" />
              <span>OPERATOR</span>
            </span>
          </div>

          <div className="p-4 bg-[#18181b]/95 text-white border border-white/15 rounded-2xl rounded-tr-none shadow-xl font-sans text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start select-text py-3">
      <div className="w-full max-w-3xl space-y-3.5">
        {/* Assistant Header Info */}
        <div className="flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-gradient-to-br from-[#FF4500] to-[#b32b00] text-black font-serif font-black rounded-lg flex items-center justify-center text-xs shadow-[0_0_12px_rgba(255,69,0,0.4)]">
              ★
            </span>
            <span className="font-serif font-bold text-xs uppercase text-white tracking-wider">
              CARTER AGENT
            </span>
            <span className="text-white/30">•</span>
            <span className="text-[10px] font-mono text-[#FF4500] bg-[#FF4500]/10 border border-[#FF4500]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {message.mode} MODE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">{message.timestamp}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-lg transition-all flex items-center gap-1 text-[10px] font-mono cursor-pointer"
              title="Copy answer"
            >
              {copied ? <Check className="w-3 h-3 text-[#FF4500]" /> : <Copy className="w-3 h-3" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>
            {onRegenerate && (
              <button
                type="button"
                onClick={() => onRegenerate(message.id)}
                className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-lg transition-all flex items-center gap-1 text-[10px] font-mono cursor-pointer"
                title="Regenerate response"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Retry</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 1: Standard / Overview Answer (Fallback if no split sections) */}
        {!hasSplitContent && message.content && (
          <div className="p-4 sm:p-5 bg-[#111111]/90 backdrop-blur-md border border-white/15 rounded-2xl shadow-xl">
            <MarkdownRenderer content={message.content} />
          </div>
        )}

        {/* Section 2: Grounded "FROM CARTER" Textbook Card */}
        {hasDedicatedCarter && (
          <div className="bg-[#0d0d0e] border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 font-serif text-xs text-white uppercase tracking-wider font-semibold">
                <BookOpen className="w-4 h-4 text-[#FF4500]" />
                <span>FROM CARTER TEXTBOOK (GROUND TRUTH)</span>
              </div>
              {primarySource ? (
                <span className="font-mono text-[10px] font-bold bg-[#FF4500]/20 text-[#FF4500] border border-[#FF4500]/40 px-2.5 py-0.5 rounded-full">
                  Ch. {primarySource.chapterNumber} · p. {primarySource.page}
                </span>
              ) : (
                <span className="font-mono text-[10px] font-bold bg-[#FF4500]/15 text-[#FF4500] border border-[#FF4500]/30 px-2 py-0.5 rounded-full">
                  TEXTBOOK CORPUS
                </span>
              )}
            </div>

            <div className="p-4 sm:p-5 text-white">
              <MarkdownRenderer content={carterText!} />
            </div>
          </div>
        )}

        {/* Section 3: Distinct Additional Scientific Explanation / Guidance */}
        {hasAdditional && (
          <div className="bg-[#141416]/90 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 font-serif text-xs text-white uppercase tracking-wider font-semibold">
                <Sparkles className="w-4 h-4 text-[#FF4500]" />
                <span>
                  {message.mode === "TUTOR"
                    ? "SOCRATIC TUTOR GUIDANCE"
                    : message.mode === "EXAM"
                    ? "MODEL EXAMINATION ANSWER"
                    : message.mode === "EXPERIMENT"
                    ? "COLUMN DIAGNOSTIC PROCEDURE"
                    : "SCIENTIFIC ANALYSIS & LAB PROTOCOL"}
                </span>
              </div>
              <span className="font-mono text-[10px] text-white/50 font-medium uppercase tracking-wider">
                {message.provider || "Williams & Carter Synthesis"}
              </span>
            </div>

            <div className="p-4 sm:p-5 text-white/90">
              <MarkdownRenderer content={additionalText!} />
            </div>
          </div>
        )}

        {/* Section 4: Verified Carter Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between font-mono text-[11px] font-bold text-white/60 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span>Verified Textbook Citations ({message.citations.length})</span>
              </span>
              {message.citations.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowAllCitations(!showAllCitations)}
                  className="text-[10px] text-[#FF4500] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {showAllCitations ? "Show less" : `Show all ${message.citations.length}`}
                  {showAllCitations ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {(showAllCitations ? message.citations : message.citations.slice(0, 1)).map((cite, i) => (
                <CitationCard key={cite.chunkId || i} source={cite} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Contextual Tool Handoff */}
        <ToolLauncher
          query={message.content}
          answer={message.additionalExplanation || message.content}
          citations={message.citations}
        />

        {/* Section 6: Follow-up Enquiries */}
        {message.suggestedQuestions && message.suggestedQuestions.length > 0 && onSelectPrompt && (
          <div className="space-y-2 pt-2">
            <span className="font-mono text-[10px] font-bold text-white/40 uppercase tracking-wider block">
              Suggested Follow-up Enquiries:
            </span>
            <div className="flex flex-wrap gap-2">
              {message.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectPrompt(q)}
                  className="px-3 py-1.5 bg-[#18181b] hover:bg-[#FF4500] text-white hover:text-black border border-white/15 hover:border-[#FF4500] rounded-xl font-sans text-xs transition-all text-left shadow-md cursor-pointer"
                >
                  → {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
