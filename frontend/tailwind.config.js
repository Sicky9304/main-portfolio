import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        heading: ['Satoshi', 'General Sans', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
        },
        pink: {
          DEFAULT: '#F43F5E',      // Rose Pink
          light: '#FB7185',        // Light Rose
          dark: '#E11D48',         // Deep Rose
        },
        surface: {
          light: '#F8FAFC',
          dark: '#030712',         // Deep obsidian dark
        }
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'aurora-rotate': 'aurora-rotate 20s linear infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'gradient-shift': 'gradient-shift 4s ease infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'aurora-rotate': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [
    plugin(function({ addComponents, addUtilities }) {
      addComponents({
        /* Glassmorphism Components */
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.45)',
          'backdrop-filter': 'blur(20px) saturate(180%)',
          '-webkit-backdrop-filter': 'blur(20px) saturate(180%)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
          'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
        },
        '.dark .glass': {
          'background': 'rgba(3, 7, 18, 0.65)',
          'border': '1px solid rgba(255, 255, 255, 0.05)',
        },
        '.glass-subtle': {
          'background': 'rgba(255, 255, 255, 0.25)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 255, 255, 0.15)',
        },
        '.dark .glass-subtle': {
          'background': 'rgba(3, 7, 18, 0.45)',
          'border': '1px solid rgba(255, 255, 255, 0.03)',
        },

        /* Gradient Text Component */
        '.gradient-text': {
          'background': 'linear-gradient(135deg, #10B981, #06B6D4, #6366F1)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.gradient-text-warm': {
          'background': 'linear-gradient(135deg, #10B981, #F43F5E)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },

        /* Section Padding */
        '.section-padding': {
          'padding': '80px 0',
          '@media (max-width: 768px)': {
            'padding': '60px 0',
          }
        },

        /* Mock browser / layout elements */
        '.loading-bar': {
          'background': 'linear-gradient(90deg, #10B981, #06B6D4, #6366F1, #F43F5E, #10B981)',
          'background-size': '200% 100%',
          'animation': 'gradient-shift 2s ease infinite',
        },

        /* 3D Cards */
        '.tilt-card': {
          'transform-style': 'preserve-3d',
          'perspective': '1000px',
          'transition': 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            'transform': 'perspective(1000px) rotateX(2deg) rotateY(-2deg) translateZ(10px)',
          }
        },

        /* Glow effects */
        '.glow-primary': {
          'box-shadow': '0 0 40px rgba(16, 185, 129, 0.15), 0 0 80px rgba(16, 185, 129, 0.05)',
        },
        '.dark .glow-primary': {
          'box-shadow': '0 0 60px rgba(16, 185, 129, 0.2), 0 0 120px rgba(16, 185, 129, 0.08)',
        },
        '.glow-accent': {
          'box-shadow': '0 0 40px rgba(99, 102, 241, 0.15)',
        },

        /* Magnetic button overlay helper */
        '.magnetic-btn': {
          'position': 'relative',
          'overflow': 'hidden',
          'transition': 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': {
            'content': '""',
            'position': 'absolute',
            'inset': '0',
            'background': 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent)',
            'opacity': '0',
            'transition': 'opacity 0.3s',
          },
          '&:hover::before': {
            'opacity': '1',
          }
        },

        /* Rotating Ring for Profile Picture */
        '.rotating-ring': {
          'position': 'relative',
          '&::before': {
            'content': '""',
            'position': 'absolute',
            'inset': '-4px',
            'border-radius': '50%',
            'background': 'conic-gradient(from 0deg, #10B981, #06B6D4, #6366F1, #F43F5E, #10B981)',
            'animation': 'spin-slow 8s linear infinite',
            'z-index': '-1',
          },
          '&::after': {
            'content': '""',
            'position': 'absolute',
            'inset': '0',
            'border-radius': '50%',
            'background': '#F8FAFC',
            'z-index': '-1',
          }
        },
        '.dark .rotating-ring::after': {
          'background': '#030712',
        },

        /* Aurora background animation element */
        '.aurora': {
          'position': 'relative',
          'overflow': 'hidden',
          '&::before': {
            'content': '""',
            'position': 'absolute',
            'width': '150%',
            'height': '150%',
            'top': '-25%',
            'left': '-25%',
            'background': 'conic-gradient(from 180deg at 50% 50%, rgba(16, 185, 129, 0.08) 0deg, rgba(6, 182, 212, 0.06) 120deg, rgba(244, 63, 94, 0.05) 240deg, rgba(16, 185, 129, 0.08) 360deg)',
            'animation': 'aurora-rotate 20s linear infinite',
            'pointer-events': 'none',
            'z-index': '0',
          }
        },
        '.dark .aurora::before': {
          'background': 'conic-gradient(from 180deg at 50% 50%, rgba(16, 185, 129, 0.15) 0deg, rgba(6, 182, 212, 0.12) 120deg, rgba(244, 63, 94, 0.1) 240deg, rgba(16, 185, 129, 0.15) 360deg)',
        },

        /* Grid Backgrounds */
        '.grid-bg': {
          'background-image': 'linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px)',
          'background-size': '60px 60px',
        },
        '.dark .grid-bg': {
          'background-image': 'linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)',
        },

        /* Blobs */
        '.blob': {
          'border-radius': '50%',
          'filter': 'blur(80px)',
          'pointer-events': 'none',
          'position': 'absolute',
          'z-index': '0',
        },
        '.blob-primary': {
          'background': 'radial-gradient(circle, rgba(16, 185, 129, 0.25), transparent 70%)',
          'animation': 'float 12s ease-in-out infinite',
        },
        '.blob-accent': {
          'background': 'radial-gradient(circle, rgba(6, 182, 212, 0.2), transparent 70%)',
          'animation': 'float 15s ease-in-out infinite reverse',
        },
        '.blob-pink': {
          'background': 'radial-gradient(circle, rgba(244, 63, 94, 0.15), transparent 70%)',
          'animation': 'float 18s ease-in-out infinite',
        },

        /* Noise Texture */
        '.noise-overlay': {
          '&::after': {
            'content': '""',
            'position': 'fixed',
            'inset': '0',
            'z-index': '9999',
            'pointer-events': 'none',
            'opacity': '0.02',
            'background-image': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
            'background-repeat': 'repeat',
            'background-size': '256px 256px',
          }
        }
      });

      addUtilities({
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            'display': 'none',
          }
        }
      });
    })
  ],
}
