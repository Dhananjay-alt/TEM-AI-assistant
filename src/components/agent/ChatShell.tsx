"use client";

import React, { useState, useEffect } from "react";
import { ChatMode, ChatResponse } from "@/lib/ai/chat";
import { Message, Conversation } from "./types";
import { Sidebar } from "./Sidebar";
import { ChatHeader, BookStatus } from "./ChatHeader";
import { SourceViewer } from "./SourceViewer";
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
  const [book, setBook] = useState<BookStatus | null>(null);
  const [openCitation, setOpenCitation] = useState<{ messageId: string; index: number } | null>(null);

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
      title: "New conversation",
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

  // Is the textbook PDF indexed? (decides what a reference opens)
  useEffect(() => {
    fetch("/api/book/status")
      .then((r) => r.json())
      .then(setBook)
      .catch(() => setBook({ available: false }));
  }, []);

  // Close the source viewer with Escape
  useEffect(() => {
    if (!openCitation) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenCitation(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openCitation]);

  // Current active conversation
  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];

  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: "New conversation",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      mode: currentMode,
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setOpenCitation(null);
    setInputQuery("");
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setOpenCitation(null);
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
            title: "New conversation",
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
        ? text.slice(0, 48) + (text.length > 48 ? "…" : "")
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

      if (!res.ok) {
        // the server explains what went wrong (rate limit, question too long, ...)
        const problem = await res.json().catch(() => null);
        throw new Error(problem?.error || "");
      }

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
        content: err?.message || "The request could not be completed. Check your connection and try again.",
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

  const openMessage = openCitation ? messages.find((m) => m.id === openCitation.messageId) : undefined;
  const openSource = openCitation ? openMessage?.citations?.[openCitation.index] : undefined;

  const handleOpenCitation = (messageId: string, index: number) => {
    setOpenCitation((cur) =>
      cur && cur.messageId === messageId && cur.index === index ? null : { messageId, index }
    );
    // the viewer needs the room on medium screens
    if (window.innerWidth < 1280) setSidebarOpen(false);
  };

  return (
    <div className="fixed inset-x-0 top-0 flex h-[100dvh] overflow-hidden bg-background text-foreground">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={handleNewConversation}
          title={activeConversation?.title || "New conversation"}
          book={book}
        />

        <MessageList
          messages={messages}
          isLoading={isLoading}
          bookTitle={book?.available ? book.title : undefined}
          showsPages={book?.view === "pages"}
          activeCitation={openCitation}
          onOpenCitation={handleOpenCitation}
          onSelectPrompt={(prompt) => handleSend(prompt)}
          onRegenerate={handleRegenerate}
        />

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
      </div>

      {openCitation && openSource && (
        <SourceViewer source={openSource} index={openCitation.index} onClose={() => setOpenCitation(null)} />
      )}
    </div>
  );
}
