"use client";

import React from "react";
import { CheckCircle, XCircle, Zap, ShieldAlert, Sparkles, BookOpen } from "lucide-react";

export function ComparisonMatrix() {
  return (
    <section className="px-4 sm:px-6 py-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b-2 border-[#09090B] pb-4">
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#09090B] tracking-widest">
          <span className="w-2.5 h-2.5 bg-[#D2E823] border border-[#09090B]" />
          PEDAGOGICAL ARCHITECTURE
        </div>
        <h2 className="mt-1 text-3xl sm:text-5xl font-display uppercase tracking-tight text-[#09090B] glitch-hover">
          WHY TEM-AI IS NOT A GENERIC CHATBOT
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generic Chatbot Card */}
        <div className="bg-white border-2 border-[#09090B] rounded-2xl p-6 shadow-hard-lg space-y-4">
          <div className="border-b-2 border-[#09090B] pb-3 flex items-center justify-between">
            <div className="font-display text-sm uppercase tracking-tight text-slate-800">
              GENERIC LLM CHATBOT (ChatGPT with PDF)
            </div>
            <span className="bg-red-100 text-red-700 text-[10px] font-mono font-bold px-2 py-0.5 border border-red-300 rounded">
              UNRELIABLE
            </span>
          </div>

          <ul className="space-y-3 font-grotesk text-xs sm:text-sm text-slate-700 font-medium">
            <li className="flex items-start gap-2.5">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>Dumps unformatted walls of text with zero visual instrument feedback.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>Hallucinates fake Carter textbook page numbers and phantom equations.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>Zero interactive physics: cannot compute accelerating voltage or observe reciprocal space spot movement.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>Cannot segment real TEM micrograph particles or calculate calibrated size distributions.</span>
            </li>
          </ul>
        </div>

        {/* TEM-AI Carter Agent Workstation Card */}
        <div className="bg-[#D2E823] border-2 border-[#09090B] rounded-2xl p-6 shadow-hard-lg space-y-4">
          <div className="border-b-2 border-[#09090B] pb-3 flex items-center justify-between">
            <div className="font-display text-sm uppercase tracking-tight text-[#09090B]">
              TEM-AI GROUNDED AGENT WORKSTATION
            </div>
            <span className="bg-[#09090B] text-[#D2E823] text-[10px] font-mono font-bold px-2 py-0.5 border border-[#09090B] rounded shadow-[1px_1px_0px_#09090B]">
              GROUNDED RAG
            </span>
          </div>

          <ul className="space-y-3 font-grotesk text-xs sm:text-sm text-[#09090B] font-medium">
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-[#09090B] shrink-0 mt-0.5" />
              <span>
                Strict separation between <strong>&ldquo;From Carter&rdquo;</strong> (verifiable textbook citations) and <strong>&ldquo;Additional Explanation&rdquo;</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-[#09090B] shrink-0 mt-0.5" />
              <span>
                Authentic interactive physics: relativistic de Broglie kinematics &amp; SAED camera constant $R\cdot d = \lambda\cdot L$.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-[#09090B] shrink-0 mt-0.5" />
              <span>
                Scroll-driven TEM column dissection (/anatomy): inspect every optical stage from FEG tip to direct CMOS camera.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-[#09090B] shrink-0 mt-0.5" />
              <span>
                Computer-vision particle size distribution lab with calibrated scale bars and university exam rubrics.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
