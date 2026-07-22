/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ledger: {
          bg: "#EDF1EF",
          paper: "#F7F9F7",
          ink: "#12232E",
          inkSoft: "#33454F",
          line: "#D6DED9",
          brass: "#B98B2A",
          brassDark: "#8F6B1E",
          coral: "#C1524B",
          emerald: "#2F6F4E",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        card: "0 2px 20px rgba(18, 35, 46, 0.06)",
        cardHover: "0 8px 30px rgba(18, 35, 46, 0.10)",
      },
      backgroundImage: {
        "ledger-rule":
          "repeating-linear-gradient(to bottom, transparent, transparent 39px, #D6DED9 40px)",
      },
      keyframes: {
        slideInFade: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        stamp: {
          "0%": { opacity: "0", transform: "scale(1.4) rotate(-8deg)" },
          "60%": { opacity: "1", transform: "scale(0.95) rotate(-8deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-8deg)" },
        },
      },
      animation: {
        slideInFade: "slideInFade 0.5s ease-out both",
        stamp: "stamp 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
