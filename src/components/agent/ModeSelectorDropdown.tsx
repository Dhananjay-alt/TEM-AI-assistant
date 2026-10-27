"use client";

import React, { useState, useRef, useEffect } from "react";
import { Zap, GraduationCap, Award, Wrench, ChevronDown, Check } from "lucide-react";
import { ChatMode } from "@/lib/ai/chat";

interface ModeSelectorDropdownProps {
  currentMode: ChatMode;
  onSelectMode: (mode: ChatMode) => void;
  examSubtype?: "2mark" | "5mark" | "10mark" | "viva" | "mcq";
  onSelectExamSubtype?: (sub: "2mark" | "5mark" | "10mark" | "viva" | "mcq") => void;
}

const MODES: Array<{
  id: ChatMode;
  title: string;
  tagline: string;
  icon: React.ReactNode;
}> = [
  {
    id: "ASK",
    title: "Ask Carter",
    tagline: "Direct technical explanation grounded in Carter",
    icon: <Zap className="w-3.5 h-3.5 text-[#FF4500]" />,
  },
  {
    id: "TUTOR",
    title: "Socratic Tutor",
    tagline: "Learn through guided questions & micro-checks",
    icon: <GraduationCap className="w-3.5 h-3.5 text-[#FF4500]" />,
  },
  {
    id: "EXAM",
    title: "Exam Grader",
    tagline: "Practice and evaluate answers with rubrics",
    icon: <Award className="w-3.5 h-3.5 text-[#FF4500]" />,
  },
  {
    id: "EXPERIMENT",
    title: "Column Lab",
    tagline: "Diagnose TEM operating problems & aberrations",
    icon: <Wrench className="w-3.5 h-3.5 text-[#FF4500]" />,
  },
];

const EXAM_SUBTYPES = [
  { id: "2mark", label: "2M" },
  { id: "5mark", label: "5M" },
  { id: "10mark", label: "10M" },
  { id: "viva", label: "Viva" },
] as const;

export function ModeSelectorDropdown({
  currentMode,
  onSelectMode,
  examSubtype = "5mark",
  onSelectExamSubtype,
}: ModeSelectorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeModeObj = MODES.find((m) => m.id === currentMode) || MODES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-flex items-center gap-2 select-none" ref={dropdownRef}>
      {/* Mode Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-[#18181b] hover:bg-white/10 text-white border border-white/15 hover:border-[#FF4500]/60 rounded-xl font-sans text-xs font-medium transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-sm"
        title="Select learning and operational mode"
      >
        <span className="w-4 h-4 bg-white/5 border border-white/10 rounded flex items-center justify-center shrink-0">
          {activeModeObj.icon}
        </span>
        <span className="font-semibold text-white/90">{activeModeObj.title}</span>
        <ChevronDown className={`w-3 h-3 text-white/50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* If Exam mode, show exam marks selector right next to it */}
      {currentMode === "EXAM" && onSelectExamSubtype && (
        <div className="flex items-center gap-1 bg-[#18181b] p-1 border border-white/15 rounded-xl">
          {EXAM_SUBTYPES.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelectExamSubtype(sub.id)}
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-lg transition-colors cursor-pointer ${
                examSubtype === sub.id
                  ? "bg-[#FF4500] text-black shadow-sm"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* Dropdown Popup Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 bg-[#111111] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
          <div className="px-2 py-1 border-b border-white/10 font-mono text-[10px] font-bold text-white/40 uppercase tracking-wider">
            Select Carter Agent Mode
          </div>

          {MODES.map((mode) => {
            const isSelected = mode.id === currentMode;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  onSelectMode(mode.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                  isSelected
                    ? "bg-[#FF4500]/15 border-[#FF4500]/40 text-white shadow-[0_0_15px_rgba(255,69,0,0.1)]"
                    : "border-transparent hover:bg-white/5 hover:border-white/10 text-white/70"
                }`}
              >
                <div className="w-6 h-6 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  {mode.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-xs uppercase text-white">
                      {mode.title}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#FF4500] stroke-[3]" />}
                  </div>
                  <p className="font-sans text-[11px] text-white/50 leading-tight mt-0.5">
                    {mode.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
