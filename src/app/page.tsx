import React from "react";
import { ChatShell } from "@/components/agent/ChatShell";

export const metadata = {
  title: "TEM-AI — Assistant",
  description:
    "An AI agent for Transmission Electron Microscopy, grounded in David B. Williams & C. Barry Carter's textbook.",
};

export default function HomePage() {
  return <ChatShell />;
}

