import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Next.js requires `jsx: "preserve"` in tsconfig, which Vite cannot transform.
  // Vite transforms via oxc, so the JSX runtime is set here instead — this is
  // what lets validation tests import route modules for their exported
  // `metadata` (tests/validation/route-metadata.test.ts).
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    environment: 'node',
    // `npm run test` runs tests/unit; `npm run validate` runs tests/validation.
    include: ['tests/unit/**/*.test.{ts,tsx}', 'tests/validation/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
