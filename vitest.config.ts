import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    exclude: [
      'src/e2e/**',
      'e2e/**',
      'tests/e2e/**',
      '**/playwright/**',
      'node_modules'
    ],
  },
}); 