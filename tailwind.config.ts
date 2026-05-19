import type { Config } from "tailwindcss";
import { clientConfig } from "./client.config";

const presets = {
  "approachable-modern": {
    bg: "#FFFFFF",
    surface: "#F7F5F2",
    ink: "#1F2937",
    inkSoft: "#6B7280",
    accent: "#D97757",
    accent2: "#F4E5DC",
    line: "#E5E7EB",
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
              : "12px",
      },
    },
  },
  plugins: [],
} satisfies Config;
