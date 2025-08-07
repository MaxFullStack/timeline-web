import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      },
      include: ['src/**/*'],
      exclude: [
        'src/test/**',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/types/**',
        'src/**/*.d.ts',
        'src/app/layout.tsx',
        'src/app/page.tsx',
        'src/lib/utils.ts',
        'src/features/timeline/index.ts',
        'src/features/timeline/data/**'
      ]
    },
    exclude: [
      'src/test/e2e/**',
      'node_modules/**'
    ]
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});