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
        bg: "#0A0804",
        "accent-electric": "#F0A830",
        "accent-blue": "#3B82F6",
        "accent-purple": "#8B5CF6",
        text: "#F5F0E6",
      },
      fontFamily: {
        corp: ["PP Neue Corp Wide", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
