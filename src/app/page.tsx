import React from "react";
import { ChatShell } from "@/components/agent/ChatShell";

export const metadata = {
  title: "TEM-AI — Carter Agent | Transmission Electron Microscopy Intelligence",
  description:
    "An AI assistant grounded in David B. Williams & C. Barry Carter's TEM textbook. Featuring interactive Socratic tutoring, exam grading, and column diagnostics.",
};

export default function HomePage() {
  return <ChatShell />;
}
