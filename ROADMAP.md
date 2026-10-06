# Roadmap for @real-native/charts

Updated: 2026-10-05. `[x]` means completed; `[ ]` means pending.
The library takes priority. **Stories** items are secondary unless they help
verify a library fix.

## Completed: library

- [x] Provide 17 chart types using RN, Victory Native and Skia primitives.
- [x] Export CommonJS and ESM builds, TypeScript types and sources for Metro.
- [x] Use TypeScript 7 for type checking and declaration builds in the library and example.
- [x] Preserve generic component key inference when using `React.memo`.
- [x] Stabilize prepared data, series keys, theme and axis options.
- [x] Avoid preparing Cartesian data again when the theme changes.
- [x] Share animation configuration and stabilize corners and candlestick colors.
- [x] Stabilize Combo series splits and Histogram's internal series.
- [x] Calculate Histogram bins from domain bounds rather than the domain reference.
- [x] Avoid renders with stable props without deep dataset comparisons.
- [x] Handle empty data and series without usable values without mounting the renderer.
- [x] Filter invalid X values and treat invalid Y values as missing data without mutating the dataset.
- [x] Require complete finite samples in Bubble, Candlestick and AreaRange.
- [x] Display a single valid point in Line, Area, Sparkline and Combo line series.
- [x] Display isolated AreaRange endpoints and cumulative StackedArea values.
- [x] Handle constant series and zeros, and constrain Histogram configurations.
- [x] Filter invalid Pie slices and handle sums that exceed the numeric range.
- [x] Preserve Gauge's handling of invalid and out-of-range values.
- [x] Export the reusable `useChartPointSelection` hook through the library's local API.
- [x] Batch selection requests into one update per frame.
- [x] Avoid state updates when repeatedly selecting the same point.
- [x] Cancel pending selection work when the component unmounts.
- [x] Document immutable updates, stable props and selection hook usage.
- [x] Add tests for edge cases, render stability and selection per frame.

## Completed: Stories and web validation

- [x] **Stories:** start, build and preview Storybook from the repository root.
- [x] **Stories:** fix dependency loading, worklet transformation and web CanvasKit.
- [x] **Stories:** display rewards using Line and Area in a small transparent card.
- [x] **Stories:** select week, month and year, with totals and labels for each period.
- [x] **Stories:** separate the chart from the tooltip and keep state in the interaction layer.
- [x] **Stories:** adjust width using the container's `onLayout` rather than the window width.
- [x] **Stories:** display values through hover, focus, touch and touch dragging.
- [x] **Stories:** retain the last value on touch release and constrain the tooltip to the container.
- [x] **Stories:** stabilize interaction zones and normalize RN/Web touch coordinates.
- [x] **Stories:** allow vertical scrolling on web and reserve horizontal dragging for selection.
- [x] **Stories:** cover all 17 charts with empty, single-point, invalid and constant examples.
- [x] **Validation:** 103 unit tests pass in the current review.
- [x] **Validation:** the 38 existing web flows passed before the latest tooltip change.
- [x] **Validation:** the 4 Rewards flows passed after that change at 320 and 1024 px.
- [x] **Validation:** lint, TypeScript, library builds and Storybook builds pass.

These web and unit checks do not replace running the app on iOS and Android.

## Priority 0: finish publication preparation

Versions 1.0.0 and 1.0.1 were published to npm through semantic-release on 2026-10-05.
The remaining items are follow-ups to that release flow.

- [x] Review the name, MIT license, metadata, `publishConfig.access` and exports.
- [x] Create and review an actual tarball with `npm pack` after the build.
- [x] Verify that all entry points and their relative imports exist inside the tarball.
- [x] Verify that types, sources and the license are included, and tests and examples are excluded.
- [x] Check tarball types in ESM and CommonJS consumers using TypeScript NodeNext.
- [x] Check that a nonexistent key remains a type error in those consumers.
- [x] Run `npm publish --dry-run --access public` for the current `0.0.0` artifact.
- [x] Query the public registry: it returns E404 for `@real-native/charts` in this review.
- [x] Install `example` with `npm --prefix example ci` in CI and Release before typecheck.
- [x] Exclude `.expo`, `storybook-static`, `test-results` and `playwright-report` from Biome.
- [x] Fix remaining formatting and Biome rule errors in project files.
- [x] Exclude generated Expo documents and test results from `lint:md`.
- [x] Raise branch coverage to the required 90% through useful behavior tests.
  Result: 95.67% achieved.
