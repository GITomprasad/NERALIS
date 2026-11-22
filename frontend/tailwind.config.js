/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deepPine: '#1B3022',
          deepPineHover: '#132218',
          sageLeaf: '#7C9082',
          sageLeafHover: '#6B7F71',
          warmAlabaster: '#F4F5F0',
          white: '#FFFFFF',
          forestCharcoal: '#29372D',
          paleSage: '#DCE4DB',
          mutedText: '#68766C',
          border: '#DFE5DD',
        },
        command: {
          bg: '#F4F5F0',
          sidebar: '#FFFFFF',
          card: '#FFFFFF',
          cardHover: '#DCE4DB',
          cardElevated: '#FFFFFF',
          border: '#DFE5DD',
          borderLight: '#E8EDE7',
          primary: '#1B3022',
          primaryHover: '#132218',
          secondary: '#7C9082',
          secondaryHover: '#6B7F71',
          success: '#7C9082',
          warning: '#D97706',
          critical: '#DC2626',
          text: '#29372D',
          textSecondary: '#68766C',
          textMuted: '#68766C'
        },
        goi: {
          navy: '#29372D',
          blue: '#1B3022',
          teal: '#7C9082',
          orange: '#D97706',
          red: '#DC2626',
          green: '#7C9082',
          white: '#FFFFFF',
          lightblue: '#DCE4DB',
          greytext: '#68766C',
          greyborder: '#DFE5DD',
          pagebg: '#F4F5F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        regional: ['Noto Sans', 'sans-serif'],
      },
      screens: {
        'xs': '375px',
      },
      spacing: {
        '240': '240px',
        '480': '480px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(41, 55, 45, 0.05), 0 1px 2px -1px rgba(41, 55, 45, 0.03)',
        'command-card': '0 1px 3px 0 rgba(41, 55, 45, 0.05), 0 1px 2px -1px rgba(41, 55, 45, 0.03)',
        'command-glow': '0 0 0 1px rgba(27, 48, 34, 0.18)',
        'command-blue': '0 0 0 1px rgba(124, 144, 130, 0.25)',
        'command-critical': '0 0 0 1px rgba(220, 38, 38, 0.25)',
      }
    },
  },
  plugins: [],
}
