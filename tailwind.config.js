module.exports = {
  purge: ['./components/**/*.tsx', './pages/**/*.tsx', './public/**/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        enji: {
          DEFAULT: '#b3424a'
        },
        ggray: {
          DEFAULT: '#a99c82',
        },
        gblack: {
          DEFAULT: "#262a2c",
        }
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