- [x] Repeat all workflow checks and confirm they pass.
  The Release workflow passed lint, format, typecheck, coverage and build for 1.0.0 and 1.0.1;
  `lint:md` and web tests are not part of it.
- [ ] Test the tarball in RN and Web consumer apps without the example's local alias to `src`.
  Partial: a Vite consumer used the published package (see integration feedback below).
- [ ] Verify the declared minimum versions and publish a tested compatibility matrix.
- [x] Document web installation: RN Web, GestureHandlerRootView and Skia/CanvasKit loading.
- [x] Document native installation and configuration differences between Reanimated 3 and 4.
- [ ] Consider `prepack: npm run build` so `npm pack` does not depend on a prior manual build.
- [x] Choose the first version and complete its CHANGELOG notes: 1.0.0, generated by semantic-release.
- [x] Choose manual release or semantic-release: semantic-release on `main`.
- [ ] Verify that semantic-release maintains `package-lock.json` alongside `package.json`.
  Not yet: `@semantic-release/git` only commits `CHANGELOG.md` and `package.json`,
  and the lockfile still says 1.0.0 while the package is 1.0.1.
- [x] Confirm user permissions for the `@real-native` scope and publication authentication.
- [x] Verify credentials or configure trusted publishing for the Release workflow (`NPM_TOKEN`).
- [ ] Run the publication dry run with the final version and review its contents.
  Skipped for 1.0.0/1.0.1; consider `npx semantic-release --dry-run` or reviewing the
  published tarball.
- [x] Publish to npm and verify installation of the published version in consumer apps.
  `npm view @real-native/charts version` returns 1.0.1.

### Pre-release review results (0.0.0 artifact)

- Tarball `real-native-charts-0.0.0.tgz`: 296 files, 58,868 compressed bytes.
- No bundled runtime dependencies; chart engines are peer dependencies.
- `lint`, `typecheck`, all 103 tests, `build` and the publication dry run: passing.
- `test:coverage`: 99.47% statements, 99.41% lines and 100% functions.
- Branch coverage: **95.67%** (354/370); exceeds 95% without modifying `jest.config.mjs`.
- `format:check`: passes without errors or warnings, with generated directories excluded.
- `lint:md`: passes with generated Expo documents and test results excluded.
- CI and Release install root and `example` dependencies before typecheck.
- The registry's E404 does not prove scope availability or permission to publish.
- Credentials have not been checked, and no actual publication has been performed.

## Priority 0: consumer integration feedback (1.0.1)

Issues found while integrating the published package into another app.
They block or complicate real usage, so they come before performance work.

### Bugs and integration issues

- [x] Axis labels never render: `useChartAxisOptions` did not pass a `font` to Victory,
  and Victory skips labels without an `SkFont`, so `formatLabel`, `tickCount` and
  `labelColor` had no effect. Fixed: `axes.font` (an `SkFont` from `useFont`) is passed
  through to Victory and documented in the README.
- [x] Optionally accept `fontSource` + `fontSize` and load the font internally:
  `axes.fontSource` is loaded with `useFont`; an explicit `axes.font` takes precedence.
- [x] Optionally allow rendering axis labels outside the canvas: `axes.labelMode: 'native'`
  draws tick labels as React Native `Text` aligned with Victory's ticks (verified in the web
  Storybook). Vertical charts only; horizontal bar charts keep canvas labels.
