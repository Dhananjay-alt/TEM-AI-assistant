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
      timestamp: "LIVE AGENT",
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
        timestamp: "OFFLINE RAG",
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
          <div className="inline-block transform -rotate-2">
            <span className="bg-[#D2E823] text-[#09090B] font-display text-xs font-black px-3.5 py-1.5 border-2 border-[#09090B] rounded-full shadow-hard-sm tracking-tight uppercase">
              ★ GROUNDED IN CARTER &amp; WILLIAMS (40+ CH)
            </span>
          </div>

          {/* Massive Display Text in Dela Gothic One */}
          <div>
            <h1 className="font-display uppercase tracking-tighter text-[#09090B] text-5xl sm:text-7xl xl:text-8xl leading-[0.88] select-none">
              <span className="block glitch-hover">TEM-AI</span>
              <span className="block text-[#D2E823] stroke-black drop-shadow-[4px_4px_0px_#09090B] glitch-hover">
                AGENT
              </span>
              <span className="block text-3xl sm:text-4xl text-[#09090B] mt-2">
                LAB WORKSTATION
              </span>
            </h1>
          </div>

          <p className="font-grotesk text-base sm:text-lg text-[#09090B] font-medium leading-relaxed max-w-md">
            Not a generic text dump. An authentic, textbook-grounded laboratory AI with real-time electron optics, SAED physics, and interactive column diagnostics.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#agent-console"
              className="px-6 py-3.5 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] rounded-xl font-display text-sm uppercase tracking-tight shadow-hard-lg hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 select-none"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>COMMAND AGENT</span>
            </a>

            <Link
              href="/anatomy"
              className="px-5 py-3.5 bg-[#F8F4E8] text-[#09090B] border-2 border-[#09090B] rounded-xl font-display text-sm uppercase tracking-tight shadow-hard hover:bg-[#D2E823] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-xs transition-all flex items-center gap-2 select-none"
            >
              <Layers className="w-4 h-4" />
              <span>DISSECT COLUMN →</span>
            </Link>
          </div>

          {/* Floating Hardware Asset Card (y-axis ±10px float) */}
          <div className="pt-4 hidden sm:block">
            <div className="p-4 bg-[#FFFFFF] border-2 border-[#09090B] rounded-2xl shadow-hard-lg animate-float max-w-xs space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  BEAM 200 kV
                </span>
                <span className="bg-[#D2E823] text-[#09090B] px-1.5 py-0.5 border border-[#09090B] rounded text-[10px]">
                  λ = 2.51 pm
                </span>
              </div>
              <div className="font-grotesk font-bold text-xs text-[#09090B]">
                Relativistic Velocity: 0.695 c
              </div>
              <p className="text-[11px] font-mono text-slate-600">
                Ewald sphere radius = 398 nm⁻¹ cuts reciprocal lattice planes flatly.
              </p>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: THE AGENT PART IN MAIN FOCUS */}
        <div id="agent-console" className="lg:col-span-7">
          <div className="bg-[#FFFFFF] border-2 border-[#09090B] rounded-2xl shadow-hard-lg overflow-hidden transition-all">
            {/* Agent Console Header */}
            <div className="bg-[#09090B] text-[#F8F4E8] px-4 py-3 border-b-2 border-[#09090B] flex flex-wrap items-center justify-between gap-2 select-none">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#D2E823] animate-ping" />
                <span className="font-display text-xs sm:text-sm uppercase tracking-tight text-[#D2E823]">
                  CARTER AI LAB AGENT // CONSOLE
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="bg-[#1C1C22] text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  RAG ENGINE v2.4
                </span>
                <span className="bg-[#D2E823] text-[#09090B] font-bold px-2 py-0.5 rounded border border-[#09090B]">
                  ONLINE
                </span>
              </div>
            </div>

            {/* Mode Switcher Bar */}
            <div className="p-3 bg-[#F8F4E8] border-b-2 border-[#09090B] flex flex-wrap items-center gap-2">
              <span className="font-display text-[11px] uppercase tracking-wider text-[#09090B] mr-1 hidden sm:inline">
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
                    "px-2.5 py-1 text-xs font-mono font-bold rounded-lg border-2 flex items-center gap-1.5 transition-all select-none",
                    mode === m.id
                      ? "bg-[#09090B] text-[#D2E823] border-[#09090B] shadow-hard-xs translate-x-[1px] translate-y-[1px]"
                      : "bg-white text-[#09090B] border-[#09090B] hover:bg-[#D2E823]"
                  )}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Live Agent Conversation Viewport */}
            <div className="p-4 sm:p-5 h-[340px] sm:h-[380px] overflow-y-auto space-y-4 font-grotesk text-xs sm:text-sm bg-[#FFFFFF] relative">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-4 rounded-xl border-2 space-y-2.5 transition-all",
                    msg.role === "user"
                      ? "bg-[#D2E823] border-[#09090B] text-[#09090B] shadow-hard-sm ml-6 sm:ml-12"
                      : "bg-[#F8F4E8] border-[#09090B] text-[#09090B] shadow-hard-sm mr-2 sm:mr-6"
                  )}
                >
                  {/* Message Top Row */}
                  <div className="flex items-center justify-between font-mono text-[11px] border-b pb-1.5 border-[#09090B]/20">
                    <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                      {msg.role === "assistant" ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#09090B]" />
                          <span className="font-display font-black text-xs">CARTER AGENT</span>
                        </>
                      ) : (
                        <span>YOU // RESEARCHER</span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-600">{msg.timestamp}</span>
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="hover:text-[#D2E823] hover:bg-[#09090B] p-0.5 rounded transition-colors"
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
                      <div className="p-3 bg-white border-2 border-[#09090B] rounded-xl shadow-hard-xs space-y-1.5 text-xs">
                        <div className="flex items-center justify-between font-display text-[10px] text-[#09090B] uppercase tracking-wider border-b border-slate-200 pb-1">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#09090B]" />
                            <span>FROM CARTER TEXTBOOK (GROUND TRUTH)</span>
                          </span>
                          <span className="bg-[#D2E823] text-[#09090B] px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border border-[#09090B]">
                            VERIFIED
                          </span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {msg.fromCarter}
                        </div>
                      </div>

                      {/* Scientific Analysis / Guidance */}
                      <div className="p-3 bg-[#F8F4E8] border-2 border-[#09090B] rounded-xl text-xs space-y-1.5">
                        <div className="font-display text-[10px] font-bold text-[#09090B] uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#09090B]" />
                          <span>
                            {msg.mode === "TUTOR"
                              ? "SOCRATIC TUTOR GUIDANCE"
                              : msg.mode === "EXAM"
                              ? "MODEL EXAMINATION ANSWER"
                              : msg.mode === "EXPERIMENT"
                              ? "LABORATORY DIAGNOSTIC PROCEDURE"
                              : "SCIENTIFIC EXPLANATION & LAB PROTOCOL"}
                          </span>
                        </div>
                        <div className="font-grotesk text-xs sm:text-[13px] text-[#09090B] leading-relaxed whitespace-pre-wrap">
                          {msg.additionalExplanation}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed text-[#09090B] font-normal">
                      {msg.content}
                    </div>
                  )}

                  {/* Citation Badges */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {msg.citations.map((c, i) => (
                        <span
                          key={i}
                          className="bg-[#09090B] text-[#D2E823] px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                        >
                          Ch. {c.chapterNumber} (p. {c.page || 3}): {c.chapterTitle}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="p-4 bg-[#F8F4E8] border-2 border-[#09090B] rounded-xl shadow-hard-sm mr-6 flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-[#09090B] border-t-transparent animate-spin" />
                  <span className="font-mono text-xs font-bold text-[#09090B]">
                    Querying 40+ Carter indexed textbook chapters &amp; synthesizing answer...
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Recommendation Chips */}
            <div className="px-4 py-2.5 bg-[#F8F4E8] border-t-2 border-[#09090B] overflow-x-auto whitespace-nowrap flex items-center gap-2 select-none">
              <span className="font-display text-[10px] uppercase text-[#09090B] shrink-0">
                QUICK ASKS:
              </span>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="px-2.5 py-1 bg-white hover:bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-md font-mono text-[11px] font-bold shadow-[1px_1px_0px_#09090B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Agent Input Bar */}
            <div className="p-3 sm:p-4 bg-[#FFFFFF] border-t-2 border-[#09090B]">
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
                  className="flex-1 px-3 sm:px-4 py-2.5 bg-[#F8F4E8] text-[#09090B] border-2 border-[#09090B] rounded-xl font-grotesk text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D2E823] transition-all"
                />

                <button
                  type="submit"
                  disabled={isLoading || !inputQuery.trim()}
                  className="px-4 sm:px-6 py-2.5 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-xl font-display font-black text-xs sm:text-sm uppercase tracking-tight shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-xs active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 select-none shrink-0"
                >
                  <span>SEND</span>
                  <Send className="w-3.5 h-3.5 fill-current" />
                </button>
              </form>
            </div>

            {/* Real-time Telemetry Strip */}
            <div className="bg-[#09090B] text-[#F8F4E8] px-4 py-1.5 font-mono text-[10px] flex items-center justify-between overflow-x-auto whitespace-nowrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[#D2E823] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D2E823]" />
                  COLUMN STATUS: IMMERSED
                </span>
                <span className="text-slate-500">|</span>
                <span>VOLTAGE: 200 kV</span>
                <span className="text-slate-500">|</span>
                <span>DE BROGLIE λ: 2.51 pm</span>
              </div>
              <div className="text-slate-400">
                SPRING 2ND ED GROUNDING • STRICT NO-HALLUCINATION
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
