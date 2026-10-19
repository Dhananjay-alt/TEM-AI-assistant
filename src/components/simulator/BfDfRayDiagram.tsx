"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sliders, Eye, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import { IMAGING_MODES, ImagingMode } from "@/lib/physics/optics";

export function BfDfRayDiagram() {
  const [selectedMode, setSelectedMode] = useState<ImagingMode>("bright-field");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const modeInfo = IMAGING_MODES[selectedMode];

  // Draw Ray Diagram and simulated micrograph contrast
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;

    // Dark instrument background
    ctx.fillStyle = "#0B0E14";
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 1. Incident Parallel Electron Beam (y = 15 to 65)
    ctx.strokeStyle = "rgba(0, 210, 255, 0.7)";
    ctx.lineWidth = 1.5;
    for (let xOffset = -40; xOffset <= 40; xOffset += 16) {
      ctx.beginPath();
      ctx.moveTo(centerX + xOffset, 15);
      ctx.lineTo(centerX + xOffset, 65);
      ctx.stroke();
    }

    ctx.fillStyle = "#00D2FF";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("INCIDENT ELECTRON BEAM", centerX, 12);

    // 2. Specimen Stage (y = 65 to 75)
    ctx.fillStyle = "#E2E8F0";
    ctx.fillRect(centerX - 80, 65, 160, 10);
    ctx.strokeStyle = "#0F172A";
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - 80, 65, 160, 10);

    // Crystalline grain in specimen (Bragg oriented)
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(centerX - 15, 65, 30, 10);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 8px monospace";
    ctx.fillText("CRYSTAL (g)", centerX, 73);

    // 3. Objective Lens (y = 110)
    ctx.fillStyle = "rgba(148, 163, 184, 0.25)";
    ctx.beginPath();
    ctx.ellipse(centerX, 110, 85, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#94A3B8";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#94A3B8";
    ctx.font = "bold 8px monospace";
    ctx.fillText("OBJECTIVE LENS", centerX + 115, 113);

    // 4. Back Focal Plane (y = 160) - Where the Objective Aperture Lives!
    ctx.strokeStyle = "rgba(234, 179, 8, 0.4)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX - 95, 160);
    ctx.lineTo(centerX + 95, 160);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#FACC15";
    ctx.font = "bold 8px monospace";
    ctx.fillText("BACK FOCAL PLANE (DIFFRACTION)", centerX + 120, 163);

    // Diffracted beam angle
    const diffractedAngleX = centerX + 45;

    // Direct Transmitted Rays (000)
    ctx.strokeStyle = "rgba(0, 210, 255, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Paraxial rays converging to focal point at center of back focal plane
    ctx.moveTo(centerX - 35, 75);
    ctx.lineTo(centerX, 160);
    ctx.moveTo(centerX + 35, 75);
    ctx.lineTo(centerX, 160);
    // Continuing down to image plane
    if (selectedMode === "bright-field" || selectedMode === "high-resolution") {
      ctx.moveTo(centerX, 160);
      ctx.lineTo(centerX, 260);
    }
    ctx.stroke();

    // Bragg Diffracted Rays (g)
    ctx.strokeStyle = "rgba(16, 185, 129, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 75);
    ctx.lineTo(diffractedAngleX, 160);
    if (selectedMode === "dark-field" || selectedMode === "high-resolution") {
      ctx.lineTo(centerX, 260);
    }
    ctx.stroke();

    // 5. Objective Aperture Physical Blades in Back Focal Plane (y = 160)
    ctx.fillStyle = "#FF5722";
    if (selectedMode === "bright-field") {
      // Aperture centered on (000) beam, blocking diffracted beam at +45
      ctx.fillRect(centerX - 70, 157, 58, 6); // Left blade
      ctx.fillRect(centerX + 12, 157, 58, 6); // Right blade
      // Transmitted beam passes through (centerX - 12 to centerX + 12)
      // Diffracted beam at centerX + 45 is BLOCKED!
      ctx.fillStyle = "#EF4444";
      ctx.beginPath();
      ctx.arc(diffractedAngleX, 160, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 8px monospace";
      ctx.fillText("BLOCKED", diffractedAngleX, 172);
    } else if (selectedMode === "dark-field") {
      // Aperture shifted to select diffracted beam at diffractedAngleX, blocking direct beam
      ctx.fillRect(centerX - 70, 157, 102, 6); // Blocks direct beam at centerX
      ctx.fillRect(centerX + 58, 157, 20, 6);
      // Diffracted beam passes through! Direct beam is BLOCKED!
      ctx.fillStyle = "#EF4444";
      ctx.beginPath();
      ctx.arc(centerX, 160, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 8px monospace";
      ctx.fillText("BLOCKED", centerX, 172);
    } else {
      // HRTEM: Wide open aperture, both beams pass!
      ctx.fillStyle = "#10B981";
      ctx.fillText("APERTURE WIDE OPEN (BOTH BEAMS PASS)", centerX, 153);
    }

    // 6. Image Plane (y = 260)
    ctx.fillStyle = "#1E293B";
    ctx.fillRect(centerX - 80, 255, 160, 12);
    ctx.strokeStyle = "#38BDF8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(centerX - 80, 255, 160, 12);

    ctx.fillStyle = "#38BDF8";
    ctx.font = "bold 8px monospace";
    ctx.fillText("IMAGE PLANE (MICROGRAPH)", centerX, 264);

    // 7. Simulated Micrograph Thumbnail Box (Bottom right of canvas)
    const thumbX = width - 110;
    const thumbY = height - 100;
    const thumbW = 90;
    const thumbH = 90;

    ctx.fillStyle = "#18181B";
    ctx.fillRect(thumbX, thumbY, thumbW, thumbH);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.strokeRect(thumbX, thumbY, thumbW, thumbH);

    // Contrast rendering inside the micrograph thumbnail
    if (selectedMode === "bright-field") {
      // Bright background, dark nanoparticle
      ctx.fillStyle = "#E2E8F0";
      ctx.fillRect(thumbX + 2, thumbY + 2, thumbW - 4, thumbH - 4);

      ctx.fillStyle = "#0F172A"; // Dark diffracting crystallite!
      ctx.beginPath();
      ctx.arc(thumbX + thumbW / 2, thumbY + thumbH / 2, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.font = "bold 8px monospace";
      ctx.fillText("BF: DARK GRAIN", thumbX + thumbW / 2, thumbY + 12);
    } else if (selectedMode === "dark-field") {
      // Dark background, bright glowing nanoparticle
      ctx.fillStyle = "#0B0E14";
      ctx.fillRect(thumbX + 2, thumbY + 2, thumbW - 4, thumbH - 4);

      // Glowing crystallite
      const grainGlow = ctx.createRadialGradient(
        thumbX + thumbW / 2,
        thumbY + thumbH / 2,
        5,
        thumbX + thumbW / 2,
        thumbY + thumbH / 2,
        24
      );
      grainGlow.addColorStop(0, "#FFFFFF");
      grainGlow.addColorStop(0.4, "#22C55E");
      grainGlow.addColorStop(1, "rgba(34, 197, 94, 0)");
      ctx.fillStyle = grainGlow;
      ctx.beginPath();
      ctx.arc(thumbX + thumbW / 2, thumbY + thumbH / 2, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 8px monospace";
      ctx.fillText("DF: GLOWING GRAIN", thumbX + thumbW / 2, thumbY + 12);
    } else {
      // HRTEM: Interference lattice fringes
      ctx.fillStyle = "#94A3B8";
      ctx.fillRect(thumbX + 2, thumbY + 2, thumbW - 4, thumbH - 4);

      ctx.strokeStyle = "#0F172A";
      ctx.lineWidth = 2;
      for (let f = thumbX + 5; f < thumbX + thumbW - 5; f += 6) {
        ctx.beginPath();
        ctx.moveTo(f, thumbY + 15);
        ctx.lineTo(f, thumbY + thumbH - 5);
        ctx.stroke();
      }

      ctx.fillStyle = "#000000";
      ctx.font = "bold 8px monospace";
      ctx.fillText("HRTEM: LATTICE", thumbX + thumbW / 2, thumbY + 12);
    }
  }, [selectedMode]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-black font-sans uppercase">
            03 / BRIGHT-FIELD VS DARK-FIELD OPTICAL SCHEMATIC
          </h3>
          <p className="text-xs font-mono text-slate-600">
            Aperture Selection in the Back Focal Plane & Contrast Inversion
          </p>
        </div>
        <ScientificBadge variant="amber" hasDot>
          OBJECTIVE APERTURE MECHANICS
        </ScientificBadge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <BrutalCard
            variant="default"
            shadowSize="md"
            titleBar="APERTURE SELECTOR"
            titleBarBadge="BFP"
            className="bg-white"
          >
            <div className="space-y-4 font-mono text-xs">
              <span className="font-bold text-slate-900 uppercase block">
                Select Contrast Mechanism:
              </span>

              <div className="space-y-2">
                {(
                  [
                    {
                      id: "bright-field",
                      label: "Bright-Field (BF)",
                      badge: "Direct Beam (000)",
                      desc: "Aperture centered on optical axis. Diffracted rays blocked.",
                    },
                    {
                      id: "dark-field",
                      label: "Dark-Field (DF)",
                      badge: "Diffracted Beam (g)",
                      desc: "Aperture shifted or beam tilted. Direct beam blocked.",
                    },
                    {
                      id: "high-resolution",
                      label: "Phase Contrast (HRTEM)",
                      badge: "Open Aperture",
                      desc: "Transmitted + diffracted beams interfere to form lattice fringes.",
                    },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMode(m.id)}
                    className={`w-full text-left p-3 border-2 transition-all flex flex-col gap-1 ${
                      selectedMode === m.id
                        ? "bg-foreground text-background border-border font-bold shadow-neo-sm -translate-x-0.5 -translate-y-0.5"
                        : "bg-surface hover:bg-surface-warm border-slate-300 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold font-sans uppercase">
                        {m.label}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 border ${
                          selectedMode === m.id
                            ? "bg-hazard-amber text-foreground font-bold"
                            : "bg-surface-warm text-slate-600"
                        }`}
                      >
                        {m.badge}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] leading-tight ${
                        selectedMode === m.id ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {m.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </BrutalCard>

          {/* Carter Grounded Notes */}
          <BrutalCard variant="warm" shadowSize="sm" className="bg-[#F4EFE6]">
            <div className="space-y-2 font-mono text-xs">
              <div className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#FF5722]" />
                Carter Textbook Reference:
              </div>
              <div className="text-[11px] text-slate-700 italic">
                {modeInfo.carterReference}
              </div>
              <p className="text-[11px] text-slate-800 font-sans leading-relaxed pt-1">
                {modeInfo.scientificExplanation}
              </p>
            </div>
          </BrutalCard>
        </div>

        {/* Ray Diagram Canvas Column */}
        <div className="lg:col-span-7 space-y-4">
          <BrutalCard
            variant="dark"
            shadowSize="lg"
            titleBar="ELECTRON OPTICAL RAY PATH & APERTURE INTERCEPTION"
            titleBarBadge={modeInfo.name}
            className="bg-[#0B0E14] text-white"
          >
            <div className="space-y-3">
              <div className="border border-slate-800 bg-[#0B0E14] flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={340}
                  className="w-full max-w-[460px] h-[320px] sm:h-[340px] block"
                />
              </div>

              {/* Status footer pill */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900 border border-slate-800 p-2">
                  <div className="text-[10px] text-slate-400">BEAM SELECTED</div>
                  <div className="font-bold text-beam-cyan truncate">
                    {modeInfo.beamSelected}
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2">
                  <div className="text-[10px] text-slate-400">CONTRAST TYPE</div>
                  <div className="font-bold text-phosphor-green truncate">
                    {modeInfo.contrastType}
                  </div>
                </div>
              </div>
            </div>
          </BrutalCard>

          {/* Typical Laboratory Use Cases */}
          <div className="brutal-border bg-white p-4 font-mono text-xs space-y-2">
            <span className="font-bold uppercase text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Typical Experimental Use Cases:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-sans text-slate-700">
              {modeInfo.typicalUseCases.map((uc, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] shrink-0" />
                  {uc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
