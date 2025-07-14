import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 120_000,
  testDir: 'src/e2e',
  use: {
    headless: true,
  },
  webServer: {
    command: 'npm run dev -- --port 4173',
    port: 4173,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
}); 