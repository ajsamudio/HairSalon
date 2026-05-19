import type { Config } from "tailwindcss";
import { clientConfig } from "./client.config";

const presets = {
  "approachable-modern": {
    bg: "#FFF8F6",
    surface: "#FCEEF1",
    ink: "#4A2E3B",
    inkSoft: "#9C7989",
    accent: "#E8A4B8",
    accent2: "#F6D6E0",
    line: "#F3DDE4",
  },
  "editorial-luxe": {
    bg: "#FAFAF7",
    surface: "#FFFFFF",
    ink: "#1A1A1A",
    inkSoft: "#4A4A4A",
    accent: "#8B6F47",
    accent2: "#C9A961",
    line: "#E8E4DC",
  },
  "edgy-studio": {
    bg: "#0F0F0F",
    surface: "#1A1A1A",
    ink: "#F5F5F5",
    inkSoft: "#A0A0A0",
    accent: "#FF4E2C",
    accent2: "#2A2A2A",
    line: "#2A2A2A",
  },
} as const;

const palette = presets[clientConfig.brand.preset];

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: clientConfig.brand.preset === "approachable-modern"
          ? palette.bg
          : palette.bg,
        surface: palette.surface,
        ink: palette.ink,
        "ink-soft": palette.inkSoft,
        accent: clientConfig.brand.primaryColor || palette.accent,
        "accent-2": clientConfig.brand.accentColor || palette.accent2,
        line: palette.line,
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        brand:
          clientConfig.brand.preset === "editorial-luxe"
            ? "2px"
            : clientConfig.brand.preset === "edgy-studio"
              ? "0px"
              : "20px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.8s ease-out both",
        "fade-up": "fade-up 0.9s ease-out both",
        "fade-down": "fade-down 0.7s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
