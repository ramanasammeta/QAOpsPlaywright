// @ts-check
import { defineConfig, devices } from '@playwright/test';

const config = ({
  testDir: './tests',
  timeout: 40 * 1000,
  expect: { timeout: 50 * 1000 },
  reporter: 'html',
  projects: [
    {
      name: 'safari',
      use: {
        // baseURL:'https://eventhub.rahulshettyacademy.com',
        browserName: 'webkit',
        headless: false,
        screenshot: 'off',
        trace: 'on',
        ...devices['Pixel 6a']
      }
    },
    {
      name: 'chrome',
      use: {
        // baseURL:'https://eventhub.rahulshettyacademy.com',
        browserName: 'chromium',
        headless: false,
        screenshot: 'on',
        trace: 'on'
      }
    }
  ]

});
module.exports = config;
