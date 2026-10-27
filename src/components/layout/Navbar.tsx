"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Layers,
  Atom,
  Eye,
  FileQuestion,
  Network,
  BookOpen,
  ChevronDown,
  Compass,
  Wrench,
  Plus,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const toolLinks = [
    { href: "/anatomy", label: "TEM Anatomy", desc: "Interactive column dissection", icon: <Layers className="w-4 h-4 text-[#09090B]" /> },
    { href: "/simulator", label: "Diffraction Lab", desc: "SAED spot & ray optics simulator", icon: <Atom className="w-4 h-4 text-[#09090B]" /> },
    { href: "/image-analysis", label: "Micrograph Lab", desc: "FFT & lattice fringe analyzer", icon: <Eye className="w-4 h-4 text-[#09090B]" /> },
    { href: "/exam", label: "Exam Mode", desc: "2-mark, 5-mark & Viva rubrics", icon: <FileQuestion className="w-4 h-4 text-[#09090B]" /> },
    { href: "/knowledge-map", label: "Concept Map", desc: "Visual Carter topic nodes", icon: <Network className="w-4 h-4 text-[#09090B]" /> },
    { href: "/technique-guide", label: "Techniques", desc: "BF/DF & CBED protocols", icon: <Compass className="w-4 h-4 text-[#09090B]" /> },
    { href: "/troubleshooter", label: "Troubleshooter", desc: "Astigmatism & alignment faults", icon: <Wrench className="w-4 h-4 text-[#09090B]" /> },
  ];

  const isAgentActive = pathname === "/" || pathname === "/ask";

  // On the main agent workspace (homepage / or /ask), hide the floating navbar
  // because ChatShell provides its own full-height integrated ChatHeader, Sidebar, and Tools menu
  if (isAgentActive) {
    return null;
  }

  return (
    <header className="sticky top-2 z-40 mx-2 sm:mx-4 transition-all duration-200">
      <div className="bg-[#F8F4E8]/95 backdrop-blur-md border-2 border-[#09090B] rounded-xl shadow-hard-xs px-3 sm:px-4 flex items-center justify-between h-13">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2 group select-none">
          <div className="w-7 h-7 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] rounded-lg flex items-center justify-center font-display font-black text-xs group-hover:rotate-6 transition-transform">
            ★
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-display uppercase tracking-tight text-[#09090B]">
              TEM-AI
            </span>
            <span className="bg-[#D2E823] text-[#09090B] border border-[#09090B] text-[9px] font-mono font-bold px-1.5 py-0.2 uppercase rounded">
              AGENT
            </span>
          </div>
        </Link>

        {/* Streamlined Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 font-mono text-xs font-bold">
          {/* Ask Carter (Main Agent) */}
          <Link
            href="/"
            className={cn(
              "px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 select-none",
              isAgentActive
                ? "bg-[#09090B] text-[#D2E823] border-[#09090B] shadow-hard-xs"
                : "border-transparent text-[#09090B] hover:border-[#09090B] hover:bg-[#D2E823]"
            )}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Carter</span>
          </Link>

          {/* Tools Dropdown */}
          <div className="relative" ref={toolsRef}>
            <button
              type="button"
              onClick={() => setToolsOpen(!toolsOpen)}
              className={cn(
                "px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 select-none",
                !isAgentActive && pathname !== "/learn"
                  ? "bg-[#09090B] text-[#D2E823] border-[#09090B] shadow-hard-xs"
                  : "border-transparent text-[#09090B] hover:border-[#09090B] hover:bg-[#D2E823]"
              )}
            >
              <span>Tools</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
            </button>

            {toolsOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white border-2 border-[#09090B] rounded-xl shadow-hard-lg p-2 z-50 space-y-1">
                <div className="px-2 py-1 border-b border-slate-200 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Supporting Lab Instruments
                </div>

                {toolLinks.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setToolsOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#F8F4E8] border border-transparent hover:border-[#09090B] transition-colors group"
                  >
                    <div className="w-7 h-7 bg-[#F8F4E8] group-hover:bg-[#D2E823] border border-[#09090B] rounded-md flex items-center justify-center shrink-0">
                      {tool.icon}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-display font-bold text-xs text-[#09090B]">
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

          {/* Carter Reader */}
          <Link
            href="/learn"
            className={cn(
              "px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 select-none",
              pathname === "/learn"
                ? "bg-[#09090B] text-[#D2E823] border-[#09090B] shadow-hard-xs"
                : "border-transparent text-[#09090B] hover:border-[#09090B] hover:bg-[#D2E823]"
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Carter Reader</span>
          </Link>
        </nav>

        {/* Right Action: + New Chat Button */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-lg text-xs font-display font-black tracking-tight shadow-hard-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:translate-y-1 select-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ NEW CHAT</span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 bg-white text-[#09090B] border-2 border-[#09090B] rounded-lg shadow-hard-xs hover:bg-[#D2E823] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-3 bg-white border-2 border-[#09090B] rounded-xl shadow-hard-lg space-y-2 z-50">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F8F4E8] font-display font-bold text-xs uppercase"
          >
            <Sparkles className="w-4 h-4 text-[#09090B]" />
            <span>Ask Carter (Main Agent)</span>
          </Link>

          <Link
            href="/learn"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F8F4E8] font-display font-bold text-xs uppercase"
          >
            <BookOpen className="w-4 h-4 text-[#09090B]" />
            <span>Carter Reader</span>
          </Link>

          <div className="border-t border-slate-200 pt-2 space-y-1">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase block px-2">
              Supporting Lab Instruments
            </span>
            {toolLinks.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F8F4E8] text-xs font-grotesk font-medium text-slate-800"
              >
                {tool.icon}
                <span>{tool.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
