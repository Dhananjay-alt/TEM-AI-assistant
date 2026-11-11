"use client";

import React, { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { ChatMode } from "@/lib/ai/chat";

type ExamSubtype = "2mark" | "5mark" | "10mark" | "viva" | "mcq";

interface ChatInputProps {
  inputQuery: string;
  setInputQuery: (v: string) => void;
  onSend: (text?: string) => void;
  isLoading: boolean;
  currentMode: ChatMode;
  onSelectMode: (mode: ChatMode) => void;
  examSubtype: ExamSubtype;
  onSelectExamSubtype: (s: ExamSubtype) => void;
}

const MODES: Array<{ id: ChatMode; label: string; hint: string }> = [
  { id: "ASK", label: "Ask", hint: "Direct answer with references" },
  { id: "TUTOR", label: "Tutor", hint: "Step-by-step, with a check question" },
  { id: "EXAM", label: "Exam", hint: "Model examination answer" },
  { id: "EXPERIMENT", label: "Laboratory", hint: "Practical troubleshooting at the microscope" },
];

const EXAM_FORMATS: Array<{ id: ExamSubtype; label: string }> = [
  { id: "2mark", label: "2 marks" },
  { id: "5mark", label: "5 marks" },
  { id: "10mark", label: "10 marks" },
  { id: "viva", label: "Viva" },
  { id: "mcq", label: "MCQ" },
];

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
  const ref = useRef<HTMLTextAreaElement>(null);

  // grow with the text, up to a limit
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [inputQuery]);

  const canSend = inputQuery.trim().length > 0 && !isLoading;

  return (
    <div className="border-t border-line bg-background px-4 pb-3 pt-3 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-xl border border-line-strong bg-surface focus-within:border-accent transition-colors">
          <label htmlFor="chat-input" className="sr-only">
            Question
          </label>
          <textarea
            id="chat-input"
            ref={ref}
            rows={1}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (canSend) onSend();
              }
            }}
            placeholder="Ask a question about transmission electron microscopy"
            className="block w-full resize-none bg-transparent px-4 pt-3 text-[15px] leading-6 text-foreground placeholder:text-faint focus:outline-none"
          />

          <div className="flex flex-wrap items-center gap-2 px-2.5 pb-2.5 pt-2">
            <div role="radiogroup" aria-label="Answer mode" className="flex rounded-md border border-line p-0.5">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={currentMode === m.id}
                  title={m.hint}
                  onClick={() => onSelectMode(m.id)}
                  className={`rounded px-2.5 py-1 text-xs transition-colors ${
                    currentMode === m.id
                      ? "bg-surface-2 font-medium text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {currentMode === "EXAM" && (
              <>
                <label htmlFor="exam-format" className="sr-only">
                  Exam answer format
                </label>
                <select
                  id="exam-format"
                  value={examSubtype}
                  onChange={(e) => onSelectExamSubtype(e.target.value as ExamSubtype)}
                  className="h-[30px] rounded-md border border-line bg-surface px-2 text-xs text-foreground"
                >
                  {EXAM_FORMATS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </>
            )}

            <button
              type="button"
              onClick={() => onSend()}
              disabled={!canSend}
              aria-label="Send question"
              title="Send (Enter)"
              className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-fg transition-opacity disabled:opacity-35"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-faint">
          Answers are generated from the indexed text and can be wrong. Check the cited passage before relying on one.
        </p>
      </div>
    </div>
  );
}
