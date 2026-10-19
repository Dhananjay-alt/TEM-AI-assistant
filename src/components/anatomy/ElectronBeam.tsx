"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ElectronBeamProps {
  beamActive?: boolean;
  intensity?: number; // 0 to 1
  voltageKV?: number;
  className?: string;
  isCondensed?: boolean;
}

export function ElectronBeam({
  beamActive = true,
  intensity = 0.8,
  voltageKV = 200,
  className,
  isCondensed = false,
}: ElectronBeamProps) {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    let animId: number;
    let start = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - start) / 1000;
      setPulsePhase((elapsed * 2) % 1);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (!beamActive) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Subtle telemetry wave line overlay */}
      <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00D2FF]/40 to-transparent" />
    </div>
  );
}
