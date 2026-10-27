"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, BookOpen, Layers, Atom, Eye, FileQuestion, Network } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // On the main agent workspace (homepage / or /ask), do not render footer to keep chat input sticky
  if (pathname === "/" || pathname === "/ask") {
    return null;
  }

  return (
    <footer className="w-full bg-[#09090B] text-[#F8F4E8] border-t-2 border-[#09090B] pt-10 pb-8 mt-16 select-none font-grotesk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: Supporting Instruments */}
          <div className="space-y-3 font-mono">
            <div className="text-xs uppercase tracking-widest text-[#D2E823] font-bold border-b border-[#F8F4E8]/20 pb-1">
              SUPPORTING INSTRUMENTS
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-slate-300 hover:text-[#D2E823] tracking-wide uppercase transition-colors flex items-center gap-1.5">
                  → CARTER AI AGENT
                </Link>
              </li>
              <li>
                <Link href="/anatomy" className="text-slate-300 hover:text-[#D2E823] tracking-wide uppercase transition-colors flex items-center gap-1.5">
                  → TEM ANATOMY DISSECTION
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="text-slate-300 hover:text-[#D2E823] tracking-wide uppercase transition-colors flex items-center gap-1.5">
                  → DIFFRACTION LAB (SAED)
                </Link>
              </li>
              <li>
                <Link href="/image-analysis" className="text-slate-300 hover:text-[#D2E823] tracking-wide uppercase transition-colors flex items-center gap-1.5">
                  → MICROGRAPH LAB (FFT)
                </Link>
              </li>
              <li>
                <Link href="/exam" className="text-slate-300 hover:text-[#D2E823] tracking-wide uppercase transition-colors flex items-center gap-1.5">
                  → EXAM WORKSHOP &amp; VIVA
                </Link>
              </li>
              <li>
                <Link href="/knowledge-map" className="text-slate-300 hover:text-[#D2E823] tracking-wide uppercase transition-colors flex items-center gap-1.5">
                  → CONCEPT MAP &amp; CHAPTERS
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Fundamental Physics & Constants */}
          <div className="space-y-3 font-mono">
            <div className="text-xs uppercase tracking-widest text-[#D2E823] font-bold border-b border-[#F8F4E8]/20 pb-1">
              ELECTRON OPTICS REFERENCE
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Accelerating Voltage: 80 – 300 kV</li>
              <li>• Relativistic Wavelength (200 kV): λ = 2.51 pm</li>
              <li>• Relativistic Velocity: v = 0.695 c</li>
              <li>• Camera Constant Equation: R·d = λ·L</li>
              <li>• Scherzer Defocus: Δf_Sch = -1.2 (Cs·λ)^0.5</li>
              <li>• Dislocation Invisibility: g·b = 0</li>
              <li>• Cliff-Lorimer EDS: (Ca/Cb) = k_ab (Ia/Ib)</li>
            </ul>
          </div>

          {/* Column 3: Carter Grounding & Disclaimer */}
          <div className="space-y-3">
            <div className="font-mono text-xs uppercase tracking-widest text-[#D2E823] font-bold border-b border-[#F8F4E8]/20 pb-1">
              CARTER TEXTBOOK GROUNDING
            </div>
            <p className="font-grotesk text-xs text-slate-300 leading-relaxed">
              Grounded in David B. Williams &amp; C. Barry Carter&apos;s authoritative text,{" "}
              <span className="italic text-[#D2E823]">
                &ldquo;Transmission Electron Microscopy: A Textbook for Materials Science&rdquo;
              </span>
              . Designed for materials scientists, crystallographers, and electron microscopists.
            </p>
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-[11px] text-slate-400 space-y-1">
              <div className="font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                EDUCATIONAL LABORATORY COMPANION
              </div>
              <p className="text-[10px] leading-normal text-slate-400">
                AI assistant for study and column understanding. Does not substitute certified instrument manuals or high-voltage radiation safety protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F8F4E8]/20 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} TEM-AI — CARTER ASSISTANT.
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-[#D2E823]">GROUNDED IN CARTER (40+ CH)</span>
            <span>•</span>
            <span>BEAM: 200 kV</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
