import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Atom,
  CheckCircle,
  XCircle,
  Sparkles,
} from "lucide-react";
import { ElectronBeamHero } from "@/components/home/ElectronBeamHero";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalButton } from "@/components/ui/BrutalButton";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* 1. Hero Section with Live Animated Electron Beam */}
      <ElectronBeamHero />

      {/* 2. Interactive Feature Grid (The 6 Modules) */}
      <FeatureGrid />

      {/* 3. "Virtual TEM Lab vs Generic Chatbot" Comparison Matrix */}
      <section className="py-12 bg-surface-warm border-y-[3px] border-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="border-b-2 border-border pb-3">
            <div className="text-xs font-mono font-bold uppercase text-[#FF5722] tracking-widest flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 bg-[#FF5722]"></span>
              PEDAGOGICAL ARCHITECTURE
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-sans uppercase text-foreground">
              WHY TEM-AI IS NOT A GENERIC CHATBOT
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Generic Chatbot Card */}
            <BrutalCard
              variant="default"
              shadowSize="md"
              titleBar="GENERIC LLM CHATBOT (e.g., ChatGPT with PDF)"
              className="bg-white border-slate-400"
            >
              <ul className="space-y-3 font-mono text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Dumps unformatted walls of text with zero visual instrument feedback.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Hallucinates fake Carter textbook page numbers and phantom equations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Zero interactive simulations: cannot change accelerating voltage or observe SAED spot movement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>Cannot segment real TEM micrograph particles or calculate size distributions.</span>
                </li>
              </ul>
            </BrutalCard>

            {/* TEM-AI Virtual Workstation Card */}
            <BrutalCard
              variant="cyan"
              shadowSize="md"
              titleBar="TEM-AI VIRTUAL LABORATORY WORKSTATION"
              className="bg-[#E0F7FE] border-[#0284C7]"
            >
              <ul className="space-y-3 font-mono text-xs text-slate-900 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Strict separation between <strong>"From Carter"</strong> (grounded text) and <strong>"Additional Explanation"</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Authentic interactive physics: relativistic de Broglie kinematics & SAED camera constant R·d = λ·L.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Computer-vision blob detection on canvas: real-time particle size histograms with calibrated scale bars.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Exam grading rubrics (2, 5, 10 marks & Viva) with automated good/missing checklists.
                  </span>
                </li>
              </ul>
            </BrutalCard>
          </div>
        </div>
      </section>

      {/* 4. Student Progress Dashboard Bar */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
        <BrutalCard
          variant="default"
          shadowSize="lg"
          titleBar="STUDENT LABORATORY DASHBOARD / LEARNING METRICS"
          titleBarBadge="SESSION TELEMETRY"
          className="bg-white"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
            <div className="p-3 bg-surface-warm brutal-border">
              <div className="text-[10px] text-slate-500 uppercase">Textbook Grounding</div>
              <div className="text-2xl font-black text-foreground">100%</div>
              <div className="text-[9px] text-emerald-600 font-bold">Williams & Carter</div>
            </div>
            <div className="p-3 bg-surface-warm brutal-border">
              <div className="text-[10px] text-slate-500 uppercase">Interactive Simulators</div>
              <div className="text-2xl font-black text-[#0284C7]">3 Labs</div>
              <div className="text-[9px] text-slate-600">Wavelength, SAED, BF/DF</div>
            </div>
            <div className="p-3 bg-surface-warm brutal-border">
              <div className="text-[10px] text-slate-500 uppercase">Exam Question Bank</div>
              <div className="text-2xl font-black text-[#FF5722]">20+ Qs</div>
              <div className="text-[9px] text-slate-600">MCQ, 2/5/10M, Viva</div>
            </div>
            <div className="p-3 bg-surface-warm brutal-border">
              <div className="text-[10px] text-slate-500 uppercase">Concept Map Nodes</div>
              <div className="text-2xl font-black text-phosphor-green">14 Nodes</div>
              <div className="text-[9px] text-slate-600">Reciprocal Space Linked</div>
            </div>
          </div>
        </BrutalCard>
      </section>
    </div>
  );
}
