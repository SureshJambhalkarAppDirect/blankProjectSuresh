/**
 * ScreenPal – sign in, then collect video URLs from page 2 onward and save to a file
 *
 * Use this to fetch download links for the remaining videos (you already have page 1 in newList.txt).
 * Same method: login → go to library page 2, 3, 4, … → get video URL from each tile (a.card-link href) → save to file.
 *
 * Credentials: SCREENPAL_EMAIL, SCREENPAL_PASSWORD in .env
 * Run: node collect-remaining-urls.js
 */

import "dotenv/config";
import { chromium } from "playwright";
import { writeFile } from "fs/promises";
import path from "path";

const BASE = "https://www.screenpal.com";
const LOGIN_URL = `${BASE}/login`;
const LIBRARY_BASE = `${BASE}/content/videos`;
const LIBRARY_PAGE_URL = (pageNum) =>
  `${LIBRARY_BASE}?sortBy=most_recent&perPage=100&pageView=grid&order=desc&page=${pageNum}`;
const OUTPUT_FILE = path.join(process.cwd(), "remaining-video-urls.txt");

const START_PAGE = 2; // First 100 are in newList.txt; collect from page 2 onward

const TILE_SELECTOR =
  '[class*="tile"], [class*="card"], [class*="grid-item"], [class*="video-item"], [data-video-id], [class*="content-item"]';

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}. Add to .env (see .env.example).`);
  return v;
}

/** Get video URL from tile: the href of a.card-link or a[href*="/content/video/"] */
async function getVideoUrlsFromTiles(page, tiles) {
  const urls = [];
  for (const tile of tiles) {
    const url = await tile.evaluate((el) => {
      const a = el.querySelector('a.card-link[href*="/content/video/"], a[href*="/content/video/"]');
      if (!a) return null;
      let href = a.getAttribute("href") || a.href || "";
      if (!href) return null;
      if (href.startsWith("/")) href = "https://www.screenpal.com" + href;
      return href;
    });
    if (url) urls.push(url);
  }
  return urls;
}

async function main() {
  const email = env("SCREENPAL_EMAIL");
  const password = env("SCREENPAL_PASSWORD");
  const headed = process.env.HEADED === "true";

  const browser = await chromium.launch({
    headless: !headed,
    channel: "chromium",
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  try {
    console.log("Step 1: Opening ScreenPal login...");
    await page.goto(LOGIN_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForLoadState("networkidle").catch(() => {});

    console.log("Step 2: Logging in...");
    const emailSel =
      'input[type="email"], input[name="email"], input[placeholder*="mail" i], input[id*="email" i]';
    await page.waitForSelector(emailSel, { timeout: 15000 });
    await page.fill(emailSel, email);
    await page.click('button:has-text("Continue"), input[value="Continue"], [type="submit"]');
    await page.waitForTimeout(2000);

    const CAPTCHA_WAIT_MS = 5 * 60 * 1000;
    const passSel =
      'input[type="password"], input[name="password"], input[placeholder*="password" i], input[id*="password" i]';
    console.log("  Waiting for password screen (if you see a CAPTCHA, complete it now)...");
    await page.waitForSelector(passSel, { timeout: CAPTCHA_WAIT_MS });
    await page.fill(passSel, password);
    await page
      .click(
        'button[type="submit"], input[type="submit"], button:has-text("Log in"), button:has-text("Sign in"), button:has-text("Continue")'
      )
      .catch(() => page.click("form button, form [type=\"submit\"]"));
    await page
      .waitForURL((u) => !u.pathname.includes("/login") || u.search.includes("furl"), {
        timeout: 20000,
      })
      .catch(() => {});
    await page.waitForTimeout(3000);

    const allUrls = [];
    let pageNum = START_PAGE;
    let hasMorePages = true;

    console.log("\nStep 3: Collecting video URLs from page", START_PAGE, "onward...");
    while (hasMorePages) {
      console.log("  Fetching page", pageNum, "...");
      await page.goto(LIBRARY_PAGE_URL(pageNum), {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(2000);

      await page
        .selectOption('select[name*="perPage"], select[id*="perPage"], select[aria-label*="per page" i]', "100")
        .catch(() => page.selectOption("select", "100").catch(() => {}));
      await page.waitForTimeout(1000);

      const tiles = await page.$$(TILE_SELECTOR);
      let count = tiles.length;
      if (count === 0) {
        const fallback = await page.$$(
          '[class*="grid"] > div, [class*="grid"] > article, [class*="library"] [class*="item"]'
        );
        if (fallback.length === 0) {
          console.log("  No tiles on this page; stopping.");
          break;
        }
        const urls = await getVideoUrlsFromTiles(page, fallback);
        allUrls.push(...urls);
        count = fallback.length;
        console.log("    Found", urls.length, "URLs");
      } else {
        const urls = await getVideoUrlsFromTiles(page, tiles);
        allUrls.push(...urls);
        console.log("    Found", urls.length, "URLs");
      }

      const nextPageNum = pageNum + 1;
      const nextLink = await page.$(
        `a[href*="page=${nextPageNum}"], button:has-text("Next"), a:has-text("Next"), [aria-label*="next" i]`
      );
      if (!nextLink || count < 100) hasMorePages = false;
      else pageNum = nextPageNum;
    }

    const uniqueUrls = [...new Set(allUrls)];
    const content = uniqueUrls.join("\n") + (uniqueUrls.length ? "\n" : "");
    await writeFile(OUTPUT_FILE, content, "utf8");

    console.log("\nDone. Total video URLs (page 2 onward):", uniqueUrls.length);
    console.log("Saved to:", path.resolve(OUTPUT_FILE));
    if (uniqueUrls.length > 0) {
      console.log("\nFirst few:");
      uniqueUrls.slice(0, 3).forEach((u, i) => console.log(" ", i + 1, u));
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
