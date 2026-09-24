import { expect, test } from "@playwright/test";
import { homedir } from "node:os";
import { join } from "node:path";

const connection = "eden-connection-" + "a".repeat(24);
const link = "connect-" + "b".repeat(24);
const callback = "synthetic-provider-session-uri";
const providerHost = (width: number) => width === 375 ? "app.composio.dev" : "connect.composio.dev";

for (const width of [1440, 1024, 768, 375]) {
  test(`password account and provider handoff at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    let authenticated = false;
    await page.route("**/api/eden/conversation", async route => {
      const body = route.request().postDataJSON();
      if (body.action === "signin") {
        expect(body.email).toBe("customer@example.test");
        expect(body.password).toBe("synthetic-password-only");
        authenticated = true;
      } else expect(body.action).toBe("open");
      await route.fulfill({ json: { authenticated } });
    });
    await page.route("**/api/eden/connections", async route => {
      expect(authenticated).toBe(true);
      expect(route.request().postDataJSON()).toEqual({ action: "start", connection_ref: connection, link_id: link });
      expect(page.url()).not.toContain(connection);
      await route.fulfill({ json: { url: `https://${providerHost(width)}/link/synthetic-only` } });
    });
    await page.route(`https://${providerHost(width)}/**`, route => route.fulfill({
      contentType: "text/html", body: "<h1>Synthetic provider handoff</h1>",
    }));
    await page.goto(`/eden/connections#connection=${connection}&link=${link}`);
    await expect(page.getByRole("heading", { name: "Sign in to your Eden account" })).toBeVisible();
    await expect(page.locator("main")).not.toContainText("Composio");
    await page.getByLabel("Email address", { exact: true }).fill("customer@example.test");
    await page.getByLabel("Password", { exact: true }).fill("synthetic-password-only");
    await expect(page.locator("section > div").filter({ has: page.getByRole("heading", { name: "Sign in to your Eden account" }) })).toHaveCSS("opacity", "1");
    await page.screenshot({ path: join(homedir(), ".eden-web-local/evidence", `generic-connection-account-${width}.png`), fullPage: true });
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Connect your account", exact: true })).toBeVisible();
    expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length,
      fits: document.documentElement.scrollWidth <= innerWidth }))).toEqual({ local: 0, session: 0, fits: true });
    await page.getByRole("button", { name: "Continue to sign in" }).click();
    await expect(page.getByRole("heading", { name: "Synthetic provider handoff" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test(`pending then verified return at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route("**/api/eden/conversation", route => route.fulfill({ json: { authenticated: true } }));
    let calls = 0;
    await page.route("**/api/eden/connections", async route => {
      expect(page.url()).not.toContain(callback);
      expect(route.request().postDataJSON()).toEqual({ action: "complete", session_uri: callback });
      await route.fulfill({ json: ++calls === 1 ? { status: "pending", reason: "awaiting-microsoft" } :
        { status: "active", reason: "verified" } });
    });
    await page.goto(`/eden/connections?session_uri=${callback}`);
    await expect(page.getByRole("heading", { name: "Your sign-in is still processing" })).toBeVisible();
    await page.getByRole("button", { name: "Check connection" }).click();
    await expect(page.getByRole("heading", { name: "Your account is connected" })).toBeVisible();
    expect(calls).toBe(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  });
}

test("wrong account can sign in again without storing the provider session", async ({ page }) => {
  let corrected = false;
  await page.route("**/api/eden/conversation", async route => {
    if (route.request().postDataJSON().action === "signin") corrected = true;
    await route.fulfill({ json: { authenticated: true } });
  });
  await page.route("**/api/eden/connections", route => route.fulfill(corrected ?
    { json: { status: "active", reason: "verified" } } : { status: 409, json: { error: "connection_unavailable" } }));
  await page.goto(`/eden/connections?session_uri=${callback}`);
  await expect(page.getByRole("heading", { name: "We couldn’t verify this connection" })).toBeVisible();
  await page.getByRole("button", { name: "Use my Eden account" }).click();
  await page.getByLabel("Email address").fill("correct@example.test");
  await page.getByLabel("Password", { exact: true }).fill("synthetic-password-only");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your account is connected" })).toBeVisible();
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test("missing and duplicated callback parameters cannot trigger verification", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/eden/**", route => { calls++; return route.fulfill({ json: {} }); });
  for (const path of ["/eden/connections", `/eden/connections?session_uri=${callback}&session_uri=other`]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "Open the link from Eden" })).toBeVisible();
  }
  expect(calls).toBe(0);
});

test("a fresh chat link replaces a completed connection in the same tab", async ({ page }) => {
  let accountChecks = 0;
  await page.route("**/api/eden/conversation", route => {
    accountChecks++;
    return route.fulfill({ json: { authenticated: true } });
  });
  await page.route("**/api/eden/connections", async route => {
    const body = route.request().postDataJSON();
    if (body.action === "complete") {
      expect(body).toEqual({ action: "complete", session_uri: callback });
      return route.fulfill({ json: { status: "active", reason: "verified" } });
    }
    expect(body).toEqual({ action: "start", connection_ref: connection, link_id: link });
    return route.fulfill({ json: { url: "https://connect.composio.dev/link/reconnect-only" } });
  });
  await page.route("https://connect.composio.dev/**", route => route.fulfill({
    contentType: "text/html", body: "<h1>Fresh connection consent</h1>",
  }));
  await page.goto(`/eden/connections?session_uri=${callback}`);
  await expect(page.getByRole("heading", { name: "Your account is connected" })).toBeVisible();
  await page.evaluate(fragment => { window.location.hash = fragment; },
    `connection=${connection}&link=${link}`);
  await expect(page.getByRole("heading", { name: "Connect your account", exact: true })).toBeVisible();
  expect(accountChecks).toBe(2);
  expect(new URL(page.url()).hash).toBe("");
  await page.getByRole("button", { name: "Continue to sign in" }).click();
  await expect(page.getByRole("heading", { name: "Fresh connection consent" })).toBeVisible();
});
