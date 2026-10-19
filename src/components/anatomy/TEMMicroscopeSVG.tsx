"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TEMMicroscopeSVGProps {
  activeChapterId?: string;
  hoveredComponentId?: string | null;
  onComponentHover?: (componentId: string | null) => void;
  onComponentClick?: (componentId: string) => void;
  explodedOffset?: number; // 0 (assembled) to 1 (fully exploded)
  beamMode?: "standard" | "condensed" | "diffracting" | "aperture-filtered" | "magnified";
  className?: string;
}

export function TEMMicroscopeSVG({
  activeChapterId = "complete-hero",
  hoveredComponentId = null,
  onComponentHover,
  onComponentClick,
  explodedOffset = 0,
  beamMode = "standard",
  className,
}: TEMMicroscopeSVGProps) {
  // Compute separation offsets based on explodedOffset (0 to 1)
  const dyGun = -70 * explodedOffset;
  const dyAnode = -45 * explodedOffset;
  const dyC1 = -25 * explodedOffset;
  const dyC2 = -10 * explodedOffset;
  const dyCAp = 5 * explodedOffset;
  const dyStage = 20 * explodedOffset;
  const dyObj = 40 * explodedOffset;
  const dyObjAp = 60 * explodedOffset;
  const dyInt = 80 * explodedOffset;
  const dyProj = 105 * explodedOffset;
  const dyDet = 135 * explodedOffset;

  const isHighlighted = (id: string) => {
    if (hoveredComponentId === id) return true;
    if (activeChapterId === id) return true;
    if (activeChapterId === "condenser-system" && (id === "condenser-1" || id === "condenser-2" || id === "condenser-aperture")) return true;
    if (activeChapterId === "specimen-stage" && (id === "specimen" || id === "specimen-stage")) return true;
    if (activeChapterId === "intermediate-lens" && (id === "intermediate-lens" || id === "projector-lens" || id === "magnification-system")) return true;
    if (activeChapterId === "exploded-view") return true;
    return false;
  };

  const isDimmed = (id: string) => {
    if (activeChapterId === "complete-hero" || activeChapterId === "exploded-view") return false;
    return !isHighlighted(id);
  };

  const getStrokeColor = (id: string) => {
    if (hoveredComponentId === id) return "#FF5722";
    if (isHighlighted(id)) return "#0284C7";
    return "#0F172A";
  };

  const getFillColor = (id: string, defaultFill: string) => {
    if (hoveredComponentId === id) return "#FFF2EE";
    if (isHighlighted(id)) return "#F0F9FF";
    return defaultFill;
  };

  return (
    <div className={cn("relative select-none w-full flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 540 1020"
        className="w-full max-h-[85vh] drop-shadow-md overflow-visible"
        style={{ filter: "drop-shadow(0 4px 6px rgba(15,23,42,0.06))" }}
        role="img"
        aria-label="Interactive Transmission Electron Microscope Column Blueprint"
      >
        <defs>
          {/* Subtle hatching pattern for electromagnetic pole piece iron core */}
          <pattern id="ironHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#94A3B8" strokeWidth="1" />
          </pattern>
          {/* Copper coil pattern */}
          <pattern id="copperCoil" width="6" height="6" patternTransform="rotate(0 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3" x2="6" y2="3" stroke="#D97706" strokeWidth="1.5" />
          </pattern>
          {/* Electron Beam Glow Filter */}
          <filter id="beamGlow" x="-50%" y="-20%" width="200%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feGaussianBlur stdDeviation="6" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="specimenGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ========================================================
            BACKGROUND BLUEPRINT CALIPERS & OPTICAL AXIS
        ======================================================== */}
        <g id="optical-axis" opacity="0.6">
          {/* Central Optical Axis */}
          <line
            x1="270"
            y1="20"
            x2="270"
            y2="980"
            stroke="#0F172A"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          {/* Top Optical Axis Arrow */}
          <path d="M270,12 L266,20 L274,20 Z" fill="#0F172A" />
          <text x="270" y="8" textAnchor="middle" className="text-[9px] font-mono font-bold fill-slate-700 tracking-wider">
            OPTICAL AXIS (z)
          </text>

          {/* Left Measurement / Height Ruler */}
          <g opacity="0.45" className="hidden sm:block">
            <line x1="45" y1="50" x2="45" y2="950" stroke="#0F172A" strokeWidth="1" />
            <line x1="40" y1="50" x2="50" y2="50" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="40" y1="950" x2="50" y2="950" stroke="#0F172A" strokeWidth="1.5" />
            <text x="35" y="500" textAnchor="middle" transform="rotate(-90 35 500)" className="text-[9px] font-mono fill-slate-600 font-bold tracking-widest">
              COLUMN HEIGHT ~ 2.4 METERS (ULTRA-HIGH VACUUM)
            </text>
          </g>
        </g>

        {/* ========================================================
            01. ELECTRON GUN GROUP
        ======================================================== */}
        <g
          id="electron-gun"
          className="transition-all duration-300 cursor-pointer"
          style={{
            transform: `translateY(${dyGun}px)`,
            opacity: isDimmed("electron-gun") ? 0.35 : 1,
          }}
          onMouseEnter={() => onComponentHover?.("electron-gun")}
          onMouseLeave={() => onComponentHover?.(null)}
          onClick={() => onComponentClick?.("electron-gun")}
        >
          {/* High Voltage Cable Top Feedthrough Insulator rings */}
          <rect x="250" y="15" width="40" height="15" fill="#E2E8F0" stroke={getStrokeColor("electron-gun")} strokeWidth="2" />
          <rect x="245" y="30" width="50" height="8" fill="#CBD5E1" stroke={getStrokeColor("electron-gun")} strokeWidth="2" />
          <rect x="240" y="38" width="60" height="8" fill="#CBD5E1" stroke={getStrokeColor("electron-gun")} strokeWidth="2" />
          <rect x="235" y="46" width="70" height="8" fill="#CBD5E1" stroke={getStrokeColor("electron-gun")} strokeWidth="2" />

          {/* Gun Chamber / High Tension Shield (-200 kV) */}
          <rect
            x="200"
            y="54"
            width="140"
            height="70"
            fill={getFillColor("electron-gun", "#F8FAFC")}
            stroke={getStrokeColor("electron-gun")}
            strokeWidth="2.5"
          />
          {/* Gun Chamber Interior Hatching */}
          <rect x="204" y="58" width="132" height="62" fill="url(#ironHatch)" opacity="0.15" />

          {/* Wehnelt Cylinder (Cathode Bias Shield) */}
          <path
            d="M235,66 L305,66 L300,98 L285,108 L255,108 L240,98 Z"
            fill="#334155"
            stroke={getStrokeColor("electron-gun")}
            strokeWidth="2"
          />
          {/* Filament / Field Emission Tip (FEG Emitter) */}
          <path d="M264,72 L270,92 L276,72" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Filament glowing point */}
          <circle cx="270" cy="92" r="3" fill="#FF5722" />
          <circle cx="270" cy="92" r="6" fill="#F59E0B" opacity="0.4" />

          {/* Wehnelt Aperture Hole */}
          <rect x="265" y="106" width="10" height="4" fill="#0F172A" />

          {/* Label Card / Callout */}
          <g transform="translate(355, 68)">
            <rect x="0" y="0" width="150" height="34" fill="#FFFFFF" stroke={getStrokeColor("electron-gun")} strokeWidth="2" />
            <text x="8" y="14" className="text-[10px] font-mono font-black fill-[#0F172A]">01. ELECTRON GUN</text>
            <text x="8" y="26" className="text-[8.5px] font-mono fill-slate-600">FEG CATHODE [-200 kV]</text>
            <line x1="0" y1="17" x2="-15" y2="17" stroke={getStrokeColor("electron-gun")} strokeWidth="1.5" />
          </g>
        </g>

        {/* ========================================================
            ACCELERATION ANODE
        ======================================================== */}
        <g
          id="anode"
          className="transition-all duration-300 cursor-pointer"
          style={{
            transform: `translateY(${dyAnode}px)`,
            opacity: isDimmed("anode") ? 0.35 : 1,
          }}
          onMouseEnter={() => onComponentHover?.("anode")}
          onMouseLeave={() => onComponentHover?.(null)}
          onClick={() => onComponentClick?.("anode")}
        >
          {/* Anode Plate (Ground = 0V) */}
          <rect x="210" y="132" width="120" height="16" fill={getFillColor("anode", "#E2E8F0")} stroke={getStrokeColor("anode")} strokeWidth="2.5" />
          {/* Central Anode Bore Hole */}
          <rect x="264" y="132" width="12" height="16" fill="#0B0E14" />
          {/* Anode Earth Ground Symbol */}
          <line x1="330" y1="140" x2="345" y2="140" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="345" y1="135" x2="345" y2="145" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="348" y1="137" x2="348" y2="143" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="351" y1="139" x2="351" y2="141" stroke="#0F172A" strokeWidth="1.5" />
          <text x="358" y="143" className="text-[8px] font-mono font-bold fill-slate-700">0V (GND)</text>
        </g>

        {/* ========================================================
            02. CONDENSER LENS 1 (C1)
        ======================================================== */}
        <g
          id="condenser-1"
          className="transition-all duration-300 cursor-pointer"
          style={{
            transform: `translateY(${dyC1}px)`,
            opacity: isDimmed("condenser-1") ? 0.35 : 1,
          }}
          onMouseEnter={() => onComponentHover?.("condenser-system")}
          onMouseLeave={() => onComponentHover?.(null)}
          onClick={() => onComponentClick?.("condenser-system")}
        >
          {/* C1 Left Pole Piece and Iron Shroud */}
          <rect x="195" y="165" width="60" height="42" fill="url(#ironHatch)" stroke={getStrokeColor("condenser-1")} strokeWidth="2" />
          <rect x="202" y="172" width="46" height="28" fill="url(#copperCoil)" stroke="#0F172A" strokeWidth="1" />
          {/* C1 Right Pole Piece */}
          <rect x="285" y="165" width="60" height="42" fill="url(#ironHatch)" stroke={getStrokeColor("condenser-1")} strokeWidth="2" />
          <rect x="292" y="172" width="46" height="28" fill="url(#copperCoil)" stroke="#0F172A" strokeWidth="1" />
          {/* Pole gap magnetic field lines indicator */}
          <path d="M255,182 Q270,186 285,182" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M255,190 Q270,194 285,190" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* Label */}
          <text x="180" y="188" textAnchor="end" className="text-[9px] font-mono font-bold fill-slate-800">C1 (SPOT SIZE)</text>
        </g>

        {/* ========================================================
            02. CONDENSER LENS 2 (C2)
        ======================================================== */}
        <g
          id="condenser-2"
          className="transition-all duration-300 cursor-pointer"
          style={{
            transform: `translateY(${dyC2}px)`,
            opacity: isDimmed("condenser-2") ? 0.35 : 1,
          }}
          onMouseEnter={() => onComponentHover?.("condenser-system")}
          onMouseLeave={() => onComponentHover?.(null)}
          onClick={() => onComponentClick?.("condenser-system")}
        >
          {/* C2 Left Pole Piece */}
          <rect x="195" y="222" width="60" height="46" fill="url(#ironHatch)" stroke={getStrokeColor("condenser-2")} strokeWidth="2" />
          <rect x="202" y="230" width="46" height="30" fill="url(#copperCoil)" stroke="#0F172A" strokeWidth="1" />
          {/* C2 Right Pole Piece */}
          <rect x="285" y="222" width="60" height="46" fill="url(#ironHatch)" stroke={getStrokeColor("condenser-2")} strokeWidth="2" />
          <rect x="292" y="230" width="46" height="30" fill="url(#copperCoil)" stroke="#0F172A" strokeWidth="1" />
          {/* Pole gap lines */}
          <path d="M255,242 Q270,246 285,242" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="2 2" />
          <text x="180" y="248" textAnchor="end" className="text-[9px] font-mono font-bold fill-slate-800">C2 (INTENSITY)</text>

          {/* Condenser System Label Card */}
          <g transform="translate(355, 218)">
            <rect x="0" y="0" width="150" height="34" fill="#FFFFFF" stroke={getStrokeColor("condenser-2")} strokeWidth="2" />
            <text x="8" y="14" className="text-[10px] font-mono font-black fill-[#0F172A]">02. CONDENSERS</text>
            <text x="8" y="26" className="text-[8.5px] font-mono fill-slate-600">BEAM CONVERGENCE (α)</text>
            <line x1="0" y1="17" x2="-10" y2="17" stroke={getStrokeColor("condenser-2")} strokeWidth="1.5" />
          </g>
        </g>

        {/* ========================================================
            CONDENSER APERTURE STRIP
        ======================================================== */}
        <g
          id="condenser-aperture"
          className="transition-all duration-300 cursor-pointer"
          style={{
            transform: `translateY(${dyCAp}px)`,
            opacity: isDimmed("condenser-aperture") ? 0.35 : 1,
          }}
          onMouseEnter={() => onComponentHover?.("condenser-system")}
          onMouseLeave={() => onComponentHover?.(null)}
          onClick={() => onComponentClick?.("condenser-system")}
        >
          {/* Movable Aperture Rod entering from right */}
          <rect x="230" y="282" width="150" height="10" fill="#E2E8F0" stroke={getStrokeColor("condenser-aperture")} strokeWidth="1.5" />
          <circle cx="270" cy="287" r="3" fill="#0B0E14" />
          <circle cx="300" cy="287" r="4.5" fill="#0B0E14" />
          <circle cx="330" cy="287" r="6" fill="#0B0E14" />
          {/* Drive Knob */}
          <rect x="380" y="278" width="16" height="18" fill="#475569" stroke="#0F172A" strokeWidth="2" />
          <text x="402" y="291" className="text-[8px] font-mono font-bold fill-slate-700">C2 APERTURE STRIP</text>
        </g>

        {/* ========================================================
            03. SPECIMEN STAGE & SPECIMEN
        ======================================================== */}
        <g
          id="specimen-stage"
          className="transition-all duration-300 cursor-pointer"
          style={{
            transform: `translateY(${dyStage}px)`,
            opacity: isDimmed("specimen") ? 0.35 : 1,
          }}
          onMouseEnter={() => onComponentHover?.("specimen")}
          onMouseLeave={() => onComponentHover?.(null)}
          onClick={() => onComponentClick?.("specimen")}
        >
          {/* Side-entry Goniometer Rod entering from left */}
          <rect x="65" y="322" width="190" height="14" fill="#E2E8F0" stroke={getStrokeColor("specimen")} strokeWidth="2" />
          <circle cx="90" cy="329" r="6" fill="#94A3B8" stroke="#0F172A" strokeWidth="1.5" />
          {/* Tilt Angle Protractor on Goniometer */}
          <text x="90" y="316" textAnchor="middle" className="text-[8px] font-mono font-bold fill-slate-700">±45° TILT</text>

          {/* 3mm Specimen Grid Cup at Optical Axis */}
          <rect x="255" y="320" width="30" height="18" fill="#FEF08A" stroke={getStrokeColor("specimen")} strokeWidth="2" />
          {/* Copper mesh lines on grid */}
          <line x1="262" y1="320" x2="262" y2="338" stroke="#B45309" strokeWidth="1" />
          <line x1="270" y1="320" x2="270" y2="338" stroke="#B45309" strokeWidth="1" />
          <line x1="278" y1="320" x2="278" y2="338" stroke="#B45309" strokeWidth="1" />

          {/* Thin Foil Specimen Center (<100 nm) */}
          <rect
            id="specimen-foil"
            x="264"
            y="327"
            width="12"
            height="4"
            fill="#00D2FF"
            stroke="#0F172A"
            strokeWidth="1.5"
            filter="url(#specimenGlow)"
          />

          {/* Specimen Stage Label Card */}
          <g transform="translate(355, 312)">
            <rect x="0" y="0" width="150" height="34" fill="#FFFFFF" stroke={getStrokeColor("specimen")} strokeWidth="2" />
            <text x="8" y="14" className="text-[10px] font-mono font-black fill-[#0F172A]">03. SPECIMEN STAGE</text>
            <text x="8" y="26" className="text-[8.5px] font-mono fill-slate-600">THIN FOIL [&lt;100 nm]</text>
            <line x1="0" y1="17" x2="-70" y2="17" stroke={getStrokeColor("specimen")} strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
        </g>

        {/* ========================================================
            04. OBJECTIVE LENS (UPPER & LOWER POLE PIECES)
        ======================================================== */}
        <g
          id="objective-lens"
          className="transition-all duration-300 cursor-pointer"
          style={{
            transform: `translateY(${dyObj}px)`,
            opacity: isDimmed("objective-lens") ? 0.35 : 1,
          }}
          onMouseEnter={() => onComponentHover?.("objective-lens")}
          onMouseLeave={() => onComponentHover?.(null)}
          onClick={() => onComponentClick?.("objective-lens")}
        >
          {/* Upper Objective Pole Piece Left */}
          <path d="M190,305 L245,305 L252,316 L245,316 L190,316 Z" fill="url(#ironHatch)" stroke={getStrokeColor("objective-lens")} strokeWidth="2" />
          {/* Upper Objective Pole Piece Right */}
          <path d="M295,305 L350,305 L350,316 L295,316 L288,316 Z" fill="url(#ironHatch)" stroke={getStrokeColor("objective-lens")} strokeWidth="2" />

          {/* Lower Objective Pole Piece Left */}
          <path d="M190,344 L245,344 L252,344 L246,358 L190,358 Z" fill="url(#ironHatch)" stroke={getStrokeColor("objective-lens")} strokeWidth="2" />
          <rect x="195" y="360" width="55" height="50" fill="url(#copperCoil)" stroke="#0F172A" strokeWidth="1.5" />
          {/* Lower Objective Pole Piece Right */}
          <path d="M295,344 L350,344 L350,358 L294,358 L288,344 Z" fill="url(#ironHatch)" stroke={getStrokeColor("objective-lens")} strokeWidth="2" />
          <rect x="290" y="360" width="55" height="50" fill="url(#copperCoil)" stroke="#0F172A" strokeWidth="1.5" />

          {/* High Magnetic Field Gap (2.0 Tesla) */}
          <ellipse cx="270" cy="330" rx="14" ry="10" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Objective Lens Label Card */}
          <g transform="translate(355, 368)">
            <rect x="0" y="0" width="150" height="34" fill="#FFFFFF" stroke={getStrokeColor("objective-lens")} strokeWidth="2" />
            <text x="8" y="14" className="text-[10px] font-mono font-black fill-[#0F172A]">04. OBJECTIVE LENS</text>
            <text x="8" y="26" className="text-[8.5px] font-mono fill-slate-600">Cs = 1.0 mm | BFP FOCUS</text>
            <line x1="0" y1="17" x2="-10" y2="17" stroke={getStrokeColor("objective-lens")} strokeWidth="1.5" />
          </g>
        </g>

        {/* ========================================================
            05. OBJECTIVE APERTURE (IN BACK FOCAL PLANE)
        ======================================================== */}
        <g
          id="objective-aperture"
          className="transition-all duration-300 cursor-pointer"
          style={{
            transform: `translateY(${dyObjAp}px)`,
            opacity: isDimmed("objective-aperture") ? 0.35 : 1,
          }}
          onMouseEnter={() => onComponentHover?.("objective-aperture")}
          onMouseLeave={() => onComponentHover?.(null)}
          onClick={() => onComponentClick?.("objective-aperture")}
        >
          {/* Back Focal Plane dashed level */}
          <line x1="160" y1="432" x2="380" y2="432" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="4 2" />
          <text x="155" y="435" textAnchor="end" className="text-[8px] font-mono font-bold fill-accent-purple">BACK FOCAL PLANE</text>

          {/* Aperture Blade Rod entering from left */}
          <rect x="180" y="428" width="87" height="8" fill="#475569" stroke={getStrokeColor("objective-aperture")} strokeWidth="1.5" />
          {/* Selected central hole (selects unscattered direct beam for BF) */}
          <circle cx="270" cy="432" r="3" fill="#0B0E14" />
          <rect x="273" y="428" width="60" height="8" fill="#475569" stroke={getStrokeColor("objective-aperture")} strokeWidth="1.5" />
          {/* Drive Knob Left */}
          <rect x="166" y="424" width="14" height="16" fill="#334155" stroke="#0F172A" strokeWidth="2" />

          {/* Objective Aperture Label Card */}
          <g transform="translate(355, 420)">
            <rect x="0" y="0" width="150" height="34" fill="#FFFFFF" stroke={getStrokeColor("objective-aperture")} strokeWidth="2" />
            <text x="8" y="14" className="text-[10px] font-mono font-black fill-[#0F172A]">05. OBJ. APERTURE</text>
            <text x="8" y="26" className="text-[8.5px] font-mono fill-slate-600">BRIGHT / DARK FIELD</text>
            <line x1="0" y1="17" x2="-20" y2="17" stroke={getStrokeColor("objective-aperture")} strokeWidth="1.5" />
          </g>
        </g>

        {/* ========================================================
            06. INTERMEDIATE & PROJECTOR LENSES
        ======================================================== */}
        <g
          id="intermediate-lens"
          className="transition-all duration-300 cursor-pointer"
          style={{
            transform: `translateY(${dyInt}px)`,
            opacity: isDimmed("intermediate-lens") ? 0.35 : 1,
          }}
          onMouseEnter={() => onComponentHover?.("intermediate-lens")}
          onMouseLeave={() => onComponentHover?.(null)}
          onClick={() => onComponentClick?.("intermediate-lens")}
        >
          {/* First Intermediate Image Plane marker */}
          <line x1="180" y1="480" x2="360" y2="480" stroke="#0284C7" strokeWidth="1" strokeDasharray="3 3" />
          <text x="175" y="483" textAnchor="end" className="text-[8px] font-mono font-bold fill-beam-blue">1ST IMAGE PLANE</text>

          {/* Intermediate Lens Assembly */}
          <rect x="185" y="500" width="65" height="48" fill="url(#ironHatch)" stroke={getStrokeColor("intermediate-lens")} strokeWidth="2" />
          <rect x="192" y="508" width="51" height="32" fill="url(#copperCoil)" stroke="#0F172A" strokeWidth="1" />

          <rect x="290" y="500" width="65" height="48" fill="url(#ironHatch)" stroke={getStrokeColor("intermediate-lens")} strokeWidth="2" />
          <rect x="297" y="508" width="51" height="32" fill="url(#copperCoil)" stroke="#0F172A" strokeWidth="1" />

          <text x="180" y="528" textAnchor="end" className="text-[9px] font-mono font-bold fill-slate-800">INTERMEDIATE</text>
        </g>

        {/* Projector Lens P1 / P2 */}
        <g
          id="projector-lens"
          className="transition-all duration-300 cursor-pointer"
          style={{
            transform: `translateY(${dyProj}px)`,
            opacity: isDimmed("projector-lens") ? 0.35 : 1,
          }}
          onMouseEnter={() => onComponentHover?.("intermediate-lens")}
          onMouseLeave={() => onComponentHover?.(null)}
          onClick={() => onComponentClick?.("intermediate-lens")}
        >
          {/* Projector Lens Assembly with widening bore */}
          <path d="M175,580 L240,580 L235,650 L175,650 Z" fill="url(#ironHatch)" stroke={getStrokeColor("projector-lens")} strokeWidth="2" />
          <rect x="182" y="590" width="46" height="48" fill="url(#copperCoil)" stroke="#0F172A" strokeWidth="1" />

          <path d="M365,580 L300,580 L305,650 L365,650 Z" fill="url(#ironHatch)" stroke={getStrokeColor("projector-lens")} strokeWidth="2" />
          <rect x="312" y="590" width="46" height="48" fill="url(#copperCoil)" stroke="#0F172A" strokeWidth="1" />

          <text x="170" y="620" textAnchor="end" className="text-[9px] font-mono font-bold fill-slate-800">PROJECTOR</text>

          {/* Magnification System Label Card */}
          <g transform="translate(375, 595)">
            <rect x="0" y="0" width="150" height="34" fill="#FFFFFF" stroke={getStrokeColor("projector-lens")} strokeWidth="2" />
            <text x="8" y="14" className="text-[10px] font-mono font-black fill-[#0F172A]">06. MAGNIFICATION</text>
            <text x="8" y="26" className="text-[8.5px] font-mono fill-slate-600">UP TO 1,500,000×</text>
            <line x1="0" y1="17" x2="-10" y2="17" stroke={getStrokeColor("projector-lens")} strokeWidth="1.5" />
          </g>
        </g>

        {/* ========================================================
            07. DETECTOR & VIEWING CHAMBER
        ======================================================== */}
        <g
          id="detector"
          className="transition-all duration-300 cursor-pointer"
          style={{
            transform: `translateY(${dyDet}px)`,
            opacity: isDimmed("detector") ? 0.35 : 1,
          }}
          onMouseEnter={() => onComponentHover?.("detector")}
          onMouseLeave={() => onComponentHover?.(null)}
          onClick={() => onComponentClick?.("detector")}
        >
          {/* Viewing Chamber Housing */}
          <path
            d="M160,680 L380,680 L395,780 L145,780 Z"
            fill={getFillColor("detector", "#F1F5F9")}
            stroke={getStrokeColor("detector")}
            strokeWidth="2.5"
          />

          {/* Lead Glass Viewing Window Port */}
          <ellipse cx="270" cy="715" rx="60" ry="20" fill="#E0F2FE" stroke="#0F172A" strokeWidth="2" />
          <ellipse cx="270" cy="715" rx="54" ry="16" fill="#BAE6FD" opacity="0.4" />
          <text x="270" y="718" textAnchor="middle" className="text-[7.5px] font-mono font-bold fill-slate-700">LEAD GLASS PORT</text>

          {/* Retractable Phosphor Viewing Screen (ZnS:Ag) */}
          <rect
            x="185"
            y="742"
            width="170"
            height="10"
            fill="#10B981"
            stroke={getStrokeColor("detector")}
            strokeWidth="2"
            style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.5))" }}
          />
          <text x="270" y="750" textAnchor="middle" className="text-[8px] font-mono font-black fill-[#064E3B]">
            PHOSPHOR SCREEN (P22)
          </text>

          {/* Bottom Direct Electron CMOS Camera Chamber */}
          <rect
            x="200"
            y="795"
            width="140"
            height="40"
            fill="#0F172A"
            stroke={getStrokeColor("detector")}
            strokeWidth="2.5"
          />
          {/* Active Sensor Chip */}
          <rect x="230" y="805" width="80" height="20" fill="#00D2FF" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="270" y="819" textAnchor="middle" className="text-[8.5px] font-mono font-black fill-[#0F172A]">
            DIRECT CMOS (4K)
          </text>

          {/* Detector System Label Card */}
          <g transform="translate(375, 755)">
            <rect x="0" y="0" width="150" height="34" fill="#FFFFFF" stroke={getStrokeColor("detector")} strokeWidth="2" />
            <text x="8" y="14" className="text-[10px] font-mono font-black fill-[#0F172A]">07. DETECTOR</text>
            <text x="8" y="26" className="text-[8.5px] font-mono fill-slate-600">DIRECT ELECTRON CMOS</text>
            <line x1="0" y1="17" x2="-10" y2="17" stroke={getStrokeColor("detector")} strokeWidth="1.5" />
          </g>
        </g>

        {/* ========================================================
            DYNAMIC ELECTRON BEAM (OVERLAY RAYS)
        ======================================================== */}
        <g id="electron-beam-layer" pointerEvents="none">
          {/* 1. Incident Beam from Gun Tip (Y=92) to C1 Crossover (Y=185) */}
          <path
            d="M270,92 L258,165 L270,195 L282,165 Z"
            fill="#00D2FF"
            opacity="0.85"
            filter="url(#beamGlow)"
          />
          {/* 2. Beam from C1 to C2 and Condenser Aperture */}
          <path
            d="M270,195 L260,240 L266,285 L274,285 L280,240 Z"
            fill="#00D2FF"
            opacity="0.8"
            filter="url(#beamGlow)"
          />
          {/* 3. Collimated / Convergent Beam reaching Specimen (Y=327) */}
          <path
            d={
              beamMode === "condensed"
                ? "M266,285 L270,327 L274,285 Z" // Focused nanometer probe
                : "M266,285 L264,327 L276,327 L274,285 Z" // Parallel TEM beam
            }
            fill="#00D2FF"
            opacity="0.9"
            filter="url(#beamGlow)"
          />

          {/* Core Central Beam Ray */}
          <line
            x1="270"
            y1="92"
            x2="270"
            y2="327"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            opacity="0.9"
          />

          {/* ====================================================
              SPECIMEN INTERACTION & BEAM SPLITTING
          ==================================================== */}
          {/* Transmitted Direct Beam continuing straight through */}
          <path
            d="M266,329 L262,432 L264,520 L240,742 L250,805 L290,805 L300,742 L276,520 L274,432 Z"
            fill="#00D2FF"
            opacity={beamMode === "diffracting" ? 0.35 : 0.65}
            filter="url(#beamGlow)"
          />

          {/* Scattered / Diffracted Rays (Bragg Angle 2θB) */}
          <g id="diffracted-beam-group">
            {/* Diffracted Ray Left */}
            <path
              d="M270,329 L238,432 L276,480 L330,742"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray={beamMode === "aperture-filtered" ? "4 3" : "none"}
              opacity={beamMode === "aperture-filtered" ? 0.25 : 0.85}
              filter="url(#beamGlow)"
            />
            {/* Diffracted Ray Right */}
            <path
              d="M270,329 L302,432 L264,480 L210,742"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeDasharray={beamMode === "aperture-filtered" ? "4 3" : "none"}
              opacity={beamMode === "aperture-filtered" ? 0.25 : 0.85}
              filter="url(#beamGlow)"
            />

            {/* Back Focal Plane Diffraction Spots at Y=432 */}
            <circle cx="270" cy="432" r="3.5" fill="#FFFFFF" stroke="#00D2FF" strokeWidth="2" />
            <circle cx="238" cy="432" r="2.5" fill="#F59E0B" />
            <circle cx="302" cy="432" r="2.5" fill="#F59E0B" />

            {/* Aperture Block indicator when in aperture-filtered mode */}
            {beamMode === "aperture-filtered" && (
              <g>
                <circle cx="238" cy="432" r="5" fill="none" stroke="#EF4444" strokeWidth="1.5" />
                <line x1="235" y1="429" x2="241" y2="435" stroke="#EF4444" strokeWidth="1.5" />
                <circle cx="302" cy="432" r="5" fill="none" stroke="#EF4444" strokeWidth="1.5" />
                <line x1="299" y1="429" x2="305" y2="435" stroke="#EF4444" strokeWidth="1.5" />
                <text x="270" y="452" textAnchor="middle" className="text-[7.5px] font-mono font-bold fill-red-600">
                  DIFFRACTED RAYS BLOCKED BY APERTURE → BF CONTRAST
                </text>
              </g>
            )}
          </g>

          {/* Central Bright Spot on Detector */}
          <circle cx="270" cy="805" r="4" fill="#FFFFFF" filter="url(#beamGlow)" />
          <circle cx="270" cy="805" r="8" fill="#00D2FF" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
