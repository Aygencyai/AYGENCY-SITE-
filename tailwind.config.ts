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
        void: {
          DEFAULT: '#0A0A0F',
          light: '#111118',
        },
        surface: {
          DEFAULT: '#16161F',
          light: '#1E1E2A',
        },
        cyan: {
          DEFAULT: '#00E5FF',
          muted: '#00B8CC',
          dim: '#006B7A',
        },
        ghost: {
          DEFAULT: '#EAEAF0',
          muted: '#9B9BAE',
          dim: '#5C5C72',
        },
        white: '#F8F8FC',
        error: '#FF4D6A',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(0,229,255,0.08)',
        nav: '0 1px 2px rgba(0,0,0,0.5)',
        'glow-sm': '0 0 40px rgba(0,229,255,0.1)',
        'glow-md': '0 0 80px rgba(0,229,255,0.15)',
        'glow-lg': '0 0 120px rgba(0,229,255,0.2)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;
