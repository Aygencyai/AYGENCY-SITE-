import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const turnstileRoute = "**/turnstile/v0/api.js?render=explicit";

async function installTurnstileStub(page: Page, outcome: "success" | "idle" = "success") {
  await page.route(turnstileRoute, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: `window.turnstile={render:function(container,options){container.setAttribute('data-test-turnstile','rendered');${
        outcome === "success"
          ? "queueMicrotask(function(){options.callback('XXXX.DUMMY.TOKEN.XXXX')});"
          : ""
      }return 'eden-test-widget';},remove:function(){}};`,
    });
  });
}

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

async function selectGroupedOption(page: Page, group: string, option: string) {
  await page
    .getByRole("group", { name: group })
    .getByText(option, { exact: true })
    .click();
}

async function completeQuestionnaire(
  page: Page,
  {
    currentFriction =
      "Follow-ups, meeting preparation, and travel changes compete for attention, so client commitments are revisited too late.",
    onOrganisationStep,
    shareOrganisation = true,
  }: {
    currentFriction?: string;
    onOrganisationStep?: (page: Page) => Promise<void>;
    shareOrganisation?: boolean;
  } = {},
) {
  await page.getByRole("button", { name: /See what Eden could do for you/i }).click();
  await expect(page.getByRole("progressbar")).toBeVisible();

  await page.getByLabel("Work email").fill("alex@example.com");
  await page.getByLabel(/Send my Eden summary and respond to my inquiry/).check();
  await expect(page.locator('[data-test-turnstile="rendered"]')).toBeVisible();
  await continueQuestion(page);

  await selectOption(page, "Protect my time");
  await selectOption(page, "Keep tasks and requests moving");
  await selectOption(page, "Prepare me better for meetings");
  await selectOption(page, "Coordinate work travel");
  await continueQuestion(page);

  await page
    .getByLabel("Weekly support")
    .fill("Keep track of replies, prepare meetings, and make sure agreed actions happen without me rebuilding context.");
  await continueQuestion(page);

  await page
    .getByLabel("Desired weekly result")
    .fill("I start each day knowing what matters and finish the week with important follow-ups completed.");
  await continueQuestion(page);

  await page.getByLabel("Current friction").fill(currentFriction);
  await continueQuestion(page);

  await selectGroupedOption(page, "Weekly tasks, requests, and follow-ups", "About 26 to 50");
  await continueQuestion(page);

  await page.getByLabel("Hours lost weekly").fill("14");
  await continueQuestion(page);

  await selectGroupedOption(page, "Meeting load", "Meetings take up most days");
  await continueQuestion(page);
  await selectGroupedOption(page, "Email load", "Important messages are easy to miss");
  await continueQuestion(page);
  await selectGroupedOption(page, "Calendar complexity", "Many people, time zones, or dependencies");
  await continueQuestion(page);
  await selectGroupedOption(page, "Travel frequency", "About once a month");
  await continueQuestion(page);

  await selectOption(page, "Microsoft 365");
  await selectOption(page, "Notion");
  await continueQuestion(page);

  await selectGroupedOption(page, "Information readiness", "It is spread across different places");
  await continueQuestion(page);

  await page
    .getByLabel("Day-one context")
    .fill("Client work and running the company compete for time, and mornings should remain protected for focused work.");
  await continueQuestion(page);

  await selectGroupedOption(page, "Initial support", "A small team");
  await continueQuestion(page);

  await selectGroupedOption(page, "Starting level of help", "Prepare work for my approval");
  await continueQuestion(page);

  await page
    .getByLabel("Decision boundaries")
    .fill("Always bring back client commitments, spending, important date changes, and messages sent in my name.");
  await continueQuestion(page);

  await page
    .getByLabel("Briefing preferences")
    .fill("A short morning plan, meeting briefs, and one end-of-day list of anything still waiting on me.");
  await continueQuestion(page);

  await page
    .getByLabel("Success measure")
    .fill("I recover focused time, arrive prepared, and people no longer need to chase me for important follow-ups.");
  await continueQuestion(page);

  await selectGroupedOption(
    page,
    "Eden service model",
    "Aygency looks after and improves Eden with me",
  );
  await continueQuestion(page);

  await selectOption(page, "Within 30 days");
  await continueQuestion(page);

  await selectGroupedOption(
    page,
    "Outcome or price priority",
    "Getting the strongest outcome, even if it costs more",
  );
  await continueQuestion(page);

  await page.getByLabel("Full name").fill("Alex Morgan");
  await page.getByLabel("Role title").fill("Founder");
  await page.getByLabel("Phone (international format)").fill("+447700900123");
  await page
    .getByLabel("LinkedIn URL")
    .fill("https://www.linkedin.com/in/example-applicant");
  await continueQuestion(page);

  if (shareOrganisation) {
    await page.getByLabel("Organisation name").fill("Northstar Advisory");
    await page.getByLabel("Website").fill("https://northstar.example.com");
    await page.getByLabel("Company number").fill("01234567");
    await page.getByLabel("Country").selectOption("GB");
    await selectOption(page, "11 to 50 people");
  }
  await onOrganisationStep?.(page);
  await continueQuestion(page);

  await page
    .getByLabel("Additional discovery context")
    .fill("A measured first release should focus on follow-through before expanding scope.");

  await expect(page.locator('[data-test-turnstile="rendered"]')).toBeVisible();
}

