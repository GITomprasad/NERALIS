/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        goi: {
          navy: '#1E3A5F',
          blue: '#2563A8',
          teal: '#0F6B6B',
          orange: '#B85C00',
          red: '#9B1B1B',
          green: '#1A6B3A',
          white: '#FFFFFF',
          lightblue: '#EBF3FB',
          greytext: '#374151',
          greyborder: '#D1D5DB',
          pagebg: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        regional: ['Noto Sans', 'sans-serif'],
      },
      spacing: {
        '64': '64px',
        '240': '240px',
        '480': '480px',
      }
    },
  },
  plugins: [],
}
