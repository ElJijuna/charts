import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-native-web-vite';
import type { Alias, Plugin } from 'vite';

const require = createRequire(import.meta.url);

// Vite adds query strings to dependency IDs. Worklets uses Babel's filename
// both to read source maps and to select its TypeScript transform.
const normalizeBabelFilename = () => ({
  name: 'normalize-vite-babel-filename',
  pre(file: { opts: { filename?: string } }) {
    if (file.opts.filename) {
      [file.opts.filename] = file.opts.filename.split('?');
    }
  },
});
const reactNativeWebRoot = dirname(require.resolve('react-native-web/package.json'));
const victoryNativeRoot = resolve(dirname(require.resolve('victory-native')), '..');

const reactNativeAliases: Alias[] = [
  { find: '@', replacement: resolve(import.meta.dirname, '../../src') },
  {
    find: /^victory-native$/,
    replacement: resolve(victoryNativeRoot, 'src/index.ts'),
  },
  {
    find: 'react-native/Libraries/Image/AssetRegistry',
    replacement: resolve(reactNativeWebRoot, 'dist/modules/AssetRegistry/index.js'),
  },
  {
    find: 'react-native-web/dist/cjs/exports/StyleSheet/compiler/createReactDOMStyle.js',
    replacement: resolve(
      reactNativeWebRoot,
      'dist/cjs/exports/StyleSheet/compiler/createReactDOMStyle.js',
    ),
  },
  {
    find: 'react-native-web/dist/cjs/exports/StyleSheet/preprocess.js',
    replacement: resolve(reactNativeWebRoot, 'dist/cjs/exports/StyleSheet/preprocess.js'),
  },
  {
    find: /^react-native$/,
    replacement: resolve(reactNativeWebRoot, 'dist/index.js'),
  },
];

const fixReactNativeAliases = (): Plugin => ({
  config: (viteConfig) => {
    const resolveOptions = viteConfig.resolve;
    const configuredAliases = resolveOptions?.alias;
    if (resolveOptions && Array.isArray(configuredAliases)) {
      resolveOptions.alias = configuredAliases.filter((alias) => alias.find !== 'react-native');
    } else if (configuredAliases) {
      delete configuredAliases['react-native'];
    }

    return { resolve: { alias: reactNativeAliases } };
  },
  enforce: 'post',
  name: 'fix-react-native-web-aliases',
});

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      modulesToTranspile: ['victory-native'],
      pluginReactOptions: {
        babel: {
          plugins: [normalizeBabelFilename, 'react-native-worklets/plugin'],
        },
      },
    },
  },
  staticDirs: ['../public'],
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  viteFinal: async (viteConfig) => {
    const configuredAliases = viteConfig.resolve?.alias;
    const preservedAliases = Array.isArray(configuredAliases)
      ? configuredAliases.filter((alias) => alias.find !== 'react-native')
      : Object.entries(configuredAliases ?? {})
          .filter(([find]) => find !== 'react-native')
          .map(([find, replacement]) => ({ find, replacement }));

    return {
      ...viteConfig,
      plugins: [...(viteConfig.plugins ?? []), fixReactNativeAliases()],
      optimizeDeps: {
        ...viteConfig.optimizeDeps,
        // Skia is loaded lazily after CanvasKit. Prebundle its CommonJS
        // renderer dependencies so named imports also work in development.
        include: [
          ...(viteConfig.optimizeDeps?.include ?? []),
          'react-native-reanimated',
          'react-native-worklets',
          'react-native-gesture-handler',
          'react-fast-compare',
          'its-fine',
          'react-reconciler',
          'react-reconciler/constants',
          'scheduler',
          'canvaskit-wasm/bin/full/canvaskit.js',
        ],
        exclude: [...(viteConfig.optimizeDeps?.exclude ?? []), 'victory-native'],
      },
      resolve: {
        ...viteConfig.resolve,
        alias: [...reactNativeAliases, ...preservedAliases],
        dedupe: [...(viteConfig.resolve?.dedupe ?? []), 'react', 'react-dom'],
      },
    };
  },
};

export default config;
