# Roadmap for @real-native/charts

Updated: 2026-10-04. `[x]` means completed; `[ ]` means pending.
The library takes priority. **Stories** items are secondary unless they help
verify a library fix.

## Completed: library

- [x] Provide 17 chart types using RN, Victory Native and Skia primitives.
- [x] Export CommonJS and ESM builds, TypeScript types and sources for Metro.
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

The artifact can be packaged, but the automated release workflow is not ready.
Quality requirements must be met before publication is considered ready.

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
- [ ] Repeat all workflow checks and confirm they pass.
- [ ] Test the tarball in RN and Web consumer apps without the example's local alias to `src`.
- [ ] Verify the declared minimum versions and publish a tested compatibility matrix.
- [ ] Document web installation: RN Web, GestureHandlerRootView and Skia/CanvasKit loading.
- [ ] Document native installation and configuration differences between Reanimated 3 and 4.
- [ ] Consider `prepack: npm run build` so `npm pack` does not depend on a prior manual build.
- [ ] Choose the first version and complete its CHANGELOG notes; it currently lists `0.0.0`.
- [ ] Choose manual release or semantic-release, avoiding two publications of the same change.
- [ ] Verify that semantic-release maintains `package-lock.json` alongside `package.json`.
- [ ] Confirm user permissions for the `@real-native` scope and publication authentication.
- [ ] Verify credentials or configure trusted publishing for the Release workflow.
- [ ] Run the publication dry run with the final version and review its contents.
- [ ] Publish to npm and verify installation of the published version in consumer apps.

### Current review results

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
- [ ] Respect reduced motion preferences when animations are enabled.
- [ ] Evaluate a reusable tooltip layer that uses actual chart geometry.
- [ ] For that layer, verify selection with nonuniform domains, multiple series and missing data.
- [ ] Add examples of resetting selection when data changes without remounting the overlay.

## Priority 2: Stories and maintenance

- [ ] **Stories:** large dataset examples for repeatable performance measurements.
- [ ] **Stories:** a render diagnostics tool separate from the example interface.
- [ ] **Stories:** tooltip examples with multiple series and nonuniform domains.
- [ ] **Stories:** configurable loading and empty states, if added to the library API.
- [ ] **Stories:** verify dark backgrounds and containers narrower than the tooltip.
- [ ] **Stories:** review chunk splitting and web build size warnings.
- [ ] **Maintenance:** integrate web tests into CI once its current checks are resolved.
- [ ] **Maintenance:** automate tarball and consumer type checks.
- [ ] **Maintenance:** record performance and size budgets to catch future regressions.

## Manual publication commands

Run from the repository root with a Node version compatible with `engines`.
Resolve pending checks first.
Version `0.1.0` is a proposal for the first release, not an applied change.

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
