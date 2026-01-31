import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    fileParallelism: false, 
    maxConcurrency: 1,      //forces single test file at a time
  },
});


