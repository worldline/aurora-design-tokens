import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: './__tests__/globalSetup.ts',
    reporters: [
      'default',
      'junit',
      ['vitest-sonar-reporter', { outputFile: 'test-report.xml' }],
    ],
    outputFile: {
      junit: 'junit.xml',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'cobertura', 'lcov'],
      reportsDirectory: 'coverage',
    },
  },
})
