module.exports = {
  env: {
    node: true,
    es2021: true,
    browser: true,
    commonjs: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {},
}
