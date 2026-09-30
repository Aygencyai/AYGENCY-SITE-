import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 768, 375]) {
  test(`homepage 3D runtime renders without React errors at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto("/", { waitUntil: "networkidle" });
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
    await expect.poll(() => canvas.evaluate((element) => {
      if (!(element instanceof HTMLCanvasElement)) return false;
      const gl = element.getContext("webgl2");
      return gl !== null && !gl.isContextLost()
        && gl.drawingBufferWidth > 0 && gl.drawingBufferHeight > 0;
    })).toBe(true);

    // Keep a rendered readback for the homepage that previously crashed when
    // Next's React runtime and the 3D reconciler used different major versions.
    await expect(page.getByText("How much could you grow", { exact: false })).toContainText("if the work ran itself?");
    await page.screenshot({ path: testInfo.outputPath("homepage.png"), fullPage: false });
    await expect(page.locator("body")).not.toContainText("Application error");
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
