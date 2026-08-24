import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function continueQuestion(page: Page) {
  await page.getByRole("button", { name: "Continue" }).click();
}

async function selectOption(page: Page, name: string | RegExp) {
  const option =
    typeof name === "string"
      ? page.getByText(name, { exact: true })
      : page.getByText(name);
  await option.click();
}

async function completeQuestionnaire(
  page: Page,
  { grantInquiry = true }: { grantInquiry?: boolean } = {}
) {
  await page
    .getByRole("button", { name: /See what Eden could do for you/i })
    .click();
  await expect(page.getByRole("progressbar")).toBeVisible();

  await selectOption(page, "Operations that run themselves");
  await continueQuestion(page);

  await page
    .getByLabel("Desired outcome")
    .fill(
      "Every recurring request reaches the right owner with context and a clear next action."
    );
  await continueQuestion(page);

  await page
    .getByLabel("Current workflow challenge")
    .fill(
      "Requests arrive through several channels, then wait for manual triage and repeated follow-up."
    );
  await continueQuestion(page);

  await selectOption(page, /101–500 workflow runs/);
  await continueQuestion(page);

  await selectOption(page, "6–20 people");
  await continueQuestion(page);

  await selectOption(page, "Email, inbox, or support desk");
  await selectOption(page, "Project or operations tools");
  await continueQuestion(page);

  await selectOption(page, "Useful, but fragmented");
  await continueQuestion(page);

  await selectOption(page, "Act after clear approval");
  await continueQuestion(page);

  await selectOption(page, "Time returned to the team");
  await selectOption(page, "More consistent quality");
  await selectOption(page, "Clearer operational visibility");
  await continueQuestion(page);

  await selectOption(page, "This quarter");
  await continueQuestion(page);

  await selectOption(page, "£25k–£50k");
  await continueQuestion(page);

  await page.getByLabel("Full name").fill("Alex Morgan");
  await continueQuestion(page);

  await page.getByLabel("Work email").fill("alex@example.com");
  await continueQuestion(page);

  await page.getByLabel("Company name").fill("Northstar Operations");
  await continueQuestion(page);

  if (grantInquiry) {
    await selectOption(page, "Respond to this inquiry *");
  }
}

