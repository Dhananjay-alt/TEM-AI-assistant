import React from "react";
import { CarterReader } from "@/components/learn/CarterReader";

export const metadata = {
  title: "Carter Textbook Reader & Citations — TEM-AI",
  description:
    "Browse indexed chapters, authentic excerpts, ray diagrams, and mathematical formulations from Barry Carter's TEM textbook.",
};

export default function LearnPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <CarterReader />
    </div>
  );
}
