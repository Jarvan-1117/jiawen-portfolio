import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111318",
        muted: "#6b7280",
        accent: {
          DEFAULT: "#0f8b8d",
          dark: "#0b6f71",
          soft: "#dff5f4"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.10)",
        glow: "0 20px 60px rgba(15, 139, 141, 0.16)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
