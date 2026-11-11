"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ANATOMY_CHAPTERS } from "./chapters";
import { TEMMicroscopeSVG } from "./TEMMicroscopeSVG";
import { AnatomyChapter } from "./AnatomyChapter";
import { AnatomyChapterNav } from "./AnatomyChapterNav";
import { TechnicalReadout } from "./TechnicalReadout";
import { AnatomyProgress } from "./AnatomyProgress";
import { DiffractionBranch } from "./DiffractionBranch";
import { ComponentDetailModal } from "./ComponentDetailModal";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import Link from "next/link";
import {
  Layers,
  ArrowDown,
  Atom,
  Zap,
  Sliders,
  Maximize2,
  Minimize2,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function TEMAnatomyScene() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const microscopeWrapperRef = useRef<HTMLDivElement | null>(null);

  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [explodedOffset, setExplodedOffset] = useState<number>(0);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [inspectedComponentId, setInspectedComponentId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isManualExplode, setIsManualExplode] = useState<boolean>(false);

  // Derive beam mode based on current chapter
  const currentChapter = ANATOMY_CHAPTERS[activeChapterIndex] || ANATOMY_CHAPTERS[0];
  let beamMode: "standard" | "condensed" | "diffracting" | "aperture-filtered" | "magnified" = "standard";
  if (currentChapter.id === "condenser-system") beamMode = "condensed";
  if (currentChapter.id === "specimen-stage" || currentChapter.id === "objective-lens") beamMode = "diffracting";
  if (currentChapter.id === "objective-aperture") beamMode = "aperture-filtered";
  if (currentChapter.id === "intermediate-lens" || currentChapter.id === "detector") beamMode = "magnified";

  // GSAP ScrollTrigger Setup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Set up triggers for each chapter article
      ANATOMY_CHAPTERS.forEach((ch, idx) => {
        const el = document.getElementById(`chapter-${ch.id}`);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => {
            setActiveChapterIndex(idx);
            if (!isManualExplode) {
              const targetOffset = idx >= 7 ? 1.0 : (idx / 7) * 0.85;
              gsap.to({ val: explodedOffset }, {
                val: targetOffset,
                duration: 0.6,
                ease: "power2.out",
                onUpdate: function () {
                  setExplodedOffset(this.targets()[0].val);
                },
              });
            }
          },
          onEnterBack: () => {
            setActiveChapterIndex(idx);
            if (!isManualExplode) {
              const targetOffset = idx >= 7 ? 1.0 : (idx / 7) * 0.85;
              gsap.to({ val: explodedOffset }, {
                val: targetOffset,
                duration: 0.6,
                ease: "power2.out",
                onUpdate: function () {
                  setExplodedOffset(this.targets()[0].val);
                },
              });
            }
          },
        });
      });

      // Overall Progress Tracking
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          setScrollProgress(self.progress * 100);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isManualExplode]);

  // Chapter jump function
  const handleSelectChapter = (index: number) => {
    const ch = ANATOMY_CHAPTERS[index];
    if (!ch) return;
    const el = document.getElementById(`chapter-${ch.id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div ref={containerRef} className="relative bg-[#FBF9F5] text-foreground instrument-grid pb-24">
      {/* Component Detail Inspection Modal */}
      <ComponentDetailModal
        componentId={inspectedComponentId}
        onClose={() => setInspectedComponentId(null)}
      />

      {/* ========================================================
          HERO SECTION — COMPLETE TEM
      ======================================================== */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 max-w-7xl mx-auto border-b border-line">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left: Large Brutalist Typography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-inverse text-white px-2 py-0.5 font-mono text-xs font-bold tracking-wide border border-border">
                Interactive scroll dissection
              </span>
              <ScientificBadge variant="cyan" hasDot>
                Optical column virtual bench
              </ScientificBadge>
              <span className="text-muted font-mono text-xs">
                GROUNDED IN CARTER &amp; WILLIAMS
              </span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-6xl font-semibold font-sans tracking-tight text-foreground leading-[1.05]">
                Inside the TEM
              </h1>
              <p className="mt-3 text-lg sm:text-xl font-bold font-mono text-accent tracking-wide">
                Dissect the instrument. Understand the electron path.
              </p>
            </div>

            <p className="text-sm sm:text-base font-sans text-foreground max-w-2xl leading-relaxed">
              A Transmission Electron Microscope is not a conventional light microscope made of glass.
              It is an ultra-high vacuum particle accelerator and a sequence of electromagnetic lenses
              focusing relativistic electrons down a 2.5-meter column.
            </p>

            {/* Visual Pathway Summary */}
            <div className="p-3 bg-surface-warm border border-border font-mono text-xs flex flex-wrap items-center gap-2 text-foreground">
              <span className="font-bold text-accent">Electron pathway:</span>
              <span className="font-bold">SOURCE</span>
              <span>→</span>
              <span className="font-bold">BEAM</span>
              <span>→</span>
              <span className="font-bold">SPECIMEN</span>
              <span>→</span>
              <span className="font-bold">OPTICS</span>
              <span>→</span>
              <span className="font-bold">DETECTOR</span>
            </div>

            {/* Scroll Indicator Prompt */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => handleSelectChapter(0)}
                className="inline-flex items-center gap-2 bg-accent-strong text-white font-mono text-xs font-bold px-4 py-2.5 brutal-border brutal-shadow hover:bg-accent-strong transition-all"
              >
                <span>Begin dissection</span>
                <ArrowDown className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-muted font-bold">
                Scroll ↓ to separate the column
              </span>
            </div>
          </div>

          {/* Hero Right: Interactive Explode Controls & Intro Readout */}
          <div className="lg:col-span-5 space-y-4">
            <BrutalCard
              variant="default"
              shadowSize="md"
              titleBar="Anatomy console controls"
              titleBarBadge="Manual override"
              className="bg-surface border-line"
            >
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5 font-bold">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Sliders className="w-3.5 h-3.5 text-accent" />
                      Explosion distance
                    </span>
                    <span className="text-accent font-semibold">{Math.round(explodedOffset * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={explodedOffset}
                    onChange={(e) => {
                      setIsManualExplode(true);
                      setExplodedOffset(parseFloat(e.target.value));
                    }}
                    className="w-full accent-accent cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted mt-1">
                    <span>0% Assembled</span>
                    <span>100% Exploded Blueprint</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-line">
                  <span className="text-muted">Scroll Auto-Sync:</span>
                  <button
                    onClick={() => setIsManualExplode(false)}
                    className="text-[11px] underline font-bold text-foreground hover:text-accent"
                  >
                    {isManualExplode ? "Re-enable Scroll Sync" : "Sync Active ●"}
                  </button>
                </div>

                <div className="p-2.5 bg-surface-warm border border-line text-[11px] text-foreground leading-normal">
                  <span className="font-bold text-foreground">Tip:</span> Hover over or tap any microscope component in the diagram below to inspect its operational role and Barry Carter textbook citations.
                </div>
              </div>
            </BrutalCard>
          </div>
        </div>
      </section>

      {/* ========================================================
          MAIN DISSECTION STAGE (STICKY SPLIT VIEW)
      ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          {/* ====================================================
              LEFT: STICKY MICROSCOPE BLUEPRINT VIEWPORT
          ==================================================== */}
          <div
            ref={microscopeWrapperRef}
            className="lg:col-span-6 lg:sticky lg:top-20 space-y-4"
          >
            <BrutalCard
              variant="default"
              shadowSize="lg"
              titleBar="Transmission electron microscope // optical column"
              titleBarBadge={currentChapter.id.toUpperCase()}
              className="bg-surface border-line relative overflow-hidden"
            >
              {/* Subtle hover tooltip header indicator */}
              <div className="mb-2 p-2 bg-surface-warm border border-line flex items-center justify-between text-xs font-mono">
                <span className="text-muted">Current target:</span>
                <span className="font-bold text-accent">
                  {hoveredComponentId || currentChapter.title}
                </span>
                <button
                  onClick={() => setInspectedComponentId(hoveredComponentId || currentChapter.componentId)}
                  className="text-[10px] bg-inverse text-white px-2 py-0.5 hover:bg-accent-strong font-bold"
                >
                  Deep inspect
                </button>
              </div>

              {/* The Interactive SVG Diagram */}
              <TEMMicroscopeSVG
                activeChapterId={currentChapter.id}
                hoveredComponentId={hoveredComponentId}
                onComponentHover={setHoveredComponentId}
                onComponentClick={setInspectedComponentId}
                explodedOffset={explodedOffset}
                beamMode={beamMode}
              />
            </BrutalCard>

            {/* Bottom HUD: Progress + Telemetry Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TechnicalReadout activeChapterIndex={activeChapterIndex} voltageKV={200} />
              <AnatomyProgress progress={scrollProgress} activeChapterIndex={activeChapterIndex} />
            </div>
          </div>

          {/* ====================================================
              RIGHT: SCROLLING EDUCATIONAL CHAPTERS
          ==================================================== */}
          <div className="lg:col-span-5 space-y-8">
            {ANATOMY_CHAPTERS.map((ch, idx) => (
              <React.Fragment key={ch.id}>
                <AnatomyChapter
                  chapter={ch}
                  isActive={activeChapterIndex === idx}
                  onInspect={(comp) => setInspectedComponentId(comp)}
                />

                {/* Insert Diffraction Branch between Chapter 03 (Specimen) and Chapter 04 (Objective) */}
                {ch.id === "specimen-stage" && (
                  <div className="py-6">
                    <DiffractionBranch />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ====================================================
              FAR RIGHT: STICKY CHAPTER TIMELINE LADDER (XL SCREENS)
          ==================================================== */}
          <div className="hidden xl:block xl:col-span-1 xl:sticky xl:top-20">
            <AnatomyChapterNav
              activeChapterIndex={activeChapterIndex}
              onSelectChapter={handleSelectChapter}
            />
          </div>
        </div>
      </div>

      {/* Mobile Chapter Floating Pill Nav */}
      <AnatomyChapterNav
        activeChapterIndex={activeChapterIndex}
        onSelectChapter={handleSelectChapter}
      />

      {/* ========================================================
          FINAL MESSAGE & COMPLETE DISSECTION SUMMARY
      ======================================================== */}
      <section className="mt-20 max-w-5xl mx-auto px-4 sm:px-6">
        <BrutalCard
          variant="default"
          shadowSize="lg"
          titleBar="Dissection conclusion // barry Carter principles"
          titleBarBadge="Section 08"
          className="bg-surface border-line p-6 sm:p-10 space-y-8 text-center"
        >
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="inline-block bg-inverse text-white px-3 py-1 font-mono text-xs font-bold tracking-wide border border-border">
              Foundational takeaway
            </div>

            <h2 className="text-3xl sm:text-5xl font-semibold font-sans tracking-tight text-foreground leading-tight">
              A TEM is not one lens.
              <br />
              <span className="text-accent">It is a chain of electron optics.</span>
            </h2>

            <p className="text-sm sm:text-base font-sans text-foreground leading-relaxed">
              Every contrast variation, diffraction ring, and atomic column in a micrograph is the
              direct result of this continuous chain: from thermal emission at the gun filament to
              coherent scattering in your specimen, filtered by apertures, magnified by magnetic
              coils, and captured on a pixel sensor.
            </p>
          </div>

          {/* Complete Optical Chain Block */}
          <div className="p-4 bg-surface-warm border border-border max-w-2xl mx-auto font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center font-bold">
              <div className="p-2 bg-surface border border-line">
                <div className="text-[9px] text-muted">STAGE 1</div>
                SOURCE
              </div>
              <div className="p-2 bg-surface border border-line">
                <div className="text-[9px] text-muted">STAGE 2</div>
                BEAM
              </div>
              <div className="p-2 bg-surface border border-line">
                <div className="text-[9px] text-muted">STAGE 3</div>
                SPECIMEN
              </div>
              <div className="p-2 bg-surface border border-line">
                <div className="text-[9px] text-muted">STAGE 4</div>
                SCATTERING
              </div>
              <div className="p-2 bg-surface border border-line">
                <div className="text-[9px] text-muted">STAGE 5</div>
                OPTICS
              </div>
              <div className="p-2 bg-accent-strong text-white border border-border">
                <div className="text-[9px] text-white/80">STAGE 6</div>
                DETECTION
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <p className="font-mono text-xs font-bold text-muted">
              You&apos;ve reached the end of the instrument. Now explore what the electrons are telling you.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/simulator">
                <BrutalButton variant="primary" size="lg" icon={<Atom className="w-5 h-5" />}>
                  Explore diffraction
                </BrutalButton>
              </Link>
              <Link href="/ask">
                <BrutalButton variant="dark" size="lg" icon={<Zap className="w-5 h-5" />}>
                  Ask TEM-AI tutor
                </BrutalButton>
              </Link>
              <Link href="/exam">
                <BrutalButton variant="outline" size="lg" icon={<BookOpen className="w-5 h-5" />}>
                  Test your anatomy knowledge
                </BrutalButton>
              </Link>
            </div>
          </div>
        </BrutalCard>
      </section>
    </div>
  );
}
