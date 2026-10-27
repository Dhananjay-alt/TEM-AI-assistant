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
        <div className="max-w-[85%] sm:max-w-[75%] space-y-1">
          <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-slate-500 font-bold uppercase">
            <span>{message.timestamp}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#09090B]">
              <User className="w-3 h-3" />
              <span>OPERATOR</span>
            </span>
          </div>

          <div className="p-3.5 bg-[#09090B] text-[#F8F4E8] border-2 border-[#09090B] rounded-2xl rounded-tr-none shadow-hard-xs font-grotesk text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start select-text py-3">
      <div className="w-full max-w-3xl space-y-3">
        {/* Assistant Header Info */}
        <div className="flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-md flex items-center justify-center font-display font-black text-[10px]">
              ★
            </span>
            <span className="font-display font-bold text-xs uppercase text-[#09090B]">
              CARTER AGENT
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-300 px-1.5 py-0.2 rounded">
              {message.mode} MODE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500">{message.timestamp}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 hover:bg-[#D2E823] text-[#09090B] border border-slate-300 hover:border-[#09090B] rounded transition-all flex items-center gap-1 text-[10px] font-mono font-bold"
              title="Copy answer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>
            {onRegenerate && (
              <button
                type="button"
                onClick={() => onRegenerate(message.id)}
                className="p-1 hover:bg-[#D2E823] text-[#09090B] border border-slate-300 hover:border-[#09090B] rounded transition-all flex items-center gap-1 text-[10px] font-mono font-bold"
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
          <div className="p-4 bg-white border-2 border-[#09090B] rounded-xl shadow-hard-xs">
            <MarkdownRenderer content={message.content} />
          </div>
        )}

        {/* Section 2: Grounded "FROM CARTER" Textbook Card */}
        {hasDedicatedCarter && (
          <div className="bg-white border-2 border-[#09090B] rounded-xl shadow-hard-xs overflow-hidden">
            <div className="px-3.5 py-2 bg-[#F8F4E8] border-b-2 border-[#09090B] flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-xs text-[#09090B] uppercase tracking-wide">
                <BookOpen className="w-4 h-4 text-[#09090B]" />
                <span>FROM CARTER TEXTBOOK (GROUND TRUTH)</span>
              </div>
              {primarySource ? (
                <span className="font-mono text-[10px] font-bold bg-[#09090B] text-[#D2E823] px-2 py-0.5 rounded">
                  Ch. {primarySource.chapterNumber} · p. {primarySource.page}
                </span>
              ) : (
                <span className="font-mono text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">
                  TEXTBOOK CORPUS
                </span>
              )}
            </div>

            <div className="p-4 bg-white">
              <MarkdownRenderer content={carterText!} />
            </div>
          </div>
        )}

        {/* Section 3: Distinct Additional Scientific Explanation / Guidance */}
        {hasAdditional && (
          <div className="bg-[#F8F4E8] border-2 border-[#09090B] rounded-xl shadow-hard-xs overflow-hidden">
            <div className="px-3.5 py-2 bg-white border-b-2 border-[#09090B] flex items-center justify-between">
              <div className="flex items-center gap-2 font-display text-xs text-[#09090B] uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-[#09090B]" />
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
              <span className="font-mono text-[10px] text-slate-600 font-bold uppercase">
                {message.provider || "Williams & Carter Synthesis"}
              </span>
            </div>

            <div className="p-4 bg-[#F8F4E8]/60">
              <MarkdownRenderer content={additionalText!} />
            </div>
          </div>
        )}

        {/* Section 4: Verified Carter Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between font-mono text-[11px] font-bold text-slate-700 uppercase">
              <span className="flex items-center gap-1.5">
                <span>Verified Textbook Citations ({message.citations.length})</span>
              </span>
              {message.citations.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowAllCitations(!showAllCitations)}
                  className="text-[10px] text-blue-700 hover:underline flex items-center gap-1"
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
          <div className="space-y-1.5 pt-2">
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Suggested Follow-up Enquiries:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {message.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectPrompt(q)}
                  className="px-2.5 py-1 bg-white hover:bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-lg font-mono text-[11px] font-bold shadow-hard-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all text-left"
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
