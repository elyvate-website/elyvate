/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5bcfc',
          400: '#8098f9',
          500: '#6172f3',
          600: '#4A4DDE',
          700: '#3E3FB4',
          800: '#333490',
          900: '#2D2E72',
        },
        surface: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#ebebeb',
          300: '#d6d6d6',
        },
        ink: {
          primary:   '#111111',
          secondary: '#555555',
          muted:     '#999999',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        card:  '0 2px 12px 0 rgba(0,0,0,0.07)',
        hover: '0 8px 30px 0 rgba(0,0,0,0.12)',
        glow:  '0 0 40px 0 rgba(97,114,243,0.25)',
      },
    },
  },
  plugins: [],
}
