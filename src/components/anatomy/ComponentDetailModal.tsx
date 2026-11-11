"use client";

import React from "react";
import { COMPONENT_INSPECTIONS } from "./chapters";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { X, BookOpen, Layers, CheckCircle } from "lucide-react";

interface ComponentDetailModalProps {
  componentId: string | null;
  onClose: () => void;
}

export function ComponentDetailModal({
  componentId,
  onClose,
}: ComponentDetailModalProps) {
  if (!componentId) return null;
  const info = COMPONENT_INSPECTIONS[componentId];
  if (!info) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0F172A]/70 backdrop-blur-sm flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border brutal-shadow-lg max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Title Bar */}
        <div className="bg-inverse text-white p-3 border-b border-border flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-accent-strong" />
            <span className="font-bold tracking-wide">{info.groupName}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-inverse text-slate-300 hover:text-white"
            aria-label="Close component detail"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 font-sans text-xs">
          <div>
            <h3 id="modal-title" className="text-lg font-semibold text-foreground">
              {info.name}
            </h3>
            <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-muted">
              <BookOpen className="w-3.5 h-3.5 text-accent" />
              <span>{info.carterRef}</span>
            </div>
          </div>

          <div className="p-3 bg-surface-warm border border-border space-y-2">
            <div className="font-mono text-[11px] font-bold text-foreground">
              Function & Operational Principle
            </div>
            <p className="text-foreground leading-relaxed">{info.functionDesc}</p>
          </div>

          <div className="space-y-1.5">
            <div className="font-mono text-[11px] font-bold text-foreground">
              Electron-Optical Role
            </div>
            <p className="text-foreground leading-relaxed">{info.opticsRole}</p>
          </div>

          {/* Typical Engineering Parameters */}
          <div className="space-y-2">
            <div className="font-mono text-[11px] font-bold text-foreground">
              Typical Laboratory Specifications
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
              {info.typicalParams.map((param, idx) => (
                <li
                  key={idx}
                  className="p-2 bg-surface border border-line flex items-start gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-phosphor-green shrink-0 mt-0.5" />
                  <span className="text-foreground">{param}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <BrutalButton variant="dark" size="sm" onClick={onClose}>
              Close inspection
            </BrutalButton>
          </div>
        </div>
      </div>
    </div>
  );
}
