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
    <div className="bg-white border-2 border-[#09090B] rounded-lg overflow-hidden shadow-hard-xs text-xs font-grotesk transition-all">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-2.5 flex items-center justify-between hover:bg-[#F8F4E8] transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="bg-[#09090B] text-[#D2E823] font-mono font-bold px-1.5 py-0.5 text-[10px] rounded shrink-0">
            [{String(index + 1).padStart(2, "0")}]
          </span>
          <span className="font-display font-bold text-xs text-[#09090B] truncate">
            Ch. {source.chapterNumber}: {source.chapterTitle}
          </span>
          <span className="text-slate-600 font-mono text-[11px] hidden sm:inline">
            §{source.sectionNumber} (pp. {source.page}–{source.pageEnd})
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono font-bold bg-[#D2E823] text-[#09090B] px-1.5 py-0.5 rounded border border-[#09090B]">
            {Math.round((source.relevanceScore || 0.95) * 100)}% MATCH
          </span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {expanded && (
        <div className="p-3 border-t-2 border-[#09090B] bg-[#F8F4E8] space-y-2.5">
          <div className="font-display text-[11px] text-[#09090B] font-bold">
            Section {source.sectionNumber}: {source.sectionTitle}
          </div>

          <div className="p-2.5 bg-white border border-[#09090B] rounded-md font-mono text-[11px] text-slate-800 leading-relaxed italic">
            "{source.excerpt}"
          </div>

          {source.pedagogicalKeyPoints && source.pedagogicalKeyPoints.length > 0 && (
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-700 block">
                Key Pedagogical Concepts (Williams & Carter):
              </span>
              <ul className="list-disc list-inside space-y-0.5 font-grotesk text-[11px] text-slate-800">
                {source.pedagogicalKeyPoints.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          {source.formulas && source.formulas.length > 0 && (
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-700 block">
                Governing Equation:
              </span>
              <div className="p-1.5 bg-[#09090B] text-[#D2E823] rounded font-mono text-xs">
                {source.formulas.join("  |  ")}
              </div>
            </div>
          )}

          {source.figureRef && (
            <div className="text-[10px] text-slate-700 font-mono bg-white p-1.5 border border-slate-300 rounded">
              📚 {source.figureRef}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
