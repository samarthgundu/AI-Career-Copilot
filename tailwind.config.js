/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        visionGlass: 'rgba(255, 255, 255, 0.16)',
        visionGlassDark: 'rgba(20, 25, 35, 0.45)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
