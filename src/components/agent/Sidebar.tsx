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
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#F8F4E8] border-r-2 border-[#09090B] flex flex-col justify-between transition-transform duration-200 select-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:hidden"
        }`}
      >
        {/* Top Header & Brand */}
        <div className="p-3.5 border-b-2 border-[#09090B] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] rounded-lg flex items-center justify-center font-display font-black text-xs group-hover:rotate-6 transition-transform">
              ★
            </div>
            <div>
              <div className="font-display text-sm font-black text-[#09090B] uppercase tracking-tighter leading-tight">
                TEM-AI
              </div>
              <div className="font-mono text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                CARTER AGENT
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 hover:bg-[#D2E823] text-[#09090B] border-2 border-transparent hover:border-[#09090B] rounded-lg transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button: + New Conversation */}
        <div className="p-3 border-b-2 border-[#09090B]">
          <button
            type="button"
            onClick={onNewConversation}
            className="w-full py-2.5 px-3 bg-[#09090B] hover:bg-[#1f1f27] text-[#D2E823] border-2 border-[#09090B] rounded-xl font-display text-xs uppercase tracking-tight shadow-hard-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Scrollable Middle: Conversation History & Tools */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {/* Section: Today */}
          <div className="space-y-1">
            <div className="px-2 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              TODAY
            </div>

            {todayConvos.length === 0 ? (
              <div className="px-2 py-1.5 text-[11px] font-mono text-slate-400 italic">
                No conversations today
              </div>
            ) : (
              todayConvos.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center justify-between px-2.5 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                    conv.id === activeConversationId
                      ? "bg-white border-[#09090B] shadow-hard-xs font-bold text-[#09090B]"
                      : "border-transparent text-slate-700 hover:bg-white/60 hover:border-slate-300"
                  }`}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-[#09090B]" />
                    <span className="font-grotesk text-xs truncate">{conv.title}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-600 p-0.5 rounded transition-opacity"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Section: Previous */}
          {previousConvos.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                PREVIOUS
              </div>

              {previousConvos.map((conv) => (
                <div
                  key={conv.id}
                  className={`group flex items-center justify-between px-2.5 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                    conv.id === activeConversationId
                      ? "bg-white border-[#09090B] shadow-hard-xs font-bold text-[#09090B]"
                      : "border-transparent text-slate-700 hover:bg-white/60 hover:border-slate-300"
                  }`}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-500 group-hover:text-[#09090B]" />
                    <span className="font-grotesk text-xs truncate">{conv.title}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-600 p-0.5 rounded transition-opacity"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Section: Supporting Tools */}
          <div className="space-y-1 pt-3 border-t-2 border-[#09090B]/10">
            <div className="px-2 font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>SUPPORTING TOOLS</span>
            </div>

            <div className="space-y-1">
              {supportingTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center justify-between px-2.5 py-1.5 text-slate-700 hover:text-[#09090B] hover:bg-white rounded-lg border border-transparent hover:border-[#09090B] transition-all text-xs font-mono font-medium group"
                >
                  <span className="flex items-center gap-2">
                    {tool.icon}
                    <span>{tool.label}</span>
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t-2 border-[#09090B] bg-white space-y-2 text-xs">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="font-bold text-[#09090B]">Williams &amp; Carter 2nd Ed</span>
            <span className="bg-[#D2E823] text-[#09090B] px-1.5 py-0.2 rounded font-bold border border-[#09090B]">
              40+ CH
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Provider: Google Gemini 3 Flash</span>
          </div>
        </div>
      </aside>
    </>
  );
}
