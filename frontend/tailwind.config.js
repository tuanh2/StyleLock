/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#07070C',
        surface: '#0E0C1B',
        surfaceCard: '#131027',
        borderDark: '#261F42',
        genPurple: {
          400: '#C084FC',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          glow: '#A855F7'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
