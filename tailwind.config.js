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
        forest: '#2D6A35',
        'forest-dark': '#245C2D',
        amber: '#E07B2D',
        muted: '#64748B',
        line: '#E7E5E4',
        moss: '#E3EDE6',
        badge: '#E07B2D',
        sheet: '#F4F4F8',
      },
    },
  },
  plugins: [],
};
