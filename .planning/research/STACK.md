# Technology Stack

**Project:** DNE Digital — Student ID Card Clone
**Researched:** 2026-02-28
**Context:** Brownfield — existing Next.js 16 + React 19 + Tailwind v4 + pnpm. Research scope is missing libraries only.

---

## Current Stack (Do Not Change)

| Technology | Version | Role |
|------------|---------|------|
| Next.js | 16.0.3 | Framework (locked per PROJECT.md) |
| React | 19.2.0 | UI runtime |
| Tailwind CSS | ^4 | Utility styling |
| TypeScript | ^5 | Type safety |
| pnpm | (system) | Package manager (locked per PROJECT.md) |
| @svgr/webpack | ^8.1.0 | SVG as React components |
| lucide-react | ^0.554.0 | Icon set |

---

## Missing Libraries — Recommended Additions

### 1. QR Code Generation

**Recommended: `qrcode.react` v4.x**

| Attribute | Detail |
|-----------|--------|
| Package | `qrcode.react` |
| Version | `^4.0.0` (verify with `pnpm info qrcode.react version`) |
| Output | SVG (default) or Canvas |
| Client-side | Yes — pure browser, zero external requests |
| React 19 support | Yes — named exports `<QRCodeSVG>` and `<QRCodeCanvas>` |
| TypeScript | Bundled types |
| Bundle size | ~14 kB gzipped |
| Confidence | MEDIUM (training data, version unverified via live npm) |

**Why `qrcode.react` over alternatives:**

- `qrcode.react` renders SVG inline, which integrates cleanly with `mix-blend-multiply` CSS already in the codebase (see line 81 of `[student]/page.tsx`)
- The `<QRCodeSVG>` export eliminates the current dependency on `api.qrserver.com` (external URL, can be blocked or rate-limited, fails without network)
- `react-qr-code` is a viable alternative but uses a wrapper div around SVG, making it harder to style the QR card precisely
- `qr-code-styling` supports custom logos inside the QR but adds significant weight (~80 kB) and complexity unnecessary for a clone project
- `@uiw/react-qrcode` also works but has less community adoption

**Usage pattern:**

```tsx
// "use client" required — browser-side rendering
"use client";
import { QRCodeSVG } from "qrcode.react";

// Replace the <Image src={data.qrcode} /> block with:
<QRCodeSVG
  value={data.codigoCie}
  size={160}
  bgColor="#ffffff"
  fgColor="#000000"
  level="M"
  className="w-[95%] mix-blend-multiply"
/>
```

**What NOT to use:**
- `api.qrserver.com` — already in use, but must be replaced: requires network, CORS-dependent, fails at build time for static export
- `qr-code-styling` — over-engineered for this use case, adds unnecessary bundle weight
- Any Canvas-based approach — SVG is sharper and composable with Tailwind utilities

---

### 2. Font Strategy

**Recommended: Next.js built-in `next/font/google` (already wired) + local font fallback**

**Confidence: HIGH** for the approach; MEDIUM for the specific font identification.

#### Font Identification for the DNE Logo

The DNE app logo uses a **rounded display sans-serif** — based on visual analysis, the closest publicly available match is **Nunito** (rounded terminals, heavy weight) or **Poppins** (geometric, no rounded terminals but similar weight/tracking).

**Identification approach (manual, requires human action):**

| Tool | Method | URL |
|------|--------|-----|
| WhatFont (browser extension) | Inspect font on `dne.org.br` in DevTools → Computed → font-family | Chrome/Firefox extension |
| FontSquirrel Matcherator | Upload screenshot crop of "dne" text | https://www.fontsquirrel.com/matcherator |
| WhatTheFont (MyFonts) | Upload screenshot | https://www.myfonts.com/pages/whatthefont |
| DevTools Network tab | Filter by `font` type on `dne.org.br` to see loaded `.woff2` filenames | Browser DevTools |

**Most likely candidates (training knowledge, needs verification):**

| Font | Weight | Where | Confidence |
|------|--------|--------|------------|
| Nunito | ExtraBold (800) | Google Fonts | MEDIUM — rounded terminals match |
| Nunito Sans | ExtraBold (800) | Google Fonts | MEDIUM — cleaner alternative |
| Rounded Mplus 1c | ExtraBold | Google Fonts | LOW — more obscure, possible |
| DM Sans | ExtraBold | Google Fonts | LOW — not rounded |

**Recommended interim approach** (before confirming exact font):

```tsx
// layout.tsx — swap Geist for Nunito as best guess
import { Nunito } from "next/font/google";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});
```

Then use `font-extrabold tracking-tighter` with Nunito on the "dne" heading.

**If the exact font is proprietary (not on Google Fonts):**
Use `next/font/local` to host the `.woff2` extracted from the app's APK or website assets. APK font extraction: unzip the `.apk`, fonts live in `assets/fonts/`.

**What NOT to do:**
- Keep Arial (current) — generic, zero resemblance to original
- Use `style={{ fontFamily: "Arial" }}` inline — prevents override and bypasses Next.js font optimization

---

### 3. SVG Asset Extraction

**No library needed — manual browser tooling approach**

**Confidence: HIGH** (standard browser DevTools workflow)

