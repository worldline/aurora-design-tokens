import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import importPlugin from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([
  globalIgnores(['dist', '*.config.*js']),
  {
    extends: [
      js.configs.recommended,
      eslintPluginPrettierRecommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'generic' }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      'arrow-body-style': ['error', 'as-needed'],
      eqeqeq: 'error',
      'no-console': 'error',
      'no-duplicate-imports': 'error',
      'no-restricted-syntax': ['error', 'FunctionDeclaration'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
      quotes: ['error', 'single', { avoidEscape: true }],
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
        },
      ],
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        projectService: true,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: 'tsconfig.json',
        },
      },
    },
  },
  {
    linterOptions: {
      reportUnusedInlineConfigs: 'error',
      reportUnusedDisableDirectives: 'error',
    },
  },
])
