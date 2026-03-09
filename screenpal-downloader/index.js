/**
 * ScreenPal – sign in, then open each video URL from a list file and download
 *
 * Steps:
 * 1. Read video links from a list file (one URL per line). Default: newList.txt. Use remaining-video-urls.txt: node index.js remaining-video-urls.txt
 * 2. Login to screenpal.com (wait for CAPTCHA if needed)
 * 3. For each URL: open https://screenpal.com/content/video/download/{videoId} to trigger download, save file
 *
 * Credentials: SCREENPAL_EMAIL, SCREENPAL_PASSWORD in .env
 * Run: npm run download              (uses newList.txt)
 *      node index.js remaining-video-urls.txt
 */

import "dotenv/config";
import { chromium } from "playwright";
import { readFile, mkdir } from "fs/promises";
import path from "path";

const BASE = "https://www.screenpal.com";
const LOGIN_URL = `${BASE}/login`;
const DOWNLOAD_URL = (videoId) => `${BASE}/content/video/download/${videoId}`;
const DEFAULT_LIST_FILE = "newList.txt";
const DOWNLOAD_DIR = path.join(process.cwd(), "screenpal-downloads");

function getListFile() {
  const arg = process.argv[2];
  if (arg) return path.join(process.cwd(), path.basename(arg));
  return path.join(process.cwd(), process.env.SCREENPAL_LIST_FILE || DEFAULT_LIST_FILE);
}

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}. Add to .env (see .env.example).`);
  return v;
}

/** Extract video ID from a line: full URL (.../content/video/xxx) or plain ID */
function videoIdFromLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (trimmed.includes("/content/video/")) {
    const seg = trimmed.split("/").filter(Boolean);
    return seg[seg.length - 1] || null;
  }
  return trimmed;
}

async function main() {
  const listFile = getListFile();
  console.log("Reading", path.basename(listFile), "...");
  const content = await readFile(listFile, "utf8").catch((e) => {
    throw new Error(`Could not read list file: ${e.message}. Put the file in the screenpal-downloader folder.`);
  });
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const videoIds = lines.map(videoIdFromLine).filter(Boolean);
  if (videoIds.length === 0) throw new Error("No video URLs found in " + path.basename(listFile));
  console.log("Found", videoIds.length, "video(s)\n");

  await mkdir(DOWNLOAD_DIR, { recursive: true });
  const downloadDirAbs = path.resolve(DOWNLOAD_DIR);
  console.log("Downloads will be saved to:", downloadDirAbs, "\n");

  const email = env("SCREENPAL_EMAIL");
  const password = env("SCREENPAL_PASSWORD");
  const headed = process.env.HEADED === "true";

  const browser = await chromium.launch({
    headless: !headed,
    channel: "chromium",
  });

  const context = await browser.newContext({
    acceptDownloads: true,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  // Force all downloads to go to our folder (so they don't end up in system Downloads with UUID names)
  const client = await context.newCDPSession(page);
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadDirAbs,
  });

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

    console.log("\nStep 3: Executing download URLs from", path.basename(listFile) + "...");
    for (let i = 0; i < videoIds.length; i++) {
      const videoId = videoIds[i];
      const label = `Video_${i + 1}`;
      const url = DOWNLOAD_URL(videoId);
      console.log(`  [${i + 1}/${videoIds.length}] ${videoId}...`);

      try {
        const downloadPromise = context.waitForEvent("download", { timeout: 30000 }).catch(() => null);
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
        const download = await downloadPromise;
        if (download) {
          const fp = path.join(downloadDirAbs, `${label}.mp4`);
          await download.saveAs(fp);
          console.log("    Saved:", fp);
        } else {
          console.warn("    Download did not start (file may still be in folder with a long name).");
        }
      } catch (e) {
        console.warn("    Error:", e.message);
      }
      await page.waitForTimeout(400);
    }

    console.log("\nDone. All files are in:");
    console.log("  ", downloadDirAbs);
    console.log("\nIf you see files with long UUID-style names and no .mp4, they are video files—add the .mp4 extension to play them.");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
