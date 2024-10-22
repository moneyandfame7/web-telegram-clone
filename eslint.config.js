import globals from 'globals'
import js from '@eslint/js'
import ts from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default ts.config(
  {files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']},
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  {ignores: ['node_modules', 'dist']},
  // {settings:{
  //   react:{
  //     version:""
  //   }
  // }},
  js.configs.recommended,
  ...ts.configs.strict,
  ...ts.configs.stylistic,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    settings: {react: {version: '18.3'}},

    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      // '@typescript-eslint': ts,
    },
    ignores: ['**/node_modules', '**/dist'],
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'error',
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'error',
      'react/jsx-fragments': ['error', 'syntax'],
      'react/button-has-type': 'error',
      'react/display-name': 'error',

      // 'no-unnecessary-condition': 'error',
      // 'ts-lint/no-unnecessary-condition': 'error',
    },
  }
)
