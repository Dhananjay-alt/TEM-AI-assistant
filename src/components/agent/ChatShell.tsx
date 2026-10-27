"use client";

import React, { useState, useEffect } from "react";
import { ChatMode, ChatResponse } from "@/lib/ai/chat";
import { Message, Conversation } from "./types";
import { Sidebar } from "./Sidebar";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

const STORAGE_KEY = "tem_ai_conversations_v2";

export function ChatShell() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentMode, setCurrentMode] = useState<ChatMode>("ASK");
  const [examSubtype, setExamSubtype] = useState<"2mark" | "5mark" | "10mark" | "viva" | "mcq">("5mark");
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage or create default conversation
  useEffect(() => {
    setIsClient(true);
    // On mobile, collapse sidebar by default; on desktop keep open
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Conversation[] = JSON.parse(stored);
        if (parsed.length > 0) {
          setConversations(parsed);
          setActiveConversationId(parsed[0].id);
          setCurrentMode(parsed[0].mode || "ASK");
          return;
        }
      }
    } catch (e) {
      console.warn("Could not read conversations from localStorage:", e);
    }

    // Default first conversation
    const initialId = `conv-${Date.now()}`;
    const initialConv: Conversation = {
      id: initialId,
      title: "New TEM Inquiry",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      mode: "ASK",
    };
    setConversations([initialConv]);
    setActiveConversationId(initialId);
  }, []);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    if (!isClient || conversations.length === 0) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.warn("Could not save conversations to localStorage:", e);
    }
  }, [conversations, isClient]);

  // Current active conversation
  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];

  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: "New TEM Inquiry",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      mode: currentMode,
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setInputQuery("");
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    const conv = conversations.find((c) => c.id === id);
    if (conv?.mode) {
      setCurrentMode(conv.mode);
    }
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        const newId = `conv-${Date.now()}`;
        setActiveConversationId(newId);
        return [
          {
            id: newId,
            title: "New TEM Inquiry",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: [],
            mode: "ASK",
          },
        ];
      }
      if (activeConversationId === id) {
        setActiveConversationId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      mode: currentMode,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update active conversation title if it's the first message
    const updatedTitle =
      messages.length === 0
        ? text.slice(0, 32) + (text.length > 32 ? "..." : "")
        : activeConversation.title;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            title: updatedTitle,
            updatedAt: Date.now(),
            mode: currentMode,
            messages: [...c.messages, userMessage],
          };
        }
        return c;
      })
    );

    setInputQuery("");
    setIsLoading(true);

    // Extract recent conversation history for multi-turn context
    const recentHistory = messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content || m.additionalExplanation || m.fromCarter || "",
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          mode: currentMode,
          examSubtype: currentMode === "EXAM" ? examSubtype : undefined,
          history: recentHistory,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data: ChatResponse = await res.json();

      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        fromCarter: data.fromCarter,
        additionalExplanation: data.additionalExplanation,
        citations: data.citations || [],
        mode: data.mode,
        provider: data.provider,
        isLiveAi: data.isLiveAi,
        suggestedQuestions: data.suggestedQuestions,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversationId) {
            return {
              ...c,
              updatedAt: Date.now(),
              messages: [...c.messages, assistantMessage],
            };
          }
          return c;
        })
      );
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: Message = {
        id: `asst-err-${Date.now()}`,
        role: "assistant",
        content:
          "Unable to complete request. Please ensure the query matches TEM concepts or retry your enquiry.",
        mode: currentMode,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversationId) {
            return {
              ...c,
              updatedAt: Date.now(),
              messages: [...c.messages, errorMessage],
            };
          }
          return c;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = (messageId: string) => {
    // Find previous user query before this message
    const idx = messages.findIndex((m) => m.id === messageId);
    if (idx > 0) {
      const prevUserMsg = messages[idx - 1];
      if (prevUserMsg && prevUserMsg.role === "user") {
        handleSend(prevUserMsg.content);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex w-full h-full overflow-hidden bg-[#050505] text-white selection:bg-[#FF4500] selection:text-white font-sans">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-35 mix-blend-screen">
          <img
            src="https://framerusercontent.com/images/9zvwRJAavKKacVyhFCwHyXW1U.png?width=1536&height=1024"
            alt="Atmosphere"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]" />
      </div>

      {/* Floating Surrealist Hand Left (Atmospheric background) */}
      <div className="absolute -left-[12%] top-[-10%] md:left-[-5%] md:top-[-10%] w-[45vw] md:w-[35vw] max-w-[700px] z-0 pointer-events-none mix-blend-hard-light opacity-25 animate-float-left">
        <img
          src="https://framerusercontent.com/images/KNhiA5A2ykNYqNkj04Hk6BVg5A.png?width=1540&height=1320"
          alt="Hand Reaching"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Floating Surrealist Hand Right (Atmospheric background) */}
      <div className="absolute -right-[12%] bottom-[-10%] md:right-[-5%] md:bottom-[-5%] w-[40vw] md:w-[30vw] max-w-[600px] z-0 pointer-events-none mix-blend-hard-light opacity-25 animate-float-right">
        <img
          src="https://framerusercontent.com/images/X89VFCABCEjjZ4oLGa3PjbOmsA.png?width=1542&height=1002"
          alt="Hand Receiving"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Left Collapsible Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-transparent relative overflow-hidden z-10">
        <ChatHeader
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={handleNewConversation}
          currentMode={currentMode}
          provider={messages[messages.length - 1]?.provider}
          isLiveAi={messages[messages.length - 1]?.isLiveAi}
        />

        {/* Message Stream or Empty State */}
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onSelectPrompt={(prompt) => handleSend(prompt)}
          onRegenerate={handleRegenerate}
        />

        {/* Sticky Chat Input */}
        <ChatInput
          inputQuery={inputQuery}
          setInputQuery={setInputQuery}
          onSend={handleSend}
          isLoading={isLoading}
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
          examSubtype={examSubtype}
          onSelectExamSubtype={setExamSubtype}
        />
      </main>
    </div>
  );
}
