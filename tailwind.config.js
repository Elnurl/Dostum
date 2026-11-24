/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: '#FAF9F6',
        ink: '#1E293B',
        forest: '#2E6F40',
        amber: '#D97706',
        muted: '#64748B',
        line: '#E7E5E4',
        moss: '#E8F2EB',
        badge: '#EF4444',
      },
    },
  },
  plugins: [],
};
