import { expect, test } from '@playwright/test';

// Opt-in: PERF=1 npm run test:perf. Timings vary by machine; compare runs on the same one.
const kinds = [
  'line',
  'area',
  'stacked-area',
  'scatter',
  'bubble',
  'bar',
  'histogram',
  'sparkline',
  'candlestick',
] as const;
const sizes = [
  ['points-1-k', 1_000],
  ['points-10-k', 10_000],
  ['points-50-k', 50_000],
] as const;
// Mounts vary between page loads, so each case mounts several times and reports medians.
const runs = Number(process.env.PERF_RUNS ?? 3);
const updates = 3;

interface Sample {
  kind: string;
  size: number;
  phase: 'mount' | 'update';
  generateMs: number;
  commitMs: number;
  settleMs: number;
}

test.skip(!process.env.PERF, 'Set PERF=1 to run performance measurements.');
test.describe.configure({ mode: 'serial' });

for (const [storyId, size] of sizes) {
  for (const kind of kinds) {
    test(`${kind} with ${size} points`, async ({ page }, testInfo) => {
      test.setTimeout(900_000);
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));

      const url = `/iframe.html?id=examples-large-datasets--${storyId}&viewMode=story&args=kind:${kind}`;
      const samples = () =>
        page.evaluate(() => (window as { __chartPerformance?: Sample[] }).__chartPerformance ?? []);
      const collected: Sample[] = [];
      for (let run = 0; run < runs; run += 1) {
        await page.goto(url);
        await expect.poll(async () => (await samples()).length, { timeout: 240_000 }).toBe(1);
        for (let update = 1; update <= updates; update += 1) {
          await page.getByTestId('update-data').click();
          await expect
            .poll(async () => (await samples()).length, { timeout: 240_000 })
            .toBe(update + 1);
        }
        collected.push(...(await samples()));
      }

      const results = collected;
      const median = (values: number[]) =>
        Math.round([...values].sort((a, b) => a - b)[Math.floor(values.length / 2)] ?? Number.NaN);
      const mounts = results.filter(({ phase }) => phase === 'mount');
      const updateRuns = results.filter(({ phase }) => phase === 'update');
      const summary = {
        kind,
        size,
        runs,
        generateMs: median(mounts.map(({ generateMs }) => generateMs)),
        mountCommitMs: median(mounts.map(({ commitMs }) => commitMs)),
        mountSettleMs: median(mounts.map(({ settleMs }) => settleMs)),
        updateCommitMs: median(updateRuns.map(({ commitMs }) => commitMs)),
        updateSettleMs: median(updateRuns.map(({ settleMs }) => settleMs)),
      };
      console.log(`PERF ${JSON.stringify(summary)}`);
      await testInfo.attach('performance', {
        body: JSON.stringify({ summary, results }, null, 2),
        contentType: 'application/json',
      });
      await expect(page.getByTestId('large-chart').locator('canvas')).toHaveCount(1);
      expect(errors).toEqual([]);
    });
  }
}
