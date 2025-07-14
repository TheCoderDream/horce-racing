import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    exclude: [
      'src/__tests__/e2e/**',
      'e2e/**',
      'tests/e2e/**',
      '**/playwright/**',
      'node_modules'
    ],
  },
}); 