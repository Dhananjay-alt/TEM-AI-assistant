"use client";

import React from "react";
import { BookOpen, PanelLeft, SquarePen } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export interface BookStatus {
  available: boolean;
  title?: string;
  numPages?: number;
  /** "pages": references open the page itself. "reference": page number and a short quotation only. */
  view?: "pages" | "reference";
}

interface ChatHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onNewChat: () => void;
  title: string;
  book: BookStatus | null;
}

export function ChatHeader({ sidebarOpen, onToggleSidebar, onNewChat, title, book }: ChatHeaderProps) {
  const iconBtn =
    "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-foreground transition-colors";

  return (
    <header className="flex h-12 shrink-0 items-center gap-1 border-b border-line bg-background px-3">
      {!sidebarOpen && (
        <>
          <button type="button" onClick={onToggleSidebar} className={iconBtn} aria-label="Show sidebar" title="Show sidebar">
            <PanelLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={onNewChat} className={iconBtn} aria-label="New conversation" title="New conversation">
            <SquarePen className="h-4 w-4" />
          </button>
        </>
      )}

      <h1 className="min-w-0 flex-1 truncate px-2 text-sm font-medium text-foreground">{title}</h1>

      {book && (
        <div
          className="hidden items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-xs text-muted sm:flex"
          title={
            !book.available
              ? "Put the textbook PDF in the book folder and run: npm run index-book"
              : book.view === "pages"
              ? "References open the page of this PDF"
              : "References give the chapter, section and page of this book"
          }
        >
          <BookOpen className="h-3.5 w-3.5 shrink-0" />
          {book.available ? (
            <span className="max-w-[260px] truncate">
              {book.title} · {book.numPages} pages
            </span>
          ) : (
            <span>Stored summaries · textbook PDF not indexed</span>
          )}
        </div>
      )}

      <ThemeToggle />
    </header>
  );
}
