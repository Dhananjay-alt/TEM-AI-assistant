import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FBF9F5",
        foreground: "#0F172A",
        surface: "#FFFFFF",
        "surface-warm": "#F4EFE6",
        "surface-dark": "#121417",
        "surface-terminal": "#0B0E14",
        border: "#0F172A",
        "beam-cyan": "#00D2FF",
        "beam-blue": "#0284C7",
        "phosphor-green": "#10B981",
        "hazard-amber": "#F59E0B",
        "lab-orange": "#FF5722",
        "accent-purple": "#8B5CF6",
      },
      boxShadow: {
        "neo-xs": "1.5px 1.5px 0px #0F172A",
        neo: "3px 3px 0px #0F172A",
        "neo-md": "4px 4px 0px #0F172A",
        "neo-lg": "6px 6px 0px #0F172A",
        "neo-xl": "8px 8px 0px #0F172A",
        "neo-amber": "4px 4px 0px #F59E0B",
        "neo-cyan": "4px 4px 0px #0284C7",
        "neo-green": "4px 4px 0px #10B981",
        "neo-orange": "4px 4px 0px #FF5722",
        "neo-inset": "inset 2px 2px 0px rgba(0,0,0,0.15)",
      },
      fontFamily: {
        sans: [
          "Outfit",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Space Mono",
          "Menlo",
          "Consolas",
          "Courier New",
          "monospace",
        ],
      },
      borderWidth: {
        3: "3px",
      },
      keyframes: {
        "beam-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scaleY(0.98)" },
          "50%": { opacity: "1", transform: "scaleY(1)" },
        },
        "diffraction-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "beam-pulse": "beam-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "diffraction-spin": "diffraction-spin 40s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
