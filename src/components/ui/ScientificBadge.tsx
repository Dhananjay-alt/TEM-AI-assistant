import React from "react";
import { cn } from "@/lib/utils";

interface ScientificBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "default" | "cyan" | "green" | "amber" | "dark" | "red";
  hasDot?: boolean;
}

/** Small status label. */
export function ScientificBadge({
  children,
  className,
  variant = "default",
  hasDot = false,
  ...props
}: ScientificBadgeProps) {
  const dot = {
    default: "bg-faint",
    cyan: "bg-accent",
    green: "bg-positive",
    amber: "bg-warning",
    dark: "bg-faint",
    red: "bg-danger",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 self-start rounded border sm:self-auto border-line bg-surface px-2 py-0.5 text-[11px] font-medium text-muted",
        className
      )}
      {...props}
    >
      {hasDot && <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />}
      {children}
    </span>
  );
}
