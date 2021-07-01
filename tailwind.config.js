module.exports = {
  purge: ['./components/**/*.tsx', './pages/**/*.tsx', './public/**/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        enji: {
          DEFAULT: '#903439'
        },
        rakuda: {
          DEFAULT: '#b19e5c'
        },
        genji: {
          DEFAULT: "#712a45"
        },
        ggray: {
          DEFAULT: '#a99c82',
        },
        bgray: {
          DEFAULT: "#4e5052"
        },
        gblack: {
          DEFAULT: "#262a2c",
        },
        wblack: {//黒
          DEFAULT: "#4b4b4b",
        },
        // ewhite: {
        //   DEFAULT: "#d4cbc4"
        // },
        // gblue: {
        //   DEFAULT: "#b5595f"
        // },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
