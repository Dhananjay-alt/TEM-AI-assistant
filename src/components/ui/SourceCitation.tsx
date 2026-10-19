import React, { useState } from "react";
import { BookOpen, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { RetrievedSource } from "@/lib/rag/vector-search";

interface SourceCitationProps {
  source: RetrievedSource;
  index: number;
}

export function SourceCitation({ source, index }: SourceCitationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="brutal-border bg-surface-warm text-foreground text-xs font-mono transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-2.5 flex items-center justify-between hover:bg-[#EBE4D5] transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="bg-foreground text-background font-bold px-1.5 py-0.5 text-[10px] shrink-0">
            [{String(index + 1).padStart(2, "0")}]
          </span>
          <span className="font-bold truncate text-slate-900">
            Carter Ch. {source.chapterNumber}: {source.chapterTitle}
          </span>
          <span className="text-slate-500 hidden sm:inline text-[11px]">
            §{source.sectionNumber} (p. {source.page}-{source.pageEnd})
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] bg-white border border-border px-1 py-0.5 text-slate-700">
            {(source.relevanceScore * 100).toFixed(0)}% MATCH
          </span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3 border-t-2 border-border bg-white space-y-2">
          <div className="text-[11px] font-sans font-semibold text-slate-700">
            {source.sectionTitle}
          </div>
          <div className="p-2.5 bg-surface-warm border border-slate-300 text-slate-800 text-[11px] leading-relaxed italic">
            "{source.excerpt}"
          </div>
          <div className="space-y-1 pt-1">
            <span className="text-[10px] uppercase font-bold text-slate-600 block">
              Core Principles (Williams & Carter):
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 font-sans">
              {source.pedagogicalKeyPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
          {source.figureRef && (
            <div className="text-[10px] text-blue-700 font-mono bg-blue-50 p-1.5 border border-blue-200">
              🖼️ {source.figureRef}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
