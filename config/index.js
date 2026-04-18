// config/index.js
// Chooses environment configuration based on TEST_ENV.
// This is what `playwright.config.ts` imports to get the baseURL.

const devConfig = require('./dev.config');
const qaConfig = require('./qa.config');

// TEST_ENV can be set from npm scripts or CI (dev | qa)
const env = process.env.TEST_ENV || 'dev';

let selectedConfig;

switch (env) {
  case 'qa':
    selectedConfig = qaConfig;
    break;
  case 'dev':
  default:
    selectedConfig = devConfig;
    break;
}

// Helpful console log so you can see which env is loaded in CI/local runs
// when Playwright starts up.
console.log(`[CONFIG] Loaded environment: ${selectedConfig.envName}`);

module.exports = selectedConfig;

