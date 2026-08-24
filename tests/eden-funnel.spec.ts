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
    grantInquiry = true,
    currentFriction =
      "Follow-ups, meeting preparation, and travel changes compete for attention, so client commitments are revisited too late.",
    onOrganisationStep,
  }: {
    grantInquiry?: boolean;
    currentFriction?: string;
    onOrganisationStep?: (page: Page) => Promise<void>;
  } = {},
) {
  await page.getByRole("button", { name: /See what Eden could do for you/i }).click();
  await expect(page.getByRole("progressbar")).toBeVisible();

  await page.getByLabel("Work email").fill("alex@example.com");
  await continueQuestion(page);

  await selectOption(page, "Protect my time");
  await selectOption(page, "Close open loops");
  await selectOption(page, "Improve meeting readiness");
  await selectOption(page, "Coordinate travel");
  await continueQuestion(page);

  await page.getByLabel("Current friction").fill(currentFriction);
  await continueQuestion(page);

  await page.getByLabel("Hours lost weekly").fill("14");
  await continueQuestion(page);

  await selectGroupedOption(page, "Open-loop volume", "High");
  await continueQuestion(page);
  await selectGroupedOption(page, "Meeting load", "High");
  await continueQuestion(page);
  await selectGroupedOption(page, "Email load", "High");
  await continueQuestion(page);
  await selectGroupedOption(page, "Calendar complexity", "Complex");
  await continueQuestion(page);
  await selectGroupedOption(page, "Travel frequency", "About monthly");
  await continueQuestion(page);

  await selectOption(page, "Microsoft 365");
  await selectOption(page, "Notion");
  await continueQuestion(page);

  await selectOption(page, "I can decide");
  await continueQuestion(page);
  await selectOption(page, "Within 30 days");
  await continueQuestion(page);
  await selectOption(page, "Budget is approved");
  await continueQuestion(page);

  await selectGroupedOption(
    page,
    "Aygency-operated service acknowledgement",
    "Yes",
  );
  await selectGroupedOption(
    page,
    "Safe application-data boundary acknowledgement",
    "Yes",
  );
  await continueQuestion(page);

  await page.getByLabel("Full name").fill("Alex Morgan");
  await page.getByLabel("Role title").fill("Founder");
  await page.getByLabel("Phone (international format)").fill("+447700900123");
  await page
    .getByLabel("LinkedIn URL")
    .fill("https://www.linkedin.com/in/example-applicant");
  await continueQuestion(page);

  await page.getByLabel(/Organisation name/).fill("Northstar Advisory");
  await page.getByLabel("Website").fill("https://northstar.example.com");
  await page.getByLabel("Company number").fill("01234567");
  await page.getByLabel(/Two-letter country code/).fill("gb");
  await selectOption(page, "11–50 people");
  await onOrganisationStep?.(page);
  await continueQuestion(page);

  await page
    .getByLabel("Additional discovery context")
    .fill("A measured first release should focus on follow-through before expanding scope.");
  await continueQuestion(page);

  await expect(page.locator('[data-test-turnstile="rendered"]')).toBeVisible();
  if (grantInquiry) {
    await page.getByLabel(/Process and follow up on this application/).check();
  }
}

test.describe("Eden AI Personal Assistant", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await installTurnstileStub(page);
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
      page.getByRole("heading", { name: "Where should we send your Eden Blueprint?" }),
    ).toBeFocused();

    await page.getByLabel("Work email").fill("not-an-email");
    await continueQuestion(page);
    await expect(page.getByText("Enter a valid work email address.")).toBeVisible();

    await page.getByLabel("Work email").fill("alex@example.com");
    await page.getByLabel("Work email").press("Enter");
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
    await expect(
      page.getByRole("heading", { name: "What should Eden improve first?" }),
    ).toBeFocused();
    await page.keyboard.press("1");
    await expect(page.getByLabel("Protect my time")).toBeChecked();
    await page.keyboard.press("Enter");

    await page
      .getByLabel("Current friction")
      .fill("Open commitments are rebuilt from email and meeting notes every day.");
    await page.getByLabel("Current friction").press("Control+Enter");
    await page.getByLabel("Hours lost weekly").fill("12");
    await page.getByLabel("Hours lost weekly").press("Enter");
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "5");

    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Hours lost weekly")).toHaveValue("12");
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByLabel("Current friction")).toHaveValue(
      "Open commitments are rebuilt from email and meeting notes every day.",
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
      grantInquiry: false,
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

    await expect(page.getByLabel(/Aygency newsletter and Eden updates/)).not.toBeChecked();
    await page.getByRole("button", { name: "Show me my Eden Blueprint" }).click();
    await expect(page.getByText("Consent is required so we can respond.")).toBeVisible();
    await page.getByLabel(/Process and follow up on this application/).check();
    await expect(page.getByText("Consent is required so we can respond.")).toBeHidden();
    const submitButton = page.getByRole("button", { name: "Show me my Eden Blueprint" });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
    await expect(page.getByRole("heading", { name: "Your Eden Blueprint" })).toBeVisible();
    expect(submittedBody).not.toBeNull();
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    await expect(page.getByText("Executive and travel coordination assistant")).toBeVisible();
    await expect(page.getByText("High", { exact: true }).first()).toBeVisible();
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
        dataBoundaryAck: boolean;
      };
      consent: { inquiry: boolean; marketing: boolean };
      attribution: Record<string, string>;
      botToken: string;
      organisation: { countryCode: string; sizeBand: string };
    } | null;
    expect(submitted?.eventId).toMatch(/^[0-9a-f-]{36}$/);
    expect(submitted?.applicationId).toMatch(/^[0-9a-f-]{36}$/);
    expect(submitted?.eventId).not.toBe(submitted?.applicationId);
    expect(submitted?.answers).toMatchObject({
      primaryOutcomes: [
        "protect-time",
        "close-open-loops",
        "improve-meeting-readiness",
        "coordinate-travel",
      ],
      currentFriction: maliciousButInert,
      hoursLostWeekly: 14,
      operatedServiceAck: true,
      dataBoundaryAck: true,
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

  test("fails closed when the Turnstile proof is absent", async ({ page }) => {
    await page.unroute(turnstileRoute);
    await installTurnstileStub(page, "idle");
    let apiCalls = 0;
    await page.route("**/api/eden/applications", async (route) => {
      apiCalls += 1;
      await route.abort();
    });

    await page.goto("/design-your-eden");
    await completeQuestionnaire(page);
    await page.getByRole("button", { name: "Show me my Eden Blueprint" }).click();

    await expect(page.getByText("Complete the security check before submitting.")).toBeVisible();
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
    await expect(page.getByRole("heading", { name: "Your Eden Blueprint" })).toBeVisible();
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
    await expect(page.getByRole("heading", { name: "Your Eden Blueprint" })).toBeVisible();
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
