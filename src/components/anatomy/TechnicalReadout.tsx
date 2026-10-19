"use client";

import React from "react";
import { ANATOMY_CHAPTERS } from "./chapters";
import { calculateRelativisticElectron } from "@/lib/physics/relativistic";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

interface TechnicalReadoutProps {
  activeChapterIndex: number;
  voltageKV?: number;
  className?: string;
}

export function TechnicalReadout({
  activeChapterIndex,
  voltageKV = 200,
  className,
}: TechnicalReadoutProps) {
  const chapter = ANATOMY_CHAPTERS[activeChapterIndex] || ANATOMY_CHAPTERS[0];
  const physics = calculateRelativisticElectron(voltageKV);

  return (
    <div
      className={cn(
        "bg-[#0B0E14] text-white border-2 border-[#0F172A] brutal-shadow-sm p-3 font-mono text-xs w-full max-w-xs select-none",
        className
      )}
      role="region"
      aria-label="Instrument Telemetry Status"
    >
      <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5" />
          SYSTEM TELEMETRY
        </span>
        <span className="bg-slate-800 text-[10px] px-1.5 py-0.2 border border-slate-700 font-bold text-phosphor-green">
          ONLINE
        </span>
      </div>

      <div className="space-y-1.5 text-[11px]">
        {/* Beam Status */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">BEAM STATE</span>
          <span className="flex items-center gap-1 font-bold text-phosphor-green">
            <span className="w-1.5 h-1.5 rounded-full bg-phosphor-green animate-pulse" />
            {chapter.systemStatus.beam}
          </span>
        </div>

        {/* Accelerating Voltage */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">VOLTAGE (HT)</span>
          <span className="font-bold text-beam-cyan">{voltageKV} kV</span>
        </div>

        {/* de Broglie Wavelength */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">WAVELENGTH (λ)</span>
          <span className="font-bold text-slate-200">{physics.wavelengthPm.toFixed(2)} pm</span>
        </div>

        {/* Relativistic Velocity */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">VELOCITY (v/c)</span>
          <span className="font-bold text-slate-200">{(physics.velocityFractionC * 100).toFixed(1)}% c</span>
        </div>

        {/* Optical Mode */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-1.5">
          <span className="text-slate-400">ACTIVE MODE</span>
          <span className="font-bold text-amber-300 truncate max-w-[150px] text-right">
            {chapter.systemStatus.mode}
          </span>
        </div>

        {/* Subsystem Location */}
        {chapter.systemStatus.stageInfo && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">SUBSYSTEM</span>
            <span className="text-[10px] text-slate-300 truncate max-w-[150px] text-right">
              {chapter.systemStatus.stageInfo}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
