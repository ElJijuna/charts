import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import type { Plugin, UserConfig } from 'vite';
import { rnw } from 'vite-plugin-rnw';
import {
  realNativeCharts,
  resolveWorkletsPlugin,
  stripBabelFilenameQuery,
  withoutReactNativePrefixAlias,
} from '@/vite';

jest.mock('vite-plugin-rnw', () => ({ rnw: jest.fn(() => []) }));

const mockRnw = jest.mocked(rnw);
const exampleRoot = resolve(__dirname, '../example');

type BabelOptions = { plugins?: unknown[] };
const rnwOptions = () => mockRnw.mock.calls.at(-1)?.[0] ?? {};

describe('realNativeCharts', () => {
  beforeEach(() => {
    mockRnw.mockClear();
  });

  it('transpiles Victory Native and adds the chart Babel plugins first', () => {
    realNativeCharts({ babel: { plugins: ['user-plugin'] } });

    const options = rnwOptions();
    expect(options.exclude).toEqual(
      /\/node_modules\/(?!react-native|@react-native|victory-native)/,
    );
    expect((options.babel as BabelOptions).plugins).toEqual([
      stripBabelFilenameQuery,
      'react-native-worklets/plugin',
      'user-plugin',
    ]);
  });

  it('wraps a Babel options function and keeps user overrides', () => {
    realNativeCharts({ exclude: /custom/, babel: () => ({ compact: true }) });

    const options = rnwOptions();
    const babel = options.babel as (
      id: string,
      options: object,
    ) => BabelOptions & {
      compact?: boolean;
    };
    expect(options.exclude).toEqual(/custom/);
    expect(babel('file.ts', {})).toEqual({
      compact: true,
      plugins: [stripBabelFilenameQuery, 'react-native-worklets/plugin'],
    });
  });

  it('replaces the react-native prefix alias with exact web aliases', () => {
    const plugin = realNativeCharts().at(-1) as Plugin;
    const config: UserConfig = {
      root: exampleRoot,
      resolve: { alias: { 'react-native': 'react-native-web', '@': '/src' } },
    };

    const result = (plugin.config as (config: UserConfig) => UserConfig)(config);

    expect(config.resolve?.alias).toEqual({ '@': '/src' });
    const aliases = result.resolve?.alias as { find: string | RegExp; replacement: string }[];
    expect(aliases.map(({ find }) => String(find))).toEqual([
      'react-native/Libraries/Image/AssetRegistry',
      '/^react-native$/',
      '/^victory-native$/',
    ]);
    expect(aliases[2]?.replacement).toMatch(/victory-native[/\\]src[/\\]index\.ts$/);
    expect(result.optimizeDeps?.exclude).toEqual(['victory-native']);
    expect(result.optimizeDeps?.include).toContain('react-reconciler/constants');
  });
});

describe('vite helpers', () => {
  it('removes only the react-native alias', () => {
    expect(
      withoutReactNativePrefixAlias([
        { find: 'react-native', replacement: 'react-native-web' },
        { find: 'other', replacement: 'x' },
      ]),
    ).toEqual([{ find: 'other', replacement: 'x' }]);
    expect(withoutReactNativePrefixAlias(undefined)).toBeUndefined();
  });

  it('strips Vite query strings from Babel file names', () => {
    const file = { opts: { filename: '/node_modules/x.js?v=123' as string | null } };
    stripBabelFilenameQuery().pre(file);
    expect(file.opts.filename).toBe('/node_modules/x.js');

    const unnamed = { opts: { filename: null } };
    stripBabelFilenameQuery().pre(unnamed);
    expect(unnamed.opts.filename).toBeNull();
  });

  it('falls back to the Reanimated 3 Babel plugin without Worklets', () => {
    expect(resolveWorkletsPlugin(process.cwd())).toBe('react-native-worklets/plugin');
    expect(resolveWorkletsPlugin(mkdtempSync(join(tmpdir(), 'charts-')))).toBe(
      'react-native-reanimated/plugin',
    );
  });
});
