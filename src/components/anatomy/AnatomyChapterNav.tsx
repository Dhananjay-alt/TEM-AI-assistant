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
          "hidden xl:flex flex-col gap-1.5 p-3 bg-surface border-2 border-border brutal-shadow-sm font-mono text-xs select-none",
          className
        )}
      >
        <div className="pb-2 mb-1 border-b-2 border-border flex items-center justify-between text-[11px] font-black uppercase text-slate-900 tracking-wider">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#FF5722]" />
            OPTICAL CHAIN
          </span>
          <span className="bg-foreground text-background px-1 py-0.2 text-[9px]">
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
                  ? "bg-[#0F172A] text-white border-[#0F172A] shadow-neo-xs translate-x-1"
                  : "bg-surface-warm/60 border-transparent text-slate-700 hover:border-border hover:bg-white"
              )}
            >
              <span
                className={cn(
                  "text-[10px] px-1 py-0.2 font-mono font-black",
                  isActive
                    ? "bg-[#FF5722] text-white"
                    : "bg-slate-200 text-slate-700 group-hover:bg-slate-300"
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
        <div className="bg-[#0F172A] text-white border-2 border-[#0F172A] shadow-neo-md p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-[#FF5722] text-white font-mono font-black text-xs px-2 py-0.5 border border-white">
              {currentChapter.number} / 07
            </span>
            <div>
              <div className="text-xs font-black uppercase tracking-wider font-sans leading-tight">
                {currentChapter.title}
              </div>
              <div className="text-[10px] font-mono text-slate-300 truncate max-w-[190px] sm:max-w-xs">
                {currentChapter.subtitle}
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white flex items-center gap-1 text-[11px] font-mono"
            aria-expanded={mobileDrawerOpen}
            aria-label="Toggle all chapters list"
          >
            <span>CHAPTERS</span>
            {mobileDrawerOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileDrawerOpen && (
          <div className="mt-1 bg-surface border-2 border-border shadow-neo-lg p-2 max-h-60 overflow-y-auto space-y-1 font-mono text-xs">
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
                    ? "bg-[#0F172A] text-white border-border"
                    : "bg-surface-warm border-slate-200 hover:bg-white text-slate-800"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#FF5722]">{ch.number}</span>
                  <span className="font-bold uppercase">{ch.title}</span>
                </div>
                <span className="text-[10px] text-slate-400">{ch.subtitle}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
