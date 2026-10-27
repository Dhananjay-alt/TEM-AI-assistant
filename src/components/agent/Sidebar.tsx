"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  MessageSquare,
  Trash2,
  Layers,
  Atom,
  Eye,
  FileQuestion,
  Network,
  Wrench,
  PanelLeftClose,
  Sparkles,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { Conversation } from "./types";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: SidebarProps) {
  // Group conversations into TODAY vs PREVIOUS
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const todayConvos = conversations.filter((c) => now - c.updatedAt < oneDayMs);
  const previousConvos = conversations.filter((c) => now - c.updatedAt >= oneDayMs);

  const supportingTools = [
    { label: "TEM Anatomy", href: "/anatomy", icon: <Layers className="w-3.5 h-3.5" /> },
    { label: "Diffraction Lab", href: "/simulator", icon: <Atom className="w-3.5 h-3.5" /> },
    { label: "Micrograph Lab", href: "/image-analysis", icon: <Eye className="w-3.5 h-3.5" /> },
    { label: "Exam Mode", href: "/exam", icon: <FileQuestion className="w-3.5 h-3.5" /> },
    { label: "Concept Map", href: "/knowledge-map", icon: <Network className="w-3.5 h-3.5" /> },
    { label: "Carter Reader", href: "/learn", icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#09090B]/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer / Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 shrink-0 h-full bg-[#09090b]/95 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between transition-transform duration-200 select-none text-white ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:hidden"
        }`}
      >
        {/* Top Header & Brand */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF4500] to-[#b32b00] text-black font-serif font-black text-sm rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,69,0,0.4)] group-hover:scale-105 transition-transform">
              ★
            </div>
            <div>
              <div className="font-serif text-sm font-bold text-white tracking-tight leading-tight flex items-center gap-1">
                <span>TEM-AI.</span>
              </div>
              <div className="font-mono text-[9px] font-semibold text-[#FF4500] tracking-widest uppercase">
                CARTER AGENT
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 hover:bg-white/10 text-white/70 hover:text-white border border-transparent hover:border-white/10 rounded-lg transition-colors cursor-pointer"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button: + New Conversation */}
        <div className="p-3 border-b border-white/10">
          <button
            type="button"
            onClick={onNewConversation}
            className="w-full py-2.5 px-3 bg-[#18181b] hover:bg-[#FF4500] text-white hover:text-black border border-white/10 hover:border-[#FF4500] rounded-xl font-sans text-xs font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Plus className="w-4 h-4 text-[#FF4500] group-hover:text-black transition-colors" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Scrollable Middle: Conversation History & Tools */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Section: Today */}
          <div className="space-y-1">
            <div className="px-2 font-mono text-[10px] font-bold text-white/40 uppercase tracking-wider">
              TODAY
            </div>

            {todayConvos.length === 0 ? (
              <div className="px-2 py-1.5 text-[11px] font-sans text-white/30 italic">
                No conversations today
              </div>
            ) : (
              todayConvos.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                    conv.id === activeConversationId
                      ? "bg-white/10 border-[#FF4500]/60 text-white shadow-[0_0_12px_rgba(255,69,0,0.15)] font-medium"
                      : "border-transparent text-white/70 hover:bg-white/5 hover:text-white hover:border-white/10"
                  }`}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      conv.id === activeConversationId ? "text-[#FF4500]" : "text-white/40 group-hover:text-white"
                    }`} />
                    <span className="font-sans text-xs truncate">{conv.title}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-[#FF4500] p-1 rounded transition-opacity"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Section: Previous */}
          {previousConvos.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 font-mono text-[10px] font-bold text-white/40 uppercase tracking-wider">
                PREVIOUS
              </div>

              {previousConvos.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                    conv.id === activeConversationId
                      ? "bg-white/10 border-[#FF4500]/60 text-white shadow-[0_0_12px_rgba(255,69,0,0.15)] font-medium"
                      : "border-transparent text-white/70 hover:bg-white/5 hover:text-white hover:border-white/10"
                  }`}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      conv.id === activeConversationId ? "text-[#FF4500]" : "text-white/40 group-hover:text-white"
                    }`} />
                    <span className="font-sans text-xs truncate">{conv.title}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-[#FF4500] p-1 rounded transition-opacity"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Section: Supporting Tools */}
          <div className="space-y-1 pt-3 border-t border-white/10">
            <div className="px-2 font-mono text-[10px] font-bold text-white/40 uppercase tracking-wider flex items-center justify-between">
              <span>SUPPORTING TOOLS</span>
            </div>

            <div className="space-y-1">
              {supportingTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center justify-between px-2.5 py-1.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all text-xs font-sans group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-white/40 group-hover:text-[#FF4500] transition-colors">{tool.icon}</span>
                    <span>{tool.label}</span>
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-white/40" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 bg-[#050505] space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-white/60">Williams &amp; Carter 2nd Ed</span>
            <span className="bg-[#FF4500]/15 text-[#FF4500] px-2 py-0.5 rounded-full font-bold border border-[#FF4500]/30">
              40+ CH
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4500] animate-pulse" />
            <span>AI: Google Gemini 3 Flash Grounded</span>
          </div>
        </div>
      </aside>
    </>
  );
}
