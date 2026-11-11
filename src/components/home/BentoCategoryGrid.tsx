"use client";

import React from "react";
import Link from "next/link";
import { Layers, Atom, Eye, FileQuestion, ArrowUpRight, Sparkles, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function BentoCategoryGrid() {
  return (
    <section className="px-4 sm:px-6 py-12 max-w-7xl mx-auto space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground tracking-wide">
            <span className="w-2.5 h-2.5 bg-accent-soft border border-line" />
            Bento architecture // Carter workstations
          </div>
          <h2 className="mt-1 text-3xl sm:text-5xl tracking-tight text-foreground">
            Core lab modules
          </h2>
        </div>
        <p className="font-grotesk text-xs sm:text-sm text-foreground max-w-md font-medium">
          Choose a laboratory module grounded in David B. Williams &amp; C. Barry Carter&apos;s classic materials science textbook.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Large 2x2 Card: TEM Optical Column Anatomy */}
        <Link
          href="/anatomy"
          className="md:col-span-2 lg:col-span-2 md:row-span-2 bg-inverse text-inverse-fg border border-line rounded-2xl p-6 sm:p-8 relative overflow-hidden group shadow-hard-lg hover:shadow-none transition-all flex flex-col justify-between select-none"
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
              <span className="bg-accent-soft text-foreground border border-line text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-tight shadow-[2px_2px_0px_#09090B]">
                Featured add-on
              </span>
              <div className="w-10 h-10 rounded-xl bg-surface/10 border border-line/20 flex items-center justify-center text-accent-inv group-hover:bg-accent-soft group-hover:text-foreground group-hover:border-line transition-colors">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="font-mono text-xs text-accent-inv font-bold tracking-wide">
                Scroll-driven dissection
              </div>
              <h3 className="text-2xl sm:text-4xl tracking-tight text-white mt-1 leading-none">
                TEM anatomy exploded view
              </h3>
            </div>

            <p className="font-grotesk text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
              Dissect a 2.5-meter Transmission Electron Microscope as you scroll. Continuous electron ray tracing from the 200 kV Field Emission Gun down through C1/C2 condenser lenses, dual-tilt specimen stage, objective Back Focal Plane, intermediate magnification cascade, and direct CMOS detector.
            </p>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-line/15 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-accent-inv font-bold">
              <Layers className="w-4 h-4" />
              <span>7 Optical chapters + exploded view</span>
            </div>
            <span className="text-faint">Gsap scrolltrigger engine →</span>
          </div>
        </Link>

        {/* Small 1x1 Card A: SAED Simulator */}
        <Link
          href="/simulator"
          className="bg-surface text-foreground border border-line rounded-2xl p-6 relative overflow-hidden group shadow-hard hover:shadow-none transition-all flex flex-col justify-between select-none radial-dots"
        >
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-accent-soft border border-line rounded-lg">
                <Atom className="w-4 h-4 text-foreground" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-foreground transition-transform" />
            </div>

            <div>
              <div className="font-mono text-[10px] text-muted font-bold tracking-wide">
                Reciprocal space solver
              </div>
              <h4 className="font-display text-lg tracking-tight text-foreground mt-0.5">
                Diffraction lab
              </h4>
            </div>

            <p className="font-grotesk text-xs text-foreground leading-relaxed font-medium">
              Ewald sphere flat-cut solver. Compute camera constant $R\cdot d = \lambda\cdot L$ and index single-crystal zone axis spot patterns.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-line font-mono text-[11px] font-bold flex items-center justify-between text-foreground">
            <span>Relativistic physics</span>
            <span>Enter lab →</span>
          </div>
        </Link>

        {/* Small 1x1 Card B: Micrograph Vision Lab */}
        <Link
          href="/image-analysis"
          className="bg-surface text-foreground border border-line rounded-2xl p-6 relative overflow-hidden group shadow-hard hover:shadow-none transition-all flex flex-col justify-between select-none radial-dots"
        >
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-accent-soft border border-line rounded-lg">
                <Eye className="w-4 h-4 text-foreground" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-foreground transition-transform" />
            </div>

            <div>
              <div className="font-mono text-[10px] text-muted font-bold tracking-wide">
                Computer vision lab
              </div>
              <h4 className="font-display text-lg tracking-tight text-foreground mt-0.5">
                Micrograph vision
              </h4>
            </div>

            <p className="font-grotesk text-xs text-foreground leading-relaxed font-medium">
              Connected-component blob segmentation on canvas: extract particle diameters, scale bar calibration, and size distributions.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-line font-mono text-[11px] font-bold flex items-center justify-between text-foreground">
            <span>AI segmentation</span>
            <span>Enter lab →</span>
          </div>
        </Link>

        {/* Card C: Exam Preparation & Viva Rubrics */}
        <Link
          href="/exam"
          className="bg-accent-soft text-foreground border border-line rounded-2xl p-6 relative overflow-hidden group shadow-hard hover:shadow-none transition-all flex flex-col justify-between select-none"
        >
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-inverse text-accent-inv border border-line rounded-lg">
                <FileQuestion className="w-4 h-4" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-foreground transition-transform" />
            </div>

            <div>
              <div className="font-mono text-[10px] text-foreground font-bold tracking-wide">
                University rubrics
              </div>
              <h4 className="font-display text-lg tracking-tight text-foreground mt-0.5">
                EXAM PREP &amp; VIVA
              </h4>
            </div>

            <p className="font-grotesk text-xs text-foreground leading-relaxed font-medium">
              Grade answers against university rubrics: 2-mark definitions, 5-mark derivations, 10-mark contrast comparisons, and Viva Voce oral traps.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-line font-mono text-[11px] font-bold flex items-center justify-between text-foreground">
            <span>Viva voce traps</span>
            <span>Test knowledge →</span>
          </div>
        </Link>

        {/* Card D: Concept Map */}
        <Link
          href="/knowledge-map"
          className="bg-surface text-foreground border border-line rounded-2xl p-6 relative overflow-hidden group shadow-hard hover:shadow-none transition-all flex flex-col justify-between select-none radial-dots"
        >
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-background border border-line rounded-lg">
                <BookOpen className="w-4 h-4 text-foreground" />
              </span>
              <ArrowUpRight className="w-4 h-4 text-foreground transition-transform" />
            </div>

            <div>
              <div className="font-mono text-[10px] text-muted font-bold tracking-wide">
                Pedagogical ontology
              </div>
              <h4 className="font-display text-lg tracking-tight text-foreground mt-0.5">
                Concept graph
              </h4>
            </div>

            <p className="font-grotesk text-xs text-foreground leading-relaxed font-medium">
              Interactive relationship network linking Ewald Sphere, Bragg Scattering, Back Focal Plane, Kikuchi Lines, and Mass-Thickness Contrast.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-line font-mono text-[11px] font-bold flex items-center justify-between text-foreground">
            <span>14+ NODES</span>
            <span>Explore graph →</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
