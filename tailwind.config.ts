import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Xandeum brand colors - deep purple/indigo with teal accents
        xandeum: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e5fe',
          300: '#7cd3fd',
          400: '#36bffa',
          500: '#0ca5eb',
          600: '#0085c9',
          700: '#016aa3',
          800: '#065986',
          900: '#0b4a6f',
          950: '#072f4a',
        },
        midnight: {
          50: '#f6f6f9',
          100: '#ececf2',
          200: '#d5d5e3',
          300: '#b0b0cb',
          400: '#8585ad',
          500: '#656593',
          600: '#50507a',
          700: '#424263',
          800: '#393953',
          900: '#191927',
          950: '#0d0d15',
        },
        aurora: {
          50: '#f0fdf6',
          100: '#dcfce9',
          200: '#bbf7d5',
          300: '#86efb4',
          400: '#4ade8a',
          500: '#22c566',
          600: '#16a350',
          700: '#158041',
          800: '#166537',
          900: '#14532f',
          950: '#052e18',
        },
        ember: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #0d0d15 0%, #191927 25%, #0b4a6f 50%, #072f4a 75%, #0d0d15 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(12, 165, 235, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(12, 165, 235, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config

