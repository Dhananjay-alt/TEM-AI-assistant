"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ToolLauncherProps {
  query?: string;
  citations?: Array<{ chapterTitle: string }>;
}

const TOOLS: Array<{ title: string; description: string; href: string; keywords: string[] }> = [
  {
    title: "Diffraction simulator",
    description: "SAED spot and ring patterns, camera constant",
    href: "/simulator",
    keywords: ["diffraction", "saed", "camera constant", "ewald sphere", "bragg", "reciprocal lattice"],
  },
  {
    title: "Column anatomy",
    description: "The optical column, stage by stage",
    href: "/anatomy",
    keywords: ["column", "lens", "electron gun", "aperture", "pole piece"],
  },
  {
    title: "Micrograph analysis",
    description: "Particle sizing from an uploaded image",
    href: "/image-analysis",
    keywords: ["micrograph", "lattice fringe", "fft", "particle", "hrtem", "image analysis"],
  },
  {
    title: "Troubleshooter",
    description: "Alignment and imaging faults",
    href: "/troubleshooter",
    keywords: ["astigmatism", "stigmator", "eucentric", "drift", "contamination", "charging"],
  },
  {
    title: "Technique guide",
    description: "Choosing between BF/DF, CBED, STEM, EDS and EELS",
    href: "/technique-guide",
    keywords: ["haadf", "stem", "cbed", "eels", "eds", "bright-field", "dark-field"],
  },
];

/** Suggests one related tool when the exchange is clearly about its subject. */
export function ToolLauncher({ query = "", citations = [] }: ToolLauncherProps) {
  const text = `${query} ${citations.map((c) => c.chapterTitle).join(" ")}`.toLowerCase();
  const tool = TOOLS.find((t) => t.keywords.some((k) => text.includes(k)));
  if (!tool) return null;

  return (
    <Link
      href={tool.href}
      className="group flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm hover:border-line-strong transition-colors"
    >
      <span className="text-faint">Related tool</span>
      <span className="font-medium text-foreground">{tool.title}</span>
      <span className="hidden truncate text-muted sm:inline">— {tool.description}</span>
      <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-faint group-hover:text-foreground" />
    </Link>
  );
}
