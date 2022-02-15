module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // allow async-await
    'semi': ['off', 'always'],
    'prefer-promise-reject-errors': ['error', { 'allowEmptyReject': true }],
    'no-trailing-spaces': ['error', { 'skipBlankLines': true }],
    'prefer-const': ['off'],
    'quote-props': ['off'],
    'object-curly-spacing': ['off'],
    'dot-notation': ['off'],
    'lines-between-class-members': ['off'],
    // 'no-undef': ['off', 'always'],
    // 'no-unused-vars': ['off', 'always'],
    'no-new-func': ['off', 'always'],
    'no-console': ['off']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
