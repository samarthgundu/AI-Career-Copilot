/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#060911',
        surface: 'rgba(15, 23, 42, 0.55)',
        surfaceHover: 'rgba(30, 41, 59, 0.7)',
        accentViolet: '#7C3AED',
        accentIndigo: '#6366F1',
        accentCyan: '#06B6D4',
        accentEmerald: '#10B981',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orb-float-1': 'orbFloat1 12s ease-in-out infinite',
        'orb-float-2': 'orbFloat2 15s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        orbFloat1: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(40px, -30px) scale(1.15)' },
        },
        orbFloat2: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(-50px, 40px) scale(0.9)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
