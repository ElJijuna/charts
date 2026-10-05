import base from 'super-configs/jest/react-native';

/** @type {import('jest').Config} */
export default {
  ...base,
  verbose: false,
  moduleNameMapper: {
    ...base.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.stories.tsx',
    '!src/index.ts',
    '!src/**/types.ts',
    '!src/types/**',
  ],
  coverageReporters: ['text', 'text-summary', 'json-summary', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};
