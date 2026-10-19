import React from "react";
import { MessageSquare, GraduationCap, Award, Wrench } from "lucide-react";
import { ChatMode } from "@/lib/ai/chat";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  currentMode: ChatMode;
  onSelectMode: (mode: ChatMode) => void;
  className?: string;
}

export function ModeSelector({
  currentMode,
  onSelectMode,
  className,
}: ModeSelectorProps) {
  const modes: {
    id: ChatMode;
    label: string;
    description: string;
    icon: React.ReactNode;
    badgeColor: string;
  }[] = [
    {
      id: "ASK",
      label: "ASK CARTER",
      description: "Direct grounded textbook answers",
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      badgeColor: "bg-[#00D2FF]",
    },
    {
      id: "TUTOR",
      label: "TUTOR",
      description: "Socratic step-by-step guidance",
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      badgeColor: "bg-[#10B981]",
    },
    {
      id: "EXAM",
      label: "EXAM MODE",
      description: "2, 5, 10 mark & Viva rubrics",
      icon: <Award className="w-3.5 h-3.5" />,
      badgeColor: "bg-[#F59E0B]",
    },
    {
      id: "EXPERIMENT",
      label: "LAB EXPERIMENT",
      description: "Practical microscopy diagnostics",
      icon: <Wrench className="w-3.5 h-3.5" />,
      badgeColor: "bg-[#FF5722]",
    },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs select-none",
        className
      )}
    >
      {modes.map((m) => {
        const isActive = currentMode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelectMode(m.id)}
            className={cn(
              "brutal-border p-2.5 text-left transition-all relative flex flex-col justify-between",
              isActive
                ? "bg-foreground text-background shadow-neo-md -translate-x-0.5 -translate-y-0.5"
                : "bg-surface hover:bg-surface-warm text-foreground shadow-neo-xs hover:-translate-x-0.5 hover:-translate-y-0.5"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5 font-bold">
                {m.icon}
                {m.label}
              </span>
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isActive ? m.badgeColor : "bg-slate-400"
                )}
              />
            </div>
            <span
              className={cn(
                "text-[10px] leading-tight block truncate",
                isActive ? "text-slate-300" : "text-slate-500"
              )}
            >
              {m.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
