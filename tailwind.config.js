/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Darker Primary Colors
        'primary-blush': '#E91E63',      // Much darker pink (Material Design Pink 500)
        'primary-lavender': '#9C27B0',   // Much darker purple (Material Design Purple 500)
        'pure-white': '#FFFFFF',
        
        // Supporting Colors
        'soft-gray': '#EDEDED',
        'deep-charcoal': '#333333',
        'golden-amber': '#F4A261',
        
        // Dark Theme Colors (for future use)
        'dark-background': '#1A1A1A',
        'muted-pink': '#E8A3B1',
        'muted-lavender': '#C19FD6',
        'light-gray-dark': '#CCCCCC',
        
        // Legacy colors (keeping for backward compatibility)
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        blush: {
          50: '#fef7f0',
          100: '#feeee0',
          200: '#fdd9c0',
          300: '#fbbf95',
          400: '#f8bbd9',
          500: '#f472b6',
          600: '#ec4899',
          700: '#db2777',
          800: '#be185d',
          900: '#9d174d',
        },
        lavender: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(233, 30, 99, 0.3)' },
          'to': { boxShadow: '0 0 30px rgba(233, 30, 99, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}