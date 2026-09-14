import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'dist-server', 'coverage', 'public', '.zuko', '.github']),
  // No eslint-disable comments: a rule changes here, in review, or not at all.
  { linterOptions: { noInlineConfig: true } },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: { globals: { ...globals.browser } },
  },
  {
    // The page sends nothing anywhere and reads no build-time secrets (PRD 5.1, 5.4).
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'The page makes no network requests.' },
        { name: 'XMLHttpRequest', message: 'The page makes no network requests.' },
        { name: 'WebSocket', message: 'The page makes no network requests.' },
        { name: 'EventSource', message: 'The page makes no network requests.' },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'navigator', property: 'sendBeacon', message: 'The page makes no network requests.' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.type='MetaProperty'][property.name='env']",
          message: 'The page reads no environment variables: anything in VITE_ ships publicly.',
        },
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'No raw HTML: every string renders as text from src/content.ts.',
        },
      ],
    },
  },
  {
    // PRD 5.2, rule 2: every user-facing string lives in src/content.ts. tests/copy-source.test.tsx is
    // the complete check; this rule gives fast feedback while editing. It repeats the two rules above
    // because a later no-restricted-syntax setting replaces an earlier one for the same files.
    files: ['src/components/**/*.tsx', 'src/App.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.type='MetaProperty'][property.name='env']",
          message: 'The page reads no environment variables: anything in VITE_ ships publicly.',
        },
        {
          selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
          message: 'No raw HTML: every string renders as text from src/content.ts.',
        },
        { selector: 'JSXText[value=/\\S/]', message: 'User-facing text belongs in src/content.ts.' },
        {
          selector: ':matches(JSXElement, JSXFragment) > JSXExpressionContainer > Literal[value=/\\S/]',
          message: 'User-facing text belongs in src/content.ts.',
        },
        {
          selector:
            ':matches(JSXElement, JSXFragment) > JSXExpressionContainer > TemplateLiteral > TemplateElement[value.raw=/\\S/]',
          message: 'User-facing text belongs in src/content.ts.',
        },
        {
          selector: 'JSXAttribute[name.name=/^(aria-label|alt|title|placeholder)$/] Literal',
          message: 'Accessible text belongs in src/content.ts.',
        },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: { globals: { ...globals.node } },
  },
]);
