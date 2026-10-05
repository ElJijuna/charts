import { expect, test } from '@playwright/test';

test.use({ hasTouch: true });

for (const width of [320, 1024]) {
  for (const variant of ['line', 'area']) {
    test(`rewards ${variant} changes periods at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 640 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`/iframe.html?id=examples-rewards--${variant}&viewMode=story`);

      const view = page.getByTestId('rewards-view');
      const chart = page.getByTestId('rewards-chart');
      const total = page.getByTestId('rewards-total');
      const canvas = chart.locator('canvas');
      await expect(canvas).toBeVisible();
      await expect(view).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      await expect(chart).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      const bounds = await view.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.width).toBeLessThanOrEqual(360);
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);

      await expect(total).toHaveText('500 pts');
      const tooltip = page.getByTestId('rewards-tooltip');
      await page.getByTestId('rewards-point-0').hover();
      await expect(tooltip).toHaveText('L40 pts');
      await page.getByTestId('rewards-point-5').hover();
      await expect(tooltip).toHaveText('S120 pts');
      await page.getByTestId('rewards-point-6').hover();
      await expect(tooltip).toHaveText('D85 pts');
      const tooltipBounds = await tooltip.boundingBox();
      expect(tooltipBounds!.x).toBeGreaterThanOrEqual(bounds!.x);
      expect(tooltipBounds!.x + tooltipBounds!.width).toBeLessThanOrEqual(
        bounds!.x + bounds!.width,
      );
      await total.hover();
      await expect(tooltip).toHaveCount(0);
      await page.getByTestId('rewards-point-2').tap();
      await expect(tooltip).toHaveText('X30 pts');
      const week = await canvas.screenshot();
      await page.getByRole('button', { name: 'Mes', exact: true }).click();
      await expect(total).toHaveText('1,650 pts');
      await expect(tooltip).toHaveCount(0);
      await page.getByTestId('rewards-point-3').hover();
      await expect(tooltip).toHaveText('Sem 4500 pts');
      await expect(page.getByTestId('rewards-caption')).toHaveText('Puntos ganados este mes');
      await expect.poll(async () => (await canvas.screenshot()).equals(week)).toBe(false);

      // React Native Web Pressable must support keyboard activation too.
      const year = page.getByRole('button', { name: 'Año', exact: true });
      await year.focus();
      await page.keyboard.press('Enter');
      await expect(total).toHaveText('19,050 pts');
      await expect(year).toHaveAttribute('aria-selected', 'true');
      await page.getByRole('button', { name: 'Semana', exact: true }).click();
      await expect(total).toHaveText('500 pts');
      expect(errors).toEqual([]);

      // Keep the viewport fixed: the chart must follow its parent card.
      const host = page.getByTestId('rewards-host');
      for (const containerWidth of [240, 280]) {
        await host.evaluate((element, nextWidth) => {
          element.style.width = `${nextWidth}px`;
        }, containerWidth);
        await expect(view).toHaveCSS('width', `${containerWidth - 32}px`);
        await expect(chart).toHaveCSS('width', `${containerWidth - 32}px`);
        await page.getByTestId('rewards-point-6').hover();
        await expect(tooltip).toHaveText('D85 pts');
        await expect
          .poll(async () => {
            const cardBounds = await view.boundingBox();
            const tipBounds = await tooltip.boundingBox();
            return tipBounds!.x + tipBounds!.width <= cardBounds!.x + cardBounds!.width;
          })
          .toBe(true);
      }
    });
  }
}
