/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#168653',
          dark: '#105B3D',
          light: '#E9F7EF'
        },
        forest: '#14532D',
        emerald: '#15803D',
        accent: '#22C55E'
      }
    }
  },
  plugins: []
};
