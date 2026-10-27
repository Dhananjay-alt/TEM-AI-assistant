import { ChatMode } from "@/lib/ai/chat";
import { RetrievedSource } from "@/lib/rag/vector-search";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  fromCarter?: string;
  additionalExplanation?: string;
  citations?: RetrievedSource[];
  mode: ChatMode;
  examSubtype?: "2mark" | "5mark" | "10mark" | "viva" | "mcq";
  provider?: string;
  isLiveAi?: boolean;
  suggestedQuestions?: string[];
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  mode: ChatMode;
  examSubtype?: "2mark" | "5mark" | "10mark" | "viva" | "mcq";
}

export interface ContextualTool {
  id: string;
  title: string;
  description: string;
  href: string;
  iconName: "Atom" | "Layers" | "Eye" | "FileQuestion" | "Network" | "Wrench";
  badge: string;
}
