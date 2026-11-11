import React from "react";
import { cn } from "@/lib/utils";

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "cyan" | "green" | "dark" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

/** Standard button. (The name is historical; many pages import it.) */
export function BrutalButton({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  disabled,
  ...props
}: BrutalButtonProps) {
  const solid = "border-accent bg-accent text-accent-fg hover:opacity-90";
  const quiet = "border-line-strong bg-surface text-foreground hover:bg-surface-2";
  const variantStyles = {
    primary: solid,
    dark: solid,
    green: solid,
    secondary: quiet,
    cyan: quiet,
    outline: quiet,
    danger: "border-danger/40 bg-surface text-danger hover:bg-danger/10",
  }[variant];

  const sizeStyles = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-2 text-sm",
    lg: "px-5 py-2.5 text-sm",
  }[size];

  return (
    <button
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-md border font-medium transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
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
