import { defineConfig } from '@playwright/test';

// Load environment configuration (baseURL, envName, etc.)
// Using CommonJS require here keeps things simple for a mixed JS/TS project.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const envConfig = require('./config');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Playwright test configuration focused on API tests against ReqRes.
 * You can still add UI/browser projects later if you want to showcase UI testing.
 */
export default defineConfig({
  // All API test specs will live under this folder
  testDir: './tests',

  // Global timeouts
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },

  // CI-friendly settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporters: list for clean console, HTML for rich report
  reporter: [
  ['list'],
  ['allure-playwright'],
  ['html', { open: 'never', outputFolder: 'playwright-report' }],
],

  // Shared settings for all tests
  use: {
    // Base URL comes from the environment config (dev/qa, etc.)
    baseURL: envConfig.baseURL,

    // Common headers for API calls
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },

  // Single API project for now (easy to extend later)
  projects: [
    {
      name: 'api-tests',
    },
  ],
});
