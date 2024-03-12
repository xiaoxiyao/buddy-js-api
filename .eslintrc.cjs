/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@stylistic/recommended-extends',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@stylistic',
    '@typescript-eslint',
    'jest',
  ],
  ignorePatterns: ['/dist'],
  root: true,
}
