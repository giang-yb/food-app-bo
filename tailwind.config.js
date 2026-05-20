/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3b82f6', hover: '#2563eb', light: '#dbeafe' },
        secondary: { DEFAULT: '#64748b', hover: '#475569' },
        success: { DEFAULT: '#22c55e', light: '#dcfce7' },
        warning: { DEFAULT: '#f59e0b', light: '#fef3c7' },
        danger: { DEFAULT: '#ef4444', light: '#fee2e2' },
        info: { DEFAULT: '#06b6d4', light: '#cffafe' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
};