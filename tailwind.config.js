module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'slow-pulse': 'pulse-slow 3s ease-in-out infinite', // Анимация каждые 3 секунды
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.9 },
        },
      },
      wordBreak: {
        anywhere: 'break-word',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};