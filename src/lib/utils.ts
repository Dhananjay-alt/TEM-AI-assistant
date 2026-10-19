import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format scientific notation cleanly
 * e.g., 0.0025079 -> "0.00251 nm" or "2.51 pm"
 */
export function formatWavelength(lambdaInMeters: number): {
  pm: string;
  nm: string;
  angstrom: string;
} {
  const pm = (lambdaInMeters * 1e12).toFixed(3);
  const nm = (lambdaInMeters * 1e9).toFixed(5);
  const angstrom = (lambdaInMeters * 1e10).toFixed(4);
  return { pm, nm, angstrom };
}

export function formatVoltage(kv: number): string {
  return `${kv} kV`;
}
