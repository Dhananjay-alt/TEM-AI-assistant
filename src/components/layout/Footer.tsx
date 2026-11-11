"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // The assistant fills the whole window; no footer there.
  if (pathname === "/" || pathname === "/ask") return null;

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 text-xs leading-5 text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>TEM-AI · a study and reference aid for transmission electron microscopy.</p>
        <p>Not a substitute for instrument manuals or laboratory safety procedures.</p>
      </div>
    </footer>
  );
}
