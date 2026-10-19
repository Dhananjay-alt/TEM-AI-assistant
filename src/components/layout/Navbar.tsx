"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Cpu,
  Atom,
  Eye,
  FileQuestion,
  HelpCircle,
  Network,
  BookOpen,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/ask", label: "Ask Carter", icon: <Zap className="w-3.5 h-3.5" /> },
    { href: "/simulator", label: "Simulator", icon: <Atom className="w-3.5 h-3.5" /> },
    { href: "/image-analysis", label: "Image Lab", icon: <Eye className="w-3.5 h-3.5" /> },
    { href: "/technique-guide", label: "Techniques", icon: <Compass className="w-3.5 h-3.5" /> },
    { href: "/troubleshooter", label: "Troubleshoot", icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { href: "/exam", label: "Exam Mode", icon: <FileQuestion className="w-3.5 h-3.5" /> },
    { href: "/knowledge-map", label: "Concept Map", icon: <Network className="w-3.5 h-3.5" /> },
    { href: "/learn", label: "Carter Reader", icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FBF9F5] border-b-[3px] border-[#0F172A] shadow-neo-sm">
      {/* Top Telemetry Ticker */}
      <div className="bg-[#0F172A] text-white px-4 py-1 text-[11px] font-mono flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-phosphor-green font-bold">
            <span className="w-2 h-2 rounded-full bg-phosphor-green animate-pulse"></span>
            BEAM ONLINE
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-beam-cyan font-bold">HT = 200 kV</span>
          <span className="text-slate-400">|</span>
          <span>λ = 0.00251 nm (2.51 pm)</span>
          <span className="text-slate-400">|</span>
          <span className="text-amber-400 font-bold">Cs = 1.0 mm</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <span className="hidden sm:inline">GROUNDED IN: DAVID B. WILLIAMS & C. BARRY CARTER</span>
          <span className="bg-slate-800 text-slate-200 px-1.5 py-0.5 border border-slate-700 text-[10px] font-bold">
            v2.4 INSTRUMENT CONSOLE
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Minimalist Stylized Electron Beam Logo */}
          <div className="w-9 h-9 bg-foreground text-background brutal-border flex items-center justify-center relative overflow-hidden group-hover:bg-[#FF5722] transition-colors">
            <svg
              viewBox="0 0 32 32"
              className="w-6 h-6 stroke-current fill-none stroke-2 text-white"
            >
              {/* Incident beam */}
              <line x1="16" y1="2" x2="16" y2="12" strokeWidth="2.5" />
              {/* Sample foil */}
              <rect x="8" y="12" width="16" height="3" fill="currentColor" strokeWidth="1" />
              {/* Diffracted rays */}
              <line x1="16" y1="15" x2="8" y2="28" strokeWidth="1.5" strokeDasharray="2 1" />
              <line x1="16" y1="15" x2="16" y2="28" strokeWidth="2" />
              <line x1="16" y1="15" x2="24" y2="28" strokeWidth="1.5" strokeDasharray="2 1" />
              {/* Central & diffracted spots */}
              <circle cx="8" cy="28" r="1.5" fill="currentColor" />
              <circle cx="16" cy="28" r="2.5" fill="currentColor" />
              <circle cx="24" cy="28" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black font-sans tracking-tight text-foreground">
                TEM-AI
              </span>
              <span className="bg-[#FF5722] text-white text-[9px] font-mono font-bold px-1 py-0.2 uppercase border border-border">
                LAB
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-600 hidden md:block leading-none">
              Transmission Electron Microscopy Intelligence
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 font-mono text-xs font-bold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-2.5 py-1.5 transition-all flex items-center gap-1.5 border-2 select-none",
                  isActive
                    ? "bg-[#0F172A] text-white border-[#0F172A] shadow-neo-xs"
                    : "border-transparent text-slate-800 hover:border-[#0F172A] hover:bg-surface-warm"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action / Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/simulator"
            className="hidden sm:inline-flex"
          >
            <ScientificBadge variant="cyan" hasDot>
              BEAM ON
            </ScientificBadge>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden brutal-border p-1.5 bg-surface hover:bg-surface-warm"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-[2.5px] border-border bg-[#FBF9F5] p-4 space-y-2 font-mono text-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 border-2 flex items-center gap-2 font-bold",
                  isActive
                    ? "bg-foreground text-background border-border shadow-neo-xs"
                    : "bg-surface border-border hover:bg-surface-warm"
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
