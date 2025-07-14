import { test, expect } from '@playwright/test';

test('Program displays 6 rounds', async ({ page }) => {
  await page.goto('http://localhost:4173');
  // Wait for the Program & Results section to be visible
  await expect(page.getByText('Program & Results')).toBeVisible();
  // Find all round program tables (assuming each round has a program table with a lap label)
  // This selector may need to be adjusted based on your actual DOM structure
  const rounds = await page.locator('.program-table').count();
  expect(rounds).toBe(6);
}); 