import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 768, 375]) {
  test(`finish brings email verification into view at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    const now = new Date().toISOString();
    const ready = { revision: 3, messages: [{ id: crypto.randomUUID(), role: "assistant",
      text: "Your starting setup is ready to review. ".repeat(20), created_at: now }],
      facts: [], summary: "Prepare a weekday morning follow-up list.", ready: true,
      email_verified: false, pending: false, confirmed: false, created: false,
      updated_at: now, retry_available: false };
    await page.route("**/api/eden/conversation", async route => {
      const input = route.request().postDataJSON() as { action: string };
      await route.fulfill({ json: input.action === "email" ? { code_sent: true } : ready });
    });
    await page.goto("/design-your-eden");
    const finish = page.getByRole("button", { name: "Verify email to finish" });
    await finish.click();
    const email = page.getByRole("textbox", { name: "Email address" });
    await expect(email).toBeFocused();
    await expect(email).toBeInViewport({ ratio: 1 });
    // Returning to the finish button must also reveal an already-open form.
    await finish.click();
    await expect(email).toBeFocused();
    await expect(email).toBeInViewport({ ratio: 1 });
    await email.fill("focus-customer@example.test");
    await page.getByRole("button", { name: "Send code", exact: true }).click();
    const code = page.getByRole("textbox", { name: "Sign-in code" });
    await expect(code).toBeFocused();
    await expect(code).toBeInViewport({ ratio: 1 });
  });

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

test("a reloaded saved reply follows progress and offers recovery after a failure", async ({ page }) => {
  const user = {id:crypto.randomUUID(),role:"user",text:"Keep my client commitments visible.",created_at:new Date().toISOString()};
  const initial = {revision:2,messages:[{id:crypto.randomUUID(),role:"assistant",text:"What would you like help with?",created_at:user.created_at},user],facts:[],summary:"",ready:false,email_verified:false,pending:true,confirmed:false,created:false,updated_at:user.created_at,retry_available:false};
  let reads = 0;
  let retried = false;
  await page.route("**/api/eden/conversation", async route => {
    const input = route.request().postDataJSON() as {action:string};
    if (input.action === "get") reads++;
    if (input.action === "retry") retried = true;
    expect(input.action).not.toBe("message"); // Reuse the saved input, never send another user turn.
    const value = retried ? {...initial,revision:3,pending:false,retry_available:false,messages:[...initial.messages,{...user,id:crypto.randomUUID(),role:"assistant",text:"I have your saved request. Where do those commitments arrive?"}]} : {...initial,retry_available:reads>=2};
    await route.fulfill({json:value});
  });
  await page.goto("/design-your-eden");
  await expect(page.getByRole("status").filter({hasText:"Message saved. Thinking"})).toBeVisible();
  await expect(page.getByRole("status").filter({hasText:"Message saved. Reply waiting."})).toBeVisible({timeout:15000});
  await page.getByRole("button",{name:"Continue with my saved message"}).click();
  await expect(page.getByRole("textbox",{name:"Your message to Eden Builder"})).toBeEnabled();
  await expect(page.getByRole("log").locator(":scope > div")).toHaveCount(3);
  await expect(page.getByRole("log")).toContainText("I have your saved request.");
});
