import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { encre: "#101B3B", surligneur: "#FFD60A", papier: "#F4F6FA", filet: "#CBD2E0" },
      fontFamily: { titre: ["var(--font-titre)"], texte: ["var(--font-texte)"] },
    },
  },
  plugins: [],
};
export default config;
