"use client";
import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background-rgb))",
        surface: "rgb(var(--surface-rgb))",
        primary: "rgb(var(--primary-rgb))",
        secondary: "rgb(var(--secondary-rgb))",
        tertiary: "rgb(var(--tertiary-rgb))",
        text: "rgb(var(--text-rgb))",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
