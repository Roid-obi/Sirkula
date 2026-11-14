/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace']
      },
      colors: {
        primary: {
          DEFAULT: '#16A34A',
          hover: '#15803D',
          soft: '#F0FDF4',
          dark: '#14532D'
        }
      }
    }
  },
  plugins: []
};
