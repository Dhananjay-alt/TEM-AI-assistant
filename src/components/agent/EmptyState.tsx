"use client";

import React from "react";
import { Sparkles, ArrowRight, BookOpen, Layers, Atom, Eye, Wrench, FileQuestion } from "lucide-react";

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

const PROMPT_SUGGESTIONS = [
  {
    title: "Explain Scherzer defocus",
    prompt: "Explain Scherzer defocus and how it optimizes the Contrast Transfer Function (CTF) in HRTEM.",
    tag: "PHASE CONTRAST",
    chapter: "Carter Ch. 28",
  },
  {
    title: "Why does diffraction contrast occur?",
    prompt: "Why does diffraction contrast occur in TEM, and how does the objective aperture control it?",
    tag: "IMAGING OPTICS",
    chapter: "Carter Ch. 22",
  },
  {
    title: "Derive relativistic electron wavelength",
    prompt: "Derive the relativistic electron wavelength equation at 200 kV and explain why electrons have picometer wavelengths.",
    tag: "BEAM PHYSICS",
    chapter: "Carter Ch. 1",
  },
  {
    title: "Explain the TEM column structure",
    prompt: "Explain the TEM column from electron gun to detector, detailing each lens and aperture system.",
    tag: "INSTRUMENT ANATOMY",
    chapter: "Carter Ch. 6 & 9",
  },
  {
    title: "Compare Bright-Field and Dark-Field",
    prompt: "Compare Bright-Field (BF), Displaced-Aperture DF, and Centered Dark-Field (CDF) imaging in detail.",
    tag: "DIFFRACTION CONTRAST",
    chapter: "Carter Ch. 13",
  },
  {
    title: "How to determine Burgers vector g·b = 0?",
    prompt: "How do you determine a dislocation's Burgers vector using the two-beam g·b = 0 invisibility criterion?",
    tag: "DEFECT ANALYSIS",
    chapter: "Carter Ch. 23",
  },
];

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  // Show 4 top prompt cards in empty state so the chat input is always immediately visible
  const displayedPrompts = PROMPT_SUGGESTIONS.slice(0, 4);

  return (
    <div className="max-w-2xl mx-auto px-4 py-2 sm:py-4 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-5 select-none my-auto">
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-full text-[11px] font-display font-black tracking-tight uppercase shadow-hard-xs">
        <Sparkles className="w-3 h-3 fill-current" />
        <span>CARTER AGENT // ELECTRON OPTICS INTELLIGENCE</span>
      </div>

      {/* Main Headline */}
      <div className="space-y-1.5 max-w-xl">
        <h1 className="text-2xl sm:text-4xl font-display uppercase tracking-tight text-[#09090B] leading-none">
          Ask anything about TEM.
        </h1>
        <p className="font-grotesk text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
          Understand electron optics, diffraction, imaging, contrast mechanisms, specimen preparation, or troubleshoot a TEM column.
        </p>
        <p className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          Grounded in David B. Williams &amp; C. Barry Carter, <em>Transmission Electron Microscopy</em>.
        </p>
      </div>

      {/* 4 Sleek Suggestion Prompt Chips */}
      <div className="w-full max-w-xl flex flex-wrap items-center justify-center gap-2 pt-1">
        {displayedPrompts.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(item.prompt)}
            className="group px-3 py-2 bg-white hover:bg-[#D2E823] border-2 border-[#09090B] rounded-xl shadow-hard-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 text-left"
          >
            <span className="font-mono text-[9px] font-bold bg-[#09090B] text-[#D2E823] group-hover:bg-[#09090B] group-hover:text-white px-1.5 py-0.5 rounded shrink-0">
              {item.tag}
            </span>
            <span className="font-display text-xs text-[#09090B] font-bold leading-none">
              {item.title}
            </span>
            <ArrowRight className="w-3 h-3 text-[#09090B] opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
