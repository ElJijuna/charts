import reactNativeTsx from 'super-configs/eslint/react-native/tsx';

export default [
  {
    ignores: ['lib/**', 'coverage/**', 'docs/**', 'node_modules/**'],
  },
  ...reactNativeTsx,
  {
    name: 'real-native-charts/stories',
    files: ['**/*.stories.tsx', '.storybook/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
];
