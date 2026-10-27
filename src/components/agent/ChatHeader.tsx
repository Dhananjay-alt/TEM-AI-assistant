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
    <header className="shrink-0 sticky top-0 h-14 border-b border-white/10 bg-[#050505]/95 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between select-none z-30 text-white">
      {/* Left: Sidebar Toggle + Title + Status */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-1.5 hover:bg-white/10 text-white/80 hover:text-white border border-transparent hover:border-white/20 rounded-lg transition-colors cursor-pointer"
          title="Toggle sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
              <span>TEM-AI.</span>
              <span className="font-serif italic font-light text-[#FF4500] text-xs">The Carter Agent</span>
            </h1>
            <span className="flex items-center gap-1 font-mono text-[9px] font-bold bg-[#FF4500]/15 text-[#FF4500] border border-[#FF4500]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4500] animate-pulse" />
              GROUNDED
            </span>
          </div>

          <p className="font-sans text-[10px] text-white/40 hidden sm:block truncate max-w-sm">
            Grounded in Williams &amp; Carter — <em>Transmission Electron Microscopy</em>
          </p>
        </div>
      </div>

      {/* Right: Tools Dropdown + New Chat */}
      <div className="flex items-center gap-2">
        {/* Supporting Tools Dropdown */}
        <div className="relative" ref={toolsRef}>
          <button
            type="button"
            onClick={() => setToolsOpen(!toolsOpen)}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 hover:border-[#FF4500]/50 rounded-full font-sans text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Tools</span>
            <ChevronDown className={`w-3 h-3 text-white/60 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
          </button>

          {toolsOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#111111] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <div className="px-2 py-1 border-b border-white/10 font-mono text-[10px] font-bold text-white/40 uppercase tracking-wider">
                Supporting Lab Instruments
              </div>

              {toolItems.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setToolsOpen(false)}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors group"
                >
                  <div className="w-7 h-7 bg-white/5 group-hover:bg-[#FF4500] group-hover:text-black border border-white/10 rounded-lg flex items-center justify-center shrink-0 text-white transition-colors">
                    {tool.icon}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-sans font-semibold text-xs text-white group-hover:text-white">
                      {tool.label}
                    </div>
                    <div className="font-sans text-[10px] text-white/50 truncate">
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
          className="px-3.5 py-1.5 bg-white hover:bg-[#FF4500] text-black hover:text-white rounded-full font-sans text-xs font-medium transition-all shadow-md flex items-center gap-1 cursor-pointer"
          title="Start fresh conversation"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New</span>
        </button>
      </div>
    </header>
  );
}
