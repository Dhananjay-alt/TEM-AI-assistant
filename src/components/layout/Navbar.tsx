"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { TOOL_LINKS } from "@/lib/nav";

export function Navbar() {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    setToolsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // The assistant has its own full-height layout with a sidebar.
  if (pathname === "/" || pathname === "/ask") return null;

  const current = TOOL_LINKS.find((t) => t.href === pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="font-serif text-[17px] font-semibold tracking-tight text-foreground">
          TEM-AI
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="Main">
          <Link href="/" className="rounded-md px-2.5 py-1.5 text-muted hover:bg-surface-2 hover:text-foreground">
            Assistant
          </Link>

          <div className="relative" ref={toolsRef}>
            <button
              type="button"
              onClick={() => setToolsOpen((o) => !o)}
              aria-expanded={toolsOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 font-medium text-foreground hover:bg-surface-2"
            >
              {current ? current.label : "Tools"}
              <ChevronDown className={`h-3.5 w-3.5 text-muted transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
            </button>

            {toolsOpen && (
              <div role="menu" className="absolute left-0 top-full mt-1 w-72 rounded-md border border-line bg-surface p-1 shadow-panel">
                {TOOL_LINKS.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    role="menuitem"
                    className={`block rounded px-2.5 py-2 hover:bg-surface-2 ${t.href === pathname ? "bg-surface-2" : ""}`}
                  >
                    <div className="text-sm font-medium text-foreground">{t.label}</div>
                    <div className="text-xs text-muted">{t.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-foreground md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line bg-surface px-4 py-2 md:hidden" aria-label="Main">
          <Link href="/" className="block rounded px-2 py-2 text-sm text-foreground hover:bg-surface-2">
            Assistant
          </Link>
          {TOOL_LINKS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`block rounded px-2 py-2 text-sm hover:bg-surface-2 ${
                t.href === pathname ? "font-medium text-foreground" : "text-muted"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
