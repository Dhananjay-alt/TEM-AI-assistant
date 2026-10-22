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
    <div className={`w-full overflow-hidden border-y-2 border-[#09090B] bg-[#D2E823] py-2 select-none ${className}`}>
      <div className="flex w-max animate-marquee font-display font-black text-xs sm:text-sm tracking-tight text-[#09090B] uppercase">
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </div>
    </div>
  );
}
