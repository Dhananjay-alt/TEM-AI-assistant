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
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center text-center space-y-8 select-none">
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-full text-xs font-display font-black tracking-tight uppercase shadow-hard-xs">
        <Sparkles className="w-3.5 h-3.5 fill-current" />
        <span>CARTER AGENT // ELECTRON OPTICS INTELLIGENCE</span>
      </div>

      {/* Main Headline */}
      <div className="space-y-3 max-w-2xl">
        <h1 className="text-4xl sm:text-6xl font-display uppercase tracking-tight text-[#09090B] leading-[0.95]">
          Ask anything about TEM.
        </h1>
        <p className="font-grotesk text-sm sm:text-base text-slate-700 max-w-xl mx-auto leading-relaxed">
          Understand electron optics, diffraction, imaging, contrast mechanisms, specimen preparation, or troubleshoot a TEM column.
        </p>
        <p className="font-mono text-[11px] text-slate-500 font-bold uppercase tracking-wider">
          Grounded in David B. Williams &amp; C. Barry Carter, <em>Transmission Electron Microscopy</em>.
        </p>
      </div>

      {/* 6 Suggestion Prompt Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {PROMPT_SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(item.prompt)}
            className="group p-3.5 bg-white hover:bg-[#D2E823] border-2 border-[#09090B] rounded-xl shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-xs active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex flex-col justify-between gap-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-bold bg-[#09090B] text-[#D2E823] group-hover:bg-[#09090B] group-hover:text-white px-2 py-0.5 rounded">
                {item.tag}
              </span>
              <span className="font-mono text-[10px] text-slate-500 group-hover:text-slate-800">
                {item.chapter}
              </span>
            </div>

            <div className="font-display text-xs sm:text-[13px] text-[#09090B] font-bold leading-snug">
              {item.title}
            </div>

            <p className="font-grotesk text-[11px] text-slate-600 group-hover:text-slate-900 line-clamp-2 leading-relaxed">
              {item.prompt}
            </p>

            <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-[#09090B] pt-1">
              <span>Send prompt</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
