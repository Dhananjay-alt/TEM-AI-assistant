"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Search, ArrowRight, Bookmark } from "lucide-react";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import { CARTER_TEXTBOOK_CHUNKS, CarterChunk } from "@/data/carter-textbook-data";

export function CarterReader() {
  const [selectedChunkId, setSelectedChunkId] = useState<string>(
    CARTER_TEXTBOOK_CHUNKS[0].chunkId
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredChunks = CARTER_TEXTBOOK_CHUNKS.filter((chunk) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      chunk.chapterTitle.toLowerCase().includes(q) ||
      chunk.sectionTitle.toLowerCase().includes(q) ||
      chunk.keywords.some((k) => k.toLowerCase().includes(q)) ||
      chunk.excerpt.toLowerCase().includes(q)
    );
  });

  const activeChunk: CarterChunk =
    CARTER_TEXTBOOK_CHUNKS.find((c) => c.chunkId === selectedChunkId) ||
    CARTER_TEXTBOOK_CHUNKS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black font-sans uppercase">
            08 / CARTER TEXTBOOK BROWSER & SOURCE VIEWER
          </h2>
          <p className="text-xs font-mono text-slate-600">
            David B. Williams & C. Barry Carter: "Transmission Electron Microscopy: A Textbook for Materials Science"
          </p>
        </div>
        <ScientificBadge variant="green" hasDot>
          ORIGINAL CITATIONS & FORMULAS
        </ScientificBadge>
      </div>

      {/* Search Input */}
      <div className="brutal-border bg-white p-2.5 flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Carter chapters by keyword (e.g. diffraction contrast, Ewald sphere, Scherzer, EDS, EELS)..."
          className="w-full font-mono text-xs bg-transparent focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-[10px] font-mono text-slate-500 hover:text-foreground px-2"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chapters & Sections List */}
        <div className="lg:col-span-5 space-y-3 max-h-[640px] overflow-y-auto pr-1">
          {filteredChunks.map((chunk) => {
            const isSelected = selectedChunkId === chunk.chunkId;
            return (
              <button
                key={chunk.chunkId}
                onClick={() => setSelectedChunkId(chunk.chunkId)}
                className={`w-full text-left p-3.5 brutal-border transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? "bg-foreground text-background shadow-neo-sm -translate-x-0.5 -translate-y-0.5"
                    : "bg-white hover:bg-surface-warm text-slate-900 shadow-neo-xs"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span
                    className={
                      isSelected ? "text-hazard-amber font-bold" : "text-[#FF5722] font-bold"
                    }
                  >
                    PART {chunk.part}: {chunk.partTitle.toUpperCase()}
                  </span>
                  <span
                    className={
                      isSelected
                        ? "bg-slate-800 text-slate-200 px-1 py-0.2 border border-slate-700"
                        : "bg-surface-warm text-slate-600 px-1 py-0.2 border"
                    }
                  >
                    pp. {chunk.page}–{chunk.pageEnd}
                  </span>
                </div>

                <div className="font-sans font-bold text-xs">
                  Ch. {chunk.chapterNumber}: {chunk.chapterTitle}
                </div>

                <div
                  className={`text-[11px] font-mono truncate ${
                    isSelected ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  §{chunk.sectionNumber} {chunk.sectionTitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Full Chapter Viewer */}
        <div className="lg:col-span-7 space-y-4">
          <BrutalCard
            variant="default"
            shadowSize="lg"
            titleBar={`CARTER CHAPTER ${activeChunk.chapterNumber} • SECTION ${activeChunk.sectionNumber}`}
            titleBarBadge={`PAGES ${activeChunk.page}–${activeChunk.pageEnd}`}
            className="bg-white"
          >
            <div className="space-y-5">
              {/* Chapter & Section Header */}
              <div className="border-b-2 border-border pb-3 space-y-1">
                <div className="text-xs font-mono font-bold text-[#FF5722] uppercase">
                  Part {activeChunk.part}: {activeChunk.partTitle}
                </div>
                <h3 className="text-xl font-bold font-sans text-slate-900">
                  {activeChunk.sectionTitle}
                </h3>
                <div className="text-xs font-mono text-slate-500">
                  Book: Transmission Electron Microscopy (Williams & Carter, Springer)
                </div>
              </div>

              {/* Executive Pedagogical Summary */}
              <div className="p-3 bg-[#FEF3C7] brutal-border border-amber-900/30 font-mono text-xs text-amber-950 space-y-1">
                <div className="font-bold text-[10px] uppercase text-amber-800 flex items-center gap-1">
                  <Bookmark className="w-3 h-3 text-amber-600" />
                  CORE TAKEAWAY:
                </div>
                <p className="text-[11px] leading-relaxed font-sans font-medium">
                  {activeChunk.summary}
                </p>
              </div>

              {/* Authentic Textbook Excerpt */}
              <div className="space-y-1.5 font-mono text-xs">
                <span className="font-bold text-slate-800 uppercase text-[11px] block">
                  Ground Truth Textbook Excerpt:
                </span>
                <div className="p-4 bg-surface-warm brutal-border text-slate-900 text-xs font-serif leading-relaxed italic whitespace-pre-line">
                  "{activeChunk.excerpt}"
                </div>
              </div>

              {/* Formulas if present */}
              {activeChunk.formulas && activeChunk.formulas.length > 0 && (
                <div className="space-y-1.5 font-mono text-xs">
                  <span className="font-bold text-slate-800 uppercase text-[11px] block">
                    Mathematical Formulation:
                  </span>
                  <div className="bg-foreground text-background p-3 font-mono space-y-1.5">
                    {activeChunk.formulas.map((form, i) => (
                      <div key={i} className="text-xs font-bold tracking-wide">
                        {form}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pedagogical Key Points */}
              <div className="space-y-2 pt-2 border-t-2 border-slate-200 font-mono text-xs">
                <span className="font-bold text-slate-900 uppercase text-[11px] block">
                  Key Principles (Williams & Carter):
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 font-sans text-xs">
                  {activeChunk.pedagogicalKeyPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Figure reference */}
              {activeChunk.figureRef && (
                <div className="text-[11px] font-mono text-blue-900 bg-blue-50 p-2.5 border border-blue-200">
                  🖼️ <strong>Textbook Illustration:</strong> {activeChunk.figureRef}
                </div>
              )}

              {/* CTA: Query Ask Carter on this chapter */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href={`/ask?prompt=${encodeURIComponent(`Explain Carter Chapter ${activeChunk.chapterNumber} on ${activeChunk.sectionTitle} in detail.`)}`}
                  className="w-full sm:w-auto"
                >
                  <BrutalButton variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                    ASK CARTER AI ABOUT THIS SECTION
                  </BrutalButton>
                </Link>
                <div className="text-[10px] font-mono text-slate-500">
                  Citation Key: {activeChunk.chunkId}
                </div>
              </div>
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
