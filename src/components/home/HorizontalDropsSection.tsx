"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight, Lock, Sparkles, Layers, Atom, Eye, FileQuestion, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export function HorizontalDropsSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = direction === "left" ? -340 : 340;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  const drops = [
    {
      id: "drop-01",
      number: "DROP 01",
      badge: "New release",
      badgeAcid: true,
      title: "TEM scroll dissection",
      subtitle: "Continuous Exploded Blueprint",
      description: "Interactive scroll-driven optical column dissection from Wehnelt FEG to 4k CMOS.",
      status: "Active in v2.4",
      href: "/anatomy",
      isLocked: false,
      icon: <Layers className="w-8 h-8 text-foreground" />,
      svgPreview: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-foreground fill-none stroke-2">
          <circle cx="50" cy="20" r="10" fill="#D2E823" />
          <line x1="50" y1="30" x2="50" y2="50" strokeDasharray="3 2" />
          <rect x="35" y="50" width="30" height="8" fill="#FFFFFF" />
          <line x1="50" y1="58" x2="30" y2="85" strokeWidth="1.5" />
          <line x1="50" y1="58" x2="50" y2="85" strokeWidth="2" />
          <line x1="50" y1="58" x2="70" y2="85" strokeWidth="1.5" />
          <circle cx="30" cy="85" r="3" fill="#09090B" />
          <circle cx="50" cy="85" r="4" fill="#D2E823" />
          <circle cx="70" cy="85" r="3" fill="#09090B" />
        </svg>
      ),
    },
    {
      id: "drop-02",
      number: "DROP 02",
      badge: "Core lab",
      badgeAcid: false,
      title: "SAED crystal solver",
      subtitle: "Reciprocal Lattice Engine",
      description: "Ewald sphere flat-cut solver, camera constant R·d = λ·L, and single-crystal indexing.",
      status: "ACTIVE",
      href: "/simulator",
      isLocked: false,
      icon: <Atom className="w-8 h-8 text-foreground" />,
      svgPreview: (
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#09090B" strokeWidth="1.5" strokeDasharray="4 2" />
          <circle cx="50" cy="50" r="6" fill="#D2E823" stroke="#09090B" strokeWidth="2" />
          <circle cx="30" cy="50" r="4" fill="#09090B" />
          <circle cx="70" cy="50" r="4" fill="#09090B" />
          <circle cx="50" cy="30" r="4" fill="#09090B" />
          <circle cx="50" cy="70" r="4" fill="#09090B" />
          <circle cx="36" cy="36" r="3" fill="#09090B" />
          <circle cx="64" cy="64" r="3" fill="#09090B" />
          <circle cx="36" cy="64" r="3" fill="#09090B" />
          <circle cx="64" cy="36" r="3" fill="#09090B" />
        </svg>
      ),
    },
    {
      id: "drop-03",
      number: "DROP 03",
      badge: "CV LAB",
      badgeAcid: false,
      title: "Particle size lab",
      subtitle: "Computer Vision Workstation",
      description: "Automated connected-component segmentation, scale bar calibration, and log-normal histograms.",
      status: "ACTIVE",
      href: "/image-analysis",
      isLocked: false,
      icon: <Eye className="w-8 h-8 text-foreground" />,
      svgPreview: (
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <rect x="10" y="10" width="80" height="80" fill="#FFFFFF" stroke="#09090B" strokeWidth="2" />
          <circle cx="35" cy="40" r="14" fill="#D2E823" stroke="#09090B" strokeWidth="2" />
          <circle cx="68" cy="35" r="10" fill="#F8F4E8" stroke="#09090B" strokeWidth="2" />
          <circle cx="55" cy="70" r="12" fill="#D2E823" stroke="#09090B" strokeWidth="2" />
          <line x1="20" y1="85" x2="45" y2="85" stroke="#09090B" strokeWidth="3" />
          <text x="32" y="80" textAnchor="middle" className="text-[8px] font-mono font-bold fill-foreground">50 nm</text>
        </svg>
      ),
    },
    {
      id: "drop-04",
      number: "DROP 04",
      badge: "Exam rubric",
      badgeAcid: true,
      title: "Viva prep workshop",
      subtitle: "University Marking System",
      description: "Authentic 2-mark definitions, 5-mark derivations, 10-mark essays, and oral Viva Voce traps.",
      status: "ACTIVE",
      href: "/exam",
      isLocked: false,
      icon: <FileQuestion className="w-8 h-8 text-foreground" />,
      svgPreview: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-foreground fill-none stroke-2">
          <rect x="20" y="15" width="60" height="70" fill="#F8F4E8" />
          <line x1="30" y1="30" x2="70" y2="30" />
          <line x1="30" y1="45" x2="65" y2="45" />
          <line x1="30" y1="60" x2="55" y2="60" />
          <circle cx="68" cy="65" r="12" fill="#D2E823" stroke="#09090B" strokeWidth="2" />
          <path d="M63,65 L66,68 L73,61" stroke="#09090B" strokeWidth="2" fill="none" />
        </svg>
      ),
    },
    {
      id: "drop-05",
      number: "DROP 05",
      badge: "Next drop",
      badgeAcid: false,
      title: "4D-STEM ptychography",
      subtitle: "Pixelated Direct Detector",
      description: "Wigner distribution deconvolution and sub-angstrom phase retrieval algorithms.",
      status: "Locked // v2.5",
      href: "#",
      isLocked: true,
      icon: <Cpu className="w-8 h-8 text-foreground" />,
      svgPreview: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 stroke-foreground fill-none stroke-2">
          <rect x="15" y="15" width="70" height="70" fill="#E2E8F0" />
          <line x1="15" y1="38" x2="85" y2="38" strokeDasharray="2 2" />
          <line x1="15" y1="62" x2="85" y2="62" strokeDasharray="2 2" />
          <line x1="38" y1="15" x2="38" y2="85" strokeDasharray="2 2" />
          <line x1="62" y1="15" x2="62" y2="85" strokeDasharray="2 2" />
        </svg>
      ),
    },
  ];

  return (
    <section className="px-4 sm:px-6 py-12 max-w-7xl mx-auto space-y-6">
      {/* Header with Arrow Navigation */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground tracking-wide">
            <span className="w-2.5 h-2.5 bg-accent-soft border border-line" />
            Experiment workstations
          </div>
          <h2 className="mt-1 text-3xl sm:text-5xl tracking-tight text-foreground">
            New drops
          </h2>
        </div>

        {/* Arrow Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 bg-surface hover:bg-accent-soft text-foreground border border-line rounded-xl flex items-center justify-center shadow-hard-sm hover:shadow-none transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 bg-surface hover:bg-accent-soft text-foreground border border-line rounded-xl flex items-center justify-center shadow-hard-sm hover:shadow-none transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Flex container with overflow-x-auto & hidden scrollbar */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth select-none no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {drops.map((drop) => {
          const CardContent = (
            <div
              className={cn(
                "w-[320px] shrink-0 bg-surface border border-line rounded-2xl p-5 shadow-hard-lg space-y-4 transition-all duration-150 flex flex-col justify-between",
                drop.isLocked
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:translate-x-1 hover:shadow-hard group"
              )}
            >
              <div className="space-y-3">
                {/* Square Image / Diagram Container */}
                <div
                  className={cn(
                    "w-full h-48 rounded-xl border border-line bg-background flex items-center justify-center relative overflow-hidden",
                    drop.isLocked && "grayscale opacity-60"
                  )}
                >
                  <div className="absolute inset-0 radial-dots opacity-40 pointer-events-none" />
                  <div className="relative z-10 transition-transform group-hover:scale-105 duration-200">
                    {drop.svgPreview}
                  </div>

                  {/* Badge top-left */}
                  <span
                    className={cn(
                      "absolute top-2.5 left-2.5 font-mono text-[10px] font-semibold px-2 py-0.5 border border-line rounded tracking-wide",
                      drop.badgeAcid
                        ? "bg-accent-soft text-foreground shadow-[1px_1px_0px_#09090B]"
                        : "bg-surface text-foreground shadow-[1px_1px_0px_#09090B]"
                    )}
                  >
                    {drop.badge}
                  </span>

                  {drop.isLocked && (
                    <div className="absolute inset-0 bg-[#09090B]/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white gap-1">
                      <Lock className="w-6 h-6 text-accent-inv" />
                      <span className="font-display text-xs tracking-tight text-accent-inv">
                        Coming soon
                      </span>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-muted font-bold">
                    <span>{drop.number}</span>
                    <span className={cn(drop.isLocked ? "text-amber-600" : "text-emerald-700")}>
                      {drop.status}
                    </span>
                  </div>
                  <h3 className="font-display text-base tracking-tight text-foreground mt-1 group-hover:text-foreground">
                    {drop.title}
                  </h3>
                  <div className="font-mono text-[11px] text-accent-inv bg-inverse px-1.5 py-0.2 rounded w-max mt-0.5 font-bold">
                    {drop.subtitle}
                  </div>
                </div>

                <p className="font-grotesk text-xs text-foreground leading-relaxed font-medium">
                  {drop.description}
                </p>
              </div>

              {/* Action Bottom */}
              <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
                <span className="tracking-tight text-foreground">
                  {drop.isLocked ? "In development" : "Explore module"}
                </span>
                {!drop.isLocked && (
                  <ArrowUpRight className="w-4 h-4 text-foreground transition-transform" />
                )}
              </div>
            </div>
          );

          return drop.isLocked ? (
            <div key={drop.id}>{CardContent}</div>
          ) : (
            <Link key={drop.id} href={drop.href}>
              {CardContent}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
