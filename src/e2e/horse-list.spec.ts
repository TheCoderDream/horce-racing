import { test, expect } from '@playwright/test';

test('Horse list displays 20 horses', async ({ page }) => {
  await page.goto('http://localhost:4173');
  // Wait for the horse list table to be visible
  await expect(page.getByText('Horse List')).toBeVisible();
  // Find all rows in the horse list table (excluding header)
  const rows = await page.locator('table tr').nth(1).locator('..').locator('tr').count();
  // There should be 20 rows
  expect(rows).toBe(20);
}); 