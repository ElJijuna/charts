import type { StorybookConfig } from '@storybook/react-native-web-vite';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import type { Alias, Plugin } from 'vite';

const require = createRequire(import.meta.url);
const reactNativeWebRoot = dirname(require.resolve('react-native-web/package.json'));

const reactNativeAliases: Alias[] = [
  {
    find: 'react-native/Libraries/Image/AssetRegistry',
    replacement: resolve(reactNativeWebRoot, 'dist/modules/AssetRegistry/index.js'),
  },
  {
    find: 'react-native-web/dist/cjs/exports/StyleSheet/compiler/createReactDOMStyle.js',
    replacement: resolve(
      reactNativeWebRoot,
      'dist/cjs/exports/StyleSheet/compiler/createReactDOMStyle.js'
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
    const configuredAliases = viteConfig.resolve?.alias;
    if (Array.isArray(configuredAliases)) {
      viteConfig.resolve!.alias = configuredAliases.filter(
        (alias) => alias.find !== 'react-native'
      );
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
          plugins: ['react-native-worklets/plugin'],
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
      resolve: {
        ...viteConfig.resolve,
        alias: [...reactNativeAliases, ...preservedAliases],
        dedupe: [...(viteConfig.resolve?.dedupe ?? []), 'react', 'react-dom'],
      },
    };
  },
};

export default config;
