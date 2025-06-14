/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NEW BOLD PRIMARY COLORS - Enhanced for Indian aesthetics
        'primary-blush': '#D81B60',      // Rose Bloom - Rich, bold pink inspired by Indian roses
        'primary-lavender': '#7B1FA2',   // Amethyst Glow - Deep purple with jewel-like vibrancy
        'pure-white': '#FFFFFF',         // Pure White - Clean and airy backgrounds
        
        // NEW BOLD SUPPORTING COLORS
        'soft-gray': '#ECEFF1',          // Soft Pearl - Subtle for dividers, skeleton loaders
        'deep-charcoal': '#212121',      // Deep Onyx - High contrast text
        'golden-amber': '#FBC02D',       // Mango Burst - Vibrant yellow inspired by Indian mangoes
        
        // OPTIONAL DARK THEME COLORS (for future use)
        'dark-background': '#1C1C1C',
        'muted-pink': '#E7A8B6',
        'muted-lavender': '#C4A8E0',
        'light-gray-dark': '#D0D0D0',
        
        // Legacy colors (keeping for backward compatibility during transition)
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
          'from': { boxShadow: '0 0 20px rgba(216, 27, 96, 0.3)' },
          'to': { boxShadow: '0 0 30px rgba(216, 27, 96, 0.6)' },
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