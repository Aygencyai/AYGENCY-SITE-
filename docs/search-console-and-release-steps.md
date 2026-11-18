# Search verification and release steps

Manual steps outside the repo. Never paste tokens into chat or commit them.

## Environment variables (Vercel, Production)
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: optional. The Google property is already DNS verified, so only set this if DNS verification stops working.
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`: the `msvalidate.01` content value from Bing Webmaster Tools.

If unset, no verification tag is emitted. Redeploy after setting.

## Apex redirect
aygency.ai currently redirects to www with a temporary 307. This is set in Vercel, not in this repo.
Vercel > Project > Settings > Domains > aygency.ai: choose the permanent redirect (308, Vercel's permanent option; 301 if offered).

## After deploy
- Google Search Console (devaygency@gmail.com): submit https://www.aygency.ai/sitemap.xml and check new pages with URL Inspection.
- Bing Webmaster Tools: verify, then submit the same sitemap.
- Run `node scripts/indexnow.mjs`.

## Legal pages
/privacy and /terms are placeholders, noindex and out of the sitemap until solicitor-reviewed AYGENCY LTD policies are approved.
