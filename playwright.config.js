// @ts-check
import { defineConfig, devices } from '@playwright/test';

const config = ({
  grep: /.*/,
  testDir: './tests',
  timeout: 40 * 1000,
  expect: { timeout: 50 * 1000 },
  reporter: [
    ['line'],
    ['allure-playwright']
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
