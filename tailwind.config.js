/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slower': 'ping 5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'shimmer-slow': 'shimmer 4s linear infinite',
        'grid-move': 'grid-move 20s linear infinite',
        'scan-vertical': 'scan-vertical 2s ease-in-out',
        'tech-glow': 'tech-glow 3s ease-in-out infinite',
        'circuit-pulse': 'circuit-pulse 4s ease-in-out infinite',
        'data-flow': 'data-flow 8s linear infinite',
        'hologram': 'hologram 6s ease-in-out infinite',
        'matrix-rain': 'matrix-rain 10s linear infinite',
        'energy-pulse': 'energy-pulse 3s ease-in-out infinite',
        'cyber-border': 'cyber-border 4s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 4s ease-in-out infinite',
        'scanline': 'scanline 1.5s linear infinite',
        'cyber-pulse': 'cyber-pulse 2s ease-in-out infinite',
        'price-glow': 'price-glow 2s ease-in-out infinite',
        'discount-bounce': 'discount-bounce 1s ease-in-out infinite',
        'sparkle-trail': 'sparkle-trail 2s linear infinite',
        'data-stream': 'data-stream 1.5s linear infinite',
        'holographic': 'holographic 3s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        pulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '.8',
          },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        shimmer: {
          'from': { transform: 'translateX(-100%)' },
          'to': { transform: 'translateX(100%)' },
        },
        'grid-move': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
        'scan-vertical': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(calc(100vh + 100%))' },
        },
        'tech-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(255, 239, 0, 0.2), 0 0 10px rgba(255, 239, 0, 0.1)',
          },
          '50%': { 
            boxShadow: '0 0 15px rgba(255, 239, 0, 0.4), 0 0 25px rgba(255, 239, 0, 0.2)',
          },
        },
        'circuit-pulse': {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.3' },
        },
        'data-flow': {
          '0%': { transform: 'translateX(-100%) translateY(0)' },
          '50%': { transform: 'translateX(50vw) translateY(-10px)' },
          '100%': { transform: 'translateX(100vw) translateY(0)' },
        },
        hologram: {
          '0%, 100%': { 
            transform: 'scale(1) rotateY(0deg)',
            opacity: '0.8',
          },
          '50%': { 
            transform: 'scale(1.02) rotateY(2deg)',
            opacity: '1',
          },
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100vh)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        'energy-pulse': {
          '0%': { 
            backgroundPosition: '0% 50%',
            filter: 'brightness(1)',
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            filter: 'brightness(1.2)',
          },
          '100%': { 
            backgroundPosition: '0% 50%',
            filter: 'brightness(1)',
          },
        },
        'cyber-border': {
          '0%': { 
            borderImageSource: 'linear-gradient(45deg, rgba(255, 239, 0, 0.1), rgba(255, 239, 0, 0.8), rgba(255, 239, 0, 0.1))',
          },
          '50%': { 
            borderImageSource: 'linear-gradient(45deg, rgba(255, 239, 0, 0.8), rgba(255, 239, 0, 0.1), rgba(255, 239, 0, 0.8))',
          },
          '100%': { 
            borderImageSource: 'linear-gradient(45deg, rgba(255, 239, 0, 0.1), rgba(255, 239, 0, 0.8), rgba(255, 239, 0, 0.1))',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px 2px rgba(255, 239, 0, 0.2)' },
          '50%': { boxShadow: '0 0 15px 5px rgba(255, 239, 0, 0.4)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'cyber-pulse': {
          '0%, 100%': { 
            opacity: '0.3',
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: '1',
            transform: 'scale(1.05)',
          },
        },
        'price-glow': {
          '0%, 100%': { 
            textShadow: '0 0 5px rgba(34, 197, 94, 0.3)',
          },
          '50%': { 
            textShadow: '0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6)',
          },
        },
        'discount-bounce': {
          '0%, 100%': { 
            transform: 'scale(1) rotate(0deg)',
          },
          '25%': { 
            transform: 'scale(1.05) rotate(1deg)',
          },
          '75%': { 
            transform: 'scale(1.05) rotate(-1deg)',
          },
        },
        'sparkle-trail': {
          '0%': { 
            transform: 'translateX(-100%) rotate(0deg)',
            opacity: '0',
          },
          '50%': { 
            opacity: '1',
          },
          '100%': { 
            transform: 'translateX(100%) rotate(180deg)',
            opacity: '0',
          },
        },
        'data-stream': {
          '0%': { 
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          '50%': { 
            opacity: '1',
          },
          '100%': { 
            transform: 'translateY(100%)',
            opacity: '0',
          },
        },
        'holographic': {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            filter: 'hue-rotate(0deg)',
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            filter: 'hue-rotate(180deg)',
          },
        },
        'neon-flicker': {
          '0%': { 
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor',
          },
          '100%': { 
            textShadow: '0 0 2px currentColor, 0 0 5px currentColor, 0 0 8px currentColor',
          },
        },
      },
    },
  },
  plugins: [],
}
