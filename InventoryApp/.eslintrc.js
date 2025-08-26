module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended', // 👈 integrates prettier
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
