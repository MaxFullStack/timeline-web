import { test, expect } from '@playwright/test';

test.describe('Timeline Application', () => {
  test('should display timeline with all timeline items', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText('Timeline Visualization')).toBeVisible();
    
    await expect(page.getByText('16 items organized in')).toBeVisible();
    
    await expect(page.getByText('Recruit translators')).toBeVisible();
    await expect(page.getByText('Launch day')).toBeVisible();
  });

  test('should display timeline lanes correctly', async ({ page }) => {
    await page.goto('/');
    
    const lanes = page.locator('text=Lane');
    await expect(lanes).toHaveCount(4);
  });

  test('should display timeline items with tooltips', async ({ page }) => {
    await page.goto('/');
    
    const firstItem = page.getByText('Recruit translators').first();
    await expect(firstItem).toHaveAttribute('title', /2021-01-14 - 2021-01-22/);
  });
});