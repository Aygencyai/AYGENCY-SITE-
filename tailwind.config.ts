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
        ivory: '#F5F1EB',
        'ivory-dark': '#EBE5DB',
        green: {
          DEFAULT: '#1B3A2D',
          light: '#2D5E45',
          muted: '#4A7A62',
        },
        navy: '#1A2744',
        blue: {
          DEFAULT: '#5BA4C9',
          light: '#8DC4DE',
        },
        'near-black': '#141C15',
        white: '#FAFAF8',
        muted: '#8A8A80',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        card: "0 2px 8px rgba(26,26,26,0.04), 0 1px 2px rgba(26,26,26,0.06)",
        "card-hover":
          "0 12px 30px rgba(26,26,26,0.08), 0 4px 10px rgba(26,26,26,0.04)",
        nav: "0 1px 3px rgba(26,26,26,0.05)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
