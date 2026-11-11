"use client";

import React, { useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";
import { Message } from "./types";
import { ToolLauncher } from "./ToolLauncher";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { sourceLocator, sourceTitle } from "./SourceViewer";

const MODE_LABEL: Record<string, string> = {
  ASK: "Ask",
  TUTOR: "Tutor",
  EXAM: "Exam",
  EXPERIMENT: "Laboratory",
};

interface MessageItemProps {
  message: Message;
  /** Index of the citation of this message that is open in the viewer, if any. */
  activeCitation: number | null;
  onOpenCitation: (messageId: string, index: number) => void;
  onSelectPrompt?: (prompt: string) => void;
  onRegenerate?: (messageId: string) => void;
}

export function MessageItem({
  message,
  activeCitation,
  onOpenCitation,
  onSelectPrompt,
  onRegenerate,
}: MessageItemProps) {
  const [copied, setCopied] = useState(false);

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-surface-2 px-4 py-2.5 text-[15px] leading-7 text-foreground">
          {message.content}
        </div>
      </div>
    );
  }

  // Conversations saved by earlier versions stored the answer in two parts.
  const text =
    message.content ||
    [message.fromCarter, message.additionalExplanation].filter(Boolean).join("\n\n");
  const citations = message.citations || [];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable; nothing to do
    }
  };

  const action =
    "inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted hover:bg-surface-2 hover:text-foreground transition-colors";

  return (
    <article className="space-y-4">
      <MarkdownRenderer
        content={text}
        citationCount={citations.length}
        activeCitation={activeCitation}
        onCite={(i) => onOpenCitation(message.id, i)}
      />

      {citations.length > 0 && (
        <section aria-label="Sources">
          <h4 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-faint">Sources</h4>
          <ol className="divide-y divide-line overflow-hidden rounded-md border border-line bg-surface">
            {citations.map((src, i) => {
              const active = activeCitation === i;
              return (
                <li key={src.chunkId || i}>
                  <button
                    type="button"
                    onClick={() => onOpenCitation(message.id, i)}
                    aria-pressed={active}
                    className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors ${
                      active ? "bg-accent-soft" : "hover:bg-surface-2"
                    }`}
                  >
                    <span className="cite mt-0.5 shrink-0" data-active={active} aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2 text-sm">
                        <span className="font-medium text-foreground">{sourceTitle(src)}</span>
                        <span className="text-muted">{sourceLocator(src)}</span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[13px] leading-5 text-muted">
                        {src.excerpt}
                      </span>
                    </span>
                    <span className="mt-0.5 hidden shrink-0 text-xs text-accent sm:block">
                      {src.kind === "pdf" ? "Open page" : "View passage"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <ToolLauncher query={text} citations={citations} />

      <div className="flex flex-wrap items-center gap-1 text-xs text-faint">
        <button type="button" onClick={handleCopy} className={action}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
        {onRegenerate && (
          <button type="button" onClick={() => onRegenerate(message.id)} className={action}>
            <RotateCcw className="h-3.5 w-3.5" />
            Regenerate
          </button>
        )}
        <span className="ml-auto">
          {MODE_LABEL[message.mode] || message.mode}
          {message.provider ? ` · ${message.provider}` : ""}
          {message.timestamp ? ` · ${message.timestamp}` : ""}
        </span>
      </div>

      {onSelectPrompt && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
        <section aria-label="Related questions" className="border-t border-line pt-3">
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-faint">Related questions</h4>
          <ul>
            {message.suggestedQuestions.map((q, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => onSelectPrompt(q)}
                  className="w-full rounded px-2 py-1.5 text-left text-sm text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
                >
                  {q}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
