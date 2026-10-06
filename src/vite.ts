/// <reference types="node" />
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import type { Alias, AliasOptions, Plugin, PluginOption, UserConfig } from 'vite';
import { type RnwOptions, rnw } from 'vite-plugin-rnw';

export type RealNativeChartsViteOptions = RnwOptions;

type BabelOptions = Exclude<NonNullable<RnwOptions['babel']>, (...args: never[]) => unknown>;

// Victory Native ships worklets that the Worklets Babel plugin must transform.
const transpileExclude = /\/node_modules\/(?!react-native|@react-native|victory-native)/;

// Skia loads after CanvasKit; prebundle the CommonJS packages its renderer and
// Reanimated import by name so those imports also work in development.
const prebundledDependencies = [
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-gesture-handler',
  'react-fast-compare',
  'its-fine',
  'react-reconciler',
  'react-reconciler/constants',
  'scheduler',
  'canvaskit-wasm/bin/full/canvaskit.js',
];

// Vite adds query strings to dependency IDs. Worklets uses Babel's filename
// both to read source maps and to select its TypeScript transform.
export function stripBabelFilenameQuery() {
  return {
    name: 'real-native-charts-strip-filename-query',
    pre(file: { opts: { filename?: string | null } }) {
      if (file.opts.filename) {
        [file.opts.filename] = file.opts.filename.split('?');
      }
    },
  };
}

// Reanimated 4 moved its Babel plugin to react-native-worklets.
export function resolveWorkletsPlugin(root: string): string {
  const require = createRequire(join(root, 'package.json'));
  try {
    require.resolve('react-native-worklets/plugin');
    return 'react-native-worklets/plugin';
  } catch {
    return 'react-native-reanimated/plugin';
  }
}

function withChartsBabel(
  babel: RnwOptions['babel'],
  workletsPlugin: string,
): NonNullable<RnwOptions['babel']> {
  const extend = (options: BabelOptions = {}): BabelOptions => ({
    ...options,
    plugins: [stripBabelFilenameQuery, workletsPlugin, ...(options.plugins ?? [])],
  });
  return typeof babel === 'function' ? (id, options) => extend(babel(id, options)) : extend(babel);
}

// vite-plugin-rnw maps the `react-native` prefix to react-native-web, which also
// rewrites deep imports such as Skia's AssetRegistry. Replace it with exact aliases.
export function withoutReactNativePrefixAlias(alias: AliasOptions | undefined) {
  if (Array.isArray(alias)) {
    return alias.filter((entry: Alias) => entry.find !== 'react-native');
  }
  if (alias) {
    return Object.fromEntries(Object.entries(alias).filter(([find]) => find !== 'react-native'));
  }
  return alias;
}

function chartsResolvePlugin(): Plugin {
  return {
    name: 'real-native-charts',
    enforce: 'post',
    config(config: UserConfig) {
      const root = resolve(config.root ?? process.cwd());
      const require = createRequire(join(root, 'package.json'));
      const reactNativeWebRoot = dirname(require.resolve('react-native-web/package.json'));
      const victoryNativeRoot = resolve(dirname(require.resolve('victory-native')), '..');

      if (config.resolve) {
        config.resolve.alias = withoutReactNativePrefixAlias(config.resolve.alias);
      }

      return {
        resolve: {
          alias: [
            {
              find: 'react-native/Libraries/Image/AssetRegistry',
              replacement: resolve(reactNativeWebRoot, 'dist/modules/AssetRegistry/index.js'),
            },
            { find: /^react-native$/, replacement: resolve(reactNativeWebRoot, 'dist/index.js') },
            // The published build is CommonJS; its TypeScript source keeps worklets intact.
            { find: /^victory-native$/, replacement: resolve(victoryNativeRoot, 'src/index.ts') },
          ],
        },
        optimizeDeps: { include: prebundledDependencies, exclude: ['victory-native'] },
      };
    },
  };
}

/**
 * Vite plugins for rendering `@real-native/charts` with React Native Web.
 * Accepts the `vite-plugin-rnw` options; Babel plugins are appended to the chart setup.
 */
export function realNativeCharts(options: RealNativeChartsViteOptions = {}): PluginOption[] {
  const workletsPlugin = resolveWorkletsPlugin(process.cwd());
  return [
    rnw({
      exclude: transpileExclude,
      ...options,
      babel: withChartsBabel(options.babel, workletsPlugin),
    }),
    chartsResolvePlugin(),
  ];
}
