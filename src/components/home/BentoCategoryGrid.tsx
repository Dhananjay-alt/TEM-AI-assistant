"use client";

import React from "react";
import Link from "next/link";
import { Layers, Atom, Eye, FileQuestion, ArrowUpRight, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function BentoCategoryGrid() {
  return (
    <section className="px-4 sm:px-6 py-12 max-w-7xl mx-auto space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#09090B] pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#09090B] tracking-widest">
            <span className="w-2.5 h-2.5 bg-[#D2E823] border border-[#09090B]" />
            BENTO ARCHITECTURE // CARTER WORKSTATIONS
          </div>
          <h2 className="mt-1 text-3xl sm:text-5xl font-display uppercase tracking-tight text-[#09090B] glitch-hover">
            CORE LAB MODULES
          </h2>
        </div>
        <p className="font-grotesk text-xs sm:text-sm text-slate-700 max-w-md font-medium">
          Choose a laboratory module grounded in David B. Williams &amp; C. Barry Carter&apos;s classic materials science textbook.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Large 2x2 Card: TEM Optical Column Anatomy */}
        <Link
          href="/anatomy"
          className="md:col-span-2 lg:col-span-2 md:row-span-2 bg-[#09090B] text-[#F8F4E8] border-2 border-[#09090B] rounded-2xl p-6 sm:p-8 relative overflow-hidden group shadow-hard-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col justify-between select-none"
        >
          {/* Subtle Background Diagram with 40% opacity mix-blend-overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(circle at 70% 30%, #D2E823 0%, transparent 60%), linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "100% 100%, 24px 24px, 24px 24px",
            }}
          />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] font-display text-[11px] font-black px-2.5 py-1 rounded-md tracking-tight uppercase shadow-[2px_2px_0px_#09090B]">
                FEATURED ADD-ON
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-[#D2E823] group-hover:bg-[#D2E823] group-hover:text-[#09090B] group-hover:border-[#09090B] transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="font-mono text-xs text-[#D2E823] font-bold tracking-widest uppercase">
                SCROLL-DRIVEN DISSECTION
              </div>
              <h3 className="text-2xl sm:text-4xl font-display uppercase tracking-tight text-white mt-1 leading-none">
                TEM ANATOMY EXPLODED VIEW
              </h3>
            </div>

            <p className="font-grotesk text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              Dissect a 2.5-meter Transmission Electron Microscope as you scroll. Continuous electron ray tracing from the 200 kV Field Emission Gun down through C1/C2 condenser lenses, dual-tilt specimen stage, objective Back Focal Plane, intermediate magnification cascade, and direct CMOS detector.
            </p>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#D2E823] font-bold">
              <Layers className="w-4 h-4" />
              <span>7 OPTICAL CHAPTERS + EXPLODED VIEW</span>
            </div>
            <span className="text-slate-400">GSAP SCROLLTRIGGER ENGINE →</span>
          </div>
        </Link>

        {/* Small 1x1 Card A: SAED Simulator */}
        <Link
          href="/simulator"
          className="bg-white text-[#09090B] border-2 border-[#09090B] rounded-2xl p-6 relative overflow-hidden group shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col justify-between select-none radial-dots"
        >
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-[#D2E823] border-2 border-[#09090B] rounded-lg">
                <Atom className="w-4 h-4 text-[#09090B]" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#09090B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div>
              <div className="font-mono text-[10px] text-slate-600 font-bold tracking-wider uppercase">
                RECIPROCAL SPACE SOLVER
              </div>
              <h4 className="font-display text-lg uppercase tracking-tight text-[#09090B] mt-0.5">
                DIFFRACTION LAB
              </h4>
            </div>

            <p className="font-grotesk text-xs text-slate-700 leading-relaxed font-medium">
              Ewald sphere flat-cut solver. Compute camera constant $R\cdot d = \lambda\cdot L$ and index single-crystal zone axis spot patterns.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t-2 border-[#09090B] font-mono text-[11px] font-bold flex items-center justify-between text-[#09090B]">
            <span>RELATIVISTIC PHYSICS</span>
            <span>ENTER LAB →</span>
          </div>
        </Link>

        {/* Small 1x1 Card B: Micrograph Vision Lab */}
        <Link
          href="/image-analysis"
          className="bg-white text-[#09090B] border-2 border-[#09090B] rounded-2xl p-6 relative overflow-hidden group shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col justify-between select-none radial-dots"
        >
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-[#D2E823] border-2 border-[#09090B] rounded-lg">
                <Eye className="w-4 h-4 text-[#09090B]" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#09090B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div>
              <div className="font-mono text-[10px] text-slate-600 font-bold tracking-wider uppercase">
                COMPUTER VISION LAB
              </div>
              <h4 className="font-display text-lg uppercase tracking-tight text-[#09090B] mt-0.5">
                MICROGRAPH VISION
              </h4>
            </div>

            <p className="font-grotesk text-xs text-slate-700 leading-relaxed font-medium">
              Connected-component blob segmentation on canvas: extract particle diameters, scale bar calibration, and size distributions.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t-2 border-[#09090B] font-mono text-[11px] font-bold flex items-center justify-between text-[#09090B]">
            <span>AI SEGMENTATION</span>
            <span>ENTER LAB →</span>
          </div>
        </Link>

        {/* Card C: Exam Preparation & Viva Rubrics */}
        <Link
          href="/exam"
          className="bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-2xl p-6 relative overflow-hidden group shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col justify-between select-none"
        >
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] rounded-lg">
                <FileQuestion className="w-4 h-4" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#09090B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div>
              <div className="font-mono text-[10px] text-[#09090B] font-bold tracking-wider uppercase">
                UNIVERSITY RUBRICS
              </div>
              <h4 className="font-display text-lg uppercase tracking-tight text-[#09090B] mt-0.5">
                EXAM PREP &amp; VIVA
              </h4>
            </div>

            <p className="font-grotesk text-xs text-[#09090B] leading-relaxed font-medium">
              Grade answers against university rubrics: 2-mark definitions, 5-mark derivations, 10-mark contrast comparisons, and Viva Voce oral traps.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t-2 border-[#09090B] font-mono text-[11px] font-bold flex items-center justify-between text-[#09090B]">
            <span>VIVA VOCE TRAPS</span>
            <span>TEST KNOWLEDGE →</span>
          </div>
        </Link>

        {/* Card D: Concept Map */}
        <Link
          href="/knowledge-map"
          className="bg-white text-[#09090B] border-2 border-[#09090B] rounded-2xl p-6 relative overflow-hidden group shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col justify-between select-none radial-dots"
        >
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-[#F8F4E8] border-2 border-[#09090B] rounded-lg">
                <BookOpen className="w-4 h-4 text-[#09090B]" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-[#09090B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div>
              <div className="font-mono text-[10px] text-slate-600 font-bold tracking-wider uppercase">
                PEDAGOGICAL ONTOLOGY
              </div>
              <h4 className="font-display text-lg uppercase tracking-tight text-[#09090B] mt-0.5">
                CONCEPT GRAPH
              </h4>
            </div>

            <p className="font-grotesk text-xs text-slate-700 leading-relaxed font-medium">
              Interactive relationship network linking Ewald Sphere, Bragg Scattering, Back Focal Plane, Kikuchi Lines, and Mass-Thickness Contrast.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t-2 border-[#09090B] font-mono text-[11px] font-bold flex items-center justify-between text-[#09090B]">
            <span>14+ NODES</span>
            <span>EXPLORE GRAPH →</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
