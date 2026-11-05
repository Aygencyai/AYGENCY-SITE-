// Ping IndexNow (Bing, Yandex and others) with every URL in the live sitemap.
// Run after a deploy: node scripts/indexnow.mjs
// The key file lives at public/dfd4ad3850a35dded0d2d329698d7db5.txt and must be live before pinging.
const host = "www.aygency.ai";
const key = "dfd4ad3850a35dded0d2d329698d7db5";

const xml = await (await fetch(`https://${host}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} for ${urlList.length} URLs`);
