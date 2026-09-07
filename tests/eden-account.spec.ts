import { expect, test } from "@playwright/test";

const connection = `eden-connection-${"a".repeat(24)}`;
const token = "s".repeat(48);
const access = "synthetic-access-".repeat(4);

for (const width of [1440, 1024, 768, 375]) {
  test(`customer connection and safe retry at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const attempts: string[] = [];
    await page.route("**/api/eden/account/open", async (route) => {
      const body = route.request().postDataJSON();
      expect(body.connection_ref).toBe(connection);
      expect(body.opaque_state).toBe(token);
      expect(page.url()).not.toContain(token);
      attempts.push(body.request_id);
      await route.fulfill({
        status: attempts.length === 1 ? 409 : 200,
        contentType: "application/json",
        body: JSON.stringify(
          attempts.length === 1
            ? { error: "connection_unavailable" }
            : { status: "email_verification_required" },
        ),
      });
    });
    await page.goto(`/eden/connect#connection=${connection}&state=${token}`);
    await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByRole("heading", { name: "Check your email" }))
      .toBeVisible();
    expect(attempts).toHaveLength(2);
    expect(attempts[0]).toBe(attempts[1]);
    await page.route("**/api/eden/account/verify", async (route) => {
      expect(route.request().postDataJSON().access_token).toBe(access);
      expect(page.url()).not.toContain(access);
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          status: "connect_telegram",
          deep_link: `https://t.me/SyntheticEdenBot?start=${"t".repeat(48)}`,
          expires_at: new Date(Date.now() + 600000).toISOString(),
        }),
      });
    });
    await page.goto(
      `/eden/connect?connection=${connection}#access_token=${access}&refresh_token=must-discard`,
    );
    await expect(page.getByRole("link", { name: "Open your Builder chat" }))
      .toBeVisible();
    const persisted = await page.evaluate(() =>
      JSON.stringify({
        session: { ...sessionStorage },
        local: { ...localStorage },
      })
    );
    expect(persisted).not.toContain(access);
    expect(persisted).not.toContain(token);
    expect(persisted).not.toContain("must-discard");
    expect(
      await page.evaluate(() =>
        document.documentElement.scrollWidth <= window.innerWidth
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/eden-account-${width}.png`,
      fullPage: true,
    });
  });
}

test("a connection reference alone does not open a private chat", async ({ page }) => {
  await page.goto("/eden/connect");
  await expect(page.getByRole("heading", { name: "Your Eden starts here" }))
    .toBeVisible();
  await expect(page.getByRole("link", { name: "Open your Builder chat" }))
    .toHaveCount(0);
});
