"use client";

import React, { useState } from "react";
import { Sliders, Sparkles, BookOpen, AlertCircle, ArrowRight } from "lucide-react";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { ParameterSlider } from "@/components/ui/ParameterSlider";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import {
  calculateRelativisticElectron,
  TYPICAL_VOLTAGES,
} from "@/lib/physics/relativistic";

export function WavelengthCalculator() {
  const [voltageKV, setVoltageKV] = useState<number>(200);

  const physics = calculateRelativisticElectron(voltageKV);

  // Bragg angle for Silicon (111) with d = 0.3135 nm
  const dSi111 = 0.3135;
  const thetaRad = Math.asin(Math.min(1, physics.wavelengthNm / (2 * dSi111)));
  const thetaMrad = thetaRad * 1000;
  const thetaDeg = (thetaRad * 180) / Math.PI;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="border-b-2 border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-black font-sans uppercase">
            01 / RELATIVISTIC ELECTRON WAVELENGTH CALCULATOR
          </h3>
          <p className="text-xs font-mono text-slate-600">
            Grounded in Williams & Carter Chapter 1: "The Transmission Electron Microscope"
          </p>
        </div>
        <ScientificBadge variant="cyan" hasDot>
          RELATIVISTIC DE BROGLIE
        </ScientificBadge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4">
          <BrutalCard
            variant="default"
            shadowSize="md"
            titleBar="ACCELERATING VOLTAGE CONTROLLER"
            titleBarBadge="HT"
            className="bg-white"
          >
            <div className="space-y-5">
              <ParameterSlider
                label="Accelerating Potential"
                value={voltageKV}
                min={10}
                max={300}
                step={5}
                unit="kV"
                onChange={setVoltageKV}
                helperText="Typical TEM accelerating voltages range from 80 kV (Cryo-TEM / 2D materials) to 300 kV (HRTEM)."
              />

              {/* Typical Voltage Presets */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
                  Quick Laboratory Presets:
                </span>
                <div className="space-y-1.5">
                  {TYPICAL_VOLTAGES.map((tv) => (
                    <button
                      key={tv.kv}
                      onClick={() => setVoltageKV(tv.kv)}
                      className={`w-full text-left p-2 border font-mono text-xs transition-all flex items-center justify-between ${
                        voltageKV === tv.kv
                          ? "bg-foreground text-background border-border font-bold shadow-neo-xs"
                          : "bg-surface hover:bg-surface-warm border-slate-300"
                      }`}
                    >
                      <span>{tv.label}</span>
                      <span className="text-[10px] opacity-80">{tv.kv} kV</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </BrutalCard>

          {/* Equation Breakdown Box */}
          <div className="brutal-border bg-[#F4EFE6] p-4 text-xs font-mono space-y-2">
            <div className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#FF5722]" />
              The Relativistic de Broglie Equation:
            </div>
            <div className="bg-white p-2.5 brutal-border text-[11px] text-center font-bold text-slate-800">
              λ = h / √[ 2 m₀ e V ( 1 + e V / (2 m₀ c²) ) ]
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
              As accelerating voltage V increases, electrons gain relativistic momentum p. Because λ = h / p, higher voltage yields a dramatically shorter wavelength.
            </p>
          </div>
        </div>

        {/* Readouts & Comparison Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BrutalCard
              variant="cyan"
              shadowSize="md"
              titleBar="RELATIVISTIC WAVELENGTH (λ)"
              className="bg-[#E0F7FE]"
            >
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#0369A1]">
                  {physics.wavelengthNm.toFixed(5)} <span className="text-lg">nm</span>
                </div>
                <div className="text-sm font-mono font-bold text-slate-700">
                  = {physics.wavelengthPm.toFixed(2)} picometers (pm)
                </div>
                <div className="text-xs font-mono text-slate-600">
                  = {physics.wavelengthAngstrom.toFixed(4)} Ångströms (Å)
                </div>
              </div>
            </BrutalCard>

            <BrutalCard
              variant="amber"
              shadowSize="md"
              titleBar="ELECTRON SPEED & KINEMATICS"
              className="bg-[#FEF3C7]"
            >
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[#B45309]">
                  {(physics.velocityFractionC * 100).toFixed(1)}% <span className="text-lg">c</span>
                </div>
                <div className="text-sm font-mono font-bold text-slate-700">
                  v = {(physics.velocityMs / 1e8).toFixed(2)} × 10⁸ m/s
                </div>
                <div className="text-xs font-mono text-slate-600">
                  Lorentz factor γ = {physics.gamma.toFixed(3)}
                </div>
              </div>
            </BrutalCard>
          </div>

          {/* Relativistic vs Non-Relativistic Error Box */}
          <BrutalCard variant="default" shadowSize="sm" className="bg-white">
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-slate-900 uppercase">
                  Why Classical Physics Fails at {voltageKV} kV:
                </span>
                <span className="bg-[#EF4444] text-white px-1.5 py-0.5 text-[10px] font-bold">
                  {physics.relativisticCorrectionPct.toFixed(1)}% ERROR IF IGNORED
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2 bg-slate-50 border border-slate-200 space-y-0.5">
                  <div className="text-slate-500">Non-Relativistic (Classical):</div>
                  <div className="font-bold text-slate-800">
                    {physics.nonRelativisticWavelengthNm.toFixed(5)} nm
                  </div>
                  <div className="text-[10px] text-slate-400">λ₀ = h / √(2 m₀ e V)</div>
                </div>

                <div className="p-2 bg-emerald-50 border border-emerald-200 space-y-0.5">
                  <div className="text-emerald-700">Relativistic (Actual TEM):</div>
                  <div className="font-bold text-emerald-900">
                    {physics.wavelengthNm.toFixed(5)} nm
                  </div>
                  <div className="text-[10px] text-emerald-600">Accounts for mass increase</div>
                </div>
              </div>

              <p className="text-[11px] font-sans text-slate-600">
                In Carter Chapter 1, it is noted that overlooking relativity at 200 kV introduces an error of nearly 8.5%, which would completely ruin lattice fringe indexing and camera constant calibrations!
              </p>
            </div>
          </BrutalCard>

          {/* Bragg Angle for Silicon (111) */}
          <BrutalCard variant="warm" shadowSize="sm" className="bg-[#F4EFE6]">
            <div className="space-y-2 font-mono text-xs">
              <div className="font-bold text-slate-900 uppercase flex items-center justify-between">
                <span>Bragg Angle for Silicon (111) [d = 0.3135 nm]:</span>
                <span className="text-[10px] bg-white px-2 py-0.5 border border-border">
                  2d sin(θ) = λ
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white p-2 border border-border">
                  <div className="text-[10px] text-slate-500">θ_B (mrad)</div>
                  <div className="font-bold text-sm text-[#0284C7]">{thetaMrad.toFixed(2)} mrad</div>
                </div>
                <div className="bg-white p-2 border border-border">
                  <div className="text-[10px] text-slate-500">θ_B (degrees)</div>
                  <div className="font-bold text-sm text-foreground">{thetaDeg.toFixed(3)}°</div>
                </div>
                <div className="bg-white p-2 border border-border">
                  <div className="text-[10px] text-slate-500">Deflection 2θ</div>
                  <div className="font-bold text-sm text-[#FF5722]">{(thetaDeg * 2).toFixed(3)}°</div>
                </div>
              </div>
              <p className="text-[10px] font-sans text-slate-600">
                Because θ_B is tiny (&lt; 0.5°), the small-angle approximation sin(θ) ≈ θ holds with extraordinary precision in TEM.
              </p>
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
