import { defineConfig } from '@playwright/test';

import config from './playwright.config';

export default defineConfig(config, {
  webServer: {
    command: 'npm run storybook -- --ci --host 127.0.0.1',
    url: 'http://127.0.0.1:6006',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
