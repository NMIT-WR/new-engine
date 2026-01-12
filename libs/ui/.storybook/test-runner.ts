import { createA11yReporter } from '@techsio/storybook-a11y-reporter';

const reporter = createA11yReporter({
  outputDir: 'a11y-report',
  failOnViolations: true,
  writeJUnit: true,
  waitForResultsMs: 30000,
});

export default {
  ...reporter,
  async getJestConfig(config) {
    return {
      ...config,
      testTimeout: 60000,
      modulePathIgnorePatterns: [
        ...(config.modulePathIgnorePatterns ?? []),
        '<rootDir>/.schaltwerk',
        '<rootDir>/.nx',
      ],
    };
  },
};
