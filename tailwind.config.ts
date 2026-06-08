import type { Config } from "tailwindcss";



const config: Config = {

  darkMode: "class",

  content: [

    "./pages/**/*.{js,ts,jsx,tsx,mdx}",

    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    "./app/**/*.{js,ts,jsx,tsx,mdx}",

  ],

  theme: {

    extend: {

      colors: {

        "deep-noir": "#1A1B23",

        surface: "rgb(var(--surface) / <alpha-value>)",

        elevated: "rgb(var(--elevated) / <alpha-value>)",

        carbon: "rgb(var(--carbon) / <alpha-value>)",

        parchment: "rgb(var(--foreground) / <alpha-value>)",

        smoke: "rgb(var(--smoke) / <alpha-value>)",

        "gold-oud": "#D8B34B",

      },

      fontFamily: {

        sans: ['"Courier New"', "Courier", "monospace"],

        poppins: ["var(--font-poppins)", "sans-serif"],

        lora: ["var(--font-lora)", "serif"],

      },

      animation: {

        "fade-in": "fade-in 0.6s ease-out forwards",

        "slide-up": "slide-up 0.8s ease-out forwards",

      },

      keyframes: {

        "fade-in": {

          "0%": { opacity: "0" },

          "100%": { opacity: "1" },

        },

        "slide-up": {

          "0%": { opacity: "0", transform: "translateY(20px)" },

          "100%": { opacity: "1", transform: "translateY(0)" },

        },

      },

    },

  },

  plugins: [],

};

export default config;


