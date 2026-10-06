globalThis.__DEV__ = true;

jest.mock('react-native-reanimated', () => ({ useReducedMotion: jest.fn(() => false) }));
