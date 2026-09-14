import { createEslintConfig } from 'super-configs/eslint';

export default createEslintConfig({
  language: 'ts',
  reactNative: true,
  testFramework: 'jest',
  ignores: ['lib/**', 'coverage/**', 'docs/**', 'node_modules/**', 'example/node_modules/**'],
  overrides: [
    {
      name: 'real-native-charts/stories',
      files: ['**/*.stories.tsx', '.storybook/**/*.{ts,tsx}'],
      rules: {
        'react-hooks/rules-of-hooks': 'off',
      },
    },
  ],
});
