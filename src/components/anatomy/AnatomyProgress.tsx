"use client";

import React from "react";
import { ANATOMY_CHAPTERS } from "./chapters";
import { cn } from "@/lib/utils";

interface AnatomyProgressProps {
  progress: number; // 0 to 100
  activeChapterIndex: number;
  className?: string;
}

export function AnatomyProgress({
  progress,
  activeChapterIndex,
  className,
}: AnatomyProgressProps) {
  const currentChapter = ANATOMY_CHAPTERS[activeChapterIndex] || ANATOMY_CHAPTERS[0];

  return (
    <div
      className={cn(
        "bg-surface border-2 border-border brutal-shadow-sm p-3 font-mono text-xs select-none",
        className
      )}
      aria-label="Dissection Scroll Progress"
    >
      <div className="flex items-center justify-between text-[11px] font-bold pb-1.5 border-b-2 border-border mb-2">
        <span className="uppercase text-slate-900 tracking-wider">DISSECTION PROGRESS</span>
        <span className="text-[#FF5722] font-black">{Math.round(progress)}%</span>
      </div>

      {/* Brutalist Progress Bar */}
      <div className="h-3 w-full bg-[#E2E8F0] border-2 border-border relative overflow-hidden mb-2">
        <div
          className="h-full bg-[#FF5722] transition-all duration-150 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-600">
        <span className="font-bold text-foreground">
          SECTION {currentChapter.number} / 07
        </span>
        <span className="truncate max-w-[140px] text-right font-medium">
          {currentChapter.title}
        </span>
      </div>

      {/* Segmented dot indicators */}
      <div className="mt-2.5 flex items-center justify-between gap-1">
        {ANATOMY_CHAPTERS.map((ch, idx) => (
          <div
            key={ch.id}
            title={`${ch.number} ${ch.title}`}
            className={cn(
              "h-1.5 flex-1 transition-colors border border-border",
              idx < activeChapterIndex
                ? "bg-[#0F172A]"
                : idx === activeChapterIndex
                ? "bg-[#FF5722]"
                : "bg-slate-200"
            )}
          />
        ))}
      </div>
    </div>
  );
}
