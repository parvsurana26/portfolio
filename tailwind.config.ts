import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      colors: {
        ink: "#050505",
        bone: "#f5f5f5",
      },
      letterSpacing: {
        wideplus: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
