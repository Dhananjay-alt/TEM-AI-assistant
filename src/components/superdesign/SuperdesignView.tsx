"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Star, ArrowUpRight, Sparkles, X, Send, Bot, BookOpen } from "lucide-react";
import { ChatShell } from "@/components/agent/ChatShell";

export function SuperdesignView() {
  const [currentTime, setCurrentTime] = useState<string>("11:11 PM");
  const [navScrolled, setNavScrolled] = useState<boolean>(false);
  const [cardOffsetUp, setCardOffsetUp] = useState<number>(0);
  const [cardOffsetDown, setCardOffsetDown] = useState<number>(0);
  const [heroOffset, setHeroOffset] = useState<{ y: number; opacity: number }>({ y: 0, opacity: 1 });
  const [agentModalOpen, setAgentModalOpen] = useState<boolean>(false);

  // 1. Live Time Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // 2. Scroll Parallax & Nav Blur
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Nav scroll blur
      if (scrollY > 50) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }

      // Parallax cards
      setCardOffsetUp(scrollY * -0.05);
      setCardOffsetDown(scrollY * 0.05);

      // Hero parallax
      if (scrollY < 1000) {
        setHeroOffset({
          y: scrollY * 0.35,
          opacity: Math.max(0, 1 - scrollY / 600),
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Intersection Observer for Reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FF4500] selection:text-white font-sans overflow-x-hidden relative">
      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Navigation */}
      <nav
        id="main-nav"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          navScrolled
            ? "py-4 bg-[#050505]/85 backdrop-blur-md border-b border-white/5"
            : "py-8 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            id="nav-logo-link"
            className="text-2xl font-bold tracking-tighter font-serif text-white hover:text-[#FF4500] transition-colors"
          >
            Superdesign.
          </Link>

          <div className="hidden md:flex items-center space-x-8 font-sans">
            <a
              href="#expertise"
              id="nav-expertise-link"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              Expertise
            </a>
            <a
              href="#works"
              id="nav-works-link"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              Selected Works
            </a>
            <a
              href="#agent"
              id="nav-perspectives-link"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF4500]" />
              <span>Carter Agent</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAgentModalOpen(true)}
              id="nav-cta-link"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-medium bg-white text-black hover:scale-105 hover:bg-[#FF4500] hover:text-white transition-all duration-300 font-sans shadow-lg cursor-pointer"
            >
              Start Project
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 bg-[#050505]">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-60 mix-blend-screen">
            <img
              src="https://framerusercontent.com/images/9zvwRJAavKKacVyhFCwHyXW1U.png?width=1536&height=1024"
              alt="Atmosphere"
              className="w-full h-full object-cover object-center opacity-80"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10" />
        </div>

        {/* Floating Surrealist Hand Left */}
        <div className="absolute -left-[10%] top-[-10%] md:left-[-5%] md:top-[-15%] w-[50vw] md:w-[40vw] max-w-[800px] z-10 pointer-events-none mix-blend-hard-light opacity-80 animate-float-left">
          <img
            src="https://framerusercontent.com/images/KNhiA5A2ykNYqNkj04Hk6BVg5A.png?width=1540&height=1320"
            alt="Hand Reaching"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Floating Surrealist Hand Right */}
        <div className="absolute -right-[10%] bottom-[-10%] md:right-[-5%] md:bottom-[-5%] w-[45vw] md:w-[35vw] max-w-[700px] z-10 pointer-events-none mix-blend-hard-light opacity-80 animate-float-right">
          <img
            src="https://framerusercontent.com/images/X89VFCABCEjjZ4oLGa3PjbOmsA.png?width=1542&height=1002"
            alt="Hand Receiving"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-20 text-center flex flex-col items-center justify-center h-full">
          <div
            id="hero-content-wrapper"
            className="max-w-4xl mx-auto transition-transform duration-75"
            style={{
              transform: `translateY(${heroOffset.y}px)`,
              opacity: heroOffset.opacity,
            }}
          >
            <div className="reveal active">
              <h1
                className="text-5xl md:text-7xl font-medium leading-[1.1] tracking-tight mb-6 text-[#ffe0e0] mix-blend-overlay font-serif"
                style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}
              >
                Superdesign. <br />
                <span className="italic font-light text-[#ffe0e0]">The design agent.</span>
              </h1>
            </div>

            <div className="reveal active" style={{ transitionDelay: "200ms" }}>
              <p
                className="text-base md:text-lg text-[#ffe0e0]/90 max-w-lg mx-auto mb-16 font-light tracking-wide leading-relaxed mix-blend-overlay font-sans"
                style={{ textShadow: "0 0 12px rgba(255,255,255,0.71)" }}
              >
                We turn the unseen into the unforgettable. A design agency for those who dare to disappear to be found.
              </p>
            </div>

            <div className="reveal active flex flex-col items-center gap-6" style={{ transitionDelay: "400ms" }}>
              <button
                type="button"
                onClick={() => setAgentModalOpen(true)}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-[#FF4500]/25 blur-xl rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="relative border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-2.5 rounded-full flex items-center gap-3 text-xs md:text-sm text-white/90 uppercase tracking-widest hover:bg-white/10 hover:border-[#FF4500]/50 transition-all duration-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF4500]" />
                  <span>Enter the Void</span>
                </div>
              </button>

              <div className="flex items-center gap-4 text-[10px] md:text-xs text-white/40 uppercase tracking-widest mt-8 font-mono">
                <span id="current-time">{currentTime}</span>
                <span className="w-px h-3 bg-white/20" />
                <span>NYC, USA</span>
                <span className="w-px h-3 bg-white/20" />
                <span className="text-[#FF4500]">CARTER AGENT LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise / Mission Section */}
      <section id="expertise" className="py-32 relative bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center reveal">
            <h2 className="text-3xl md:text-5xl lg:text-6xl leading-tight text-white/90 mb-12 font-serif">
              We design the negative space where your brand truly lives.
            </h2>
            <p className="text-xl md:text-2xl text-gray-500 leading-relaxed font-light font-sans">
              Elegance is refusal. We remove the noise so your message resonates with absolute clarity.
            </p>
          </div>

          {/* Logo Grid */}
          <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="reveal font-bold text-xl tracking-widest font-sans">VOGUE</div>
            <div className="reveal font-bold text-xl tracking-widest font-sans" style={{ transitionDelay: "100ms" }}>
              TESLA
            </div>
            <div className="reveal font-bold text-xl tracking-widest font-sans" style={{ transitionDelay: "200ms" }}>
              MOOMA
            </div>
            <div className="reveal font-bold text-xl tracking-widest font-sans" style={{ transitionDelay: "300ms" }}>
              AESOP
            </div>
          </div>
        </div>
      </section>

      {/* Selected Works Cards Section */}
      <section id="works" className="py-40 relative overflow-hidden bg-[#050505]">
        <div className="container mx-auto px-6 relative z-10">
          <div className="reveal mb-32 text-center">
            <h2 className="text-5xl md:text-7xl font-serif">
              Define your <br />
              <span className="italic font-light">digital presence</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1 - Red / Orange #FF4500 */}
            <div
              className="parallax-card-down transition-transform duration-100 ease-out"
              style={{ transform: `translateY(${cardOffsetDown}px)` }}
            >
              <div
                onClick={() => setAgentModalOpen(true)}
                className="reveal bg-[#FF4500] rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl hover:shadow-[0_20px_50px_rgba(255,69,0,0.35)] transition-all duration-500 group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                    <Star className="text-black w-6 h-6 fill-current" />
                  </div>
                  <span className="text-black font-medium text-sm border border-black/20 px-3 py-1 rounded-full font-mono">
                    01
                  </span>
                </div>

                <div>
                  <h3 className="text-4xl md:text-5xl text-black mb-4 leading-none tracking-tight font-serif">
                    Emerging <br />Talent
                  </h3>
                  <p className="text-black/70 text-lg leading-snug font-sans">
                    You have the spark. We provide the atmosphere for it to ignite into a blazing reality.
                  </p>
                </div>

                <div className="w-full h-px bg-black/10 mt-8" />
              </div>
            </div>

            {/* Card 2 - Obsidian Black #111 */}
            <div
              className="parallax-card-up md:mt-24 transition-transform duration-100 ease-out"
              style={{ transform: `translateY(${cardOffsetUp}px)` }}
            >
              <div
                onClick={() => setAgentModalOpen(true)}
                className="reveal bg-[#111111] border border-white/10 rounded-3xl p-8 md:p-12 aspect-[4/5] flex flex-col justify-between shadow-2xl group cursor-pointer hover:border-[#FF4500]/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500"
                style={{ transitionDelay: "150ms" }}
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <ArrowUpRight className="text-white w-6 h-6 group-hover:text-[#FF4500] transition-colors" />
                  </div>
                  <span className="text-white/50 font-medium text-sm border border-white/10 px-3 py-1 rounded-full font-mono">
                    02
                  </span>
                </div>

                <div>
                  <h3 className="text-4xl md:text-5xl text-white mb-4 leading-none tracking-tight font-serif">
                    Evolving <br />Legacy
                  </h3>
                  <p className="text-gray-400 text-lg leading-snug font-sans">
                    You&apos;ve arrived. Now let&apos;s make sure you never leave their minds. Permanence is our craft.
                  </p>
                </div>

                <div className="w-full h-px bg-white/10 mt-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </section>

      {/* Embedded Carter AI Agent Section */}
      <section id="agent" className="py-24 border-t border-white/5 bg-[#080808] relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4500]/10 border border-[#FF4500]/30 text-[#FF4500] text-xs font-mono uppercase tracking-widest mb-4">
              <Bot className="w-3.5 h-3.5" />
              <span>TEM-AI // CARTER GROUNDED INTELLIGENCE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">
              Consult with the Agent.
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base font-sans">
              Grounded in David B. Williams &amp; C. Barry Carter&apos;s <em>Transmission Electron Microscopy</em>.
            </p>
          </div>

          {/* Interactive Agent Frame */}
          <div className="max-w-5xl mx-auto h-[680px] bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
            <ChatShell />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-[#050505] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div className="w-full md:w-auto">
              <h2 className="text-[10vw] leading-[0.8] tracking-tighter text-white/10 font-bold select-none pointer-events-none font-serif">
                SUPERDESIGN.
              </h2>
            </div>

            <div className="flex flex-col gap-8 text-right font-sans">
              <div className="flex flex-col gap-4 text-gray-400">
                <a href="#expertise" className="hover:text-white transition-colors">
                  Expertise
                </a>
                <a href="#works" className="hover:text-white transition-colors">
                  Selected Works
                </a>
                <a href="#agent" className="hover:text-[#FF4500] transition-colors">
                  Carter Agent
                </a>
              </div>
              <p className="text-sm text-gray-600">© 2024 Superdesign. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Full-Screen Agent Modal when "Enter the Void" or "Start Project" is clicked */}
      {agentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#050505] text-white">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4500] animate-pulse" />
              <span className="font-serif text-lg tracking-tight">Superdesign // Carter Agent</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">
                Grounded Knowledge Base
              </span>
            </div>

            <button
              type="button"
              onClick={() => setAgentModalOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <ChatShell />
          </div>
        </div>
      )}
    </div>
  );
}
