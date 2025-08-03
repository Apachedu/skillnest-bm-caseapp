/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: {
          DEFAULT: '#1E3A8A',
          dark: '#1E40AF'
        },
        brandGray: '#4B5563',
        'brandGray-light': '#9CA3AF',
        'brandGray-dark': '#1F2937'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
