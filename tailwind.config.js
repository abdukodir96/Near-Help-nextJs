/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#0f172a',
          teal: '#0f766e',
          mist: '#ecfeff',
          sand: '#fff7ed',
          ember: '#f97316',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.08)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(15, 118, 110, 0.16), transparent 36%), radial-gradient(circle at bottom right, rgba(249, 115, 22, 0.14), transparent 28%)',
      },
    },
  },
  plugins: [],
};
