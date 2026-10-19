import React from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";

export const metadata = {
  title: "Ask Carter — TEM-AI Grounded Tutor",
  description: "Ask questions grounded strictly in David B. Williams & C. Barry Carter's TEM textbook.",
};

export default function AskPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <ChatInterface />
    </div>
  );
}
