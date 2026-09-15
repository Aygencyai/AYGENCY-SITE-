import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 768, 375]) {
  test(`conversation opens and resumes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/design-your-eden");
    await expect(page.getByRole("heading", { name: "Find out what your Eden can do for you." })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Your message to Eden Builder" })).toBeEnabled();
    await expect(page.getByRole("log")).toContainText("I'm Eden Builder.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const cookies = await page.context().cookies();
    expect(cookies.some((cookie) => cookie.name === "eden-conversation" && cookie.httpOnly)).toBe(true);
    await page.reload();
    await expect(page.getByRole("log")).toContainText("I'm Eden Builder.");
    expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })))
      .toEqual({ local: 0, session: 0 });
    expect(errors).toEqual([]);
    await expect(page.locator("#main-content > div")).toHaveCSS("opacity", "1");
    await expect(page.locator("main header")).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `/private/tmp/eden-web-20260915/chat-${width}.png`, fullPage: true });
  });
}

test("a real model answer survives reload", async ({ page }) => {
  await page.goto("/design-your-eden");
  const input = page.getByRole("textbox", { name: "Your message to Eden Builder" });
  await expect(input).toBeEnabled();
  const answer = "I'm Sam and I run a small design studio. Could Eden help track client tasks, and would I have to connect Outlook?";
  await input.fill(answer);
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(input).toBeEnabled({ timeout: 65_000 });
  await expect(page.getByRole("log")).toContainText(answer);
  await expect(page.getByRole("log").locator(":scope > div")).toHaveCount(3);
  const transcript = await page.getByRole("log").innerText();
  expect((await page.getByRole("log").locator(":scope > div").last().innerText()).toLowerCase()).toContain("outlook");
  await page.reload();
  await expect(input).toBeEnabled();
  await expect(page.getByRole("log")).toContainText(answer);
  expect(await page.getByRole("log").innerText()).toBe(transcript);
});
