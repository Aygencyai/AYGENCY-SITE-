import { expect, test, type Page, type APIRequestContext } from "@playwright/test";
import { z } from "zod";
import { conversationView } from "../src/lib/eden/conversation-schema";

// Opt-in: actual subscription model and disposable local Supabase/Mailpit only.
test.use({ screenshot: "off", trace: "off" });
test("two isolated accounts, cross-device resume and confirmed personalized setup", async ({ browser, page, request }) => {
  test.skip(process.env.EDEN_WEB_FULL_JOURNEY !== "true", "Requires the isolated local Builder and mail capture");
  test.setTimeout(360_000);
  const email = `web-journey-${crypto.randomUUID()}@example.test`;
  async function open(target: Page) {
    await target.goto("http://127.0.0.1:3118/design-your-eden");
    await expect(target.getByRole("heading", { name: "Sign in to meet Ava." })).toBeVisible();
  }
  async function state(target: Page) {
    return conversationView.parse(await target.evaluate(async () => {
      const response = await fetch("/api/eden/conversation", { method: "POST",
        headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "get" }) });
      if (!response.ok) throw new Error("Saved state unavailable");
      return response.json() as Promise<unknown>;
    }));
  }
  async function send(target: Page, text: string, reloadDuringReply = false) {
    const input = target.getByRole("textbox", { name: "Your message to Ava" });
    await input.fill(text);
    await target.getByRole("button", { name: "Send message", exact: true }).click();
    if (reloadDuringReply) {
      await expect.poll(async () => (await state(target)).messages.some(message => message.text === text)).toBe(true);
      await target.reload();
    }
    await expect(input).toBeEnabled({ timeout: 70_000 });
    const saved = await state(target);
    expect(saved.pending).toBe(false);
    expect(saved.messages.at(-2)?.text).toBe(text);
    return saved;
  }
  async function verify(target: Page, api: APIRequestContext, address = email) {
    await target.getByLabel("Email address", { exact: true }).fill(address);
    await target.getByRole("button", { name: "Send code", exact: true }).click();
    await expect(target.getByLabel("Sign-in code", { exact: true })).toBeVisible();
    const list = z.object({ messages: z.array(z.object({ ID: z.string(), To: z.array(z.object({ Address: z.string() })) })) });
    let id: string | undefined;
    await expect.poll(async () => {
      const result = list.parse(await (await api.get("http://127.0.0.1:55424/api/v1/messages")).json());
      id = result.messages.find(message => message.To.some(recipient => recipient.Address === address))?.ID;
      return Boolean(id);
    }).toBe(true);
    const mail = z.object({ Text: z.string(), HTML: z.string() }).parse(
      await (await api.get(`http://127.0.0.1:55424/api/v1/message/${id}`)).json());
    const code = `${mail.Text} ${mail.HTML}`.match(/\b\d{6,8}\b/)?.[0];
    if (!code) throw new Error("Local OTP email did not include a code");
    await target.getByLabel("Sign-in code", { exact: true }).fill(code);
    await target.getByRole("button", { name: "Verify email", exact: true }).click();
    await expect(target.getByLabel("Sign-in code", { exact: true })).not.toBeVisible();
    expect((await state(target)).email_verified).toBe(true);
  }
  await open(page);
  await verify(page, request);
  const verifiedAt = Date.now();
  const first = await send(page, "I'm Sam and I run a small design studio. Client tasks slip between messages and meetings. Could Eden help keep a Kanban board up to date, and would I have to connect Outlook?", true);
  expect(first.messages.at(-1)?.text.toLowerCase()).toContain("outlook");
  await send(page, "We use a Notion Kanban with Inbox, Planned, Doing, Waiting on client and Done. Outlook email and meeting notes are where tasks arrive; Notion wins if statuses disagree. I own client communication and my delivery lead Mia owns design work. Every card needs an owner and due date. First job: every Monday to Friday at 8:30am UK time, prepare a short Telegram brief of promises due today, overdue work and missing owners using Notion and Outlook. Within two weeks every client promise should be assigned with no missed follow-ups.");
  const ready = await send(page, "I work in London, Europe/London time, Monday to Friday 9am to 6pm, with no other location constraints. Stay quiet 6pm to 9am except the scheduled brief or a client deadline at risk today. Uncertain promises go into the brief for review. Use warm concise English, no jargon or invented progress. Ask me when unsure; no fallback person. Don't take external actions, move cards, send replies, change calendars, spend or share private information without asking. No evening wrap. We can decide anything else later. Please show the starting setup for review.");
  expect(ready.ready).toBe(true);
  expect(ready.confirmed).toBe(false);
  await page.reload();
  await expect(page.getByRole("textbox", { name: "Your message to Ava" })).toBeEnabled();
  expect((await state(page)).messages).toEqual(ready.messages);
  const corrected = await send(page, "Actually change the weekday morning brief to 9:15am Europe/London. Keep everything else the same and show me the updated setup.");
  expect(corrected.ready).toBe(true);
  expect(corrected.facts.find(fact => fact.topic === "recurring-jobs")?.text).toMatch(/9:15|09:15/);
  expect(corrected.facts.some(fact => /8:30|08:30/.test(fact.text))).toBe(false);
  // A second customer signs in on their own phone-sized browser while Sam's
  // existing conversation and facts remain available only to Sam.
  const separate = await browser.newContext({viewport:{width:375,height:850}});
  const louis = await separate.newPage();
  const louisEmail = `web-separate-${crypto.randomUUID()}@example.test`;
  await open(louis);
  await verify(louis, request, louisEmail);
  expect((await state(louis)).messages).toHaveLength(1);
  const louisState = await send(louis, "I'm Morgan and I run a dog-walking business. I need help remembering which customers need a renewal reminder. What could Eden do for me?");
  expect(louisState.messages.at(-1)?.text).not.toContain("Sam");
  expect(JSON.stringify(louisState)).not.toContain("Mia");
  expect(JSON.stringify(louisState)).not.toContain("9:15");
  expect(JSON.stringify(await state(page))).not.toContain("dog-walking");
  expect((await state(page)).facts).toEqual(corrected.facts);
  await louis.reload();
  await expect(louis.getByText(`Signed in as ${louisEmail}`)).toBeVisible();
  expect((await state(louis)).messages).toEqual(louisState.messages);
  // GoTrue's resend cooldown still applies to this synthetic address.
  const remaining = 61_000 - (Date.now() - verifiedAt);
  if (remaining > 0) await page.waitForTimeout(Math.min(remaining, 60_000));
  const other = await browser.newContext({viewport:{width:375,height:850}});
  const resumed = await other.newPage();
  await open(resumed);
  await expect(resumed.getByRole("log")).toHaveCount(0);
  await verify(resumed, request);
  expect((await state(resumed)).messages).toEqual(corrected.messages);
  await resumed.getByRole("button", { name: "Confirm my setup", exact: true }).click();
  await expect(resumed.getByRole("heading", { name: "Your Eden starts here." })).toBeVisible();
  expect((await state(resumed)).confirmed).toBe(true);
  // The original device follows the same account's confirmation automatically.
  await page.bringToFront();
  await expect(page.getByRole("heading", {name:"Your Eden starts here."})).toBeVisible({timeout:15000});
  expect((await state(louis)).confirmed).toBe(false);
  expect((await state(louis)).messages).toEqual(louisState.messages);
  // Sign-out clears browser content and revokes the previous bearer at the server.
  const oldCookie = (await separate.cookies()).find(cookie => cookie.name === "eden-conversation");
  if (!oldCookie) throw new Error("Expected a private local session cookie");
  await louis.getByRole("button", {name:"Sign out",exact:true}).click();
  await expect(louis.getByRole("heading", {name:"Sign in to meet Ava."})).toBeVisible();
  await expect(louis.getByRole("log")).toHaveCount(0);
  const revoked = await request.post("http://127.0.0.1:3118/api/eden/conversation", {
    headers:{origin:"http://127.0.0.1:3118",cookie:`eden-conversation=${oldCookie.value}`},
    data:{action:"get"},
  });
  expect(revoked.status()).toBe(401);
  expect((await state(resumed)).confirmed).toBe(true);
  await separate.close();

  expect(await resumed.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await other.close();
});
