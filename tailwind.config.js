/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coal: '#151718',
        ketchup: '#d6453d',
        cheese: '#d6a84f',
        ice: '#f4efe5',
        fire: '#c8643d',
        'burger-dark': '#0b0d0e',
        whatsapp: '#25D366',
        'surface-dark': '#1d2021',
        'surface-light': '#f8f3ea',
      },
      fontFamily: {
        sans: ['Onest', 'system-ui', 'sans-serif'],
        heading: ['Onest', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 30s linear infinite',
        'spin-slower': 'spin 40s linear infinite reverse',
        'bounce-soft': 'bounceSoft 3s ease-in-out infinite',
        'bounce-soft-delay': 'bounceSoft 3s ease-in-out 0.5s infinite',
      },
      keyframes: {
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
