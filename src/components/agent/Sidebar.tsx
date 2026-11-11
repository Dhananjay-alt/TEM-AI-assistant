"use client";

import React from "react";
import Link from "next/link";
import { PanelLeftClose, Plus, Trash2 } from "lucide-react";
import { Conversation } from "./types";
import { TOOL_LINKS } from "@/lib/nav";

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
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const groups = [
    { label: "Today", items: conversations.filter((c) => c.updatedAt >= dayAgo) },
    { label: "Earlier", items: conversations.filter((c) => c.updatedAt < dayAgo) },
  ].filter((g) => g.items.length > 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onToggle} aria-hidden="true" />

      <aside
        className="fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-line bg-surface lg:static lg:z-auto lg:shrink-0"
        aria-label="Conversations and tools"
      >
        <div className="flex h-12 items-center justify-between px-3">
          <Link href="/" className="px-1 font-serif text-[17px] font-semibold tracking-tight text-foreground">
            TEM-AI
          </Link>
          <button
            type="button"
            onClick={onToggle}
            aria-label="Hide sidebar"
            title="Hide sidebar"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-foreground"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={onNewConversation}
            className="flex w-full items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium text-foreground hover:bg-surface-2 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New conversation
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-3" aria-label="Conversations">
          {groups.map((group) => (
            <div key={group.label} className="mt-3">
              <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-faint">{group.label}</div>
              <ul>
                {group.items.map((c) => {
                  const active = c.id === activeConversationId;
                  return (
                    <li key={c.id} className="group relative">
                      <button
                        type="button"
                        onClick={() => onSelectConversation(c.id)}
                        aria-current={active ? "true" : undefined}
                        className={`w-full truncate rounded-md py-1.5 pl-2 pr-8 text-left text-sm transition-colors ${
                          active ? "bg-surface-2 font-medium text-foreground" : "text-muted hover:bg-surface-2 hover:text-foreground"
                        }`}
                      >
                        {c.title}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteConversation(c.id)}
                        aria-label={`Delete conversation: ${c.title}`}
                        title="Delete"
                        className="absolute right-1 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-faint hover:text-danger group-hover:inline-flex focus-visible:inline-flex"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-line px-3 py-3">
          <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-faint">Tools</div>
          <ul>
            {TOOL_LINKS.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  title={t.description}
                  className="block rounded-md px-2 py-1.5 text-sm text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
