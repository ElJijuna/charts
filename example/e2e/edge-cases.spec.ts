import { expect, test } from '@playwright/test';

const kinds = [
  'line',
  'area',
  'bar',
  'horizontal-bar',
  'horizontal-stacked-bar',
  'stacked-bar',
  'stacked-area',
  'area-range',
  'scatter',
  'bubble',
  'sparkline',
  'histogram',
  'lollipop',
  'candlestick',
  'combo',
  'pie',
  'gauge',
];
const scenarios = ['empty', 'single-point', 'invalid', 'constant', 'zero'];

for (const kind of kinds) {
  test(`${kind} handles empty, single, invalid and constant samples`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const scenario of scenarios) {
      await page.goto(
        `/iframe.html?id=examples-edge-cases--${scenario}&viewMode=story&args=kind:${kind}`,
      );
      const chart = page.getByTestId('edge-chart');
      await expect(chart).toBeVisible();
      const empty =
        kind !== 'gauge' &&
        (scenario === 'empty' || scenario === 'invalid' || (kind === 'pie' && scenario === 'zero'));
      if (empty) {
        await expect(chart.getByText('No data')).toBeVisible();
        await expect(chart.locator('canvas')).toHaveCount(0);
      } else {
        const canvas = chart.locator('canvas');
        await expect(canvas).toBeVisible();
        if (['line', 'area', 'sparkline'].includes(kind) && scenario === 'single-point') {
          // Validate real colored pixels: an invisible one-sample path is not enough.
          const screenshot = await canvas.screenshot();
          const coloredPixels = await page.evaluate(
            async (bytes) => {
              const bitmap = await createImageBitmap(
                new Blob([new Uint8Array(bytes)], { type: 'image/png' }),
              );
              const surface = new OffscreenCanvas(bitmap.width, bitmap.height);
              const context = surface.getContext('2d');
              if (!context) {
                throw new Error('Unable to create a 2D canvas context');
              }
              context.drawImage(bitmap, 0, 0);
              const pixels = context.getImageData(0, 0, bitmap.width, bitmap.height).data;
              let colored = 0;
              for (let i = 0; i < pixels.length; i += 4) {
                if (pixels[i] !== pixels[i + 1] || pixels[i + 1] !== pixels[i + 2]) {
                  colored++;
                }
              }
              bitmap.close();
              return colored;
            },
            [...screenshot],
          );
          expect(coloredPixels).toBeGreaterThan(0);
        }
      }
    }
    expect(errors).toEqual([]);
  });
}
