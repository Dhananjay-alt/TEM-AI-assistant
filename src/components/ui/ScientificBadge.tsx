import React from "react";
import { cn } from "@/lib/utils";

interface ScientificBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "cyan" | "green" | "amber" | "dark" | "red";
  hasDot?: boolean;
}

export function ScientificBadge({
  children,
  className,
  variant = "default",
  hasDot = false,
  ...props
}: ScientificBadgeProps) {
  const styles = {
    default: "bg-surface-warm text-foreground border-border",
    cyan: "bg-[#E0F7FE] text-[#0369A1] border-[#0284C7]",
    green: "bg-[#ECFDF5] text-[#047857] border-[#10B981]",
    amber: "bg-[#FEF3C7] text-[#B45309] border-[#F59E0B]",
    dark: "bg-foreground text-background border-foreground",
    red: "bg-[#FEE2E2] text-[#B91C1C] border-[#EF4444]",
  }[variant];

  const dotColors = {
    default: "bg-foreground",
    cyan: "bg-[#00D2FF]",
    green: "bg-[#10B981]",
    amber: "bg-[#F59E0B]",
    dark: "bg-[#10B981]",
    red: "bg-[#EF4444]",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider border-2",
        styles,
        className
      )}
      {...props}
    >
      {hasDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColors)}
        />
      )}
      {children}
    </span>
  );
}
