/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Component tests opt into jsdom with a `// @vitest-environment jsdom` docblock.
export default getViteConfig({
  test: {
    include: ['tests/{unit,components,build}/**/*.test.{ts,tsx}'],
    environment: 'node',
    setupFiles: ['tests/setup.ts'],
  },
});
