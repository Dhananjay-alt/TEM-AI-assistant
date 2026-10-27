import React from "react";
import { ChatShell } from "@/components/agent/ChatShell";

export const metadata = {
  title: "Ask Carter — TEM-AI Grounded Tutor",
  description: "Ask questions grounded strictly in David B. Williams & C. Barry Carter's TEM textbook.",
};

export default function AskPage() {
  return <ChatShell />;
}
