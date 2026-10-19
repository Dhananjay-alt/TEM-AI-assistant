import React from "react";
import { cn } from "@/lib/utils";

interface BrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "warm" | "dark" | "cyan" | "amber" | "green";
  shadowSize?: "sm" | "md" | "lg" | "none";
  titleBar?: string;
  titleBarBadge?: string;
}

export function BrutalCard({
  children,
  className,
  variant = "default",
  shadowSize = "md",
  titleBar,
  titleBarBadge,
  ...props
}: BrutalCardProps) {
  const bgStyles = {
    default: "bg-surface text-foreground",
    warm: "bg-surface-warm text-foreground",
    dark: "bg-surface-dark text-white border-white",
    cyan: "bg-[#E0F7FE] text-foreground border-[#0F172A]",
    amber: "bg-[#FEF3C7] text-foreground border-[#0F172A]",
    green: "bg-[#ECFDF5] text-foreground border-[#0F172A]",
  }[variant];

  const shadowStyles = {
    none: "",
    sm: "shadow-neo-xs",
    md: "shadow-neo-md",
    lg: "shadow-neo-lg",
  }[shadowSize];

  return (
    <div
      className={cn(
        "brutal-border rounded-none relative overflow-hidden transition-all duration-150",
        bgStyles,
        shadowStyles,
        className
      )}
      {...props}
    >
      {titleBar && (
        <div className="border-b-[2.5px] border-border bg-foreground text-background px-3 py-1.5 flex items-center justify-between text-xs font-mono font-bold tracking-wider uppercase">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 bg-hazard-amber"></span>
            {titleBar}
          </span>
          {titleBarBadge && (
            <span className="bg-background text-foreground px-1.5 py-0.5 text-[10px] font-bold">
              {titleBarBadge}
            </span>
          )}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
