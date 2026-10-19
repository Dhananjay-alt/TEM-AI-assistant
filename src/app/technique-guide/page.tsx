import React from "react";
import { TechniqueDecisionWizard } from "@/components/technique/TechniqueDecisionWizard";

export const metadata = {
  title: "TEM Technique Decision Guide — TEM-AI",
  description:
    "Interactive decision matrix to match your materials problem to the optimal TEM method.",
};

export default function TechniqueGuidePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <TechniqueDecisionWizard />
    </div>
  );
}
