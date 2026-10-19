import React from "react";
import { InteractiveKnowledgeGraph } from "@/components/knowledge/InteractiveKnowledgeGraph";

export const metadata = {
  title: "TEM Concept Knowledge Map — TEM-AI",
  description:
    "Interactive visual concept network of transmission electron microscopy principles grounded in Barry Carter.",
};

export default function KnowledgeMapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <InteractiveKnowledgeGraph />
    </div>
  );
}
