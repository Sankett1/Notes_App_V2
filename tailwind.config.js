/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', 'ui-sans-serif', 'system-ui'],
        display: ['Bricolage Grotesque', 'ui-sans-serif'],
        mono:    ['DM Mono', 'ui-monospace'],
      },
      colors: {
        primary: {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe',
          300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6',
          600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95',
        },
        accent: {
          50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc',
          300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4',
          600: '#0891b2', 700: '#0e7490',
        },
        danger: {
          400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
