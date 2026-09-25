/** @type {import('tailwindcss').Config} */
export default {
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
          light: '#F0FDF4',
          border: '#BBF7D0',
        },
        surface: '#FFFFFF',
        'page-bg': '#F9FAFB',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',
        'user-bubble': '#16A34A',
        'bot-bubble': '#FFFFFF',
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
    },
  },
  plugins: [],
}