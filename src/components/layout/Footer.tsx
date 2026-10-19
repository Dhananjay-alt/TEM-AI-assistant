import React from "react";
import Link from "next/link";
import { BookOpen, ShieldAlert, Cpu, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-[#0F172A] bg-surface-warm text-foreground font-mono text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black font-sans text-foreground">TEM-AI</span>
              <span className="bg-foreground text-background text-[10px] px-1.5 py-0.5 font-bold uppercase">
                Educational Laboratory
              </span>
            </div>
            <p className="text-slate-700 text-xs font-sans max-w-md leading-relaxed">
              Transforming C. Barry Carter & David B. Williams' classic textbook,{" "}
              <span className="font-semibold italic">
                "Transmission Electron Microscopy: A Textbook for Materials Science"
              </span>
              , into an interactive AI-powered laboratory assistant, diffraction simulator, and micrograph analysis workstation.
            </p>
            <div className="p-3 bg-white brutal-border border-border text-[11px] text-slate-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-700">
                <ShieldAlert className="w-3.5 h-3.5" />
                EDUCATIONAL LABORATORY SAFETY DISCLAIMER
              </div>
              <p className="text-[10px] text-slate-600 leading-normal">
                This software is an educational simulator and tutorial aid. It does not replace physical laboratory protocols, radiation safety regulations, or qualified microscope operator supervision.
              </p>
            </div>
          </div>

          {/* Core Modules */}
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-slate-900 border-b-2 border-border pb-1">
              Modules
            </div>
            <ul className="space-y-1.5 text-slate-700">
              <li>
                <Link href="/anatomy" className="hover:text-[#FF5722] hover:underline flex items-center gap-1.5 font-bold text-slate-900">
                  → TEM Column Anatomy (Dissection)
                </Link>
              </li>
              <li>
                <Link href="/ask" className="hover:text-[#FF5722] hover:underline flex items-center gap-1.5">
                  → Ask Carter AI Tutor
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-[#FF5722] hover:underline flex items-center gap-1.5">
                  → Electron Diffraction Simulator
                </Link>
              </li>
              <li>
                <Link href="/image-analysis" className="hover:text-[#FF5722] hover:underline flex items-center gap-1.5">
                  → Micrograph Particle Size Lab
                </Link>
              </li>
              <li>
                <Link href="/technique-guide" className="hover:text-[#FF5722] hover:underline flex items-center gap-1.5">
                  → Materials Technique Guide
                </Link>
              </li>
              <li>
                <Link href="/troubleshooter" className="hover:text-[#FF5722] hover:underline flex items-center gap-1.5">
                  → Experimental Troubleshooter
                </Link>
              </li>
              <li>
                <Link href="/exam" className="hover:text-[#FF5722] hover:underline flex items-center gap-1.5">
                  → Examination Preparation
                </Link>
              </li>
            </ul>
          </div>

          {/* Reference & Physics */}
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-slate-900 border-b-2 border-border pb-1">
              Carter Reference
            </div>
            <ul className="space-y-1.5 text-slate-700 text-[11px]">
              <li>Part 1: Basics & Electron Optics</li>
              <li>Part 2: Diffraction & Reciprocal Space</li>
              <li>Part 3: Imaging & Contrast Mechanisms</li>
              <li>Part 4: Spectrometry (EDS & EELS)</li>
              <li className="pt-2 text-slate-500">
                Grounded in Springer 2nd Edition (Williams & Carter)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-slate-300 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 gap-2">
          <div>
            © {new Date().getFullYear()} TEM-AI Laboratory. Built for Materials Science Education.
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold">Accelerating Voltage: 10–300 kV</span>
            <span>•</span>
            <span className="font-bold">de Broglie: λ = h / p</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
