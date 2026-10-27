"use client";

import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Check, ExternalLink } from "lucide-react";
import { RetrievedSource } from "@/lib/rag/vector-search";

interface CitationCardProps {
  source: RetrievedSource;
  index: number;
}

export function CitationCard({ source, index }: CitationCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#111111]/90 backdrop-blur-md border border-white/10 hover:border-[#FF4500]/50 rounded-xl overflow-hidden shadow-lg text-xs font-sans transition-all">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="bg-[#FF4500]/15 text-[#FF4500] border border-[#FF4500]/30 font-mono font-bold px-2 py-0.5 text-[10px] rounded-full shrink-0">
            [{String(index + 1).padStart(2, "0")}]
          </span>
          <span className="font-serif font-semibold text-xs text-white truncate">
            Ch. {source.chapterNumber}: {source.chapterTitle}
          </span>
          <span className="text-white/40 font-mono text-[10px] hidden sm:inline">
            §{source.sectionNumber} (pp. {source.page}–{source.pageEnd})
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[10px] font-mono font-bold bg-[#FF4500]/20 text-[#FF4500] px-2 py-0.5 rounded-full border border-[#FF4500]/40">
            {Math.round((source.relevanceScore || 0.95) * 100)}% MATCH
          </span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-white/50" /> : <ChevronDown className="w-3.5 h-3.5 text-white/50" />}
        </div>
      </button>

      {expanded && (
        <div className="p-3.5 border-t border-white/10 bg-[#0a0a0a] space-y-3">
          <div className="font-sans text-[11px] text-white/90 font-medium">
            Section {source.sectionNumber}: {source.sectionTitle}
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl font-mono text-[11px] text-white/70 leading-relaxed italic">
            "{source.excerpt}"
          </div>

          {source.pedagogicalKeyPoints && source.pedagogicalKeyPoints.length > 0 && (
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-[#FF4500] block">
                Key Pedagogical Concepts (Williams &amp; Carter):
              </span>
              <ul className="list-disc list-inside space-y-0.5 font-sans text-[11px] text-white/70">
                {source.pedagogicalKeyPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          {source.formulas && source.formulas.length > 0 && (
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-[#FF4500] block">
                Governing Equation:
              </span>
              <div className="p-2 bg-[#18181b] text-white border border-white/10 rounded-lg font-mono text-xs">
                {source.formulas.join("  |  ")}
              </div>
            </div>
          )}

          {source.figureRef && (
            <div className="text-[10px] text-white/60 font-mono bg-white/5 p-2 border border-white/10 rounded-lg">
              📚 {source.figureRef}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
