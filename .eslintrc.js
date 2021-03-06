module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  rules: {
    'react/prop-types': [0],
    'react/forbid-prop-types': [0],
    'import/no-unresolved': [0],
    'comma-dangle': [1],
    'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }]
  },
  env: {
    browser: true
  }
};
