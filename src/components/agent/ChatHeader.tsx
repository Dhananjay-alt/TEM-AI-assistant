"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  PanelLeft,
  MoreHorizontal,
  Share,
  SlidersHorizontal,
  Check,
  Layers,
  Atom,
  Eye,
  FileQuestion,
  Network,
  Compass,
  Wrench,
  BookOpen,
  RotateCcw,
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
  const [moreOpen, setMoreOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const moreRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    <header className="shrink-0 sticky top-0 h-12 w-full px-3 sm:px-4 flex items-center justify-between select-none z-30 text-white bg-transparent pointer-events-auto">
      {/* Left: Minimal ChatGPT-style icon / toggle */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center group"
          title="Toggle sidebar"
        >
          {/* Subtle atom/aperture icon matching ChatGPT header styling */}
          <svg
            className="w-5 h-5 text-white/80 group-hover:text-white transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Center: Completely empty, preserving clean ChatGPT negative space */}
      <div className="flex-1" />

      {/* Right: Exactly matches user screenshot: [...] [Share] [sliders] */}
      <div className="flex items-center gap-1.5">
        {/* More Actions Dropdown (...) */}
        <div className="relative" ref={moreRef}>
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className="p-2 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="More options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {moreOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#111111]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <div className="px-2 py-1 border-b border-white/10 font-mono text-[10px] font-bold text-white/40 uppercase tracking-wider">
                Supporting Lab Instruments
              </div>

              {toolItems.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMoreOpen(false)}
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

              <div className="pt-1 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen(false);
                    onNewChat();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 text-left text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-white/50" />
                  <span>Start New Conversation</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Share Button (matches screenshot `[tray-arrow] Share`) */}
        <button
          type="button"
          onClick={handleShare}
          className="h-8 px-3 rounded-lg hover:bg-white/10 text-white/80 hover:text-white text-xs font-sans font-medium transition-colors flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-white/10"
          title="Share conversation"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Share className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>

        {/* Sliders / Controls Dropdown (matches screenshot slider icon) */}
        <div className="relative" ref={settingsRef}>
          <button
            type="button"
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2 hover:bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Carter Grounding & Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {settingsOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-[#111111]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-3 z-50 space-y-3">
              <div className="font-mono text-[10px] font-bold text-white/40 uppercase tracking-wider border-b border-white/10 pb-1.5">
                Carter Agent Grounding
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Knowledge Base</span>
                  <span className="text-white font-medium">Williams &amp; Carter</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Edition</span>
                  <span className="text-[#FF4500] font-mono font-medium">2nd Edition</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Current Mode</span>
                  <span className="text-white/90 font-mono text-[11px] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {currentMode}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">AI Verification</span>
                  <span className="text-green-400 font-mono text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Active
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-[10px] text-white/40 leading-relaxed">
                All responses cite specific chapter numbers, page ranges, and equations from the textbook.
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
