import React from "react";
import { HeroAgentWorkstation } from "@/components/home/HeroAgentWorkstation";
import { AcidMarquee } from "@/components/home/AcidMarquee";
import { BentoCategoryGrid } from "@/components/home/BentoCategoryGrid";
import { HorizontalDropsSection } from "@/components/home/HorizontalDropsSection";
import { ComparisonMatrix } from "@/components/home/ComparisonMatrix";

export default function HomePage() {
  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* 1. Hero Section: CARTER AI AGENT IN MAIN FOCUS */}
      <HeroAgentWorkstation />

      {/* 2. Continuous Acid Marquee Banner */}
      <AcidMarquee />

      {/* 3. Bento Category Grid with varied aspect ratios & radial dots */}
      <BentoCategoryGrid />

      {/* 4. Horizontal Scrolling 'NEW DROPS' Product / Lab Section */}
      <HorizontalDropsSection />

      {/* 5. "Why TEM-AI Is Not A Generic Chatbot" Comparison Matrix */}
      <ComparisonMatrix />
    </div>
  );
}
