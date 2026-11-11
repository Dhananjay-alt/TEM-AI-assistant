"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ShieldAlert,
  ChevronRight,
  Sliders,
  Wrench,
} from "lucide-react";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import { TROUBLESHOOTING_GUIDE, TroubleshootingItem } from "@/data/troubleshooting-guide";

export function TroubleshootingMatrix() {
  const [selectedId, setSelectedId] = useState<string>(TROUBLESHOOTING_GUIDE[0].id);

  const activeProblem: TroubleshootingItem =
    TROUBLESHOOTING_GUIDE.find((item) => item.id === selectedId) ||
    TROUBLESHOOTING_GUIDE[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold font-sans">
            TEM laboratory experimental troubleshooter
          </h2>
          <p className="text-xs font-mono text-muted">
            Diagnose column alignment, specimen charging, contamination, and contrast issues
          </p>
        </div>
        <ScientificBadge variant="red" hasDot>
          Diagnostic matrix
        </ScientificBadge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Symptom Selector List */}
        <div className="lg:col-span-5 space-y-4">
          <BrutalCard
            variant="default"
            shadowSize="md"
            titleBar="What is wrong at the column?"
            titleBarBadge="SYMPTOMS"
            className="bg-surface"
          >
            <div className="space-y-2 font-mono text-xs">
              <span className="font-bold text-foreground block text-[11px]">
                Select Observed Experimental Problem:
              </span>
              <div className="space-y-1.5">
                {TROUBLESHOOTING_GUIDE.map((prob) => {
                  const isSelected = selectedId === prob.id;
                  return (
                    <button
                      key={prob.id}
                      onClick={() => setSelectedId(prob.id)}
                      className={`w-full text-left p-3 border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? "bg-inverse text-inverse-fg border-border font-bold shadow-neo-sm"
                          : "bg-surface hover:bg-surface-warm border-line text-foreground"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-faint">
                          {prob.category}
                        </div>
                        <div className="text-xs font-sans font-bold leading-tight">
                          {prob.symptom}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </BrutalCard>
        </div>

        {/* Right Column: Diagnostic & Step-by-Step Corrective Protocol */}
        <div className="lg:col-span-7 space-y-4">
          <BrutalCard
            variant="warm"
            shadowSize="lg"
            titleBar={`DIAGNOSIS: ${activeProblem.category.toUpperCase()}`}
            titleBarBadge={`SEVERITY: ${activeProblem.severity}`}
            className="bg-surface-2"
          >
            <div className="space-y-5 font-mono text-xs">
              {/* Problem Heading */}
              <div className="border-b border-border pb-3 space-y-1">
                <div className="text-[10px] font-bold text-muted">
                  Observed symptom:
                </div>
                <h3 className="text-base sm:text-lg font-bold font-sans text-foreground">
                  "{activeProblem.symptom}"
                </h3>
              </div>

              {/* Possible Causes List */}
              <div className="space-y-2">
                <div className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-accent" />
                  Possible Physical Root Causes:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeProblem.possibleCauses.map((cause, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-surface brutal-border border-border space-y-1"
                    >
                      <div className="font-bold text-foreground text-[11px]">
                        0{idx + 1} / {cause.title}
                      </div>
                      <p className="text-[10px] font-sans text-muted leading-normal">
                        {cause.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step "Try this" Action Procedure */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="font-bold text-foreground flex items-center gap-1.5 text-xs">
                  <Wrench className="w-4 h-4 text-emerald-700" />
                  Recommended Experimental Protocol (Try This):
                </div>
                <div className="space-y-2">
                  {activeProblem.tryThis.map((step) => (
                    <div
                      key={step.step}
                      className="p-3 bg-surface brutal-border border-border flex items-start gap-3"
                    >
                      <span className="w-6 h-6 brutal-border bg-inverse text-inverse-fg flex items-center justify-center font-bold text-xs shrink-0">
                        {step.step}
                      </span>
                      <div className="space-y-0.5">
                        <div className="font-bold text-foreground text-xs">
                          {step.action}
                        </div>
                        <p className="text-[11px] font-sans text-foreground leading-relaxed">
                          {step.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning note if present */}
              {activeProblem.warningNote && (
                <div className="p-3 bg-red-50 border border-red-400 text-red-900 font-sans text-xs flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Critical laboratory safety alert:</strong>{" "}
                    {activeProblem.warningNote}
                  </div>
                </div>
              )}

              {/* Carter Reference Grounding */}
              <div className="pt-2 border-t border-line text-[11px] font-mono text-muted flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-accent" />
                <span>Textbook Grounding: {activeProblem.carterReference}</span>
              </div>
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
