"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

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
];

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 select-none my-auto z-10 relative">
      {/* Top Luxury Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FF4500]/10 text-[#FF4500] border border-[#FF4500]/30 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(255,69,0,0.2)]">
        <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse text-[#FF4500]" />
        <span>CARTER AGENT // ELECTRON OPTICS INTELLIGENCE</span>
      </div>

      {/* Main Luxury Headline */}
      <div className="space-y-3 max-w-xl">
        <h1 className="text-3xl sm:text-5xl font-serif text-white leading-[1.1] tracking-tight">
          Superintelligence for{" "}
          <span className="italic font-normal text-white/90">Electron Microscopy.</span>
        </h1>
        <p className="font-sans text-xs sm:text-sm text-white/60 max-w-md mx-auto leading-relaxed">
          Ask anything about electron optics, diffraction crystallography, phase contrast, Scherzer defocus, or troubleshoot your TEM column.
        </p>
        <p className="font-mono text-[10px] text-white/40 font-medium uppercase tracking-widest">
          Grounded in David B. Williams &amp; C. Barry Carter, <span className="italic text-white/60">Transmission Electron Microscopy</span>.
        </p>
      </div>

      {/* 4 Sleek Obsidian Suggestion Prompt Cards */}
      <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
        {PROMPT_SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(item.prompt)}
            className="group p-3 bg-[#111111]/90 hover:bg-[#18181b] border border-white/10 hover:border-[#FF4500]/60 rounded-xl transition-all flex flex-col justify-between text-left gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(255,69,0,0.15)] cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-mono text-[9px] font-bold bg-[#FF4500]/15 text-[#FF4500] border border-[#FF4500]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {item.tag}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-[#FF4500] group-hover:translate-x-0.5 transition-all" />
            </div>
            <span className="font-sans text-xs text-white/90 group-hover:text-white font-medium leading-snug">
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

