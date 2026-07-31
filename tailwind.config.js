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
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        finora: {
          bg: '#f8fafd',
          card: '#ffffff',
          textPrimary: '#0f172a',
          textSecondary: '#64748b',
          success: '#10b981',
          danger: '#f43f5e',
          warning: '#f59e0b',
          info: '#3b82f6',
          purple: '#a855f7',
          orange: '#f97316',
          emerald: '#10b981',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 30px rgba(0, 0, 0, 0.06)',
        'nav': '0 -4px 20px rgba(0, 0, 0, 0.03)',
        'sidebar': '4px 0 20px rgba(0, 0, 0, 0.03)',
        'fab': '0 10px 20px rgba(37, 99, 235, 0.25)'
      }
    },
  },
  plugins: [],
}
