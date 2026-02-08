/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        agro: {
          primary: '#10b981',
          secondary: '#3b82f6',
          accent: '#f59e0b',
          bg: '#020403'
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 45s linear infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'boot-progress': 'boot-progress 2s ease-in-out forwards',
        'scan': 'scan 3s linear infinite',
        'spin-slow': 'spin 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        glow: {
          '0%': { 'box-shadow': '0 0 5px rgba(16, 185, 129, 0.2)' },
          '100%': { 'box-shadow': '0 0 20px rgba(16, 185, 129, 0.6)' },
        },
        'boot-progress': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        scan: {
          '0%': { top: '-10px' },
          '100%': { top: '100%' }
        }
      }
    },
  },
  plugins: [],
}
