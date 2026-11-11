"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Network,
  Atom,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  ExternalLink,
  Layers,
} from "lucide-react";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import { TEM_CONCEPTS, ConceptNode } from "@/data/demo-concepts";

export function InteractiveKnowledgeGraph() {
  const [selectedConceptId, setSelectedConceptId] = useState<string>("diffraction-contrast");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const activeConcept: ConceptNode =
    TEM_CONCEPTS.find((c) => c.id === selectedConceptId) || TEM_CONCEPTS[0];

  const categories = ["All", "Optics", "Diffraction", "Imaging", "Spectrometry", "Crystallography"];

  const filteredConcepts = TEM_CONCEPTS.filter((c) => {
    if (selectedCategory !== "All" && c.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold font-sans">
            Interactive TEM concept & knowledge map
          </h2>
          <p className="text-xs font-mono text-muted">
            Explore the structural connections between reciprocal space, electron optics, contrast & spectrometry
          </p>
        </div>
        <ScientificBadge variant="cyan" hasDot>
          Carter concept graph
        </ScientificBadge>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="font-bold text-foreground">Filter Category:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 border text-[11px] font-bold transition-all ${
              selectedCategory === cat
                ? "bg-inverse text-inverse-fg border-border shadow-neo-xs"
                : "bg-surface text-foreground hover:bg-surface-warm border-line"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Node Map Matrix */}
        <div className="lg:col-span-7 space-y-4">
          <BrutalCard
            variant="default"
            shadowSize="md"
            titleBar="TEM concept network nodes"
            titleBarBadge={`${filteredConcepts.length} CONCEPTS`}
            className="bg-surface"
          >
            <div className="space-y-3 font-mono text-xs">
              <span className="font-bold text-foreground block text-[11px]">
                Click Any Node to Inspect Relationships & Physics:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredConcepts.map((concept) => {
                  const isSelected = selectedConceptId === concept.id;
                  const catColors = {
                    Optics: "border-l-2 border-l-[#00D2FF]",
                    Diffraction: "border-l-2 border-l-[#10B981]",
                    Imaging: "border-l-2 border-l-accent",
                    Spectrometry: "border-l-2 border-l-[#8B5CF6]",
                    Crystallography: "border-l-2 border-l-[#F59E0B]",
                  }[concept.category];

                  return (
                    <button
                      key={concept.id}
                      onClick={() => setSelectedConceptId(concept.id)}
                      className={`p-3 border text-left transition-all relative ${catColors} ${
                        isSelected
                          ? "bg-inverse text-inverse-fg border-border shadow-neo-sm font-bold"
                          : "bg-surface hover:bg-surface-warm border-line text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-faint font-mono">
                          {concept.category}
                        </span>
                        <span className="text-[9px] bg-line/50 px-1 py-0.2 border border-line text-foreground">
                          Ch. {concept.carterChapter}
                        </span>
                      </div>
                      <div className="font-sans font-bold text-xs">
                        {concept.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </BrutalCard>
        </div>

        {/* Right Column: Deep Concept Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <BrutalCard
            variant="warm"
            shadowSize="lg"
            titleBar={`INSPECTING: ${activeConcept.label.toUpperCase()}`}
            titleBarBadge={activeConcept.category}
            className="bg-surface-2"
          >
            <div className="space-y-4 font-mono text-xs">
              {/* Concept Title & Carter Location */}
              <div className="border-b border-border pb-3 space-y-1">
                <div className="text-[10px] text-accent font-bold">
                  Williams & Carter: Chapter {activeConcept.carterChapter} ({activeConcept.carterSection})
                </div>
                <h3 className="text-lg font-bold font-sans text-foreground">
                  {activeConcept.label}
                </h3>
              </div>

              {/* Physical Definition */}
              <div className="space-y-1">
                <span className="font-bold text-foreground text-[11px] block">
                  Physical Mechanism:
                </span>
                <p className="text-[11px] font-sans text-foreground leading-relaxed bg-surface p-3 brutal-border">
                  {activeConcept.shortDefinition}
                </p>
              </div>

              {/* Core Equation if present */}
              {activeConcept.keyEquation && (
                <div className="space-y-1">
                  <span className="font-bold text-foreground text-[11px] block">
                    Core Mathematical Equation:
                  </span>
                  <div className="bg-inverse text-inverse-fg p-2.5 font-mono text-center font-bold text-xs tracking-wide">
                    {activeConcept.keyEquation}
                  </div>
                </div>
              )}

              {/* Connected Relationships */}
              <div className="space-y-1.5 pt-2 border-t border-border">
                <span className="font-bold text-foreground text-[11px] block">
                  Connected Concepts in Carter:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeConcept.connections.map((connId) => {
                    const conn = TEM_CONCEPTS.find((c) => c.id === connId);
                    if (!conn) return null;
                    return (
                      <button
                        key={connId}
                        onClick={() => setSelectedConceptId(connId)}
                        className="px-2 py-1 bg-surface hover:bg-surface-2 border border-border text-[11px] font-mono text-foreground flex items-center gap-1"
                      >
                        → {conn.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct Simulator or Ask Actions */}
              <div className="pt-3 border-t border-line flex flex-col gap-2">
                {activeConcept.simulatorLink && (
                  <Link href={activeConcept.simulatorLink}>
                    <BrutalButton variant="cyan" size="sm" className="w-full">
                      Open relevant simulator
                    </BrutalButton>
                  </Link>
                )}
                <Link
                  href={`/ask?prompt=${encodeURIComponent(activeConcept.suggestedPrompt)}`}
                >
                  <BrutalButton variant="primary" size="sm" className="w-full">
                    Ask the assistant about this
                  </BrutalButton>
                </Link>
              </div>
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
