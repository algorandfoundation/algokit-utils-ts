import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '.eslintrc.js',
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '**/generated/types.d.ts',
      '**/generated/types.ts',
      '.idea/**',
      '.vscode/**',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true, argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-expressions': 'off',
      'prefer-template': 'error',
    },
  },
  // Test file overrides
  {
    files: ['**/*.spec.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  prettier,
)
