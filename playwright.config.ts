import { defineConfig, devices, ReporterDescription } from '@playwright/test';
import type { UserContextFixture } from './src/fixtures/userContext.fixture';

/* array of all playwright projects. Set name with '-api' substring to avoid using browser in tests */
const allProjects: any[] = [
  {
    name: 'all',
  },
  {
    name: 'api',
    testDir: 'tests/api',
  },
  {
    name: 'ui',
    testDir: 'tests/ui',
  },
  {
    name: 'example',
    testDir: 'tests',
  },
];

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/* Modifies projects by context */
function getProjects(projects: any[]): any[] {
  let updated_projects = updateProjectsByBrowser(projects);
  return updated_projects;
}

/* Modifies projects adding target browser to projects not related 'api' */
function updateProjectsByBrowser(projects: any[]): any[] {
  return projects.map((project) => {
    project.use ??= {
      ...devices['Desktop Chrome'],
      viewport: { width: 1920, height: 1080 },
    };
    return project;
  });
}

// Set report types which will be used for test
function getReports(): ReporterDescription[] {
  return [
    ['html', { outputFolder: 'reports/html-report', open: 'on-failure' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['./src/reporter/logReporter.ts'],
  ];
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<UserContextFixture>({
  timeout: 10 * 60 * 1000,
  testDir: 'tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Limit the number of failures on CI to save resources */
  maxFailures: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: getReports(),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: {
      mode: 'retain-on-failure',
      snapshots: true,
      screenshots: true,
      sources: true,
    },
    headless: true,
    ignoreHTTPSErrors: true,
    /* Timeout for each action */
    actionTimeout: 10 * 1000,
    // sets [arial-label] as the default testId attribute to be used by 'Locator.getByTestId()' method
    testIdAttribute: 'aria-label',
  },
  expect: {
    /* Default timeout for async expect matchers in milliseconds, defaults to 5000ms. */
    timeout: 10 * 1000,
  },

  /* Configure projects for major browsers */
  projects: getProjects(allProjects),

  /* Configure global setup and tear down */
  globalSetup: require.resolve('./tests/hooks/globalSetup'),
  globalTeardown: require.resolve('./tests/hooks/globalTearDown'),
});
