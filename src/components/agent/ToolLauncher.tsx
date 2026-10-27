"use client";

import React from "react";
import Link from "next/link";
import { Atom, Layers, Eye, FileQuestion, Network, Wrench, ArrowUpRight } from "lucide-react";

interface ToolLauncherProps {
  query?: string;
  answer?: string;
  citations?: Array<{ chapterNumber: number; chapterTitle: string }>;
}

export function ToolLauncher({ query = "", answer = "", citations = [] }: ToolLauncherProps) {
  const text = `${query} ${answer} ${citations.map((c) => c.chapterTitle).join(" ")}`.toLowerCase();

  // Detect relevant tool based on keywords
  let tool: {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    tag: string;
  } | null = null;

  if (
    text.includes("diffraction") ||
    text.includes("saed") ||
    text.includes("camera constant") ||
    text.includes("ewald sphere") ||
    text.includes("bragg") ||
    text.includes("reciprocal lattice")
  ) {
    tool = {
      title: "Diffraction Lab",
      description: "Interactive SAED spot pattern generator, Ewald sphere, and camera constant calculator",
      href: "/simulator",
      icon: <Atom className="w-4 h-4 text-[#09090B]" />,
      tag: "SAED SIMULATOR",
    };
  } else if (
    text.includes("column") ||
    text.includes("lens") ||
    text.includes("electron gun") ||
    text.includes("aperture") ||
    text.includes("anatomy") ||
    text.includes("dissection") ||
    text.includes("pole piece")
  ) {
    tool = {
      title: "TEM Anatomy Dissection",
      description: "Scroll-driven interactive anatomical breakdown of internal TEM column optics",
      href: "/anatomy",
      icon: <Layers className="w-4 h-4 text-[#09090B]" />,
      tag: "COLUMN OPTICS",
    };
  } else if (
    text.includes("micrograph") ||
    text.includes("lattice fringe") ||
    text.includes("fft") ||
    text.includes("particle") ||
    text.includes("hrtem") ||
    text.includes("thon ring") ||
    text.includes("image analysis")
  ) {
    tool = {
      title: "Micrograph Lab",
      description: "Upload and analyze TEM images: FFT power spectra, lattice d-spacings, and particle sizing",
      href: "/image-analysis",
      icon: <Eye className="w-4 h-4 text-[#09090B]" />,
      tag: "IMAGE LAB",
    };
  } else if (
    text.includes("astigmatism") ||
    text.includes("stigmator") ||
    text.includes("eucentric") ||
    text.includes("drift") ||
    text.includes("contamination") ||
    text.includes("troubleshoot")
  ) {
    tool = {
      title: "Column Troubleshooter",
      description: "Step-by-step diagnostic workflows for astigmatism, sample charging, and alignment faults",
      href: "/troubleshooter",
      icon: <Wrench className="w-4 h-4 text-[#09090B]" />,
      tag: "DIAGNOSTICS",
    };
  } else if (
    text.includes("exam") ||
    text.includes("viva") ||
    text.includes("question") ||
    text.includes("rubric") ||
    text.includes("marks")
  ) {
    tool = {
      title: "Exam Workshop",
      description: "University-level 2-mark, 5-mark, 10-mark, and Viva Voce questions with model answers",
      href: "/exam",
      icon: <FileQuestion className="w-4 h-4 text-[#09090B]" />,
      tag: "EXAM PRACTICE",
    };
  }

  if (!tool) return null;

  return (
    <div className="pt-2">
      <Link
        href={tool.href}
        className="group flex items-center justify-between p-3 bg-white hover:bg-[#D2E823] border-2 border-[#09090B] rounded-xl shadow-hard-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all select-none"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 bg-[#F8F4E8] group-hover:bg-white border-2 border-[#09090B] rounded-lg flex items-center justify-center shrink-0">
            {tool.icon}
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xs uppercase text-[#09090B]">
                {tool.title}
              </span>
              <span className="text-[9px] font-mono font-bold bg-[#09090B] text-[#D2E823] px-1.5 py-0.2 rounded">
                {tool.tag}
              </span>
            </div>
            <p className="text-[11px] font-grotesk text-slate-700 truncate">
              {tool.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-[#09090B] shrink-0 pl-2">
          <span className="hidden sm:inline">Launch Tool</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </Link>
    </div>
  );
}
