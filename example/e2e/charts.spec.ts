import { expect, test } from '@playwright/test';

const chartIds = [
  'line',
  'line-native-labels',
  'bar',
  'horizontal-bar',
  'horizontal-stacked-bar',
  'stacked-bar',
  'area',
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
] as const;

for (const chartId of chartIds) {
  test(`${chartId} story renders non-empty chart output`, async ({ page }) => {
    const pageErrors: string[] = [];
    let rejectOnPageError: (error: Error) => void;
    const pageError = new Promise<never>((_, reject) => {
      rejectOnPageError = reject;
    });
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
      rejectOnPageError(error);
    });

    await page.goto(`/iframe.html?id=charts--${chartId}&viewMode=story`);

    const story = page.getByTestId(`chart-story-${chartId}`);
    await Promise.race([expect(story).toBeVisible(), pageError]);

    const canvas = story.locator('canvas');
    await expect(canvas).toHaveCount(1);
    await expect(canvas).toBeVisible();

    const dimensions = await canvas.evaluate((element: HTMLCanvasElement) => ({
      height: element.height,
      width: element.width,
    }));
    expect(dimensions.width, `${chartId} canvas width`).toBeGreaterThan(0);
    expect(dimensions.height, `${chartId} canvas height`).toBeGreaterThan(0);

    const renderedChart = await canvas.screenshot();
    expect(renderedChart.byteLength, `${chartId} rendered image`).toBeGreaterThan(1_000);
    expect(pageErrors).toEqual([]);
  });
}

test('native axis labels render as text next to the plot', async ({ page }) => {
  await page.goto('/iframe.html?id=charts--line-native-labels&viewMode=story');

  const story = page.getByTestId('chart-story-line-native-labels');
  await expect(story.getByText('Jan', { exact: true })).toBeVisible();
  await expect(story.getByText('$100k')).toBeVisible();
});
