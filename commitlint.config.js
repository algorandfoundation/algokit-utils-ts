module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow sentence case commit messages
    'subject-case': [2, 'never', ['pascal-case', 'upper-case']],
    'type-empty': [1, 'never'],
    'body-leading-blank': [0, 'off'],
  },
}
