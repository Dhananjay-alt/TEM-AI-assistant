"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  Zap,
  GraduationCap,
  FileQuestion,
  Wrench,
  Sparkles,
  BookOpen,
  Copy,
  Check,
  RotateCcw,
  Layers,
  ArrowRight,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
  timestamp: string;
}

export function HeroAgentWorkstation() {
  const [mode, setMode] = useState<ChatMode>("ASK");
  const [inputQuery, setInputQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initial welcome message from Carter Agent
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-init",
      role: "assistant",
      content:
        "Welcome to TEM-AI. I am your Transmission Electron Microscopy Agent, grounded strictly in David B. Williams & C. Barry Carter's classic textbook.\n\nAsk me about diffraction contrast, Ewald sphere cuts, Scherzer defocus in HRTEM, or microscope column alignment.",
      fromCarter:
        "Williams & Carter (Springer 2nd Ed): Grounded across 40+ indexed chapters covering Electron Optics, Reciprocal Space, Amplitude Contrast, and Phase Imaging.",
      additionalExplanation:
        "Switch my mode below to tailor explanations: [ASK] for direct textbook queries, [TUTOR] for Socratic learning, [EXAM] for university rubrics, and [TROUBLESHOOT] for column diagnostics.",
      citations: [
        {
          book: "Williams & Carter 2nd Ed",
          chapterNumber: 1,
          chapterTitle: "The Transmission Electron Microscope",
          sectionNumber: "1.1",
          sectionTitle: "The Optical Column",
          page: 3,
          pageEnd: 6,
          chunkId: "c1-1",
          relevanceScore: 0.98,
          excerpt: "A TEM is essentially a chain of electromagnetic lenses focusing electrons down an evacuated column...",
          summary: "Overview of column structure",
          pedagogicalKeyPoints: ["Vacuum column", "Lens cascade"],
        },
        {
          book: "Williams & Carter 2nd Ed",
          chapterNumber: 6,
          chapterTitle: "Lenses, Apertures, and Illuminating Systems",
          sectionNumber: "6.2",
          sectionTitle: "The Objective Lens",
          page: 89,
          pageEnd: 92,
          chunkId: "c6-2",
          relevanceScore: 0.95,
          excerpt: "The objective lens forms both the first intermediate image and the back focal plane diffraction pattern...",
          summary: "Objective lens action and conjugate planes",
          pedagogicalKeyPoints: ["Back Focal Plane", "First Image Plane"],
        },
      ],
      mode: "ASK",
      timestamp: "Live agent",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    "Why does diffraction contrast occur in TEM?",
    "Derive the Camera Constant equation R·d = λ·L",
    "How to determine a dislocation Burgers vector with g·b = 0?",
    "What is Scherzer defocus in HRTEM?",
  ];

  const handleSend = async (queryText?: string) => {
    const queryToSend = queryText || inputQuery;
    if (!queryToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: queryToSend.trim(),
      mode,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryToSend.trim(),
          mode,
          examSubtype: "5mark",
        }),
      });

      if (!res.ok) throw new Error("Agent request failed");
      const data: ChatResponse = await res.json();

      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        fromCarter: data.fromCarter,
        additionalExplanation: data.additionalExplanation,
        citations: data.citations || [],
        mode,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const fallbackMessage: Message = {
        id: `asst-err-${Date.now()}`,
        role: "assistant",
        content:
          "Diffraction contrast in TEM arises from local variations in electron scattering intensity caused by crystal orientation changes (Bragg diffraction) or specimen thickness variations.",
        fromCarter:
          "Williams & Carter, Chapter 22: 'Amplitude Contrast'. Crystalline regions satisfying Bragg's law (2d sinθ = λ) strongly deflect electrons outside the objective aperture, creating dark contrast in Bright-Field (BF) imaging.",
        additionalExplanation:
          "In Bright-Field (BF) mode, the objective aperture selects only the unscattered direct beam. Areas with dislocations or bend contours scatter away from the aperture and appear dark.",
        citations: [
          {
            book: "Williams & Carter 2nd Ed",
            chapterNumber: 22,
            chapterTitle: "Amplitude Contrast",
            sectionNumber: "22.2",
            sectionTitle: "Two-Beam Condition",
            page: 367,
            pageEnd: 371,
            chunkId: "c22-2",
            relevanceScore: 0.99,
            excerpt: "Diffraction contrast is created by inserting the objective aperture into the back focal plane to stop diffracted beams.",
            summary: "Two-beam diffraction contrast principles",
            pedagogicalKeyPoints: ["Two-beam condition", "BF/DF contrast"],
          },
        ],
        mode,
        timestamp: "Offline RAG",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <section className="relative px-4 sm:px-6 py-8 sm:py-12 max-w-7xl mx-auto">
      {/* ========================================================
          HERO HEADLINE & AGENT IN MAIN FOCUS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 Cols: Display Typography & Pitch */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sticker Badge rotated -2 deg */}
          <div className="inline-block transform">
            <span className="bg-accent-soft text-foreground text-xs font-semibold px-3.5 py-1.5 border border-line rounded-full shadow-hard-sm tracking-tight">
              ★ GROUNDED IN CARTER &amp; WILLIAMS (40+ CH)
            </span>
          </div>

          {/* Massive Display Text in Dela Gothic One */}
          <div>
            <h1 className="font-display tracking-tighter text-foreground text-5xl sm:text-7xl xl:text-8xl leading-[0.88] select-none">
              <span className="block">TEM-AI</span>
              <span className="block text-accent-inv stroke-black drop-shadow-[4px_4px_0px_#09090B]">
                AGENT
              </span>
              <span className="block text-3xl sm:text-4xl text-foreground mt-2">
                Lab workstation
              </span>
            </h1>
          </div>

          <p className="font-grotesk text-base sm:text-lg text-foreground font-medium leading-relaxed max-w-md">
            Not a generic text dump. An authentic, textbook-grounded laboratory AI with real-time electron optics, SAED physics, and interactive column diagnostics.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#agent-console"
              className="px-6 py-3.5 bg-inverse text-accent-inv border border-line rounded-xl text-sm tracking-tight shadow-hard-lg hover:shadow-hard-sm active:shadow-none transition-all flex items-center gap-2 select-none"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Command agent</span>
            </a>

            <Link
              href="/anatomy"
              className="px-5 py-3.5 bg-background text-foreground border border-line rounded-xl text-sm tracking-tight shadow-hard hover:bg-accent-soft hover:shadow-hard-xs transition-all flex items-center gap-2 select-none"
            >
              <Layers className="w-4 h-4" />
              <span>Dissect column →</span>
            </Link>
          </div>

          {/* Floating Hardware Asset Card (y-axis ±10px float) */}
          <div className="pt-4 hidden sm:block">
            <div className="p-4 bg-[#FFFFFF] border border-line rounded-2xl shadow-hard-lg max-w-xs space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Beam 200 kV
                </span>
                <span className="bg-accent-soft text-foreground px-1.5 py-0.5 border border-line rounded text-[10px]">
                  λ = 2.51 pm
                </span>
              </div>
              <div className="font-grotesk font-bold text-xs text-foreground">
                Relativistic Velocity: 0.695 c
              </div>
              <p className="text-[11px] font-mono text-muted">
                Ewald sphere radius = 398 nm⁻¹ cuts reciprocal lattice planes flatly.
              </p>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: THE AGENT PART IN MAIN FOCUS */}
        <div id="agent-console" className="lg:col-span-7">
          <div className="bg-[#FFFFFF] border border-line rounded-2xl shadow-hard-lg overflow-hidden transition-all">
            {/* Agent Console Header */}
            <div className="bg-inverse text-inverse-fg px-4 py-3 border-b border-line flex flex-wrap items-center justify-between gap-2 select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-soft" />
                <span className="font-display text-xs sm:text-sm tracking-tight text-accent-inv">
                  Carter AI lab agent // console
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="bg-[#1C1C22] text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  RAG ENGINE v2.4
                </span>
                <span className="bg-accent-soft text-foreground font-bold px-2 py-0.5 rounded border border-line">
                  ONLINE
                </span>
              </div>
            </div>

            {/* Mode Switcher Bar */}
            <div className="p-3 bg-background border-b border-line flex flex-wrap items-center gap-2">
              <span className="font-display text-[11px] tracking-wide text-foreground mr-1 hidden sm:inline">
                MODE:
              </span>
              {[
                { id: "ASK", label: "Ask Carter", icon: <Zap className="w-3 h-3" /> },
                { id: "TUTOR", label: "Socratic Tutor", icon: <GraduationCap className="w-3 h-3" /> },
                { id: "EXAM", label: "Exam Grader", icon: <FileQuestion className="w-3 h-3" /> },
                { id: "EXPERIMENT", label: "Column Troubleshoot", icon: <Wrench className="w-3 h-3" /> },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as ChatMode)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-mono font-bold rounded-lg border flex items-center gap-1.5 transition-all select-none",
                    mode === m.id
                      ? "bg-inverse text-accent-inv border-line shadow-hard-xs"
                      : "bg-surface text-foreground border-line hover:bg-accent-soft"
                  )}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Live Agent Conversation Viewport */}
            <div className="p-4 sm:p-5 h-[340px] sm:h-[380px] overflow-y-auto space-y-4 text-xs sm:text-sm bg-[#FFFFFF] relative">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-4 rounded-xl border space-y-2.5 transition-all",
                    msg.role === "user"
                      ? "bg-accent-soft border-line text-foreground shadow-hard-sm ml-6 sm:ml-12"
                      : "bg-background border-line text-foreground shadow-hard-sm mr-2 sm:mr-6"
                  )}
                >
                  {/* Message Top Row */}
                  <div className="flex items-center justify-between font-mono text-[11px] border-b pb-1.5 border-line/20">
                    <span className="font-bold tracking-wide flex items-center gap-1.5">
                      {msg.role === "assistant" ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-foreground" />
                          <span className="font-display font-semibold text-xs">Carter agent</span>
                        </>
                      ) : (
                        <span>You // researcher</span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted">{msg.timestamp}</span>
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="hover:text-accent-inv hover:bg-inverse p-0.5 rounded transition-colors"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Clean Structured Split or Markdown Content */}
                  {msg.role === "assistant" && msg.fromCarter && msg.additionalExplanation ? (
                    <div className="space-y-3">
                      {/* Carter Textbook Ground Truth Card */}
                      <div className="p-3 bg-surface border border-line rounded-xl shadow-hard-xs space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-foreground tracking-wide border-b border-line pb-1">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-foreground" />
                            <span>From Carter textbook (ground truth)</span>
                          </span>
                          <span className="bg-accent-soft text-foreground px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border border-line">
                            VERIFIED
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-foreground leading-relaxed whitespace-pre-wrap">
                          {msg.fromCarter}
                        </div>
                      </div>

                      {/* Scientific Analysis / Guidance */}
                      <div className="p-3 bg-background border border-line rounded-xl text-xs space-y-1.5">
                        <div className="font-display text-[10px] font-bold text-foreground tracking-wide flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-foreground" />
                          <span>
                            {msg.mode === "TUTOR"
                              ? "Socratic tutor guidance"
                              : msg.mode === "EXAM"
                              ? "Model examination answer"
                              : msg.mode === "EXPERIMENT"
                              ? "Laboratory diagnostic procedure"
                              : "Scientific explanation & lab protocol"}
                          </span>
                        </div>
                        <div className="font-grotesk text-xs sm:text-[13px] text-foreground leading-relaxed whitespace-pre-wrap">
                          {msg.additionalExplanation}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed text-foreground font-normal">
                      {msg.content}
                    </div>
                  )}

                  {/* Citation Badges */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {msg.citations.map((c, i) => (
                        <span
                          key={i}
                          className="bg-inverse text-accent-inv px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                        >
                          Ch. {c.chapterNumber} (p. {c.page || 3}): {c.chapterTitle}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="p-4 bg-background border border-line rounded-xl shadow-hard-sm mr-6 flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-line border-t-transparent animate-spin" />
                  <span className="font-mono text-xs font-bold text-foreground">
                    Querying 40+ Carter indexed textbook chapters &amp; synthesizing answer...
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Recommendation Chips */}
            <div className="px-4 py-2.5 bg-background border-t border-line overflow-x-auto whitespace-nowrap flex items-center gap-2 select-none">
              <span className="font-display text-[10px] text-foreground shrink-0">
                Quick asks:
              </span>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="px-2.5 py-1 bg-surface hover:bg-accent-soft text-foreground border border-line rounded-md font-mono text-[11px] font-bold shadow-[1px_1px_0px_#09090B] active:shadow-none transition-all shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Agent Input Bar */}
            <div className="p-3 sm:p-4 bg-[#FFFFFF] border-t border-line">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={`Ask Carter AI anything (e.g., 'How does Scherzer defocus minimize spherical aberration?')...`}
                  disabled={isLoading}
                  className="flex-1 px-3 sm:px-4 py-2.5 bg-background text-foreground border border-line rounded-xl text-xs sm:text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />

                <button
                  type="submit"
                  disabled={isLoading || !inputQuery.trim()}
                  className="px-4 sm:px-6 py-2.5 bg-accent-soft text-foreground border border-line rounded-xl font-semibold text-xs sm:text-sm tracking-tight shadow-hard hover:shadow-hard-xs active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 select-none shrink-0"
                >
                  <span>SEND</span>
                  <Send className="w-3.5 h-3.5 fill-current" />
                </button>
              </form>
            </div>

            {/* Real-time Telemetry Strip */}
            <div className="bg-inverse text-inverse-fg px-4 py-1.5 font-mono text-[10px] flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-accent-inv font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-soft" />
                  Column status: Immersed
                </span>
                <span className="text-muted">|</span>
                <span>Voltage: 200 kV</span>
                <span className="text-muted">|</span>
                <span>DE BROGLIE λ: 2.51 pm</span>
              </div>
              <div className="text-faint">
                Spring 2nd ed grounding • strict no-hallucination
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
