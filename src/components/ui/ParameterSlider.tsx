import React from "react";
import { cn } from "@/lib/utils";

interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  className?: string;
  helperText?: string;
  badgeText?: string;
}

export function ParameterSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  className,
  helperText,
  badgeText,
}: ParameterSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("space-y-2 select-none", className)}>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="font-bold text-foreground flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-hazard-amber"></span>
          {label}
        </span>
        <div className="flex items-center gap-2">
          {badgeText && (
            <span className="bg-surface-warm border border-border px-1.5 py-0.2 text-[10px] font-bold text-foreground">
              {badgeText}
            </span>
          )}
          <span className="bg-inverse text-inverse-fg px-2 py-0.5 font-bold font-mono text-xs">
            {value} {unit}
          </span>
        </div>
      </div>

      <div className="relative pt-1 pb-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-3 bg-surface-warm border border-border appearance-none cursor-pointer accent-accent focus:outline-none"
        />
        <div className="flex justify-between text-[10px] font-mono text-muted mt-1">
          <span>{min} {unit}</span>
          <span>{Math.round((min + max) / 2)} {unit}</span>
          <span>{max} {unit}</span>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] font-mono text-muted leading-tight">
          {helperText}
        </p>
      )}
    </div>
  );
}
