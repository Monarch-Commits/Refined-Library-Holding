module.exports = {
  content: ['./**/*.html', './js/**/*.js'], // saan hahanapin ng Tailwind ang class names
  theme: {
    extend: {
      colors: {
        primary: '#197fe6',
        'background-light': '#f6f7f8',
        'background-dark': '#111921',
      },
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
