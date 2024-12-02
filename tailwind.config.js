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
      screens: {
        'mbl': {'max': '639px'},  // Это определяет медиазапрос для экранов шириной менее 640px
        'tbl': {'max': '1023px'},  // Это определяет медиазапрос для экранов шириной менее 640px
        '2tbl': {'max': '1279px'},  // Это определяет медиазапрос для экранов шириной менее 640px
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};