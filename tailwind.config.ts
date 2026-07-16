import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBg: "#FFCFC9",
        websiteBg: "#FFF8F6",
        heading: "#0F172A",
        paragraph: "#6B7280",
        cardBg: "#FFFFFF",
        border: "#F3E7E5",
        buttonBg: "#0F172A",
        buttonHover: "#1E293B",
      },
      boxShadow: {
        soft: "0 20px 45px -24px rgba(15, 23, 42, 0.2)",
      },
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
