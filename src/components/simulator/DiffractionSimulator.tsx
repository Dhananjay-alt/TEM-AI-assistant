"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sliders, HelpCircle, Layers, RefreshCw, ZoomIn, Info } from "lucide-react";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { ParameterSlider } from "@/components/ui/ParameterSlider";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import {
  calculateDiffractionPattern,
  CRYSTAL_DATABASE,
  DiffractionResult,
} from "@/lib/physics/diffraction";

export function DiffractionSimulator() {
  const [voltageKV, setVoltageKV] = useState<number>(200);
  const [cameraLengthMm, setCameraLengthMm] = useState<number>(600);
  const [selectedCrystal, setSelectedCrystal] = useState<string>("gold");
  const [zoneAxis, setZoneAxis] = useState<string>("[001]");
  const [mode, setMode] = useState<"single-crystal" | "polycrystalline-rings">("single-crystal");
  const [showLabels, setShowLabels] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const patternData: DiffractionResult = calculateDiffractionPattern(
    voltageKV,
    cameraLengthMm,
    selectedCrystal,
    zoneAxis,
    mode,
    2.2 // scale pixels per mm
  );

  // Draw diffraction pattern on dark scientific phosphor canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Phosphor screen background
    ctx.fillStyle = "#0B0E14";
    ctx.fillRect(0, 0, width, height);

    // Subtle phosphor coordinate rings
    ctx.strokeStyle = "rgba(16, 185, 129, 0.1)";
    ctx.lineWidth = 1;
    for (let r = 40; r < width / 2; r += 40) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Coordinate crosshairs
    ctx.strokeStyle = "rgba(16, 185, 129, 0.15)";
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Central diffuse beam glow
    const radialGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
    radialGlow.addColorStop(0, "rgba(16, 185, 129, 0.45)");
    radialGlow.addColorStop(0.2, "rgba(4, 120, 87, 0.2)");
    radialGlow.addColorStop(1, "rgba(11, 14, 20, 0)");
    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fill();

    if (mode === "polycrystalline-rings") {
      // Draw concentric Debye-Scherrer rings
      patternData.rings.forEach((ring) => {
        const radiusPixels = ring.radiusMm * 2.2;
        if (radiusPixels > width / 2 - 10) return;

        ctx.strokeStyle = `rgba(34, 197, 94, ${0.4 + ring.intensity * 0.5})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radiusPixels, 0, Math.PI * 2);
        ctx.stroke();

        if (showLabels) {
          ctx.fillStyle = "#A7F3D0";
          ctx.font = "bold 9px monospace";
          ctx.fillText(ring.hklStr, centerX + radiusPixels + 4, centerY - 4);
        }
      });
    } else {
      // Draw single-crystal reciprocal lattice diffraction spots
      patternData.spots.forEach((spot) => {
        const spotX = centerX + spot.x;
        const spotY = centerY + spot.y;

        if (spotX < 10 || spotX > width - 10 || spotY < 10 || spotY > height - 10) return;

        // Spot phosphor halo
        const spotGlow = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 6);
        spotGlow.addColorStop(0, `rgba(74, 222, 128, ${spot.intensity})`);
        spotGlow.addColorStop(1, "rgba(74, 222, 128, 0)");
        ctx.fillStyle = spotGlow;
        ctx.beginPath();
        ctx.arc(spotX, spotY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Sharp core spot
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(spotX, spotY, 2.2, 0, Math.PI * 2);
        ctx.fill();

        if (showLabels && spot.intensity > 0.4) {
          ctx.fillStyle = "#86EFAC";
          ctx.font = "bold 8px monospace";
          ctx.fillText(spot.hklStr, spotX + 4, spotY - 3);
        }
      });
    }

    // Beam Stopper Shadow (typical experimental artifact in TEM SAED)
    ctx.fillStyle = "rgba(18, 20, 23, 0.9)";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + 12, centerY);
    ctx.lineTo(centerX + 60, height);
    ctx.lineTo(centerX + 35, height);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.stroke();

    // Central Transmitted Direct Beam (000)
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "#00D2FF";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Label for central beam
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 9px monospace";
    ctx.fillText("(000)", centerX + 8, centerY + 14);

    // Scale bar in reciprocal space (nm^-1)
    const scaleLengthPixels = 60;
    const scaleValueNmInv = (scaleLengthPixels / 2.2 / patternData.cameraConstantMmNm).toFixed(2);
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(25, height - 25);
    ctx.lineTo(25 + scaleLengthPixels, height - 25);
    ctx.stroke();

    ctx.fillStyle = "#10B981";
    ctx.font = "bold 9px monospace";
    ctx.fillText(`${scaleValueNmInv} nm⁻¹`, 25, height - 30);
  }, [patternData, mode, showLabels]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-black font-sans uppercase">
            02 / SAED ELECTRON DIFFRACTION SIMULATOR
          </h3>
          <p className="text-xs font-mono text-slate-600">
            Selected-Area Electron Diffraction (SAED) & Reciprocal Space Geometry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ScientificBadge variant="green" hasDot>
            CAMERA CONSTANT: {(patternData.cameraConstantMmNm).toFixed(2)} mm·nm
          </ScientificBadge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Instrument Knobs */}
        <div className="lg:col-span-5 space-y-4">
          <BrutalCard
            variant="default"
            shadowSize="md"
            titleBar="DIFFRACTION CONTROLS"
            titleBarBadge="TEM COLUMN"
            className="bg-white"
          >
            <div className="space-y-4">
              {/* Material Selector */}
              <div className="space-y-1.5 font-mono text-xs">
                <label className="font-bold uppercase text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#FF5722]"></span>
                  Target Specimen Crystal:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(CRYSTAL_DATABASE).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCrystal(c.id);
                        setZoneAxis(c.zoneAxes[0] || "[001]");
                      }}
                      className={`p-2 border text-left font-mono text-xs transition-all ${
                        selectedCrystal === c.id
                          ? "bg-foreground text-background font-bold border-border shadow-neo-xs"
                          : "bg-surface hover:bg-surface-warm border-slate-300"
                      }`}
                    >
                      <div className="font-bold">{c.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {c.structure} (a={c.latticeConstantA} nm)
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pattern Mode Toggle */}
              <div className="space-y-1.5 font-mono text-xs">
                <label className="font-bold uppercase text-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#00D2FF]"></span>
                  Pattern Geometry:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMode("single-crystal")}
                    className={`p-2 border text-center font-mono text-xs font-bold transition-all ${
                      mode === "single-crystal"
                        ? "bg-[#00D2FF] text-foreground border-border shadow-neo-xs"
                        : "bg-surface hover:bg-surface-warm border-slate-300"
                    }`}
                  >
                    Single-Crystal Spots
                  </button>
                  <button
                    onClick={() => setMode("polycrystalline-rings")}
                    className={`p-2 border text-center font-mono text-xs font-bold transition-all ${
                      mode === "polycrystalline-rings"
                        ? "bg-[#10B981] text-white border-border shadow-neo-xs"
                        : "bg-surface hover:bg-surface-warm border-slate-300"
                    }`}
                  >
                    Polycrystalline Rings
                  </button>
                </div>
              </div>

              {/* Zone Axis Selection (if single crystal) */}
              {mode === "single-crystal" && (
                <div className="space-y-1.5 font-mono text-xs">
                  <label className="font-bold uppercase text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#F59E0B]"></span>
                    Zone Axis [uvw]:
                  </label>
                  <div className="flex gap-2">
                    {CRYSTAL_DATABASE[selectedCrystal]?.zoneAxes.map((za) => (
                      <button
                        key={za}
                        onClick={() => setZoneAxis(za)}
                        className={`flex-1 py-1.5 border font-mono text-xs font-bold ${
                          zoneAxis === za
                            ? "bg-foreground text-background border-border shadow-neo-xs"
                            : "bg-surface hover:bg-surface-warm border-slate-300"
                        }`}
                      >
                        {za}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Camera Length Slider */}
              <ParameterSlider
                label="Camera Length (L)"
                value={cameraLengthMm}
                min={200}
                max={1200}
                step={50}
                unit="mm"
                onChange={setCameraLengthMm}
                helperText="Increasing camera length optically magnifies the diffraction pattern."
              />

              {/* Accelerating Voltage Slider */}
              <ParameterSlider
                label="Voltage (HT)"
                value={voltageKV}
                min={50}
                max={300}
                step={10}
                unit="kV"
                onChange={setVoltageKV}
                helperText="Higher voltage decreases electron wavelength λ, moving diffraction spots closer to the center."
              />

              <div className="pt-2 flex items-center justify-between border-t text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="w-4 h-4 accent-[#FF5722]"
                  />
                  <span>Show Miller Indices (hkl)</span>
                </label>
              </div>
            </div>
          </BrutalCard>
        </div>

        {/* Right Column: Dark Scientific Phosphor Canvas & Scientific Insights */}
        <div className="lg:col-span-7 space-y-4">
          <BrutalCard
            variant="dark"
            shadowSize="lg"
            titleBar="TEM PHOSPHOR VIEWING SCREEN / DIFFRACTION PATTERN"
            titleBarBadge="DETECTOR PLANE"
            className="bg-[#0B0E14] text-white"
          >
            <div className="space-y-3">
              <div className="border border-slate-800 bg-[#0B0E14] flex justify-center relative">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={380}
                  className="w-full max-w-[460px] h-[340px] sm:h-[380px] block"
                />

                {/* Telemetry pill */}
                <div className="absolute top-2 right-2 bg-black/80 border border-slate-700 px-2.5 py-1 text-[10px] font-mono text-emerald-400">
                  {mode === "single-crystal" ? `ZONE AXIS ${zoneAxis}` : "DEBYE-SCHERRER"}
                </div>
              </div>

              {/* Instrument Readout Bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-900 border border-slate-800 p-2">
                  <div className="text-[10px] text-slate-400">λ (WAVELENGTH)</div>
                  <div className="font-bold text-beam-cyan">
                    {(patternData.wavelengthNm * 1000).toFixed(2)} pm
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2">
                  <div className="text-[10px] text-slate-400">CAMERA LENGTH (L)</div>
                  <div className="font-bold text-amber-400">{cameraLengthMm} mm</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2">
                  <div className="text-[10px] text-slate-400">CAMERA CONSTANT (λL)</div>
                  <div className="font-bold text-phosphor-green">
                    {(patternData.cameraConstantMmNm).toFixed(3)} mm·nm
                  </div>
                </div>
              </div>
            </div>
          </BrutalCard>

          {/* WHAT CHANGED? Scientific Explanation Box */}
          <BrutalCard variant="warm" shadowSize="sm" className="bg-[#F4EFE6]">
            <div className="space-y-2 font-mono text-xs">
              <div className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#FF5722]" />
                WHAT CHANGED? (Williams & Carter Reciprocal Relationships)
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-800 font-sans leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-[#FF5722] font-mono">→</span>
                  <span>
                    <strong>Camera Constant equation:</strong>{" "}
                    <code className="font-mono bg-white px-1 border">R · d = λ · L</code>.
                    The physical radius R of any diffraction spot on the detector is inversely proportional to lattice spacing d and directly proportional to camera length L.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-[#0284C7] font-mono">→</span>
                  <span>
                    <strong>Increasing Camera Length ({cameraLengthMm} mm):</strong>{" "}
                    Diffraction spots move farther from the direct beam (000), increasing angular dispersion.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-[#10B981] font-mono">→</span>
                  <span>
                    <strong>Increasing Voltage ({voltageKV} kV):</strong>{" "}
                    Relativistic momentum increases, reducing electron wavelength λ. Consequently, diffraction angles 2θ_B shrink, drawing all spots inward.
                  </span>
                </li>
              </ul>
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
