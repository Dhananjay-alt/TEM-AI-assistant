"use client";

import React, { useState } from "react";
import {
  Compass,
  Star,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sliders,
} from "lucide-react";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import { TEM_TECHNIQUES, TemTechnique } from "@/data/techniques-data";

export function TechniqueDecisionWizard() {
  const [targetGoal, setTargetGoal] = useState<string>("crystal-structure");
  const [scale, setScale] = useState<"<10nm" | "10-100nm" | ">100nm">("10-100nm");
  const [crystallinity, setCrystallinity] = useState<"crystalline" | "amorphous" | "both">(
    "crystalline"
  );

  const goalOptions = [
    { id: "crystal-structure", label: "Crystal Structure & Symmetry" },
    { id: "morphology", label: "Particle Morphology & Size" },
    { id: "defects", label: "Defects, Dislocations & Twins" },
    { id: "composition", label: "Chemical Composition & Elements" },
    { id: "interfaces", label: "Atomic Interfaces & Epitaxy" },
    { id: "lattice-spacing", label: "Unit Cell d-Spacing" },
    { id: "strain-mapping", label: "Local Lattice Strain" },
  ];

  // Rank techniques based on user selection
  const scoredTechniques = TEM_TECHNIQUES.map((tech) => {
    let matchScore = 0;

    // Goal match
    if (tech.targetTags.includes(targetGoal)) matchScore += 50;

    // Scale compatibility
    if (tech.scaleCompatibility.includes(scale)) matchScore += 25;

    // Crystallinity match
    if (tech.crystallinityCompatibility.includes(crystallinity) || tech.crystallinityCompatibility.includes("both")) {
      matchScore += 25;
    }

    return {
      technique: tech,
      matchScore,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2 border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-black font-sans uppercase">
            05 / MATERIALS PROBLEM TECHNIQUE RECOMMENDER
          </h2>
          <p className="text-xs font-mono text-slate-600">
            Interactive Decision Matrix: Choose the optimal TEM method for your materials problem
          </p>
        </div>
        <ScientificBadge variant="cyan" hasDot>
          EDUCATIONAL GUIDANCE
        </ScientificBadge>
      </div>

      {/* 3-Step Selection Wizard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Investigation Target */}
        <BrutalCard
          variant="default"
          shadowSize="sm"
          titleBar="STEP 1: INVESTIGATION TARGET"
          className="bg-white"
        >
          <div className="space-y-2 font-mono text-xs">
            <span className="font-bold text-slate-800 uppercase block text-[11px]">
              What do you need to determine?
            </span>
            <div className="space-y-1.5">
              {goalOptions.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setTargetGoal(g.id)}
                  className={`w-full text-left p-2 border font-mono text-xs transition-all ${
                    targetGoal === g.id
                      ? "bg-foreground text-background font-bold border-border shadow-neo-xs"
                      : "bg-surface hover:bg-surface-warm border-slate-300 text-slate-800"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </BrutalCard>

        {/* Step 2: Feature Scale */}
        <BrutalCard
          variant="default"
          shadowSize="sm"
          titleBar="STEP 2: FEATURE SCALE"
          className="bg-white"
        >
          <div className="space-y-2 font-mono text-xs">
            <span className="font-bold text-slate-800 uppercase block text-[11px]">
              What is the size of the feature?
            </span>
            <div className="space-y-1.5">
              {(
                [
                  { id: "<10nm", label: "Atomic / Sub-10 nm (<10 nm)", desc: "Lattice columns, quantum dots, clusters" },
                  { id: "10-100nm", label: "Nanoscale (10–100 nm)", desc: "Nanoparticles, precipitates, dislocation loops" },
                  { id: ">100nm", label: "Meso / Micro (>100 nm)", desc: "Grains, thin film layers, bulk domains" },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScale(s.id)}
                  className={`w-full text-left p-2 border font-mono text-xs transition-all ${
                    scale === s.id
                      ? "bg-[#00D2FF] text-foreground font-bold border-border shadow-neo-xs"
                      : "bg-surface hover:bg-surface-warm border-slate-300 text-slate-800"
                  }`}
                >
                  <div className="font-bold">{s.label}</div>
                  <div className="text-[10px] text-slate-500">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </BrutalCard>

        {/* Step 3: Specimen State */}
        <BrutalCard
          variant="default"
          shadowSize="sm"
          titleBar="STEP 3: SPECIMEN ORDER"
          className="bg-white"
        >
          <div className="space-y-2 font-mono text-xs">
            <span className="font-bold text-slate-800 uppercase block text-[11px]">
              Crystallographic state:
            </span>
            <div className="space-y-1.5">
              {(
                [
                  { id: "crystalline", label: "Crystalline", desc: "Metals, semiconductors, ceramics with periodic lattice" },
                  { id: "amorphous", label: "Amorphous / Vitreous", desc: "Glasses, polymers, amorphous carbon, biological" },
                  { id: "both", label: "Multiphase / Unknown", desc: "Composite, partially crystalline, or unknown sample" },
                ] as const
              ).map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCrystallinity(c.id)}
                  className={`w-full text-left p-2 border font-mono text-xs transition-all ${
                    crystallinity === c.id
                      ? "bg-[#F59E0B] text-foreground font-bold border-border shadow-neo-xs"
                      : "bg-surface hover:bg-surface-warm border-slate-300 text-slate-800"
                  }`}
                >
                  <div className="font-bold">{c.label}</div>
                  <div className="text-[10px] text-slate-500">{c.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </BrutalCard>
      </div>

      {/* Ranked Recommendations Output */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-border pb-2">
          <span className="font-mono text-xs font-bold uppercase text-slate-900">
            Recommended TEM Techniques (Ranked by Suitability):
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Grounded in Carter's Characterization Strategies
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scoredTechniques.slice(0, 4).map(({ technique: tech, matchScore }, index) => (
            <BrutalCard
              key={tech.id}
              variant={index === 0 ? "cyan" : "default"}
              shadowSize="md"
              titleBar={`RANK ${index + 1} / ${tech.abbreviation} (${tech.category})`}
              titleBarBadge={index === 0 ? "TOP RECOMMENDATION" : `${matchScore}% SUITABLE`}
              className={index === 0 ? "bg-[#E0F7FE]" : "bg-white"}
            >
              <div className="space-y-3 font-mono text-xs">
                {/* Title & Stars */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold font-sans text-slate-900">
                      {tech.name}
                    </h3>
                    <div className="text-[11px] text-slate-600 font-bold">
                      {tech.primaryUse}
                    </div>
                  </div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: tech.stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Detailed Rationale */}
                <p className="text-[11px] font-sans text-slate-800 leading-relaxed bg-white/70 p-2.5 brutal-border">
                  {tech.detailedRationale}
                </p>

                {/* Pros and Cons */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-sans">
                  <div className="space-y-1">
                    <span className="font-bold text-emerald-800 uppercase block font-mono">
                      ✓ Advantages:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      {tech.pros.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-red-800 uppercase block font-mono">
                      ✗ Limitations:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      {tech.cons.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Specimen Requirements & Carter Citation */}
                <div className="pt-2 border-t border-slate-300 text-[10px] text-slate-600 flex flex-col gap-0.5">
                  <div>
                    <strong>Specimen Condition:</strong> {tech.specimenRequirements}
                  </div>
                  <div>
                    <strong>Carter Reference:</strong> {tech.carterReference}
                  </div>
                </div>
              </div>
            </BrutalCard>
          ))}
        </div>
      </div>

      {/* Educational Disclaimer */}
      <div className="p-3 bg-amber-50 border border-amber-300 text-[11px] font-sans text-amber-900">
        ℹ️ <strong>Educational Note:</strong> Recommendations must be treated as educational guidance to help develop physical intuition, not as rigid operating instructions for specific commercial microscopes.
      </div>
    </div>
  );
}
