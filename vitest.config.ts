import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/{unit,components,build}/**/*.test.{ts,tsx}'],
    environment: 'node',
  },
});
