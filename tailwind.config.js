/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        brand: {
          teal: '#0d9488',
          cyan: '#06b6d4',
          amber: '#f59e0b',
          rose: '#f43f5e',
          indigo: '#6366f1',
          sunset: '#ff6b6b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glow': '0 0 25px rgba(22, 163, 74, 0.25)',
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.25)',
      }
    },
  },
  plugins: [],
}
