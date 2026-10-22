"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldAlert, Send, Sparkles, Check } from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#09090B] text-[#F8F4E8] border-t-2 border-[#09090B] pt-12 pb-8 mt-16 select-none font-grotesk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Top Newsletter / Dispatch Bar */}
        <div className="border-2 border-[#F8F4E8]/20 bg-[#121217] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-mono text-xs text-[#D2E823] font-bold tracking-widest uppercase">
              ★ MICROSCOPY DISPATCH
            </div>
            <h3 className="text-xl sm:text-2xl font-display uppercase tracking-tight text-white">
              STAY TUNED FOR NEW INSTRUMENT DROPS
            </h3>
            <p className="font-grotesk text-xs sm:text-sm text-slate-400">
              Receive updates on new diffraction solvers, 4D-STEM modules, and Carter textbook analyses.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@materials.edu"
              required
              className="px-4 py-2.5 bg-transparent text-white border-2 border-[#F8F4E8]/40 rounded-xl font-mono text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D2E823] w-full sm:w-64"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#D2E823] text-[#09090B] border-2 border-[#D2E823] rounded-xl font-display text-xs uppercase tracking-tight shadow-[2px_2px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              {subscribed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>SUBSCRIBED</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 fill-current" />
                  <span>SIGN UP</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 3-Column Layout: Store/Modules, Info & Physics, Carter References */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {/* Column 1: Store / Modules */}
          <div className="space-y-3 font-mono">
            <div className="text-xs uppercase tracking-widest text-[#D2E823] font-bold border-b border-[#F8F4E8]/20 pb-1">
              STORE // LAB MODULES
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/ask" className="text-slate-300 hover:text-[#D2E823] tracking-wide uppercase transition-colors">
                  → CARTER AI AGENT WORKSTATION
                </Link>
              </li>
              <li>
                <Link href="/anatomy" className="text-slate-300 hover:text-[#D2E823] tracking-wide uppercase transition-colors">
                  → TEM COLUMN SCROLL DISSECTION
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="text-slate-300 hover:text-[#D2E823] tracking-wide uppercase transition-colors">
                  → ELECTRON DIFFRACTION SIMULATOR
                </Link>
              </li>
              <li>
                <Link href="/image-analysis" className="text-slate-300 hover:text-[#D2E823] tracking-wide uppercase transition-colors">
                  → MICROGRAPH PARTICLE LAB
                </Link>
              </li>
              <li>
                <Link href="/exam" className="text-slate-300 hover:text-[#D2E823] tracking-wide uppercase transition-colors">
                  → VIVA &amp; EXAM PREPARATION
                </Link>
              </li>
              <li>
                <Link href="/knowledge-map" className="text-slate-300 hover:text-[#D2E823] tracking-wide uppercase transition-colors">
                  → RECIPROCAL CONCEPT GRAPH
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Info & Constants */}
          <div className="space-y-3 font-mono">
            <div className="text-xs uppercase tracking-widest text-[#D2E823] font-bold border-b border-[#F8F4E8]/20 pb-1">
              INFO // RELATIVISTIC CONSTANTS
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Accelerating Voltage: 10 – 300 kV</li>
              <li>• de Broglie Wavelength: λ = h / p</li>
              <li>• Relativistic at 200 kV: λ = 2.51 pm</li>
              <li>• Relativistic Velocity: v = 0.695 c</li>
              <li>• Camera Constant: R·d = λ·L</li>
              <li>• Scherzer Defocus: Δf_Sch = -1.2 (Cs·λ)^0.5</li>
              <li>• Optical Vacuum: 10⁻⁸ Pa (FEG Chamber)</li>
            </ul>
          </div>

          {/* Column 3: Carter Grounding & Disclaimer */}
          <div className="space-y-3">
            <div className="font-mono text-xs uppercase tracking-widest text-[#D2E823] font-bold border-b border-[#F8F4E8]/20 pb-1">
              CARTER TEXTBOOK GROUNDING
            </div>
            <p className="font-grotesk text-xs text-slate-300 leading-relaxed">
              Grounded in David B. Williams &amp; C. Barry Carter&apos;s authoritative Springer text,{" "}
              <span className="italic text-[#D2E823]">
                &ldquo;Transmission Electron Microscopy: A Textbook for Materials Science&rdquo;
              </span>
              . Designed for materials science students and electron microscopists.
            </p>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-[11px] text-slate-400 space-y-1">
              <div className="font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                SAFETY &amp; LAB DISCLAIMER
              </div>
              <p className="text-[10px] leading-normal text-slate-400">
                Educational assistant only. Does not replace certified radiation safety or physical high-voltage protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F8F4E8]/20 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} TEM-AI WORKSTATION. NEO-BRUTALIST ACID SPEC.
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-[#D2E823]">STATUS: ALL SYSTEMS NOMINAL</span>
            <span>•</span>
            <span>BEAM: 200 kV</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
