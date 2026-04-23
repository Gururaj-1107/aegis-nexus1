/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aegis: {
          bg: '#070A12',
          surface: 'rgba(17, 24, 39, 0.72)',
          indigo: { light: '#818CF8', DEFAULT: '#6366F1', dark: '#4F46E5' },
          cyan: '#22D3EE',
          warning: '#FFB800',
          critical: '#FF4444',
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
