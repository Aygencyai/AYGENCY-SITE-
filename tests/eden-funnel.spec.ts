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
  {
    grantInquiry = true,
    onBuyingPriorityStep,
  }: {
    grantInquiry?: boolean;
    onBuyingPriorityStep?: (page: Page) => Promise<void>;
  } = {}
) {
  await page
    .getByRole("button", { name: /See what Eden could do for you/i })
    .click();
  await expect(page.getByRole("progressbar")).toBeVisible();

  await page.getByLabel("Work email").fill("alex@example.com");
  await continueQuestion(page);

  await selectOption(page, "Coordinate projects and recurring work");
  await continueQuestion(page);

  await page
    .getByLabel("Desired outcome")
    .fill(
      "Every recurring request reaches the right owner with context and a clear next action."
    );
  await continueQuestion(page);

  await page
    .getByLabel("Current working challenge")
    .fill(
      "Requests arrive through several channels, then wait for manual triage and repeated follow-up."
    );
  await continueQuestion(page);

  await selectOption(page, /101–500 tasks or hand-offs/);
  await continueQuestion(page);

  await selectOption(page, "A team of 6–20");
  await continueQuestion(page);

  await selectOption(page, "Email, calendar, or support inbox");
  await selectOption(page, "Project or task management");
  await continueQuestion(page);

  await selectOption(page, "Useful, spread across a few places");
  await continueQuestion(page);

  await selectOption(page, "Act after clear approval");
  await continueQuestion(page);

  await selectOption(page, "Hours back each week");
  await selectOption(page, "More reliable execution");
  await selectOption(page, "Clearer priorities and open actions");
  await continueQuestion(page);

  await selectOption(page, "During the next three months");
  await continueQuestion(page);

  await onBuyingPriorityStep?.(page);
  await selectOption(page, "Getting the strongest fit and result");
  await continueQuestion(page);

  await page.getByLabel("Full name").fill("Alex Morgan");
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

  test("starts with a required email gate, stays keyboard friendly, branches, and retains answers", async ({
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
      .getByRole("button", { name: "Show me what Eden could do" })
      .click();

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");

    await expect(
      page.getByRole("heading", {
        name: "Where should we send your Eden Blueprint?",
      })
    ).toBeFocused();
    await page.getByLabel("Work email").fill("not-an-email");
    await continueQuestion(page);
    await expect(page.getByText("Enter a valid work email address.")).toBeVisible();
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");

    await page.getByLabel("Work email").fill("alex@example.com");
    await page.getByLabel("Work email").press("Enter");
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
    await expect(
      page.getByRole("heading", {
        name: "What should Eden take off your plate first?",
      })
    ).toBeFocused();
    await page.keyboard.press("3");
    await expect(
      page.getByLabel("Coordinate projects and recurring work")
    ).toBeChecked();
    await page.keyboard.press("Enter");

    await expect(
      page.getByRole("heading", {
        name: "What should Eden make reliably true each week?",
      })
    ).toBeFocused();

    await page
      .getByLabel("Desired outcome")
      .fill("Routine work moves to the right person without manual chasing every day.");
    await page.getByLabel("Desired outcome").press("Control+Enter");

    await page
      .getByLabel("Current working challenge")
      .fill("The team copies requests between inboxes and trackers before work can begin.");
    await page.getByLabel("Current working challenge").press("Control+Enter");

    await expect(
      page.getByRole("heading", {
        name: "How many tasks or hand-offs could Eden coordinate each week?",
      })
    ).toBeVisible();
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "5");

    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Current working challenge")).toHaveValue(
      "The team copies requests between inboxes and trackers before work can begin."
    );
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Desired outcome")).toHaveValue(
      "Routine work moves to the right person without manual chasing every day."
    );
    await page.getByRole("button", { name: "Back" }).click();
    await expect(
      page.getByLabel("Coordinate projects and recurring work")
    ).toBeChecked();
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Work email")).toHaveValue("alex@example.com");
  });

  test("keeps consent separate and renders exact answers, a tailored example, and contact actions", async ({
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
    await completeQuestionnaire(page, {
      grantInquiry: false,
      onBuyingPriorityStep: async (currentPage) => {
        await expect(
          currentPage.getByRole("heading", {
            name: "What matters most when choosing your Eden?",
          })
        ).toBeVisible();

        for (const viewport of [
          { name: "mobile-375", width: 375, height: 812 },
          { name: "tablet-768", width: 768, height: 1024 },
          { name: "laptop-1024", width: 1024, height: 768 },
          { name: "desktop-1440", width: 1440, height: 1000 },
        ]) {
          await currentPage.setViewportSize({
            width: viewport.width,
            height: viewport.height,
          });
          const overflow = await currentPage.evaluate(
            () =>
              document.documentElement.scrollWidth -
              document.documentElement.clientWidth
          );
          expect(overflow).toBeLessThanOrEqual(0);
          await currentPage.screenshot({
            path: testInfo.outputPath(`${viewport.name}-buying-priority.png`),
            fullPage: true,
          });
        }
      },
    });

    await expect(
      page.getByLabel(/Aygency newsletter and Eden updates/)
    ).not.toBeChecked();
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
    await expect(page.getByText("Project coordination assistant")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "An example of what your Eden can do for you",
      })
    ).toBeVisible();
    await expect(
      page.getByText("A project update becomes a clear next action.")
    ).toBeVisible();
    await expect(
      page.getByText("101–500 tasks or hand-offs / week", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText(
        "Email, calendar, or support inbox and Project or task management",
        { exact: true }
      )
    ).toBeVisible();

    await page.getByText("Your original answers").click();
    await expect(
      page.getByText(
        "Every recurring request reaches the right owner with context and a clear next action.",
        { exact: true }
      )
    ).toBeVisible();
    await expect(
      page.getByText("Getting the strongest fit and result", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Email build@aygency.ai" })
    ).toHaveAttribute(
      "href",
      "mailto:build@aygency.ai?subject=Eden%20AI%20Personal%20Assistant%20enquiry"
    );
    await expect(
      page.getByRole("link", { name: "Book a discovery call" })
    ).toHaveAttribute("href", "/contact");

    const submitted = submittedBody as {
      consent: { inquiry: boolean; marketing: boolean };
      attribution: Record<string, string>;
      answers: { desiredOutcome: string; buyingPriority: string };
      contact: { workEmail: string };
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
    expect(submitted?.answers.buyingPriority).toBe("best_result");
    expect(submitted?.answers).not.toHaveProperty("investmentRange");
    expect(submitted?.contact.workEmail).toBe("alex@example.com");

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
                code: "crm_unavailable",
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
      page.getByRole("heading", { name: "CRM storage needs another attempt" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Email build@aygency.ai" })
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

  test("offers an honest Blueprint preview when CRM storage is unavailable", async ({
    page,
  }) => {
    await page.route("**/api/eden/applications", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          error: "The CRM is unavailable.",
          code: "crm_unavailable",
        }),
      });
    });

    await page.goto("/design-your-eden");
    await completeQuestionnaire(page);
    await page
      .getByRole("button", { name: "Show me my Eden Blueprint" })
      .click();

    await expect(
      page.getByRole("heading", { name: "CRM storage needs another attempt" })
    ).toBeVisible();
    await expect(
      page.getByText(
        "The CRM is temporarily unavailable. Your Eden Blueprint is ready to preview."
      )
    ).toBeVisible();
    await page.getByRole("button", { name: "Preview my Blueprint" }).click();

    await expect(
      page.getByText("Blueprint preview // Submission pending")
    ).toBeVisible();
    await expect(
      page.getByText(
        "This preview is based on answers held in this browser. CRM storage is still pending."
      )
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Email build@aygency.ai" })
    ).toBeVisible();
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
    await page.waitForTimeout(800);

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
