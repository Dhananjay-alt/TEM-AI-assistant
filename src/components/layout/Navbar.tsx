"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Atom,
  Eye,
  FileQuestion,
  HelpCircle,
  Network,
  BookOpen,
  Menu,
  X,
  Compass,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/ask", label: "Ask Agent", icon: <Zap className="w-3.5 h-3.5" /> },
    { href: "/anatomy", label: "Anatomy", icon: <Layers className="w-3.5 h-3.5" /> },
    { href: "/simulator", label: "Simulator", icon: <Atom className="w-3.5 h-3.5" /> },
    { href: "/image-analysis", label: "Image Lab", icon: <Eye className="w-3.5 h-3.5" /> },
    { href: "/technique-guide", label: "Techniques", icon: <Compass className="w-3.5 h-3.5" /> },
    { href: "/troubleshooter", label: "Troubleshoot", icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { href: "/exam", label: "Exam Mode", icon: <FileQuestion className="w-3.5 h-3.5" /> },
    { href: "/knowledge-map", label: "Concept Map", icon: <Network className="w-3.5 h-3.5" /> },
    { href: "/learn", label: "Carter Reader", icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-3 z-50 mx-3 sm:mx-6 transition-all duration-200">
      {/* Sticky Floating Nav Bar */}
      <div className="bg-[#F8F4E8]/90 backdrop-blur-[24px] border-2 border-[#09090B] rounded-[12px] shadow-hard-sm px-3 sm:px-5 flex items-center justify-between h-14">
        {/* Brand Logo & Title with Dela Gothic One */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-8 h-8 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] rounded-lg flex items-center justify-center font-display font-black text-xs transition-transform group-hover:rotate-6">
            <svg viewBox="0 0 32 32" className="w-5 h-5 stroke-current fill-none stroke-2 text-[#D2E823]">
              <line x1="16" y1="2" x2="16" y2="12" strokeWidth="3" />
              <rect x="8" y="12" width="16" height="3" fill="currentColor" strokeWidth="1" />
              <line x1="16" y1="15" x2="8" y2="28" strokeWidth="2" strokeDasharray="2 1" />
              <line x1="16" y1="15" x2="16" y2="28" strokeWidth="2.5" />
              <line x1="16" y1="15" x2="24" y2="28" strokeWidth="2" strokeDasharray="2 1" />
            </svg>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg sm:text-xl font-display uppercase tracking-tighter text-[#09090B] glitch-hover">
              TEM-AI
            </span>
            <span className="bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] text-[9px] font-mono font-black px-1.5 py-0.2 uppercase rounded shadow-[1px_1px_0px_#09090B]">
              AGENT
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-[11px] xl:text-xs font-bold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-2 xl:px-2.5 py-1 rounded-md transition-all flex items-center gap-1 select-none border-2",
                  isActive
                    ? "bg-[#09090B] text-[#D2E823] border-[#09090B] shadow-hard-xs"
                    : "border-transparent text-[#09090B] hover:border-[#09090B] hover:bg-[#D2E823] hover:shadow-hard-xs"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href="/ask"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-lg text-xs font-display font-black tracking-tight shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-y-1"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>CARTER AGENT</span>
          </Link>

          {/* Mobile Drawer Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 bg-[#F8F4E8] text-[#09090B] border-2 border-[#09090B] rounded-lg shadow-hard-xs hover:bg-[#D2E823] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 border-2 border-[#09090B] rounded-[12px] bg-[#F8F4E8] p-3 shadow-hard-md space-y-1.5 font-mono text-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2 border-2 rounded-lg flex items-center gap-2 font-bold transition-all",
                  isActive
                    ? "bg-[#09090B] text-[#D2E823] border-[#09090B] shadow-hard-xs"
                    : "bg-white border-[#09090B] hover:bg-[#D2E823]"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
