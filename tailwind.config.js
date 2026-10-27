/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F3F6FB',
        cream: '#FFFFFF',
        ink: '#0E1525',
        mute: '#5C6B80',
        line: '#D9E2EE',
        clay: '#D12B4A',
        forest: {
          DEFAULT: '#1D4ED8',
          deep: '#0B1F4D',
          mid: '#2563EB',
        },
        lime: {
          DEFAULT: '#FF6B3D',
          deep: '#F25522',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Segoe UI', 'sans-serif'],
        serif: ['Syne', 'Manrope', 'sans-serif'],
      },
      maxWidth: {
        page: '1440px',
      },
      boxShadow: {
        card: '0 16px 40px -24px rgba(11, 31, 77, 0.28)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        progress: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease both',
        progress: 'progress 0.55s ease forwards',
      },
      screens: {
        '2xl': '1440px',
      },
    },
  },
  plugins: [],
};
