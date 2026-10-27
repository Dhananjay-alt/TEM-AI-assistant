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
        className="group flex items-center justify-between p-3.5 bg-[#111111]/90 hover:bg-[#18181b] border border-white/10 hover:border-[#FF4500]/60 rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(255,69,0,0.15)] transition-all select-none cursor-pointer"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-white/5 group-hover:bg-[#FF4500] group-hover:text-black border border-white/10 rounded-lg flex items-center justify-center shrink-0 text-white transition-colors">
            {tool.icon}
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xs text-white">
                {tool.title}
              </span>
              <span className="text-[9px] font-mono font-bold bg-[#FF4500]/15 text-[#FF4500] border border-[#FF4500]/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {tool.tag}
              </span>
            </div>
            <p className="text-[11px] font-sans text-white/50 truncate mt-0.5">
              {tool.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 font-sans text-xs font-semibold text-[#FF4500] shrink-0 pl-3">
          <span className="hidden sm:inline">Launch Tool</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </Link>
    </div>
  );
}
