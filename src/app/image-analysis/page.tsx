import React from "react";
import { ParticleAnalyzer } from "@/components/image-analysis/ParticleAnalyzer";

export const metadata = {
  title: "TEM Image & Particle Analysis — TEM-AI",
  description:
    "Interactive computer vision blob segmentation, nanoparticle size distribution histograms, and AI vision interpretation.",
};

export default function ImageAnalysisPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <ParticleAnalyzer />
    </div>
  );
}
