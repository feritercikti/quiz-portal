/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        loader: {
          '0%': { transform: 'rotate(0)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    }
  },
  plugins: [],
  important: true
};
