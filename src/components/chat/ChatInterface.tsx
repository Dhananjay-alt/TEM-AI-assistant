"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Zap,
  GraduationCap,
  Award,
  Wrench,
  BookOpen,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { ModeSelector } from "@/components/ui/ModeSelector";
import { SourceCitation } from "@/components/ui/SourceCitation";
import { ScientificBadge } from "@/components/ui/ScientificBadge";
import { ChatMode, ChatResponse } from "@/lib/ai/chat";
import { RetrievedSource } from "@/lib/rag/vector-search";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  fromCarter?: string;
  additionalExplanation?: string;
  citations?: RetrievedSource[];
  mode: ChatMode;
  provider?: string;
  suggestedQuestions?: string[];
  timestamp: string;
}

export function ChatInterface() {
  const [mode, setMode] = useState<ChatMode>("ASK");
  const [examSubtype, setExamSubtype] = useState<
    "2mark" | "5mark" | "10mark" | "viva" | "mcq"
  >("5mark");
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initial welcome message grounded in Barry Carter
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-init",
      role: "assistant",
      content:
        "Welcome to TEM-AI. I am your transmission electron microscopy laboratory assistant, grounded in David B. Williams & C. Barry Carter's 'Transmission Electron Microscopy: A Textbook for Materials Science'.\n\nAsk me about diffraction contrast, Ewald sphere geometry, HRTEM lattice imaging, or experimental troubleshooting at the microscope column.",
      fromCarter:
        "Grounded in 40+ indexed chapters covering Basics, Diffraction, Imaging, and Spectrometry.",
      additionalExplanation:
        "Select your operating mode above (ASK, TUTOR, EXAM, or EXPERIMENT) to tailor explanations to your learning or laboratory needs.",
      citations: [],
      mode: "ASK",
      provider: "Carter Grounded Knowledge Base",
      suggestedQuestions: [
        "Why does diffraction contrast occur in TEM?",
        "How do I determine a dislocation Burgers vector using g·b = 0?",
        "What is Scherzer defocus in HRTEM?",
        "Derive the Camera Constant equation R·d = λ·L.",
      ],
      timestamp: "00:00:01",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      mode,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          mode,
          examSubtype: mode === "EXAM" ? examSubtype : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data: ChatResponse = await res.json();

      const assistantMessage: Message = {
        id: `msg-resp-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        fromCarter: data.fromCarter,
        additionalExplanation: data.additionalExplanation,
        citations: data.citations,
        mode: data.mode,
        provider: data.provider,
        suggestedQuestions: data.suggestedQuestions,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage: Message = {
        id: `msg-err-${Date.now()}`,
        role: "assistant",
        content:
          "Unable to complete request. Please check your network connection or ensure the query matches TEM concepts.",
        mode,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector Top Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-border pb-2">
          <div>
            <h2 className="text-xl font-black font-sans uppercase">
              ASK CARTER — GROUNDED AI ASSISTANT
            </h2>
            <p className="text-xs font-mono text-slate-600">
              Select an instrument mode to configure pedagogical guidance:
            </p>
          </div>
          <ScientificBadge variant="cyan" hasDot>
            GROUND TRUTH: CARTER TEXTBOOK
          </ScientificBadge>
        </div>

        <ModeSelector currentMode={mode} onSelectMode={setMode} />

        {/* If EXAM mode, show exam marks selector */}
        {mode === "EXAM" && (
          <div className="brutal-border bg-[#FEF3C7] p-2.5 flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-700" />
              Target Examination Grading Rubric:
            </span>
            <div className="flex gap-1.5">
              {(
                [
                  { id: "2mark", label: "2 Marks" },
                  { id: "5mark", label: "5 Marks" },
                  { id: "10mark", label: "10 Marks" },
                  { id: "viva", label: "Viva Voce" },
                ] as const
              ).map((et) => (
                <button
                  key={et.id}
                  onClick={() => setExamSubtype(et.id)}
                  className={`px-2 py-0.5 border text-[11px] font-bold ${
                    examSubtype === et.id
                      ? "bg-foreground text-background border-border"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {et.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages Log Area */}
      <BrutalCard
        variant="default"
        shadowSize="lg"
        titleBar="CONVERSATION LOG / CARTER GROUNDED INFERENCE"
        titleBarBadge={mode}
        className="bg-white min-h-[480px] flex flex-col justify-between"
      >
        <div className="space-y-6 max-h-[560px] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`space-y-2 ${
                msg.role === "user" ? "ml-auto max-w-2xl" : "mr-auto max-w-3xl w-full"
              }`}
            >
              {/* Message Header */}
              <div
                className={`flex items-center gap-2 text-[10px] font-mono ${
                  msg.role === "user" ? "justify-end" : "justify-between"
                }`}
              >
                {msg.role === "assistant" && (
                  <span className="font-bold flex items-center gap-1 text-slate-900 uppercase">
                    <span className="w-2 h-2 bg-[#FF5722]"></span>
                    TEM-AI ASSISTANT
                    <span className="text-slate-400">({msg.provider || "Carter RAG"})</span>
                  </span>
                )}
                <span className="text-slate-400">{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              {msg.role === "user" ? (
                <div className="brutal-border bg-[#0F172A] text-white p-3 font-mono text-xs shadow-neo-sm">
                  {msg.content}
                </div>
              ) : (
                <div className="brutal-border bg-surface-warm p-4 font-sans text-xs space-y-4 shadow-neo-sm">
                  {/* Distinct Section 1: FROM CARTER */}
                  {msg.fromCarter && (
                    <div className="brutal-border bg-white p-3 space-y-1.5 border-amber-900/30">
                      <div className="flex items-center justify-between font-mono text-[10px] font-bold text-amber-800 uppercase tracking-wider border-b pb-1">
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                          FROM CARTER (RETRIEVED TEXTBOOK CONTENT)
                        </span>
                        <span className="bg-amber-100 px-1 py-0.2 text-[9px] text-amber-900 border border-amber-300">
                          GROUND TRUTH
                        </span>
                      </div>
                      <div className="text-slate-800 text-[11px] leading-relaxed whitespace-pre-line font-serif italic">
                        {msg.fromCarter}
                      </div>
                    </div>
                  )}

                  {/* Distinct Section 2: ADDITIONAL SCIENTIFIC EXPLANATION */}
                  {msg.additionalExplanation && (
                    <div className="space-y-1 pt-1">
                      <div className="font-mono text-[10px] font-bold text-[#0284C7] uppercase tracking-wider">
                        ADDITIONAL SCIENTIFIC EXPLANATION:
                      </div>
                      <div className="text-slate-900 text-xs leading-relaxed whitespace-pre-line font-sans">
                        {msg.additionalExplanation}
                      </div>
                    </div>
                  )}

                  {/* Fallback if raw content without split */}
                  {!msg.fromCarter && (
                    <div className="text-slate-900 text-xs leading-relaxed whitespace-pre-line font-sans">
                      {msg.content}
                    </div>
                  )}

                  {/* Citations Drawer */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-300">
                      <div className="font-mono text-[10px] font-bold text-slate-600 uppercase flex items-center justify-between">
                        <span>Textbook Citations ({msg.citations.length}):</span>
                        <span className="text-[9px] text-slate-500">
                          Click to inspect Carter excerpt
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {msg.citations.map((cite, idx) => (
                          <SourceCitation key={cite.chunkId || idx} source={cite} index={idx} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-up Questions */}
                  {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-300">
                      <span className="font-mono text-[10px] font-bold text-slate-500 uppercase block">
                        Suggested Follow-Up Enquiries:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedQuestions.map((sq, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(sq)}
                            className="text-[11px] font-mono bg-white hover:bg-slate-100 border border-border px-2 py-1 text-slate-800 transition-colors text-left"
                          >
                            → {sq}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Copy Toolbar */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="text-[10px] font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Answer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="mr-auto max-w-xl w-full brutal-border bg-surface-warm p-4 font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <span className="w-2.5 h-2.5 bg-[#FF5722] animate-ping rounded-full"></span>
                RETRIEVING CARTER CHUNKS & GENERATING GROUNDED EXPLANATION...
              </div>
              <p className="text-[10px] text-slate-500">
                Searching Carter textbook vector space • Checking citation fidelity • Applying {mode} rubric
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Query Input Box */}
        <div className="pt-4 border-t-2 border-border mt-4 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                mode === "TUTOR"
                  ? "Ask to be taught a TEM concept step-by-step..."
                  : mode === "EXAM"
                  ? "Enter an exam question to get marking rubric & model answer..."
                  : mode === "EXPERIMENT"
                  ? "Describe your experimental TEM problem..."
                  : "Ask Carter anything about TEM (e.g., Why does diffraction contrast occur?)..."
              }
              className="flex-1 brutal-border p-2.5 font-mono text-xs bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
              disabled={isLoading}
            />
            <BrutalButton
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading || !inputQuery.trim()}
              icon={<Send className="w-4 h-4" />}
            >
              SEND
            </BrutalButton>
          </form>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-600">
            <span className="font-bold text-slate-800">Quick Prompts:</span>
            <button
              onClick={() => handleSend("Why does diffraction contrast occur in TEM?")}
              className="bg-surface-warm border border-slate-300 px-1.5 py-0.5 hover:bg-slate-200"
            >
              Diffraction Contrast
            </button>
            <button
              onClick={() => handleSend("Explain the g.b = 0 dislocation invisibility criterion.")}
              className="bg-surface-warm border border-slate-300 px-1.5 py-0.5 hover:bg-slate-200"
            >
              g·b=0 Dislocation
            </button>
            <button
              onClick={() => handleSend("What is Scherzer defocus and the Contrast Transfer Function?")}
              className="bg-surface-warm border border-slate-300 px-1.5 py-0.5 hover:bg-slate-200"
            >
              Scherzer Defocus
            </button>
            <button
              onClick={() => handleSend("I have poor contrast in my TEM image. What should I do?")}
              className="bg-surface-warm border border-slate-300 px-1.5 py-0.5 hover:bg-slate-200"
            >
              Poor Contrast Troubleshooting
            </button>
          </div>
        </div>
      </BrutalCard>
    </div>
  );
}
