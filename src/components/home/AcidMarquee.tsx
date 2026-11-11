"use client";

import React from "react";

export function AcidMarquee({
  text = "⚡ CARTER AI AGENT: ONLINE ⚡ 200 KV ACCELERATING BEAM ⚡ R·d = λ·L CAMERA CONSTANT ⚡ 40+ INDEXED TEXTBOOK CHAPTERS ⚡ ZERO HALLUCINATION RAG ⚡ HRTEM & SAED WORKSTATION ⚡ PHYSICAL ELECTRON OPTICS ⚡",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={`w-full overflow-hidden border-y border-line bg-accent-soft py-2 select-none ${className}`}>
      <div className="flex w-max font-semibold text-xs sm:text-sm tracking-tight text-foreground">
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </div>
    </div>
  );
}
