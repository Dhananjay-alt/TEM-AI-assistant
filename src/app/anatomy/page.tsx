import type { Metadata } from "next";
import { TEMAnatomyScene } from "@/components/anatomy/TEMAnatomyScene";

export const metadata: Metadata = {
  title: "TEM Anatomy — Interactive Scroll Dissection | TEM-AI",
  description:
    "Dissect the Transmission Electron Microscope column as you scroll. Interactive scientific textbook, engineering blueprint, and exploded view grounded in C. Barry Carter & David B. Williams.",
  keywords: [
    "TEM Anatomy",
    "Transmission Electron Microscope components",
    "Electron Gun",
    "Condenser Lenses",
    "Objective Lens",
    "Objective Aperture",
    "Intermediate Projector Lenses",
    "Barry Carter TEM",
    "Electron Optics",
    "Diffraction Pattern Back Focal Plane",
  ],
};

export default function AnatomyPage() {
  return (
    <main className="min-h-screen">
      <TEMAnatomyScene />
    </main>
  );
}
