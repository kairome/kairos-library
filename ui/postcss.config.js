module.exports = {
  plugins: {
    'postcss-extend': {},
    'postcss-import': {
      path: ['src/css', 'src/components/'],
    },
    'postcss-cssnext': {},
    cssnano: {},
    lost: {
      flexbox: 'flex',
      gutter: '2.4%',
    },
    'postcss-nested': {},
    'postcss-css-variables': {},
    'postcss-custom-media': {},
  },
};