#### Extracting Logo/Icon SVGs from dne.org.br

**Method 1 — DevTools Elements inspector (best for inline SVG):**
1. Open `dne.org.br` in Chrome/Firefox
2. F12 → Elements tab
3. Ctrl+F → search `<svg`
4. Right-click the SVG element → Copy → Copy outerHTML
5. Paste into `/src/assets/dne-logo.svg`

**Method 2 — DevTools Network tab (best for external SVG files):**
1. F12 → Network tab → filter by "img" or "svg" or type "Fetch/XHR"
2. Reload the page
3. Find `.svg` requests → click → Preview or copy Response URL
4. Download directly via URL

**Method 3 — SVG extraction from APK:**
1. Download DNE APK from APKPure/APKMirror
2. Unzip: `unzip DNE.apk -d dne_extracted/`
3. SVG/PNG assets in `res/drawable/` or `assets/`

**For the UNE icon (Brazil map circle):**
The `Globe` from Lucide (current) must be replaced. The UNE icon is a circle containing a simplified Brazil map outline + "UNE" text — this is a custom SVG, not available from any icon library. Best path: extract from DNE app website or app APK, then import via `@svgr/webpack` (already configured).

```tsx
// After extracting the SVG:
import UneIcon from "@/assets/une-icon.svg";

// Replace:
// <Globe className="text-[#005c9e]" size={20} strokeWidth={2.5} />
// With:
<UneIcon className="w-5 h-5" />
```

**Color extraction — no library needed:**
Use browser DevTools Computed Styles or the Chrome Color Picker eyedropper on the target site. For the exact background green, inspect `dne.org.br` computed `background-color`. Current code uses `#8CD6BF` — likely needs verification.

---

### 4. Mobile-First Phone Simulation on Desktop

**No additional library needed — pure CSS/Tailwind approach**

**Confidence: HIGH** (already partially implemented in codebase)

The current code already implements the core pattern (line 25 of `[student]/page.tsx`):

```tsx
<div className="w-full max-w-[400px] bg-[#8CD6BF] h-screen md:h-[850px]
  md:rounded-[40px] overflow-hidden relative flex flex-col
  shadow-2xl border-0 md:border-8 border-stone-800">
```

**What's working:**
- Dark background (`bg-stone-900`) simulates desktop context
- `max-w-[400px]` constrains to phone-width
- `md:rounded-[40px]` adds phone corner radius on desktop
- `md:border-8 border-stone-800` simulates phone bezel

**What's missing — refinements to add:**

| Element | Tailwind Pattern | Notes |
|---------|-----------------|-------|
| Vertical centering | `flex items-center justify-center` on `<main>` | Already in place |
| Desktop phone height | `md:h-[844px]` or `md:h-[852px]` | iPhone 14 standard (current 850px is close) |
| Safe area for notch simulation | `pt-safe` or `pt-11` | Optional cosmetic detail |
| Scroll lock | `overflow-hidden` | Already in place |
| Landscape guard | `min-h-screen` | Already in place |

**No library recommendation** — the existing Tailwind approach is correct and complete. Adding a library like `react-device-preview` would be over-engineering for a one-screen clone.

**What NOT to use:**
- `react-device-preview` or similar — adds iframe complexity, breaks Next.js routing, unnecessary overhead
- Fixed pixel dimensions without responsive breakpoints — the current approach with `h-screen md:h-[850px]` is the right pattern
- CSS media query `@media (display-mode: standalone)` alone — doesn't help desktop simulation

---

## Installation

```bash
# Only new dependency required:
pnpm add qrcode.react

# If font confirmed as Nunito (already available via next/font/google — no install needed):
# Just update layout.tsx import

# No install needed for: SVG extraction, mobile layout, font tooling
```

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| QR Code | qrcode.react | react-qr-code | Div wrapper complicates blend-mode styling |
| QR Code | qrcode.react | qr-code-styling | 80 kB overhead, logo customization not needed |
| QR Code | qrcode.react | api.qrserver.com (current) | External API, network-dependent, not local |
| Font | next/font/google (Nunito) | Local .woff2 | Google Fonts easier unless font is proprietary |
| Mobile wrapper | CSS/Tailwind | react-device-preview | Unnecessary iframe complexity |
| SVG extraction | Browser DevTools | Automated scraper | Manual is faster and more reliable for 2-3 assets |

---

## Full Dependency Delta

| Package | Action | Reason |
|---------|--------|--------|
| `qrcode.react` | ADD | Replace external QR API with local generation |
| `lucide-react` | KEEP (partial) | Menu, Copy, Check icons are still needed |
| `@svgr/webpack` | KEEP | Already configured, needed for SVG imports |
| Geist (next/font) | REPLACE with Nunito | Closer to DNE rounded font style |
| `qr-code-styling` | DO NOT ADD | Overkill |
| `react-device-preview` | DO NOT ADD | Unnecessary |

---

## Sources

- Training knowledge (cutoff August 2025) — qrcode.react v4 API, react-qr-code comparison
- External verification blocked during research session (WebFetch/WebSearch permissions denied)
- Package versions marked MEDIUM confidence — verify with `pnpm info qrcode.react version` before install
- Font identification requires manual human action on `dne.org.br` — cannot be automated remotely
