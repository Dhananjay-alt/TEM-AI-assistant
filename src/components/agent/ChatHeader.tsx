"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  PanelLeft,
  Sparkles,
  Plus,
  Compass,
  Layers,
  Atom,
  Eye,
  FileQuestion,
  Network,
  BookOpen,
  Wrench,
  ChevronDown,
} from "lucide-react";
import { ChatMode } from "@/lib/ai/chat";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onNewChat: () => void;
  currentMode: ChatMode;
  provider?: string;
  isLiveAi?: boolean;
}

export function ChatHeader({
  onToggleSidebar,
  onNewChat,
  currentMode,
  provider = "Carter Grounded AI",
  isLiveAi = false,
}: ChatHeaderProps) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toolItems = [
    { label: "TEM Anatomy Dissection", href: "/anatomy", desc: "Interactive column dissection", icon: <Layers className="w-4 h-4" /> },
    { label: "Diffraction Lab", href: "/simulator", desc: "SAED spots & Ewald sphere", icon: <Atom className="w-4 h-4" /> },
    { label: "Micrograph Lab", href: "/image-analysis", desc: "FFT & lattice fringe analyzer", icon: <Eye className="w-4 h-4" /> },
    { label: "Exam Mode", href: "/exam", desc: "Graded question generator", icon: <FileQuestion className="w-4 h-4" /> },
    { label: "Concept Map", href: "/knowledge-map", desc: "Visual Carter topic nodes", icon: <Network className="w-4 h-4" /> },
    { label: "Technique Guide", href: "/technique-guide", desc: "BF/DF & CBED protocols", icon: <Compass className="w-4 h-4" /> },
    { label: "Column Troubleshooter", href: "/troubleshooter", desc: "Astigmatism & alignment", icon: <Wrench className="w-4 h-4" /> },
  ];

  return (
    <header className="h-14 border-b-2 border-[#09090B] bg-[#F8F4E8]/95 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between select-none z-30">
      {/* Left: Sidebar Toggle + Title + Status */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 hover:bg-[#D2E823] text-[#09090B] border-2 border-transparent hover:border-[#09090B] rounded-lg transition-colors"
          title="Toggle sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-black text-xs sm:text-sm uppercase tracking-tight text-[#09090B]">
              CARTER AGENT
            </h1>
            <span className="flex items-center gap-1 font-mono text-[9px] font-bold bg-[#D2E823] text-[#09090B] border border-[#09090B] px-1.5 py-0.2 rounded uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#09090B] animate-pulse" />
              GROUNDED
            </span>
          </div>

          <p className="font-mono text-[10px] text-slate-500 hidden sm:block truncate max-w-sm">
            Grounded in Williams &amp; Carter — <em>Transmission Electron Microscopy</em>
          </p>
        </div>
      </div>

      {/* Right: Tools Dropdown + New Chat + Model Indicator */}
      <div className="flex items-center gap-2">
        {/* Supporting Tools Dropdown */}
        <div className="relative" ref={toolsRef}>
          <button
            type="button"
            onClick={() => setToolsOpen(!toolsOpen)}
            className="px-2.5 py-1 bg-white hover:bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-lg font-mono text-xs font-bold shadow-hard-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1.5"
          >
            <span>Tools</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
          </button>

          {toolsOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border-2 border-[#09090B] rounded-xl shadow-hard-lg p-2 z-50 space-y-1">
              <div className="px-2 py-1 border-b border-slate-200 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Supporting Lab Instruments
              </div>

              {toolItems.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setToolsOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#F8F4E8] border border-transparent hover:border-[#09090B] transition-colors group"
                >
                  <div className="w-7 h-7 bg-[#F8F4E8] group-hover:bg-[#D2E823] border border-[#09090B] rounded-md flex items-center justify-center shrink-0 text-[#09090B]">
                    {tool.icon}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-display font-bold text-xs text-[#09090B] group-hover:text-black">
                      {tool.label}
                    </div>
                    <div className="font-grotesk text-[10px] text-slate-500 truncate">
                      {tool.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* New Chat Button */}
        <button
          type="button"
          onClick={onNewChat}
          className="p-1.5 bg-[#F8F4E8] hover:bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-lg shadow-hard-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1 font-mono text-xs font-bold"
          title="Start fresh conversation"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New</span>
        </button>
      </div>
    </header>
  );
}
