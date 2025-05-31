import tailwind from 'eslint-plugin-tailwindcss';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      tailwindcss: {
        // For TailwindCSS v4 - point to CSS config file
        config: "D:\\Work\\new-engine\\libs\\ui\\src\\tokens\\index.css",
      },
    },
    plugins: {
      tailwindcss: tailwind,
    },
    rules: {
      // Only enable Tailwind CSS rules for class name validation
      'tailwindcss/classnames-order': 'off',
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/migration-from-tailwind-2': 'off',
      'tailwindcss/no-arbitrary-value': 'off',
      'tailwindcss/no-contradicting-classname': 'error',
      'tailwindcss/no-custom-classname': 'error',
      'tailwindcss/no-unnecessary-arbitrary-value': 'error',
    },
  },
  {
    // Exclude generated/dist files from linting
    ignores: ['dist/**/*', 'storybook-static/**/*'],
  },
];
