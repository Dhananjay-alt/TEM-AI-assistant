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
        // Acid Neo-Brutalist Palette
        paper: "#F8F4E8",
        ink: "#09090B",
        acid: "#D2E823",

        // Existing TEM-AI tokens maintained for compatibility
        background: "#F8F4E8",
        foreground: "#09090B",
        surface: "#FFFFFF",
        "surface-warm": "#F4EFE6",
        "surface-dark": "#09090B",
        "surface-terminal": "#0B0E14",
        border: "#09090B",
        "beam-cyan": "#00D2FF",
        "beam-blue": "#0284C7",
        "phosphor-green": "#10B981",
        "hazard-amber": "#F59E0B",
        "lab-orange": "#FF5722",
        "accent-purple": "#8B5CF6",
      },
      boxShadow: {
        // Strict Hard Shadows (0 blur)
        "hard-xs": "1.5px 1.5px 0px 0px #09090B",
        "hard-sm": "2px 2px 0px 0px #09090B",
        hard: "4px 4px 0px 0px #09090B",
        "hard-md": "6px 6px 0px 0px #09090B",
        "hard-lg": "8px 8px 0px 0px #09090B",
        "hard-acid": "4px 4px 0px 0px #D2E823",
        "hard-acid-lg": "8px 8px 0px 0px #D2E823",

        // Compatibility shadows
        "neo-xs": "1.5px 1.5px 0px #09090B",
        neo: "3px 3px 0px #09090B",
        "neo-md": "4px 4px 0px #09090B",
        "neo-lg": "6px 6px 0px #09090B",
        "neo-xl": "8px 8px 0px #09090B",
        "neo-amber": "4px 4px 0px #F59E0B",
        "neo-cyan": "4px 4px 0px #0284C7",
        "neo-green": "4px 4px 0px #10B981",
        "neo-orange": "4px 4px 0px #FF5722",
        "neo-inset": "inset 2px 2px 0px rgba(0,0,0,0.15)",
      },
      fontFamily: {
        display: [
          "'Dela Gothic One'",
          "Outfit",
          "sans-serif",
        ],
        grotesk: [
          "'Space Grotesk'",
          "Inter",
          "sans-serif",
        ],
        sans: [
          "'Space Grotesk'",
          "Outfit",
          "Inter",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Space Mono",
          "Menlo",
          "monospace",
        ],
      },
      borderWidth: {
        2: "2px",
        3: "3px",
        4: "4px",
      },
      keyframes: {
        glitch: {
          "0%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0, 0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "float-card": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "beam-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scaleY(0.98)" },
          "50%": { opacity: "1", transform: "scaleY(1)" },
        },
      },
      animation: {
        glitch: "glitch 0.3s infinite",
        marquee: "marquee 20s linear infinite",
        float: "float-card 3.5s ease-in-out infinite",
        "beam-pulse": "beam-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
