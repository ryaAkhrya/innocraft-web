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
        primaryBg: "#FF7F73", // Coral
        websiteBg: "#FFF7F2", // Warm Cream
        websiteBgEnd: "#FFF2EC", // Soft Background
        
        // V4 Modern Playful Color-Block Palette
        peach: "#FFB4A9",
        coral: "#FF7F73",
        
        freshGreen: "#8BCB88",
        softGreen: "#DDF3DA",
        
        skyBlue: "#7FB8F5",
        softBlue: "#E3F0FF",
        
        lavender: "#B9A7F2",
        softLavender: "#EEE7FF",
        
        softYellow: "#FFD66B",
        paleYellow: "#FFF0B8",
        
        heading: "#101B35", // Dark Navy
        paragraph: "#475569", 
        cardBg: "#FFFFFF",
        border: "rgba(16, 27, 53, 0.08)",
        buttonBg: "#101B35",
        buttonHover: "#1E293B",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(16, 27, 53, 0.06)", // Gentle depth
        "soft-lg": "0 16px 32px rgba(16, 27, 53, 0.08)",
        "soft-sm": "0 4px 12px rgba(16, 27, 53, 0.04)",
        "color-peach": "0 8px 24px rgba(255, 180, 169, 0.3)",
        "color-blue": "0 8px 24px rgba(127, 184, 245, 0.3)",
        "color-green": "0 8px 24px rgba(139, 203, 136, 0.3)",
        "hero-card": "0 20px 40px -10px rgba(16, 27, 53, 0.1), 0 0 0 1px rgba(255, 127, 115, 0.2)",
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
      backgroundImage: {
        "grid-subtle":
          "linear-gradient(rgba(255, 207, 201, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 207, 201, 0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "64px 64px",
      },
      keyframes: {
        "float-block": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(2deg)" },
        },
        "float-block-delayed": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(-2deg)" },
        },
        "float-block-large": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg) scale(1)" },
          "33%": { transform: "translateY(-8px) rotate(1deg) scale(1.02)" },
          "66%": { transform: "translateY(-4px) rotate(-1deg) scale(0.98)" },
        },
        "float-cube": {
          "0%, 100%": { transform: "translateY(0px) rotateX(0deg) rotateY(0deg)" },
          "25%": { transform: "translateY(-6px) rotateX(2deg) rotateY(4deg)" },
          "50%": { transform: "translateY(-12px) rotateX(0deg) rotateY(8deg)" },
          "75%": { transform: "translateY(-4px) rotateX(-2deg) rotateY(4deg)" },
        },
        "float-cube-delayed": {
          "0%, 100%": { transform: "translateY(0px) rotateX(0deg) rotateY(0deg)" },
          "25%": { transform: "translateY(-4px) rotateX(-3deg) rotateY(-4deg)" },
          "50%": { transform: "translateY(-8px) rotateX(0deg) rotateY(-8deg)" },
          "75%": { transform: "translateY(-2px) rotateX(3deg) rotateY(-4deg)" },
        },
        "pixel-glow": {
          "0%, 100%": { opacity: "0.08" },
          "50%": { opacity: "0.2" },
        },
        "pixel-glow-delayed": {
          "0%, 100%": { opacity: "0.1" },
          "50%": { opacity: "0.22" },
        },
        "pixel-glow-large": {
          "0%, 100%": { opacity: "0.06" },
          "50%": { opacity: "0.15" },
        },
        "breath-bg": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "sparkle": {
          "0%, 100%": { opacity: "0", transform: "scale(0)" },
          "50%": { opacity: "0.15", transform: "scale(1)" },
        },
        "terrain-drift": {
          "0%, 100%": { transform: "translateX(0px) translateY(0px)" },
          "50%": { transform: "translateX(8px) translateY(-4px)" },
        },
        "terrain-drift-delayed": {
          "0%, 100%": { transform: "translateX(0px) translateY(0px)" },
          "50%": { transform: "translateX(-6px) translateY(3px)" },
        },
        "hero-glow": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(1.04)" },
        },
        "hero-ambient": {
          "0%, 100%": { opacity: "0.12", transform: "translate(0px, 0px)" },
          "33%": { opacity: "0.18", transform: "translate(8px, -8px)" },
          "66%": { opacity: "0.15", transform: "translate(-4px, 4px)" },
        },
        "cube-rotate": {
          "0%, 100%": { transform: "rotateY(0deg) rotateX(0deg)" },
          "50%": { transform: "rotateY(10deg) rotateX(5deg)" },
        },
        "depth-pulse": {
          "0%, 100%": { opacity: "0.04" },
          "50%": { opacity: "0.1" },
        },
      },
      animation: {
        "float-block": "float-block 8s ease-in-out infinite",
        "float-block-delayed": "float-block-delayed 10s ease-in-out infinite",
        "float-block-large": "float-block-large 12s ease-in-out infinite",
        "float-cube": "float-cube 14s ease-in-out infinite",
        "float-cube-delayed": "float-cube-delayed 16s ease-in-out infinite",
        "pixel-glow": "pixel-glow 6s ease-in-out infinite",
        "pixel-glow-delayed": "pixel-glow-delayed 8s ease-in-out infinite",
        "pixel-glow-large": "pixel-glow-large 10s ease-in-out infinite",
        "breath-bg": "breath-bg 18s ease-in-out infinite",
        "sparkle": "sparkle 4s ease-in-out infinite",
        "terrain-drift": "terrain-drift 15s ease-in-out infinite",
        "terrain-drift-delayed": "terrain-drift-delayed 18s ease-in-out infinite",
        "hero-glow": "hero-glow 6s ease-in-out infinite",
        "hero-ambient": "hero-ambient 10s ease-in-out infinite",
        "cube-rotate": "cube-rotate 20s ease-in-out infinite",
        "depth-pulse": "depth-pulse 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;