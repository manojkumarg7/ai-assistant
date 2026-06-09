import { chromium } from "playwright";

const ENDPOINT =
  "http://127.0.0.1:7614/ingest/df98a9cd-ddfd-4b82-82a9-44e5c4a6af98";

async function log(hypothesisId, location, message, data) {
  await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "c2118a",
    },
    body: JSON.stringify({
      sessionId: "c2118a",
      runId: "post-fix",
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}

function extractAttr(html, selector, attr) {
  const re = new RegExp(`${selector}[^>]*${attr}="([^"]*)"`);
  return html.match(re)?.[1] ?? null;
}

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const route of ["/", "/assistant"]) {
    const page = await browser.newPage();
    const consoleMessages = [];
    page.on("console", (msg) =>
      consoleMessages.push({ type: msg.type(), text: msg.text() }),
    );

    const res = await fetch(`http://localhost:3000${route}`);
    const ssrHtml = await res.text();

    await page.addInitScript(() => {
      window.__hydrationMismatches = [];
      const orig = console.error;
      console.error = (...args) => {
        const t = args.map(String).join(" ");
        if (t.includes("did not match") || t.includes("Hydration")) {
          window.__hydrationMismatches.push(t.slice(0, 800));
        }
        orig(...args);
      };
    });

    await page.goto(`http://localhost:3000${route}`, {
      waitUntil: "networkidle",
    });

    const clientData = await page.evaluate(() => {
      const hero = document.querySelector("[data-debug-hero-badge]");
      const select = document.querySelector("[data-debug-select-trigger]");
      const themeBtn = document.querySelector("[data-debug-theme-toggle]");
      return {
        heroStyle: hero?.getAttribute("style") ?? null,
        selectId: select?.id ?? null,
        selectAttrs: select
          ? Array.from(select.attributes).map((a) => `${a.name}=${a.value}`)
          : [],
        themeBtnAttrs: themeBtn
          ? Array.from(themeBtn.attributes).map((a) => `${a.name}=${a.value}`)
          : [],
        hydrationMismatches: window.__hydrationMismatches ?? [],
        htmlStyle: document.documentElement.getAttribute("style"),
        htmlClass: document.documentElement.className,
      };
    });

    await log("ALL", "scripts/hydration-check.mjs", `Deep scan ${route}`, {
      route,
      ssrHeroStyle: extractAttr(
        "data-debug-hero-badge",
        "data-debug-hero-badge",
        "style",
      ),
      ssrSelectId: extractAttr(
        "data-debug-select-trigger",
        "data-debug-select-trigger",
        "id",
      ),
      ssrHtmlClass: ssrHtml.match(/<html[^>]*class="([^"]*)"/)?.[1] ?? null,
      ssrHtmlStyle: ssrHtml.match(/<html[^>]*style="([^"]*)"/)?.[1] ?? null,
      clientData,
      consoleErrors: consoleMessages.filter((m) => m.type === "error"),
    });

    await page.close();
  }

  await browser.close();
  console.log("Deep scan complete");
})();
