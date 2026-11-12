"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
  bookTitle?: string;
  /** True when references open the page itself (local use with the PDF). */
  showsPages?: boolean;
}

const EXAMPLES = [
  "Why do electrons give better resolution than visible light?",
  "What is the difference between bright-field and dark-field imaging?",
  "How is the camera constant used to index a diffraction pattern?",
  "What sets the Scherzer defocus in HRTEM?",
];

export function EmptyState({ onSelectPrompt, bookTitle, showsPages }: EmptyStateProps) {
  const opens = !bookTitle
    ? "open the source passage it comes from, with the supporting lines highlighted"
    : showsPages
    ? "open the page of the textbook it comes from, with the supporting lines highlighted"
    : "see the chapter, section and page of the textbook it comes from";
  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center px-4 py-12 sm:px-6">
      <h1 className="font-serif text-[28px] font-semibold leading-tight text-foreground">
        Transmission electron microscopy reference
      </h1>
      <p className="mt-3 text-[15px] leading-7 text-muted">
        Ask a question and get an answer with numbered references. Select a reference to {opens}.
      </p>

      <div className="mt-8">
        <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-faint">Example questions</div>
        <ul className="divide-y divide-line overflow-hidden rounded-md border border-line bg-surface">
          {EXAMPLES.map((q) => (
            <li key={q}>
              <button
                type="button"
                onClick={() => onSelectPrompt(q)}
                className="group flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left text-sm text-foreground hover:bg-surface-2 transition-colors"
              >
                <span>{q}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-faint group-hover:text-foreground" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
