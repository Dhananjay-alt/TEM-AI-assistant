"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Play, RefreshCw, Zap, Sliders, ShieldCheck } from "lucide-react";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import { calculateRelativisticElectron } from "@/lib/physics/relativistic";

export function ElectronBeamHero() {
  const [voltageKV, setVoltageKV] = useState<number>(200);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const physics = calculateRelativisticElectron(voltageKV);

  // Animated Electron Beam & Diffraction Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Electron particle simulation
    const particles: { y: number; xOffset: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        y: Math.random() * 320,
        xOffset: (Math.random() - 0.5) * 16,
        speed: 2 + Math.random() * 3,
        size: 1.5 + Math.random() * 1.5,
      });
    }

    const render = () => {
      time += 0.02;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;

      ctx.clearRect(0, 0, width, height);

      // Dark instrument background with subtle grid
      ctx.fillStyle = "#0B0E14";
      ctx.fillRect(0, 0, width, height);

      // Subtle grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Column Geometry:
      // 1. Electron Gun (Top: y = 25)
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(centerX - 35, 10, 70, 25);
      ctx.strokeStyle = "#00D2FF";
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - 35, 10, 70, 25);

      ctx.fillStyle = "#00D2FF";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`GUN: ${voltageKV} kV`, centerX, 26);

      // 2. Incident Beam Column (y = 35 to y = 140)
      const beamGradient = ctx.createLinearGradient(centerX - 10, 35, centerX + 10, 35);
      beamGradient.addColorStop(0, "rgba(0, 210, 255, 0.2)");
      beamGradient.addColorStop(0.5, "rgba(0, 210, 255, 0.9)");
      beamGradient.addColorStop(1, "rgba(0, 210, 255, 0.2)");

      ctx.fillStyle = beamGradient;
      ctx.fillRect(centerX - 6, 35, 12, 105);

      // 3. Specimen Stage (y = 140)
      ctx.fillStyle = "#F59E0B";
      ctx.fillRect(centerX - 50, 140, 100, 8);
      ctx.strokeStyle = "#0F172A";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(centerX - 50, 140, 100, 8);

      ctx.fillStyle = "#000000";
      ctx.font = "bold 8px monospace";
      ctx.fillText("SPECIMEN FOIL (Au)", centerX, 146);

      // 4. Diffracted Beams (y = 148 to y = 290)
      // Central transmitted beam
      ctx.fillStyle = "rgba(0, 210, 255, 0.95)";
      ctx.fillRect(centerX - 3, 148, 6, 140);

      // First-order diffracted Bragg rays: angle scales inversely with voltage!
      // High kV -> shorter wavelength -> smaller diffraction angle!
      const spreadFactor = (200 / voltageKV) * 32;

      ctx.strokeStyle = "rgba(16, 185, 129, 0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, 148);
      ctx.lineTo(centerX - spreadFactor, 290);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX, 148);
      ctx.lineTo(centerX + spreadFactor, 290);
      ctx.stroke();

      // Second-order diffracted rays
      ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX, 148);
      ctx.lineTo(centerX - spreadFactor * 2, 290);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX, 148);
      ctx.lineTo(centerX + spreadFactor * 2, 290);
      ctx.stroke();

      // 5. Streaming Electron Particles
      ctx.fillStyle = "#FFFFFF";
      particles.forEach((p) => {
        p.y += p.speed * (physics.velocityFractionC * 1.5);
        if (p.y > 290) {
          p.y = 35;
          p.xOffset = (Math.random() - 0.5) * 12;
        }

        let px = centerX + p.xOffset;
        if (p.y > 148) {
          // Diverge along diffracted paths probabilistically
          const progress = (p.y - 148) / 142;
          if (p.xOffset > 2) {
            px = centerX + progress * spreadFactor;
          } else if (p.xOffset < -2) {
            px = centerX - progress * spreadFactor;
          }
        }

        ctx.beginPath();
        ctx.arc(px, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 6. Phosphor Viewing Screen (y = 290 to 315)
      ctx.fillStyle = "#064E3B";
      ctx.fillRect(centerX - 90, 290, 180, 25);
      ctx.strokeStyle = "#10B981";
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - 90, 290, 180, 25);

      // Central transmitted spot (000)
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "#00D2FF";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(centerX, 302, 5, 0, Math.PI * 2);
      ctx.fill();

      // Diffracted spots on phosphor screen
      ctx.fillStyle = "#10B981";
      ctx.shadowColor = "#10B981";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(centerX - spreadFactor, 302, 3.5, 0, Math.PI * 2);
      ctx.arc(centerX + spreadFactor, 302, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 2nd order spots
      if (centerX - spreadFactor * 2 > centerX - 85) {
        ctx.beginPath();
        ctx.arc(centerX - spreadFactor * 2, 302, 2.5, 0, Math.PI * 2);
        ctx.arc(centerX + spreadFactor * 2, 302, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0; // Reset shadow

      // Labels on screen
      ctx.fillStyle = "#A7F3D0";
      ctx.font = "bold 8px monospace";
      ctx.fillText("(000)", centerX, 312);
      ctx.fillText("(-g)", centerX - spreadFactor, 312);
      ctx.fillText("(+g)", centerX + spreadFactor, 312);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [voltageKV, physics.velocityFractionC]);

  return (
    <section className="pt-6 pb-12 sm:pt-10 sm:pb-16 instrument-grid border-b-[3px] border-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Bold Neo-Brutalist Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="bg-foreground text-background font-mono text-xs font-bold px-2 py-0.5 uppercase tracking-widest brutal-shadow-sm">
                INSTRUMENT ASSISTANT
              </span>
              <ScientificBadge variant="green" hasDot>
                GROUNDED IN BARRY CARTER
              </ScientificBadge>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-sans tracking-tight text-foreground leading-[1.08] uppercase">
                TRANSMISSION <br />
                <span className="bg-[#FF5722] text-white px-2 py-0.5 inline-block brutal-shadow-sm mr-2">
                  ELECTRON
                </span>
                MICROSCOPY <br />
                <span className="text-[#0284C7]">INTELLIGENCE</span>
              </h1>
              <p className="text-lg sm:text-xl font-mono text-slate-800 font-semibold max-w-xl leading-snug">
                "Turn the TEM textbook into an interactive laboratory."
              </p>
            </div>

            <p className="text-sm font-sans text-slate-700 max-w-xl leading-relaxed">
              TEM-AI unites rigorous materials-science physics from Williams &
              Carter with interactive beam simulations, computer-vision
              micrograph analysis, and exam preparation. Not a generic chatbot—a
              true virtual TEM instrument workstation.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/ask">
                <BrutalButton variant="primary" size="lg" icon={<Zap className="w-4 h-4" />}>
                  ASK CARTER AI
                </BrutalButton>
              </Link>
              <Link href="/simulator">
                <BrutalButton variant="cyan" size="lg" icon={<Play className="w-4 h-4" />}>
                  OPEN TEM SIMULATOR
                </BrutalButton>
              </Link>
              <Link href="/image-analysis">
                <BrutalButton variant="outline" size="lg">
                  ANALYZE MICROGRAPH
                </BrutalButton>
              </Link>
            </div>

            {/* Live Instrument Telemetry Readouts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
              <div className="brutal-border bg-white p-2.5 font-mono">
                <div className="text-[10px] text-slate-500 uppercase">Wavelength (λ)</div>
                <div className="text-sm font-bold text-foreground">
                  {physics.wavelengthNm.toFixed(5)} nm
                </div>
                <div className="text-[9px] text-slate-500">
                  {physics.wavelengthPm.toFixed(2)} pm
                </div>
              </div>
              <div className="brutal-border bg-white p-2.5 font-mono">
                <div className="text-[10px] text-slate-500 uppercase">Electron Velocity (v)</div>
                <div className="text-sm font-bold text-[#0284C7]">
                  {(physics.velocityFractionC * 100).toFixed(1)}% c
                </div>
                <div className="text-[9px] text-slate-500">
                  {(physics.velocityMs / 1e8).toFixed(2)} × 10⁸ m/s
                </div>
              </div>
              <div className="brutal-border bg-white p-2.5 font-mono">
                <div className="text-[10px] text-slate-500 uppercase">Lorentz (γ)</div>
                <div className="text-sm font-bold text-[#FF5722]">
                  {physics.gamma.toFixed(3)}
                </div>
                <div className="text-[9px] text-slate-500">Relativistic Factor</div>
              </div>
              <div className="brutal-border bg-white p-2.5 font-mono">
                <div className="text-[10px] text-slate-500 uppercase">Carter Chunks</div>
                <div className="text-sm font-bold text-phosphor-green">
                  100% CITED
                </div>
                <div className="text-[9px] text-slate-500">Zero Fake Pages</div>
              </div>
            </div>
          </div>

          {/* Right Column: Stylized Animated Electron Column & Live Voltage Knob */}
          <div className="lg:col-span-5">
            <BrutalCard
              variant="default"
              shadowSize="lg"
              titleBar="TEM COLUMN / ELECTRON BEAM TRAJECTORY"
              titleBarBadge="LIVE SIMULATION"
              className="bg-white"
            >
              <div className="space-y-4">
                {/* HTML5 Canvas Beam Schematic */}
                <div className="relative border-2 border-border overflow-hidden bg-[#0B0E14]">
                  <canvas
                    ref={canvasRef}
                    width={380}
                    height={325}
                    className="w-full h-[300px] sm:h-[325px] block"
                  />
                  {/* Overlay telemetry badges */}
                  <div className="absolute top-2 right-2 bg-black/80 border border-slate-700 px-2 py-1 font-mono text-[10px] text-beam-cyan flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-beam-cyan animate-pulse"></span>
                    BRAGG REFLECTION EXCITED
                  </div>
                </div>

                {/* Live Voltage Control Interactive Slider */}
                <div className="bg-surface-warm p-3 border-2 border-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#FF5722]" />
                      ACCELERATING VOLTAGE (HT)
                    </span>
                    <span className="bg-foreground text-background px-2 py-0.5 font-bold">
                      {voltageKV} kV
                    </span>
                  </div>

                  <input
                    type="range"
                    min={10}
                    max={300}
                    step={10}
                    value={voltageKV}
                    onChange={(e) => setVoltageKV(parseInt(e.target.value, 10))}
                    className="w-full h-3 bg-white border-2 border-border appearance-none cursor-pointer accent-[#FF5722]"
                  />

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-600">
                    <button
                      onClick={() => setVoltageKV(80)}
                      className={`px-1.5 py-0.5 border ${voltageKV === 80 ? "bg-foreground text-white" : "bg-white"}`}
                    >
                      80 kV (Cryo)
                    </button>
                    <button
                      onClick={() => setVoltageKV(120)}
                      className={`px-1.5 py-0.5 border ${voltageKV === 120 ? "bg-foreground text-white" : "bg-white"}`}
                    >
                      120 kV
                    </button>
                    <button
                      onClick={() => setVoltageKV(200)}
                      className={`px-1.5 py-0.5 border ${voltageKV === 200 ? "bg-foreground text-white" : "bg-white"}`}
                    >
                      200 kV (Standard)
                    </button>
                    <button
                      onClick={() => setVoltageKV(300)}
                      className={`px-1.5 py-0.5 border ${voltageKV === 300 ? "bg-foreground text-white" : "bg-white"}`}
                    >
                      300 kV (HRTEM)
                    </button>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 border border-slate-200 flex items-center justify-between">
                  <span>Notice: Higher kV → Shorter λ → Spots move closer</span>
                  <Link
                    href="/simulator"
                    className="text-[#0284C7] font-bold hover:underline flex items-center gap-0.5"
                  >
                    Full Lab <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </BrutalCard>
          </div>
        </div>
      </div>
    </section>
  );
}
