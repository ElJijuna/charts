import { expect, test } from '@playwright/test';

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
      const week = await canvas.screenshot();
      await page.getByRole('button', { name: 'Mes', exact: true }).click();
      await expect(total).toHaveText('1,650 pts');
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
    });
  }
}
