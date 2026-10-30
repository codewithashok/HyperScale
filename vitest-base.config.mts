import { defineConfig } from 'vitest/config';

// Loaded by `ng test` (runnerConfig: true in angular.json).
export default defineConfig({
  test: {
    // Each worker boots its own jsdom; too many at once time out on smaller machines.
    maxWorkers: 2,
  },
});
