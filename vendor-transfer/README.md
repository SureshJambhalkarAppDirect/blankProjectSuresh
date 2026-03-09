# Vendor Transfer

A Company Settings–style experience for initiating vendor transfers. The UI matches the shared design: top navigation, left sidebar with **Company Settings** / **Vendor Information**, and a main content area.

## Features

- **Top nav**: Account, Dashboard, Applications, Users, Assign Apps, Billing, **Company Settings** (active).
- **Sidebar**  
  - **COMPANY SETTINGS**: Company Settings, Single Sign-On  
  - **VENDOR INFORMATION**: Adobe, Microsoft, **Google**
- **Vendor content**  
  - **Adobe / Microsoft**: “No [vendor] tenant linked” empty state.  
  - **Google**: Transfer flow with iframe + fallback.

## Google transfer flow

1. User selects **Google** in the sidebar.
2. Intro text and a **Transfer** button are shown.
3. User clicks **Transfer** → Google Admin Console (`https://admin.google.com`) is loaded in the iframe (and an **Open in new tab** link is available if the iframe is blocked).
4. User signs in and completes the transfer in the console (or in the new tab).
5. User clicks **I've completed the transfer**.
6. A **Transfer complete** message is shown with **Close this page**.

## Running locally

Open `index.html` in a browser, or serve the folder with any static server, for example:

```bash
cd vendor-transfer
npx serve .
# or: python3 -m http.server 8080
```

Then open the URL (e.g. `http://localhost:3000` or `http://localhost:8080`).

## Marketplace / iframe use

- The app is a single-page layout that can be embedded in a marketplace or parent app via an iframe.
- The **Transfer** action loads `https://admin.google.com` in an iframe; some environments (e.g. Google’s own security headers) may block this. The **Open in new tab** link is the recommended fallback for completing the transfer when the iframe does not load.
- “Close this page” uses `window.close()` when the page was opened by script; otherwise the user can close the tab manually.

## Files

- `index.html` – Layout and panels (nav, sidebar, default panel, Google transfer panel).
- `styles.css` – Layout and styling to match the Company Settings design.
- `app.js` – Sidebar selection, Transfer button, iframe load, and transfer-complete state.
