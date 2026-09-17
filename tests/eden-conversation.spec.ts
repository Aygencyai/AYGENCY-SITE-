import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 768, 375]) {
  test(`email is required before chatting at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    const actions: string[] = [];
    const now = new Date().toISOString();
    const ready = { revision: 3, messages: [{ id: crypto.randomUUID(), role: "assistant",
      text: "I'm Ava. Your starting setup is ready to review.", created_at: now }],
      facts: [], summary: "Prepare a weekday morning follow-up list.", ready: true,
      email_verified: true, email: "focus-customer@example.test", pending: false,
      confirmed: false, created: false, updated_at: now, retry_available: false };
    let signedIn = false;
    await page.route("**/api/eden/conversation", async route => {
      const input = route.request().postDataJSON() as { action: string };
      actions.push(input.action);
      if (input.action === "verify") signedIn = true;
      if (input.action === "logout") signedIn = false;
      await route.fulfill({ json: input.action === "email" ? { code_sent: true } : signedIn ? ready : { email_verified: false } });
    });
    await page.goto("/design-your-eden");
    await expect(page.getByRole("textbox", { name: "Your message to Ava" })).toHaveCount(0);
    await expect(page.getByRole("log")).toHaveCount(0);
    const email = page.getByRole("textbox", { name: "Email address" });
    await expect(email).toBeFocused();
    await email.fill(ready.email);
    await page.getByRole("button", { name: "Send code", exact: true }).click();
    const code = page.getByRole("textbox", { name: "Sign-in code" });
    await expect(code).toBeFocused();
    await expect(code).toBeInViewport({ ratio: 1 });
    await expect(page.getByRole("log")).toHaveCount(0);
    await code.fill("123456");
    await page.getByRole("button", { name: "Verify email", exact: true }).click();
    await expect(page.getByRole("log")).toContainText("I'm Ava.");
    await expect(page.getByText(`Signed in as ${ready.email}`)).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirm my setup" })).toBeVisible();
    expect(actions.slice(0, 3)).toEqual(["open", "email", "verify"]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await expect(email).toBeVisible();
    await expect(page.getByRole("log")).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Your Eden setup" })).toHaveCount(0);
  });

  test(`sign-in gate opens and reloads at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/design-your-eden");
    await expect(page.getByRole("heading", { name: "Sign in to meet Ava." })).toBeVisible();
    await expect(page.getByRole("log")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const cookies = await page.context().cookies();
    expect(cookies.some((cookie) => cookie.name === "eden-conversation" && cookie.httpOnly)).toBe(true);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Sign in to meet Ava." })).toBeVisible();
    expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })))
      .toEqual({ local: 0, session: 0 });
    expect(errors).toEqual([]);
    await page.screenshot({ path: `/private/tmp/eden-web-20260915/email-first-${width}.png`, fullPage: true });
  });
}

test("a reloaded saved reply follows progress and offers recovery after a failure", async ({ page }) => {
  const user = {id:crypto.randomUUID(),role:"user",text:"Keep my client commitments visible.",created_at:new Date().toISOString()};
  const initial = {revision:2,messages:[{id:crypto.randomUUID(),role:"assistant",text:"What would you like help with?",created_at:user.created_at},user],facts:[],summary:"",ready:false,email_verified:true,email:"saved@example.test",pending:true,confirmed:false,created:false,updated_at:user.created_at,retry_available:false};
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
  await expect(page.getByRole("textbox",{name:"Your message to Ava"})).toBeEnabled();
  await expect(page.getByRole("log").locator(":scope > div")).toHaveCount(3);
  await expect(page.getByRole("log")).toContainText("I have your saved request.");
});


test("a delayed reply cannot restore content after sign-out", async ({ page }) => {
  const now = new Date().toISOString();
  const saved = { revision: 1, messages: [{id:crypto.randomUUID(),role:"assistant",text:"Private conversation",created_at:now}], facts:[],summary:"",ready:false,email_verified:true,email:"private@example.test",pending:false,confirmed:false,created:false,updated_at:now };
  let signedIn = true;
  let release: (() => void) | undefined;
  const pending = new Promise<void>(resolve => { release = resolve; });
  let started = false;
  await page.route("**/api/eden/conversation", async route => {
    const input = route.request().postDataJSON() as { action: string };
    if (input.action === "message") { started = true; await pending; await route.fulfill({json:saved}); return; }
    if (input.action === "logout") signedIn = false;
    await route.fulfill({json:signedIn ? saved : {email_verified:false}});
  });
  await page.goto("/design-your-eden");
  await page.getByRole("textbox",{name:"Your message to Ava"}).fill("My private request");
  await page.getByRole("button",{name:"Send message",exact:true}).click();
  await expect.poll(() => started).toBe(true);
  await page.getByRole("button",{name:"Sign out",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Sign in to meet Ava."})).toBeVisible();
  const finished = page.waitForResponse(response => response.request().postData()?.includes('"action":"message"') === true);
  release?.(); await finished;
  await expect(page.getByRole("log")).toHaveCount(0);
  await expect(page.getByText("private@example.test",{exact:false})).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading",{name:"Sign in to meet Ava."})).toBeVisible();
});

test("session expiry returns to sign-in without displaying cached history", async ({ page }) => {
  let reads = 0;
  let expired = false;
  const saved = {revision:1,messages:[],facts:[],summary:"",ready:false,email_verified:true,email:"expired@example.test",pending:false,confirmed:false,created:false,updated_at:new Date().toISOString()};
  await page.route("**/api/eden/conversation", async route => {
    const input = route.request().postDataJSON() as {action:string};
    if (input.action === "get") { reads++; expired = true; await route.fulfill({status:401,json:{error:"sign_in_required"}}); return; }
    await route.fulfill({json:expired ? {email_verified:false} : saved});
  });
  await page.goto("/design-your-eden");
  await expect(page.getByText("Signed in as expired@example.test")).toBeVisible();
  await expect(page.getByRole("heading",{name:"Sign in to meet Ava."})).toBeVisible({timeout:15000});
  expect(reads).toBeGreaterThan(0);
  await expect(page.getByRole("log")).toHaveCount(0);
  await expect(page.getByRole("button",{name:"Send code",exact:true})).toBeEnabled();
});