- [x] Remove hardcoded English text: `EmptyChartState` showed "No data" with a fixed color,
  and `accessibilityLabel` defaulted to English names such as "Line chart". Fixed:
  `accessibilityLabel` is now required (breaking, needs a 2.0.0 release), and charts accept
  `emptyLabel` (drawn in the theme's `labelColor`) and `renderEmpty`; without either the
  empty state shows nothing.
- [x] Ship a Jest mock: importing the library failed with "Must use import to load ES Module"
  because the `react-native` field points to `lib/native` (TS), which imports
  `victory-native/src`. Fixed: `@real-native/charts/jest` exports stand-ins that keep
  `accessibilityLabel`, `testID`, `height` and `style`, with a parity test against the main
  entry. Verified in a React Native 0.86 Jest project installing the packed tarball, through
  both `moduleNameMapper` and `jest.mock`.
- [x] Simplify the web setup. Vite required aliasing `victory-native` to `src/index.ts`,
  excluding it from pre-bundling, manually pre-bundling `react-reconciler`, `its-fine`,
  `scheduler`, etc., and a Babel plugin that strips `?v=` from file names so Worklets compiles.
  Fixed: `@real-native/charts/vite` exports `realNativeCharts()`, built on `vite-plugin-rnw`
  (optional peer), and the README documents a Vite recipe without Storybook. Verified with a
  plain Vite 7 app installing the packed tarball, in `vite` dev and `vite build` + preview.
- [x] Respect reduced motion: `animate` defaulted to `true` and ignored `useReducedMotion`.
  Fixed: when `animate` is omitted, charts animate only if the system does not request
  reduced motion; an explicit `animate` still wins.

### API improvements

- [x] Make hiding axes simple: it needed `axes: { x: { lineColor: 'transparent' } }`.
  Fixed: `axes={false}` hides axes, grid and labels, and `axes.grid: false` hides only grid
  lines. Victory draws Y grid lines even without `axisOptions`, so hidden axes pass zero-width
  transparent lines; this also removed stray grid lines from `SparklineChart`
  (verified in the web Storybook).
- [x] Provide an accessible data description: a generated `accessibilityValue` or a
  `describeSeries(data, format)` helper, instead of building "Monday, 40, Tuesday, 70…" by hand.
  Done: `describeSeries(data, { xKey, yKey, formatX, formatY, … })` returns text to append to
  `accessibilityLabel`; it skips unplottable points, sorts numeric X like Victory and adds no
  built-in wording. A helper was chosen over `accessibilityValue`, which is not reliably
  announced on plain views across platforms.
- [ ] Expose point coordinates: consumers copy the geometry (padding ± width/2) to align
  custom labels. Add an `onLayoutPoints` callback or a render prop with `points`.
- [ ] Avoid one `GestureHandlerRootView` per chart: Victory wraps every chart even without
  interaction. Skip it when there is no `chartPressState`, or document the behavior.
- [ ] Add token-based theming: `theme` only accepts loose colors. Add a `ChartThemeProvider`
  to avoid repeating `theme` on every chart and to support light/dark modes.

### Documentation and packaging

- [ ] Skia binaries depend on `postinstall`: with `ignore-scripts=true`, `pod install` fails.
  Mention `npx install-skia` in the README installation steps.
- [ ] CanvasKit (~7 MB) loads blocking on web and delays the first render. Document the
  deferred pattern (load the chart only when shown) and `canvaskit-wasm?url` in Vite as an
  alternative to `setup-skia-web public`.
- [ ] Peers do not pin tested versions, and npm installs Skia 2.14 by default. Add an
  Expo SDK → versions table (e.g. Expo 57, Skia 2.6.2, RNGH 2.32, as in the example).
  Related to the compatibility matrix item in Priority 0.

## Priority 1: performance with large series

- [ ] Measure preparation, rendering, memory and interaction with 1,000, 10,000 and 50,000 points.
- [ ] Measure on Web and RN before adding more memoization or changing algorithms.
- [ ] Fix `Math.min(...sizes)` and `Math.max(...sizes)` in Bubble for large arrays.
- [ ] Reduce passes and temporary arrays in Bubble, and reuse its normalized data.
- [ ] Review Bubble radius scaling with extreme numeric ranges and repeated values.
- [ ] Review allocations and repeated passes in preparation, Histogram and stacked charts.
- [ ] Avoid repeated cumulative calculations for StackedArea markers.
- [ ] Evaluate optional Line/Area point simplification based on the available width.
- [ ] If simplifying, preserve extrema, gaps and original data for value selection.
- [ ] Preserve current default behavior and RN/Web API compatibility.
- [ ] Measure distribution and consumer bundle size, including the effects of tree shaking.
- [ ] Review animation with large datasets and offer compatible controls if measurements warrant it.

## Priority 1: compatibility and accessibility

- [ ] Run charts and tooltips on iOS and Android devices or simulators.
- [ ] Verify touch, dragging, cancellation, vertical scrolling, period changes and native resizing.
- [ ] Verify behavior with Reanimated 3 and 4 and supported RN/Expo versions.
- [ ] Test Safari and Firefox in addition to Chromium.
- [ ] Verify keyboard point navigation, including arrows, Home, End and Escape.
- [ ] Define how to announce selected values to screen readers without excessive announcements.
- [ ] Verify VoiceOver, TalkBack, focus, target sizes and contrast on varying backgrounds.
- [ ] Evaluate a reusable tooltip layer that uses actual chart geometry.
- [ ] For that layer, verify selection with nonuniform domains, multiple series and missing data.
- [ ] Add examples of resetting selection when data changes without remounting the overlay.

## Priority 2: Stories and maintenance

- [ ] **Stories:** large dataset examples for repeatable performance measurements.
- [ ] **Stories:** a render diagnostics tool separate from the example interface.
- [ ] **Stories:** tooltip examples with multiple series and nonuniform domains.
- [ ] **Stories:** configurable loading and empty states (`emptyLabel` / `renderEmpty`).
- [ ] **Stories:** verify dark backgrounds and containers narrower than the tooltip.
- [ ] **Stories:** review chunk splitting and web build size warnings.
- [ ] **Maintenance:** integrate web tests into CI once its current checks are resolved.
- [ ] **Maintenance:** automate tarball and consumer type checks.
- [ ] **Maintenance:** record performance and size budgets to catch future regressions.

## Manual publication commands

Run from the repository root with a Node version compatible with `engines`.
Resolve pending checks first.
semantic-release is the chosen flow; keep this sequence only as a fallback.
The first release was 1.0.0, so the `0.1.0` below is only an example.

```sh
npm ci
npm --prefix example ci
npm run lint
npm run format:check
npm run lint:md
npm run typecheck
npm run test:coverage -- --runInBand
npm run storybook:build
npm run test:e2e
```

Only if all checks pass and manual publication is chosen:

```sh
npm version 0.1.0 --no-git-tag-version
npm run build
npm pack --dry-run
npm publish --dry-run --access public
npm login
npm whoami
npm publish --access public
npm view @real-native/charts version
```

Update CHANGELOG before the final build. Review and save version changes.
`prepublishOnly` rebuilds on publication but does not run the checks above by itself.
The dry run does not verify publication permissions. The scope requires npm permissions;
interactive publication requires the authentication and 2FA requested by the registry.

If semantic-release is chosen, let it manage the version and publish through the Release
workflow after fixing its checks and configuring authentication.
Do not run the manual sequence in parallel for the same change.

Sources: [publishing scoped packages][npm-scoped], [npm publish][npm-publish],
[npm scripts][npm-scripts], [versioning][npm-version] and [2FA authentication][npm-2fa].

[npm-scoped]: https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/
[npm-publish]: https://docs.npmjs.com/cli/commands/npm-publish/
[npm-scripts]: https://docs.npmjs.com/misc/scripts/
[npm-version]: https://docs.npmjs.com/cli/commands/npm-version/
[npm-2fa]: https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/
