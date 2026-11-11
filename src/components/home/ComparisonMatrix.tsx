"use client";

import React from "react";
import { CheckCircle, XCircle, Zap, ShieldAlert, Sparkles, BookOpen } from "lucide-react";

export function ComparisonMatrix() {
  return (
    <section className="px-4 sm:px-6 py-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-line pb-4">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground tracking-wide">
          <span className="w-2.5 h-2.5 bg-accent-soft border border-line" />
          Pedagogical architecture
        </div>
        <h2 className="mt-1 text-3xl sm:text-5xl tracking-tight text-foreground">
          Why TEM-AI is not a generic chatbot
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generic Chatbot Card */}
        <div className="bg-surface border border-line rounded-2xl p-6 shadow-hard-lg space-y-4">
          <div className="border-b border-line pb-3 flex items-center justify-between">
            <div className="font-display text-sm tracking-tight text-foreground">
              GENERIC LLM CHATBOT (ChatGPT with PDF)
            </div>
            <span className="bg-red-100 text-red-700 text-[10px] font-mono font-bold px-2 py-0.5 border border-red-300 rounded">
              UNRELIABLE
            </span>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-foreground font-medium">
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
        <div className="bg-accent-soft border border-line rounded-2xl p-6 shadow-hard-lg space-y-4">
          <div className="border-b border-line pb-3 flex items-center justify-between">
            <div className="font-display text-sm tracking-tight text-foreground">
              TEM-AI grounded agent workstation
            </div>
            <span className="bg-inverse text-accent-inv text-[10px] font-mono font-bold px-2 py-0.5 border border-line rounded shadow-[1px_1px_0px_#09090B]">
              Grounded RAG
            </span>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-foreground font-medium">
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
              <span>
                Strict separation between <strong>&ldquo;From Carter&rdquo;</strong> (verifiable textbook citations) and <strong>&ldquo;Additional Explanation&rdquo;</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
              <span>
                Authentic interactive physics: relativistic de Broglie kinematics &amp; SAED camera constant $R\cdot d = \lambda\cdot L$.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
              <span>
                Scroll-driven TEM column dissection (/anatomy): inspect every optical stage from FEG tip to direct CMOS camera.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
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
