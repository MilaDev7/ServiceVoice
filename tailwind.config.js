/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',  
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
            colors: {
        primary: {
          DEFAULT: '#16A34A',
          dark: '#15803D',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
          border: '#BBF7D0',
        },
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'page-bg': 'rgb(var(--color-page-bg) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'user-bubble': 'rgb(var(--color-user-bubble) / <alpha-value>)',
        'bot-bubble': 'rgb(var(--color-bot-bubble) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        amharic: ['"Noto Sans Ethiopic"', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        pill: '24px',
        btn: '8px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.1)',
        message: '0 1px 2px rgba(0, 0, 0, 0.05)',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1.5)' },
        },
      },
      animation: {
        wave: 'wave 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}