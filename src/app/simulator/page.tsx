"use client";

import React, { useState } from "react";
import { Atom, Sliders, Layers, Sparkles } from "lucide-react";
import { WavelengthCalculator } from "@/components/simulator/WavelengthCalculator";
import { DiffractionSimulator } from "@/components/simulator/DiffractionSimulator";
import { BfDfRayDiagram } from "@/components/simulator/BfDfRayDiagram";
import { ScientificBadge } from "@/components/ui/ScientificBadge";

export default function SimulatorPage() {
  const [activeTab, setActiveTab] = useState<"diffraction" | "wavelength" | "bfdf">(
    "diffraction"
  );

  const tabs = [
    {
      id: "diffraction",
      label: "DIFFRACTION LAB (SAED)",
      desc: "Spot/Ring Pattern Generator (R·d = λ·L)",
      icon: <Atom className="w-4 h-4 text-[#10B981]" />,
    },
    {
      id: "wavelength",
      label: "WAVELENGTH (λ)",
      desc: "Relativistic de Broglie Calculator",
      icon: <Sliders className="w-4 h-4 text-[#00D2FF]" />,
    },
    {
      id: "bfdf",
      label: "BF / DF OPTICS",
      desc: "Objective Aperture & Contrast Mechanisms",
      icon: <Layers className="w-4 h-4 text-[#FF5722]" />,
    },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Title & Tab Navigation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-border pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-sans uppercase text-foreground">
              TEM INTERACTIVE LABORATORY SIMULATORS
            </h1>
            <p className="text-xs font-mono text-slate-600">
              Experiment with relativistic momentum, reciprocal space, and objective aperture optics
            </p>
          </div>
          <ScientificBadge variant="green" hasDot>
            VIRTUAL BEAM ACTIVE
          </ScientificBadge>
        </div>

        {/* Tab Selection Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3.5 brutal-border text-left transition-all flex items-center justify-between gap-3 ${
                  isActive
                    ? "bg-foreground text-background shadow-neo-md -translate-x-0.5 -translate-y-0.5"
                    : "bg-white hover:bg-surface-warm text-slate-900 shadow-neo-xs"
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-sans font-bold text-xs uppercase">
                    {tab.icon}
                    {tab.label}
                  </div>
                  <div
                    className={`text-[10px] font-mono leading-tight ${
                      isActive ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {tab.desc}
                  </div>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? "bg-hazard-amber" : "bg-slate-300"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === "diffraction" && <DiffractionSimulator />}
        {activeTab === "wavelength" && <WavelengthCalculator />}
        {activeTab === "bfdf" && <BfDfRayDiagram />}
      </div>
    </div>
  );
}
