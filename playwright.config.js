// @ts-check
import { defineConfig, devices } from '@playwright/test';

const config = ({
  grep: /.*/,
  testDir: './tests',
  timeout: 40 * 1000,
  expect: { timeout: 50 * 1000 },
 reporter: [
    ['list'],
    ['allure-playwright', {
      resultsDir: 'allure-results'
    }]
  ],
  use: {
    // baseURL:'https://eventhub.rahulshettyacademy.com',
    browserName: 'chromium',
    headless: true,
    screenshot: 'on',
    trace: 'retain-on-failure'
  }

});
module.exports = config;
