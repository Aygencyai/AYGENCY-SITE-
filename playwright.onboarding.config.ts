import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests", testMatch: /eden-conversation(?:-journey)?\.spec\.ts/, workers: 1,
  timeout: 180_000, expect: { timeout: 60_000 }, reporter: [["line"]],
  use: { baseURL: "http://127.0.0.1:3118", browserName: "chromium", channel: "chrome",
    headless: true, trace: "off", screenshot: "only-on-failure" },
  webServer: { command: "pnpm dev --hostname 127.0.0.1 --port 3118",
    url: "http://127.0.0.1:3118", reuseExistingServer: true, timeout: 120_000 },
});
