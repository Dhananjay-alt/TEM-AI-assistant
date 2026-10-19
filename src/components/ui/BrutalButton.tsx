import React from "react";
import { cn } from "@/lib/utils";

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "cyan" | "green" | "dark" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export function BrutalButton({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  disabled,
  ...props
}: BrutalButtonProps) {
  const variantStyles = {
    primary: "bg-[#FF5722] text-white hover:bg-[#E64A19] active:bg-[#D84315]",
    secondary: "bg-[#F59E0B] text-foreground hover:bg-[#D97706] active:bg-[#B45309]",
    cyan: "bg-[#00D2FF] text-foreground hover:bg-[#00B4D8] active:bg-[#0096C7]",
    green: "bg-[#10B981] text-white hover:bg-[#059669] active:bg-[#047857]",
    dark: "bg-foreground text-background hover:bg-slate-800 active:bg-slate-900",
    outline: "bg-white text-foreground hover:bg-[#F4EFE6] active:bg-[#EBE5D8]",
    danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C]",
  }[variant];

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs font-mono",
    md: "px-4 py-2 text-sm font-bold",
    lg: "px-6 py-3 text-base font-bold tracking-wide",
  }[size];

  return (
    <button
      className={cn(
        "brutal-border brutal-shadow font-sans uppercase tracking-wider inline-flex items-center justify-center gap-2 select-none",
        "transition-all duration-100 ease-out",
        "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg",
        "active:translate-x-0.5 active:translate-y-0.5 active:shadow-neo-xs",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        variantStyles,
        sizeStyles,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
