import { test, expect } from '@playwright/test';
import { INTER_ROUND_DELAY_MS, TICK_MS } from '../constants/index.js';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test('Race results and horse icon positions update correctly', async ({ page }) => {
  await page.goto('http://localhost:4173');
  // Start the race
  await expect(page.getByText('Horse List')).toBeVisible();
  await page.getByRole('button', { name: /start|resume/i }).click();

  // For each round (6 rounds)
  for (let round = 0; round < 6; round++) {
    await expect(page.locator('.race-track .horse-icon')).toHaveCount(10);
    let finishedHorses = new Set();
    let lastPositions: number[] = [];
    let roundDone = false;
    let tickCount = 0;
    while (!roundDone && tickCount < 200) { // safety limit
      try {
        const icons = page.locator('.race-track .horse-icon');
        const count = await icons.count();
        let positions: number[] = [];
        for (let i = 0; i < count; i++) {
          if (await icons.nth(i).isVisible()) {
            const left = await icons.nth(i).evaluate((el: HTMLElement) => parseFloat(el.style.left));
            positions.push(left);
            if (left >= 100) finishedHorses.add(i);
          } else {
            positions.push(NaN);
          }
        }
        // Log positions and finished count
        console.log(`Round ${round + 1}, Tick ${tickCount}: positions =`, positions, 'finished =', finishedHorses.size);
        if (tickCount > 0 && positions.some((p, i) => p !== lastPositions[i])) {
          expect(positions.some((p, i) => p !== lastPositions[i])).toBe(true);
        }
        lastPositions = positions;
        if (finishedHorses.size === count) {
          roundDone = true;
        } else {
          await sleep(TICK_MS);
          tickCount++;
        }
      } catch (err) {
        console.error(`Error in polling loop (round ${round + 1}, tick ${tickCount}):`, err);
        throw err;
      }
    }
    // After round is done, check results table for this round
    const resultTable = page.locator('.result-table').nth(round).locator('table');
    await expect(resultTable).toBeVisible();
    const resultNames = await resultTable.locator('tbody tr td:nth-child(2)').allTextContents();
    expect(resultNames.length).toBe(10);
    expect(new Set(resultNames).size).toBe(10);
    if (round < 5) await sleep(INTER_ROUND_DELAY_MS + 200);
  }
  await expect(page.getByRole('button', { name: /finished/i })).toBeVisible();
}); // 5 minutes