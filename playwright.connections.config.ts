import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests", testMatch: /eden-outlook\.spec\.ts/, workers: 1,
  timeout: 60_000, expect: { timeout: 20_000 }, reporter: [["line"]],
  use: { baseURL: "http://127.0.0.1:3122", browserName: "chromium", channel: "chrome",
    headless: true, trace: "off", screenshot: "only-on-failure" },
  webServer: { command: "pnpm dev --hostname 127.0.0.1 --port 3122",
    env: { EDEN_CUSTOMER_CONNECTIONS_ENABLED: "true" },
    url: "http://127.0.0.1:3122", reuseExistingServer: false, timeout: 120_000 },
});
