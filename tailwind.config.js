/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F5FF',
          100: '#E3ECFF',
          200: '#C7D9FE',
          300: '#9BBBFD',
          400: '#6495FA',
          500: '#3A70F4',
          600: '#2A5FD9',
          700: '#1D4FB0',
          800: '#143C88',
          900: '#0F2657',
        },
        ink: {
          DEFAULT: '#1E2A44',
          soft: '#64748B',
          muted: '#94A3B8',
        },
        surface: {
          bg: '#EEF2FA',
          card: '#FFFFFF',
          border: '#E4E9F5',
        },
        kbc: {
          teal: '#0D9488',
          'teal-soft': '#E1F3F1',
          gold: '#D9860A',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
