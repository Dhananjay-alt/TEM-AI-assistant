"use client";

import React, { useState } from "react";
import { ANATOMY_CHAPTERS } from "./chapters";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";

interface AnatomyChapterNavProps {
  activeChapterIndex: number;
  onSelectChapter: (index: number) => void;
  className?: string;
}

export function AnatomyChapterNav({
  activeChapterIndex,
  onSelectChapter,
  className,
}: AnatomyChapterNavProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const currentChapter = ANATOMY_CHAPTERS[activeChapterIndex] || ANATOMY_CHAPTERS[0];

  return (
    <>
      {/* ========================================================
          DESKTOP STICKY LADDER NAVIGATION
      ======================================================== */}
      <nav
        aria-label="TEM Anatomy Chapters"
        className={cn(
          "hidden xl:flex flex-col gap-1.5 p-3 bg-surface border border-border brutal-shadow-sm font-mono text-xs select-none",
          className
        )}
      >
        <div className="pb-2 mb-1 border-b border-border flex items-center justify-between text-[11px] font-semibold text-foreground tracking-wide">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-accent" />
            Optical chain
          </span>
          <span className="bg-inverse text-inverse-fg px-1 py-0.2 text-[9px]">
            {String(activeChapterIndex + 1).padStart(2, "0")}/{String(ANATOMY_CHAPTERS.length).padStart(2, "0")}
          </span>
        </div>

        {ANATOMY_CHAPTERS.map((ch, idx) => {
          const isActive = activeChapterIndex === idx;
          return (
            <button
              key={ch.id}
              onClick={() => onSelectChapter(idx)}
              className={cn(
                "group text-left px-2.5 py-1.5 transition-all border flex items-center gap-2 font-bold",
                isActive
                  ? "bg-inverse text-white border-line shadow-neo-xs"
                  : "bg-surface-warm/60 border-transparent text-foreground hover:border-border hover:bg-surface"
              )}
            >
              <span
                className={cn(
                  "text-[10px] px-1 py-0.2 font-mono font-semibold",
                  isActive
                    ? "bg-accent-strong text-white"
                    : "bg-line text-foreground group-hover:bg-line"
                )}
              >
                {ch.number}
              </span>
              <span className="truncate tracking-tight text-[11px]">{ch.title}</span>
            </button>
          );
        })}
      </nav>

      {/* ========================================================
          MOBILE COMPACT FLOATING INDICATOR (03 / 07  SPECIMEN)
      ======================================================== */}
      <div className="xl:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="bg-inverse text-white border border-line shadow-neo-md p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-accent-strong text-white font-mono font-semibold text-xs px-2 py-0.5 border border-line">
              {currentChapter.number} / 07
            </span>
            <div>
              <div className="text-xs font-semibold tracking-wide font-sans leading-tight">
                {currentChapter.title}
              </div>
              <div className="text-[10px] font-mono text-slate-300 truncate max-w-[190px] sm:max-w-xs">
                {currentChapter.subtitle}
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-1.5 bg-inverse hover:bg-inverse border border-line-strong text-white flex items-center gap-1 text-[11px] font-mono"
            aria-expanded={mobileDrawerOpen}
            aria-label="Toggle all chapters list"
          >
            <span>CHAPTERS</span>
            {mobileDrawerOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileDrawerOpen && (
          <div className="mt-1 bg-surface border border-border shadow-neo-lg p-2 max-h-60 overflow-y-auto space-y-1 font-mono text-xs">
            {ANATOMY_CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  onSelectChapter(idx);
                  setMobileDrawerOpen(false);
                }}
                className={cn(
                  "w-full text-left p-2 border flex items-center justify-between",
                  activeChapterIndex === idx
                    ? "bg-inverse text-white border-border"
                    : "bg-surface-warm border-line hover:bg-surface text-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-accent">{ch.number}</span>
                  <span className="font-bold">{ch.title}</span>
                </div>
                <span className="text-[10px] text-faint">{ch.subtitle}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