test.describe("Eden AI Personal Assistant", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("is one-question-at-a-time, keyboard friendly, branched, and retains answers", async ({
    page,
  }) => {
    await page.goto("/design-your-eden");
    await expect(
      page.getByRole("heading", {
        name: "Meet Eden. Your new AI personal assistant.",
      })
    ).toBeVisible();
    await expect(
      page.getByText(/Your personal interface to Aygency/i)
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "One assistant. The right specialist for every job.",
      })
    ).toBeVisible();
    await page
      .getByRole("button", { name: /See what Eden could do for you/i })
      .click();

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
    await page.keyboard.press("3");
    await expect(page.getByLabel("Operations that run themselves")).toBeChecked();
    await page.keyboard.press("Enter");

    await expect(
      page.getByRole("heading", {
        name: "What should be reliably true when this is working?",
      })
    ).toBeFocused();

    await page
      .getByLabel("Desired outcome")
      .fill("Routine work moves to the right person without manual chasing every day.");
    await page.getByLabel("Desired outcome").press("Control+Enter");

    await page
      .getByLabel("Current workflow challenge")
      .fill("The team copies requests between inboxes and trackers before work can begin.");
    await page.getByLabel("Current workflow challenge").press("Control+Enter");

    await expect(
      page.getByRole("heading", { name: "How often does this workflow run?" })
    ).toBeVisible();
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "4");

    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Current workflow challenge")).toHaveValue(
      "The team copies requests between inboxes and trackers before work can begin."
    );
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Desired outcome")).toHaveValue(
      "Routine work moves to the right person without manual chasing every day."
    );
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Operations that run themselves")).toBeChecked();
  });

  test("keeps inquiry and marketing consent separate and renders exact answers in the Blueprint", async ({
    page,
  }, testInfo) => {
    let submittedBody: Record<string, unknown> | null = null;
    await page.route("**/api/eden/applications", async (route) => {
      submittedBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          submissionId: submittedBody.submissionId,
          duplicate: false,
        }),
      });
    });

    await page.goto(
      "/design-your-eden?utm_source=linkedin&utm_campaign=blueprint&password=not-attribution"
    );
    await completeQuestionnaire(page, { grantInquiry: false });

    await expect(page.getByLabel(/Occasional practical AI systems insights/)).not.toBeChecked();
    await page
      .getByRole("button", { name: "Show me my Eden Blueprint" })
      .click();
    await expect(
      page.getByText("Consent is required so we can respond to your inquiry.")
    ).toBeVisible();
    await selectOption(page, "Respond to this inquiry *");
    await page
      .getByRole("button", { name: "Show me my Eden Blueprint" })
      .click();

    await expect(
      page.getByRole("heading", { name: "Your Eden Blueprint" })
    ).toBeVisible();
    await expect(page.getByText("Operational command system")).toBeVisible();

    await page.getByText("Your original answers").click();
    await expect(
      page.getByText(
        "Every recurring request reaches the right owner with context and a clear next action.",
        { exact: true }
      )
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Book your discovery call" })
    ).toHaveAttribute("href", "/contact");

    const submitted = submittedBody as {
      consent: { inquiry: boolean; marketing: boolean };
      attribution: Record<string, string>;
      answers: { desiredOutcome: string };
    } | null;
    expect(submitted?.consent).toEqual({ inquiry: true, marketing: false });
    expect(submitted?.attribution).toMatchObject({
      utmSource: "linkedin",
      utmCampaign: "blueprint",
      landingPath: "/design-your-eden",
    });
    expect(submitted?.attribution).not.toHaveProperty("password");
    expect(submitted?.answers.desiredOutcome).toBe(
      "Every recurring request reaches the right owner with context and a clear next action."
    );

    for (const viewport of [
      { name: "mobile-375", width: 375, height: 812 },
      { name: "tablet-768", width: 768, height: 1024 },
      { name: "laptop-1024", width: 1024, height: 768 },
      { name: "desktop-1440", width: 1440, height: 1000 },
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(0);
      await page.screenshot({
        path: testInfo.outputPath(`${viewport.name}-blueprint.png`),
        fullPage: true,
      });
    }
  });

  test("retries an immutable snapshot and preserves it after a failed response", async ({
    page,
  }) => {
    const bodies: string[] = [];
    await page.route("**/api/eden/applications", async (route) => {
      bodies.push(route.request().postData() ?? "");
      const shouldFail = bodies.length <= 2;
      await route.fulfill({
        status: shouldFail ? 503 : 202,
        contentType: "application/json",
        body: JSON.stringify(
          shouldFail
            ? {
                error:
                  "We could not safely record your application. Your answers are still here. Please try again.",
              }
            : {
                success: true,
                submissionId: JSON.parse(bodies[0]).submissionId,
                duplicate: true,
              }
        ),
      });
    });

    await page.goto("/design-your-eden");
    await completeQuestionnaire(page);
    await page
      .getByRole("button", { name: "Show me my Eden Blueprint" })
      .click();

    await expect(
      page.getByRole("heading", { name: "Your answers are still here" })
    ).toBeVisible();
    expect(bodies).toHaveLength(2);
    expect(bodies[0]).toBe(bodies[1]);

    await page.getByRole("button", { name: "Retry safely" }).click();
    await expect(
      page.getByRole("heading", { name: "Your Eden Blueprint" })
    ).toBeVisible();
    expect(bodies).toHaveLength(3);
    expect(new Set(bodies).size).toBe(1);
  });

  test("has no detectable critical accessibility violations in the form and result", async ({
    page,
  }) => {
    await page.route("**/api/eden/applications", async (route) => {
      const body = route.request().postDataJSON() as { submissionId: string };
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ success: true, submissionId: body.submissionId }),
      });
    });
    await page.goto("/design-your-eden");

    const introductionScan = await new AxeBuilder({ page })
      .include("#main-content")
      .analyze();
    expect(introductionScan.violations).toEqual([]);

    await page
      .getByRole("button", { name: /See what Eden could do for you/i })
      .click();
    await page.waitForTimeout(800);

    const formScan = await new AxeBuilder({ page })
      .include("#main-content")
      .analyze();
    expect(formScan.violations).toEqual([]);

    await page.reload();
    await completeQuestionnaire(page);
    await page
      .getByRole("button", { name: "Show me my Eden Blueprint" })
      .click();
    await expect(page.getByRole("heading", { name: "Your Eden Blueprint" })).toBeVisible();
    await page.waitForTimeout(800);
    await page.getByText("Your original answers").click();

    const resultScan = await new AxeBuilder({ page })
      .include("#main-content")
      .analyze();
    expect(resultScan.violations).toEqual([]);
  });

  for (const viewport of [
    { name: "mobile-375", width: 375, height: 812 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "laptop-1024", width: 1024, height: 768 },
    { name: "desktop-1440", width: 1440, height: 1000 },
  ]) {
    test(`has no horizontal overflow at ${viewport.width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/design-your-eden");
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(800);

      const introOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(introOverflow).toBeLessThanOrEqual(0);

      for (const sectionHeading of [
        "One assistant. The right specialist for every job.",
        "Proactive by design. Controlled by you.",
        "See what Eden could do for your operation.",
      ]) {
        await page
          .getByRole("heading", { name: sectionHeading })
          .scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
      }
      for (const revealTarget of await page
        .locator("#eden-capabilities article, [data-eden-operating-step]")
        .all()) {
        await revealTarget.scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(250);

      await page.screenshot({
        path: testInfo.outputPath(`${viewport.name}-intro.png`),
        fullPage: true,
      });

      await page
        .getByRole("button", { name: /See what Eden could do for you/i })
        .click();
      await expect(page.getByRole("progressbar")).toBeVisible();
      await page.waitForTimeout(800);
      const formOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(formOverflow).toBeLessThanOrEqual(0);
      await page.screenshot({
        path: testInfo.outputPath(`${viewport.name}-question.png`),
        fullPage: true,
      });
    });
  }
});

test.describe("Eden site integration", () => {
  test("integrates with live navigation and preserves the contact route", async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    const homeResponse = await page.goto("/");

    expect(homeResponse?.ok()).toBe(true);
    await expect(page.locator('nav a[href="/design-your-eden"]')).toHaveText(
      "AI Personal Assistant"
    );
    await expect(page.locator('footer a[href="/design-your-eden"]')).toHaveText(
      "AI Personal Assistant"
    );
    await expect(page.locator('nav a[href="/contact"]')).toHaveText("Contact Us");

    const contactResponse = await page.goto("/contact");
    expect(contactResponse?.ok()).toBe(true);
    await expect(page).toHaveTitle(/Contact \| Aygency/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const sitemapResponse = await request.get("/sitemap.xml");
    expect(sitemapResponse.ok()).toBe(true);
    expect(await sitemapResponse.text()).toContain(
      "https://aygency.ai/design-your-eden"
    );

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const mobileMenu = page.locator("div.fixed.inset-0");
    await expect(
      mobileMenu.locator('a[href="/design-your-eden"]')
    ).toHaveText("AI Personal Assistant");
    await expect(mobileMenu.locator('a[href="/contact"]')).toHaveText(
      "Contact Us"
    );
  });
});
