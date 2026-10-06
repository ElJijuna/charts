globalThis.__DEV__ = true;

jest.mock('react-native-reanimated', () => ({ useReducedMotion: jest.fn(() => false) }));

jest.mock('@shopify/react-native-skia', () => ({ useFont: jest.fn(() => null) }));
