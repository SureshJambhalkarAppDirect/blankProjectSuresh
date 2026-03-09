# ScreenPal Download Agent

Downloads all your ScreenPal recordings by:

1. **Login** to screenpal.com (two-step: email → Continue → password → submit)
2. **Go to Library** – https://screenpal.com/content/videos (100 per page)
3. **For each tile** – read the video ID from the tile link (e.g. `a.card-link` href `.../content/video/cOnIhCn02FI` → ID `cOnIhCn02FI`)
4. **Open direct download URL** – `https://screenpal.com/content/video/download/{videoId}` (triggers file download)
5. **Save** the file, then **next page**, repeat

Files are saved under `screenpal-downloads/` (e.g. `Video_1.mp4`, `Video_2.mp4`, …).

## Prerequisites

- **Node.js** 18+
- **Chromium** (installed by Playwright)

## Setup

1. **Clone or copy** this folder.

2. **Install dependencies and browser:**
   ```bash
   cd screenpal-downloader
   npm install
   npx playwright install chromium
   ```

3. **Configure credentials** (never commit these):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   - `SCREENPAL_EMAIL` – your ScreenPal login email  
   - `SCREENPAL_PASSWORD` – your ScreenPal password  

   Optional:
   - `HEADED=true` – run the browser visibly (default is headless).

## Run

```bash
npm run download
```

Or:

```bash
node index.js
```

- The agent reads **`newList.txt`** (one video URL per line), signs in, then opens each download URL. All files are saved into **`screenpal-downloads/`** in this folder; the script prints the full path when it runs.
- **Where are my downloads?**  
  - **New runs:** Everything goes to **`screenpal-downloader/screenpal-downloads/`** (path is printed at start and end).  
  - **Already downloaded (Chrome history with UUID names):** In Chrome go to `chrome://downloads`, find a file, and click the **folder icon** (“Show in folder”) next to it to open the folder on your computer. Those files are the videos; they may have no extension—add **`.mp4`** to the filename to play them.

## Flow (matches Loom + ScreenPal docs)

1. Open **ScreenPal login** (screenpal.com/login).
2. **Log in** with your `.env` credentials.
3. Open **content/library** (screenpal.com/content or your library URL).
4. **Discover** all video links on the library page.
5. **For each video:**
   - Open the video page.
   - If there’s a direct “Download” control, use it.
   - Otherwise: **Details** → **More** → **Download MP4** (as in the official flow).
6. **Save** each download to `screenpal-downloads/` with a safe filename.

## If the library URL is different

If your library is at another path (e.g. a “Hosting” or “Library” section with a different URL), you can set:

- `SCREENPAL_LIBRARY_URL=https://www.screenpal.com/your/library/path` in `.env`  

and we can add support in the script to use it. Right now the script uses `https://www.screenpal.com/content` by default.

## Security

- **Do not commit `.env`** or share it. `.env` is in `.gitignore`.
- Credentials are read only from the environment at runtime.

## Troubleshooting

- **“Missing env: SCREENPAL_EMAIL”** – Create `.env` from `.env.example` and set both email and password.
- **CAPTCHA (cars, buses, etc.)** – The script waits up to **5 minutes** for the password screen after Continue. If a CAPTCHA appears, complete it in the browser. Use **HEADED=true** so you can see and solve it; the script continues once the password field is visible.
- **No videos found** – Run with `HEADED=true` to watch the browser; the library might be at a different URL or behind extra navigation (e.g. “Library” or “Hosting” in the menu). Adjust the script’s `CONTENT_URL` or add a step to click that menu first.
- **Login fails** – Check email/password; ScreenPal may use a different login form (e.g. “Sign in with Google”). The script targets standard email/password fields; if your login is different, we can adapt selectors.
- **Download not triggered** – ScreenPal’s UI may have changed (e.g. different labels or structure for Details / More / Download MP4). Run with `HEADED=true` and compare with the Loom steps; we can update selectors to match.

## References

- [Loom: ScreenPal – Videos (walkthrough)](https://www.loom.com/share/a5aaaedeeb3745148a57f5fc6b978793)
- [ScreenPal: How to download MP4](https://screenpal.com/tool/mp4-download) – “Navigate to your video → hover → Details → More → Download MP4”
- [ScreenPal: Manage recordings](https://screenpal.com/tutorial/manage-recordings)
