import type { Config } from "tailwindcss";

/** Colour tokens are CSS variables (see globals.css) so light and dark share one set of classes. */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: token("bg"),
        foreground: token("fg"),
        surface: token("surface"),
        "surface-2": token("surface-2"),
        line: token("line"),
        "line-strong": token("line-strong"),
        muted: token("muted"),
        faint: token("faint"),
        accent: token("accent"),
        "accent-fg": token("accent-fg"),
        "accent-soft": token("accent-soft"),
        "accent-inv": token("accent-inv"),
        "accent-strong": token("accent-strong"),
        mark: token("mark"),
        inverse: token("inverse"),
        "inverse-fg": token("inverse-fg"),
        positive: token("positive"),
        warning: token("warning"),
        danger: token("danger"),

        // Names used by the older tool pages, mapped onto the same tokens
        border: token("line"),
        "surface-warm": token("surface-2"),
        "surface-dark": token("inverse"),
        paper: token("bg"),
        ink: token("fg"),
        acid: token("accent-soft"),

        // Instrument-display colours (diagrams and simulated detector screens)
        "surface-terminal": "#0B0E14",
        "beam-cyan": "#38BDF8",
        "beam-blue": "#0284C7",
        "phosphor-green": "#10B981",
        "hazard-amber": "#D97706",
        "lab-orange": "#C2410C",
        "accent-purple": "#7C3AED",
      },
      boxShadow: {
        panel: "0 1px 2px rgb(0 0 0 / 0.04), 0 4px 16px rgb(0 0 0 / 0.06)",
        // The older pages used hard offset shadows; they are flattened here.
        "hard-xs": "none",
        "hard-sm": "none",
        hard: "none",
        "hard-md": "none",
        "hard-lg": "0 1px 2px rgb(0 0 0 / 0.04), 0 4px 16px rgb(0 0 0 / 0.06)",
        "hard-acid": "none",
        "hard-acid-lg": "none",
        "neo-xs": "none",
        neo: "none",
        "neo-md": "none",
        "neo-lg": "none",
        "neo-xl": "none",
        "neo-amber": "none",
        "neo-cyan": "none",
        "neo-green": "none",
        "neo-orange": "none",
        "neo-inset": "none",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        serif: ["'Source Serif 4'", "Georgia", "'Times New Roman'", "serif"],
        mono: ["'JetBrains Mono'", "Menlo", "Consolas", "monospace"],
        display: ["Inter", "-apple-system", "'Segoe UI'", "sans-serif"],
        grotesk: ["Inter", "-apple-system", "'Segoe UI'", "sans-serif"],
      },
      keyframes: {
        "beam-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "scaleY(0.98)" },
          "50%": { opacity: "1", transform: "scaleY(1)" },
        },
      },
      animation: {
        "beam-pulse": "beam-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
