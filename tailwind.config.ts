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
        burgundy: {
          DEFAULT: "#8C1538",
          hover: "#72102D",
          dark: "#540B20",
          light: "#A81E46",
          muted: "#8C153818",
          subtle: "#FAF0F2",
        },
        flame: {
          DEFAULT: "#FF6B3D",
          hover: "#E85628",
          dark: "#CC4418",
          light: "#FF8760",
          muted: "#FF6B3D1A",
          subtle: "#FFF3EE",
        },
        softpink: {
          DEFAULT: "#FFB8C8",
          light: "#FFE3EA",
          hover: "#FFA0B5",
          subtle: "#FFF5F7",
        },
        cream: {
          DEFAULT: "#FFF7F0",
          50: "#FFFCF9",
          100: "#FFF7F0",
          200: "#F7ECE2",
          300: "#EEDCCA",
          400: "#DFC7AF",
        },
        charcoal: {
          DEFAULT: "#211A19",
          50: "#362C2B",
          100: "#2B2221",
          200: "#211A19",
          300: "#1A1413",
          400: "#120E0D",
          border: "#3D3231",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(33, 26, 25, 0.08)",
        card: "0 20px 40px -15px rgba(33, 26, 25, 0.12)",
        glow: "0 0 35px -5px rgba(255, 107, 61, 0.35)",
        burgundyGlow: "0 0 40px -8px rgba(140, 21, 56, 0.4)",
      },
      backgroundImage: {
        "radial-flame": "radial-gradient(circle at 50% 30%, rgba(255, 107, 61, 0.15) 0%, transparent 70%)",
        "radial-burgundy": "radial-gradient(circle at 50% 50%, rgba(140, 21, 56, 0.18) 0%, transparent 65%)",
      },
    },
  },
  plugins: [],
};

export default config;

