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
    icon: <Zap className="w-3.5 h-3.5 text-[#09090B]" />,
  },
  {
    id: "TUTOR",
    title: "Socratic Tutor",
    tagline: "Learn through guided questions & micro-checks",
    icon: <GraduationCap className="w-3.5 h-3.5 text-[#09090B]" />,
  },
  {
    id: "EXAM",
    title: "Exam Grader",
    tagline: "Practice and evaluate answers with rubrics",
    icon: <Award className="w-3.5 h-3.5 text-[#09090B]" />,
  },
  {
    id: "EXPERIMENT",
    title: "Column Lab",
    tagline: "Diagnose TEM operating problems & aberrations",
    icon: <Wrench className="w-3.5 h-3.5 text-[#09090B]" />,
  },
];

const EXAM_SUBTYPES = [
  { id: "2mark", label: "2 Marks" },
  { id: "5mark", label: "5 Marks" },
  { id: "10mark", label: "10 Marks" },
  { id: "viva", label: "Viva Voce" },
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
        className="px-2.5 py-1.5 bg-[#F8F4E8] hover:bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-lg font-display text-xs uppercase tracking-tight shadow-[1px_1px_0px_#09090B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 shrink-0"
        title="Select learning and operational mode"
      >
        <span className="w-4 h-4 bg-white border border-[#09090B] rounded flex items-center justify-center shrink-0">
          {activeModeObj.icon}
        </span>
        <span className="font-bold">{activeModeObj.title}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* If Exam mode, show exam marks selector right next to it */}
      {currentMode === "EXAM" && onSelectExamSubtype && (
        <div className="flex items-center gap-1 bg-[#F8F4E8] p-1 border-2 border-[#09090B] rounded-lg shadow-hard-xs">
          {EXAM_SUBTYPES.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelectExamSubtype(sub.id)}
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-colors ${
                examSubtype === sub.id
                  ? "bg-[#09090B] text-[#D2E823]"
                  : "bg-white text-slate-800 hover:bg-[#D2E823]"
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* Dropdown Popup Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 bg-white border-2 border-[#09090B] rounded-xl shadow-hard-lg p-2 z-50 space-y-1">
          <div className="px-2 py-1 border-b border-slate-200 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
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
                className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? "bg-[#D2E823]/30 border-[#09090B] shadow-hard-xs"
                    : "border-transparent hover:bg-[#F8F4E8] hover:border-slate-300"
                }`}
              >
                <div className="w-6 h-6 bg-white border-2 border-[#09090B] rounded-md flex items-center justify-center shrink-0 mt-0.5">
                  {mode.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs uppercase text-[#09090B]">
                      {mode.title}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#09090B] stroke-[3]" />}
                  </div>
                  <p className="font-grotesk text-[11px] text-slate-700 leading-tight mt-0.5">
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