test.describe("Eden AI Personal Assistant", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await installTurnstileStub(page);
    await page.route("**/api/eden/leads", async (route) => {
      const body = route.request().postDataJSON() as { applicationId: string };
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          applicationId: body.applicationId,
          duplicate: false,
          recorded: true,
        }),
      });
    });
  });

  test("starts with a required email gate, supports keyboard flow, and retains exact answers", async ({
    page,
  }) => {
    await page.goto("/design-your-eden");
    await expect(
      page.getByRole("heading", { name: "Meet Eden. Your new AI personal assistant." }),
    ).toBeVisible();
    await expect(page.getByText(/Your personal interface to Aygency/i)).toBeVisible();
    await page.getByRole("button", { name: /See what Eden could do for you/i }).click();

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
    await expect(
      page.getByRole("heading", { name: "First, where should we send your Eden summary?" }),
    ).toBeFocused();

    await page.getByLabel("Work email").fill("not-an-email");
    await continueQuestion(page);
    await expect(page.getByText("Enter a valid work email address.")).toBeVisible();

    await page.getByLabel("Work email").fill("alex@example.com");
    await page.getByLabel(/Send my Eden summary and respond to my inquiry/).check();
    await page.getByLabel("Work email").press("Enter");
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
    await expect(
      page.getByRole("heading", { name: "What should Eden take off your plate first?" }),
    ).toBeFocused();
    await page.keyboard.press("1");
    await expect(page.getByLabel("Protect my time")).toBeChecked();
    await page.keyboard.press("Enter");

    await page
      .getByLabel("Weekly support")
      .fill("Prepare my meetings and make sure important replies and follow-ups happen each week.");
    await page.getByLabel("Weekly support").press("Control+Enter");
    await page
      .getByLabel("Desired weekly result")
      .fill("I begin each day with a clear plan and finish the week with important actions completed.");
    await page.getByLabel("Desired weekly result").press("Control+Enter");
    await page
      .getByLabel("Current friction")
      .fill("Important commitments are rebuilt from email and meeting notes, which delays replies and frustrates people.");
    await page.getByLabel("Current friction").press("Control+Enter");
    await selectGroupedOption(page, "Weekly tasks, requests, and follow-ups", "About 10 to 25");
    await page.keyboard.press("Enter");
    await page.getByLabel("Hours lost weekly").fill("12");
    await page.getByLabel("Hours lost weekly").press("Enter");
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "8");

    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Hours lost weekly")).toHaveValue("12");
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("About 10 to 25")).toBeChecked();
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Current friction")).toHaveValue(
      "Important commitments are rebuilt from email and meeting notes, which delays replies and frustrates people.",
    );
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Desired weekly result")).toHaveValue(
      "I begin each day with a clear plan and finish the week with important actions completed.",
    );
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Weekly support")).toHaveValue(
      "Prepare my meetings and make sure important replies and follow-ups happen each week.",
    );
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Protect my time")).toBeChecked();
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Work email")).toHaveValue("alex@example.com");
  });

  test("submits the exact contract facts, keeps consent separate, and renders an inert Blueprint", async ({
    page,
  }, testInfo) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    let submittedBody: Record<string, unknown> | null = null;
    let capturedBody: Record<string, unknown> | null = null;
    await page.route("**/api/eden/leads", async (route) => {
      const body = route.request().postDataJSON() as Record<string, unknown>;
      capturedBody = body;
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          applicationId: body.applicationId,
          duplicate: false,
          recorded: true,
        }),
      });
    });
    await page.route("**/api/eden/applications", async (route) => {
      submittedBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          applicationId: submittedBody.applicationId,
          duplicate: false,
        }),
      });
    });

    const maliciousButInert =
      '<img src=x onerror="window.__edenInjected=true"> Follow-ups and meeting preparation compete for attention every day.';
    await page.goto(
      "/design-your-eden?utm_source=linkedin&utm_campaign=blueprint&gclid=excluded&password=excluded",
    );
    await completeQuestionnaire(page, {
      currentFriction: maliciousButInert,
      onOrganisationStep: async (currentPage) => {
        for (const viewport of [
          { name: "mobile-375", width: 375, height: 812 },
          { name: "tablet-768", width: 768, height: 1024 },
          { name: "laptop-1024", width: 1024, height: 768 },
          { name: "desktop-1440", width: 1440, height: 1000 },
        ]) {
          await currentPage.setViewportSize(viewport);
          expect(
            await currentPage.evaluate(
              () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
            ),
          ).toBeLessThanOrEqual(0);
          await currentPage.screenshot({
            path: testInfo.outputPath(`${viewport.name}-organisation.png`),
            fullPage: true,
          });
        }
      },
    });

    await expect(page.getByLabel(/Send me useful Eden updates too/)).not.toBeChecked();
    const submitButton = page.getByRole("button", { name: "Show me my Eden Blueprint" });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    await expect(page.getByRole("heading", { name: "This is how your Eden can help" })).toBeVisible();
    expect(submittedBody).not.toBeNull();
    expect(capturedBody).not.toBeNull();
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    await expect(page.getByText("Personal assistant for work and travel")).toBeVisible();
    await expect(page.getByRole("heading", { name: "What Eden can take off your plate" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Keep tasks, requests, and promises moving" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Prepare meetings and remember what comes next" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Keep work travel organised" })).toBeVisible();
    await expect(page.getByText("About 26 to 50", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(maliciousButInert, { exact: true })).toBeHidden();
    for (const viewport of [
      { name: "mobile-375", width: 375, height: 812 },
      { name: "tablet-768", width: 768, height: 1024 },
      { name: "laptop-1024", width: 1024, height: 768 },
      { name: "desktop-1440", width: 1440, height: 1000 },
    ]) {
      await page.setViewportSize(viewport);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
      ).toBeLessThanOrEqual(0);
      await page.screenshot({
        path: testInfo.outputPath(`${viewport.name}-result.png`),
        fullPage: true,
      });
    }
    await page.getByText("Your original answers").click();
    await expect(page.getByText(maliciousButInert, { exact: true })).toBeVisible();
    expect(await page.evaluate(() => (window as typeof window & { __edenInjected?: boolean }).__edenInjected)).not.toBe(true);
    await expect(page.locator("img[src='x']")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Email build@aygency.ai" })).toHaveAttribute(
      "href",
      "mailto:build@aygency.ai?subject=Eden%20AI%20Personal%20Assistant%20enquiry",
    );

    const submitted = submittedBody as {
      eventId: string;
      applicationId: string;
      answers: {
        primaryOutcomes: string[];
        currentFriction: string;
        hoursLostWeekly: number;
        operatedServiceAck: boolean;
      };
      consent: { inquiry: boolean; marketing: boolean };
      attribution: Record<string, string>;
      botToken: string;
      organisation: { countryCode: string; sizeBand: string };
    } | null;
    expect(submitted?.eventId).toMatch(/^[0-9a-f-]{36}$/);
    expect(submitted?.applicationId).toMatch(/^[0-9a-f-]{36}$/);
    expect(submitted?.eventId).not.toBe(submitted?.applicationId);
    expect(capturedBody).toMatchObject({
      applicationId: submitted?.applicationId,
      workEmail: "alex@example.com",
      inquiryConsent: true,
      attribution: {
        utmSource: "linkedin",
        utmCampaign: "blueprint",
        landingPath: "/design-your-eden",
      },
      botToken: "XXXX.DUMMY.TOKEN.XXXX",
    });
    expect(submitted?.answers).toMatchObject({
      primaryOutcomes: [
        "protect-time",
        "keep-tasks-moving",
        "improve-meeting-readiness",
        "coordinate-travel",
      ],
      weeklyWorkloadVolume: "26-50",
      currentFriction: maliciousButInert,
      hoursLostWeekly: 14,
      operatedServiceAck: true,
    });
    expect(submitted?.consent).toEqual({ inquiry: true, marketing: false });
    expect(submitted?.attribution).toMatchObject({
      utmSource: "linkedin",
      utmCampaign: "blueprint",
      landingPath: "/design-your-eden",
    });
    expect(submitted?.attribution).not.toHaveProperty("gclid");
    expect(submitted?.attribution).not.toHaveProperty("password");
    expect(submitted?.botToken).toBe("XXXX.DUMMY.TOKEN.XXXX");
    expect(submitted?.organisation).toMatchObject({ countryCode: "GB", sizeBand: "11-50" });
  });

  test("lets a prospect skip organisation context without fabricating it", async ({
    page,
  }) => {
    let submittedBody: { organisation?: unknown } | null = null;
    await page.route("**/api/eden/applications", async (route) => {
      submittedBody = route.request().postDataJSON() as { organisation?: unknown };
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ success: true, recorded: true }),
      });
    });

    await page.goto("/design-your-eden");
    await completeQuestionnaire(page, { shareOrganisation: false });
    await page.getByRole("button", { name: "Show me my Eden Blueprint" }).click();

    await expect(page.getByRole("heading", { name: "This is how your Eden can help" })).toBeVisible();
    expect(
      (submittedBody as unknown as { organisation?: unknown } | null)?.organisation,
    ).toBeNull();
    await page.getByText("Your original answers").click();
    await expect(
      page.getByRole("group").getByText("Not shared", { exact: true }),
    ).toBeVisible();
  });

  test("fails closed when the Turnstile proof is absent", async ({ page }) => {
    await page.unroute(turnstileRoute);
    await page.unroute("**/api/eden/leads");
    await installTurnstileStub(page, "idle");
    let apiCalls = 0;
    await page.route("**/api/eden/leads", async (route) => {
      apiCalls += 1;
      await route.abort();
    });

    await page.goto("/design-your-eden");
    await page.getByRole("button", { name: /See what Eden could do for you/i }).click();
    await page.getByLabel("Work email").fill("alex@example.com");
    await page.getByLabel(/Send my Eden summary and respond to my inquiry/).check();
    await continueQuestion(page);

    await expect(page.getByText("Complete the security check before continuing.")).toBeVisible();
    expect(apiCalls).toBe(0);
  });

  test("retries one immutable browser snapshot and preserves it after failure", async ({
    page,
  }) => {
    const bodies: string[] = [];
    await page.route("**/api/eden/applications", async (route) => {
      bodies.push(route.request().postData() ?? "");
      const shouldFail = bodies.length <= 2;
      const first = JSON.parse(bodies[0]) as { applicationId: string };
      await route.fulfill({
        status: shouldFail ? 503 : 202,
        contentType: "application/json",
        body: JSON.stringify(
          shouldFail
            ? { error: "Storage unavailable.", code: "crm_unavailable" }
            : { success: true, applicationId: first.applicationId, duplicate: true },
        ),
      });
    });

    await page.goto("/design-your-eden");
    await completeQuestionnaire(page);
    await page.getByRole("button", { name: "Show me my Eden Blueprint" }).click();
    await expect(page.getByRole("heading", { name: "CRM storage needs another attempt" })).toBeVisible();
    expect(bodies).toHaveLength(2);
    expect(bodies[0]).toBe(bodies[1]);

    await page.getByRole("button", { name: "Retry safely" }).click();
    await expect(page.getByRole("heading", { name: "This is how your Eden can help" })).toBeVisible();
    expect(bodies).toHaveLength(3);
    expect(new Set(bodies).size).toBe(1);
  });

  test("reports an idempotency conflict honestly and still offers a local preview", async ({
    page,
  }) => {
    await page.route("**/api/eden/applications", async (route) => {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({ error: "Safe retry conflict.", code: "crm_conflict" }),
      });
    });

    await page.goto("/design-your-eden");
    await completeQuestionnaire(page);
    await page.getByRole("button", { name: "Show me my Eden Blueprint" }).click();
    await expect(page.getByText(/could not confirm this retry safely/i)).toBeVisible();
    await page.getByRole("button", { name: "Preview my Blueprint" }).click();
    await expect(page.getByText("Blueprint preview // Submission pending")).toBeVisible();
  });

  test("has no detectable critical accessibility violations in intro, form, and result", async ({
    page,
  }) => {
    await page.route("**/api/eden/applications", async (route) => {
      const body = route.request().postDataJSON() as { applicationId: string };
      await route.fulfill({
        status: 202,
        contentType: "application/json",
        body: JSON.stringify({ success: true, applicationId: body.applicationId }),
      });
    });
    await page.goto("/design-your-eden");
    await page.waitForTimeout(500);
    expect((await new AxeBuilder({ page }).include("#main-content").analyze()).violations).toEqual([]);

    await page.getByRole("button", { name: /See what Eden could do for you/i }).click();
    await page.waitForTimeout(500);
    expect((await new AxeBuilder({ page }).include("#main-content").analyze()).violations).toEqual([]);

    await page.reload();
    await completeQuestionnaire(page);
    await page.getByRole("button", { name: "Show me my Eden Blueprint" }).click();
    await expect(page.getByRole("heading", { name: "This is how your Eden can help" })).toBeVisible();
    await page.getByText("Your original answers").click();
    expect((await new AxeBuilder({ page }).include("#main-content").analyze()).violations).toEqual([]);
  });

  for (const viewport of [
    { name: "mobile-375", width: 375, height: 812 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "laptop-1024", width: 1024, height: 768 },
    { name: "desktop-1440", width: 1440, height: 1000 },
  ]) {
    test(`has no horizontal overflow at ${viewport.width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize(viewport);
      await page.goto("/design-your-eden");
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
      ).toBeLessThanOrEqual(0);
      await page.screenshot({
        path: testInfo.outputPath(`${viewport.name}-intro.png`),
        fullPage: true,
      });

      await page.getByRole("button", { name: /See what Eden could do for you/i }).click();
      await expect(page.getByRole("progressbar")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
      ).toBeLessThanOrEqual(0);
      await page.screenshot({
        path: testInfo.outputPath(`${viewport.name}-question.png`),
        fullPage: true,
      });
    });
  }
});

test.describe("Eden site integration", () => {
  test("integrates with live navigation and preserves contact and sitemap routes", async ({
    page,
    request,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    expect((await page.goto("/"))?.ok()).toBe(true);
    await expect(page.locator('nav a[href="/design-your-eden"]')).toHaveText(
      "AI Personal Assistant",
    );
    await expect(page.locator('footer a[href="/design-your-eden"]')).toHaveText(
      "AI Personal Assistant",
    );
    await expect(page.locator('nav a[href="/contact"]')).toHaveText("Contact Us");

    expect((await page.goto("/contact"))?.ok()).toBe(true);
    await expect(page).toHaveTitle(/Contact \| Aygency/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const sitemapResponse = await request.get("/sitemap.xml");
    expect(sitemapResponse.ok()).toBe(true);
    expect(await sitemapResponse.text()).toContain("https://aygency.ai/design-your-eden");

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const mobileMenu = page.locator("div.fixed.inset-0");
    await expect(mobileMenu.locator('a[href="/design-your-eden"]')).toHaveText(
      "AI Personal Assistant",
    );
    await expect(mobileMenu.locator('a[href="/contact"]')).toHaveText("Contact Us");
  });
});
