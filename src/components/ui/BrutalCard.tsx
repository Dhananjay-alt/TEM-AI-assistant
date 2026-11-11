import React from "react";
import { cn } from "@/lib/utils";

interface BrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "warm" | "dark" | "cyan" | "amber" | "green";
  /** Kept for compatibility with existing pages; cards no longer cast shadows. */
  shadowSize?: "sm" | "md" | "lg" | "none";
  titleBar?: string;
  titleBarBadge?: string;
}

/** Plain bordered panel. (The name is historical; many pages import it.) */
export function BrutalCard({
  children,
  className,
  variant = "default",
  shadowSize: _shadowSize,
  titleBar,
  titleBarBadge,
  ...props
}: BrutalCardProps) {
  const tone = {
    default: "bg-surface",
    warm: "bg-surface-2",
    dark: "bg-inverse text-inverse-fg",
    cyan: "bg-surface",
    amber: "bg-surface",
    green: "bg-surface",
  }[variant];

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg border border-line", variant === "dark" ? "" : "text-foreground", tone, className)}
      {...props}
    >
      {titleBar && (
        <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-2 text-xs font-medium text-muted">
          <span>{titleBar}</span>
          {titleBarBadge && <span className="font-mono text-[11px] text-faint">{titleBarBadge}</span>}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
