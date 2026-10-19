"use client";

import React from "react";
import { AnatomyChapter as AnatomyChapterType } from "./types";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BookOpen, Layers, ArrowRight, Zap, CheckCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnatomyChapterProps {
  chapter: AnatomyChapterType;
  isActive: boolean;
  onInspect: (componentId: string) => void;
  className?: string;
}

export function AnatomyChapter({
  chapter,
  isActive,
  onInspect,
  className,
}: AnatomyChapterProps) {
  return (
    <article
      id={`chapter-${chapter.id}`}
      className={cn(
        "min-h-[80vh] flex flex-col justify-center py-12 transition-all duration-300",
        className
      )}
    >
      <BrutalCard
        variant={isActive ? "default" : "warm"}
        shadowSize={isActive ? "lg" : "sm"}
        titleBar={`CHAPTER ${chapter.number} // ${chapter.componentId.toUpperCase()}`}
        titleBarBadge={chapter.systemStatus.beam}
        className={cn(
          "transition-all duration-300",
          isActive ? "border-[#0F172A] bg-white ring-2 ring-[#0F172A]" : "border-slate-300 opacity-80"
        )}
      >
        <div className="space-y-5 font-sans">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black bg-[#FF5722] text-white px-2 py-0.5 border border-border">
                {chapter.number}
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
                {chapter.subtitle}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
              {chapter.title}
            </h2>
          </div>

          {/* Function & Key Idea */}
          <div className="space-y-3">
            <div className="p-3 bg-surface-warm border-2 border-border text-xs leading-relaxed text-slate-900">
              <div className="font-mono font-bold uppercase text-[#FF5722] text-[11px] mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#FF5722]" />
                FUNCTION
              </div>
              <p>{chapter.functionSummary}</p>
            </div>

            <div className="p-3 bg-[#FEF3C7] border-2 border-border text-xs leading-relaxed text-slate-900">
              <div className="font-mono font-bold uppercase text-amber-800 text-[11px] mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-hazard-amber" />
                KEY IDEA
              </div>
              <p>{chapter.keyIdea}</p>
            </div>
          </div>

          {/* Technical Specs Grid */}
          <div className="space-y-1.5">
            <div className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              TECHNICAL READOUT & OPERATIONAL VALUES
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {chapter.specs.map((spec, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-2 border font-mono text-[11px]",
                    spec.highlight
                      ? "bg-[#0F172A] text-white border-border"
                      : "bg-surface border-slate-300 text-slate-800"
                  )}
                >
                  <div className="text-[9px] uppercase tracking-wider text-slate-400">
                    {spec.label}
                  </div>
                  <div className="font-bold font-mono">
                    {spec.value} {spec.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carter Textbook Grounding */}
          <div className="p-2.5 bg-slate-50 border border-slate-300 flex items-start gap-2 font-mono text-[11px] text-slate-700">
            <BookOpen className="w-4 h-4 text-[#FF5722] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">{chapter.carterRef.chapter}: </span>
              <span>{chapter.carterRef.title}</span>
              <div className="text-[10px] text-slate-500 italic mt-0.5">
                Topic: {chapter.carterRef.topic}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t-2 border-slate-200">
            <button
              onClick={() => onInspect(chapter.componentId)}
              className="text-xs font-mono font-bold text-slate-700 hover:text-[#FF5722] flex items-center gap-1 underline underline-offset-4"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inspect Component Details →</span>
            </button>

            {chapter.buttonAction && (
              <a href={chapter.buttonAction.href}>
                <BrutalButton variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                  {chapter.buttonAction.label}
                </BrutalButton>
              </a>
            )}
          </div>
        </div>
      </BrutalCard>
    </article>
  );
}
