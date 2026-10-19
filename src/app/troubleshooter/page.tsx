import React from "react";
import { TroubleshootingMatrix } from "@/components/troubleshooter/TroubleshootingMatrix";

export const metadata = {
  title: "TEM Experimental Troubleshooter — TEM-AI",
  description:
    "Diagnose experimental problems at the microscope: poor contrast, beam drift, hydrocarbon contamination, and astigmatism.",
};

export default function TroubleshooterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <TroubleshootingMatrix />
    </div>
  );
}
