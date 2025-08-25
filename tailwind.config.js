/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: { boxShadow:{ card:'0 1px 2px rgba(16,24,40,.06)' }, borderRadius:{ xl:'12px' } },
  },
  plugins: [],
}