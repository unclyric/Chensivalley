/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        game: {
          bg: '#2d1b2e',
          panel: '#3d2b3e',
          border: '#5a3d5c',
          text: '#e8d5c4',
          accent: '#7eb5a6',
          gold: '#d4a853',
          heart: '#e85d75',
          water: '#4a8fbf',
          grass: '#5a8f4a',
          wood: '#8b6914',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
};
