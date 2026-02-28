# Domain Pitfalls

**Domain:** Pixel-perfect mobile UI clone — Next.js 16 + Tailwind v4
**Project:** DNE Digital (student ID card clone)
**Researched:** 2026-02-28
**Confidence:** MEDIUM-HIGH (official docs verified where available; some browser behavior from training data + MDN)

---

## Critical Pitfalls

Mistakes that cause rewrites or hours of debugging.

---

### Pitfall 1: next/image width/height Conflict With className Sizing

**What goes wrong:**
The current code uses `<Image width={440} height={550} className="w-full h-full object-cover">`. The `width` and `height` props on next/image control the *intrinsic* dimensions used for aspect-ratio reservation and srcset generation — they do NOT control the rendered CSS size. When you also pass `className="w-full h-full"`, the CSS wins for layout, but the browser still reserves space based on the intrinsic dimensions before the CSS applies, causing layout shifts or unexpected behavior.

Worse: the current Apple Wallet image uses `className="w-[160] h-[46px]"` — `w-[160]` is invalid Tailwind (missing unit). It should be `w-[160px]`. This silently renders at an arbitrary/default size.

**Why it happens:**
Developers treat next/image like a regular `<img>` and assume `width`/`height` control CSS layout size, when they are really intrinsic-size hints for optimization.

**Consequences:**
- Layout shifts (CLS) during page load
- Photo card and QR card proportions differ from the original app
- Apple Wallet badge renders at wrong size
- Pixel-perfect match fails before content even loads

**Prevention:**
For CSS-controlled sizing (like `w-full h-full` inside a flex/grid container), use `fill` mode with a positioned parent:
```tsx
// Container must have position: relative + explicit dimensions
<div className="relative w-full h-full">
  <Image src={src} alt={alt} fill className="object-cover rounded-lg" />
</div>
```
For fixed-size elements (Apple Wallet badge), use explicit numeric props that match the CSS:
```tsx
<Image src={badge} width={160} height={46} className="w-[160px] h-[46px]" />
```

**Detection:**
- Open DevTools, check computed size vs intrinsic size — they should match
- Look for `w-[160]` (no unit) in Tailwind classes — always invalid
- Check for CLS score in Lighthouse

**Phase:** Foundation / visual fidelity phase

---

### Pitfall 2: External QR Code URL Dependency

**What goes wrong:**
The current code fetches QR codes from `api.qrserver.com`. This creates several failure modes: the external service can be slow, rate-limited, blocked by school firewall, or return CORS errors in some contexts. The QR code is the most critical element for competition judges to verify. If it fails to load, the whole demo breaks.

Additionally, `mix-blend-multiply` is applied to the QR code image — this works correctly only when the parent background is white and the image has a white background. If Next.js image optimization converts the image format (e.g., to WebP with transparency), `mix-blend-multiply` may render incorrectly.

**Why it happens:**
Quickest path to a working QR code is an external URL. The dependency is only felt in demo conditions.

**Consequences:**
- Competition demo fails if school network blocks external APIs
- QR code doesn't render without internet (no offline fallback)
- `mix-blend-multiply` fails if image gets transparency

**Prevention:**
Replace with `qrcode.react` library (renders QR client-side as SVG or Canvas):
```bash
pnpm add qrcode.react
```
```tsx
"use client"
import { QRCodeSVG } from "qrcode.react"

<QRCodeSVG
  value={codigoCie}
  size={180}
  level="M"
  bgColor="#ffffff"
  fgColor="#000000"
  includeMargin={false}
/>
```
Since this is a Client Component, wrap it in a dedicated `QrCode` component with `"use client"`. The parent page remains a Server Component.

**Detection:**
- Open Network tab, block `api.qrserver.com`, reload — does QR still appear?
- Check if `mix-blend-multiply` causes dark artifacts on QR background

**Phase:** QR code phase (immediate priority)

---

### Pitfall 3: Font Loading — Wrong Font for DNE Logo

**What goes wrong:**
The DNE logo uses a specific rounded display typeface. The current code hardcodes `fontFamily: "Arial, sans-serif"` inline, which renders completely differently from the original. For a pixel-perfect clone, this is the most visible mismatch.

The secondary pitfall is font loading order: if you load a custom font via `@font-face` in CSS but not via `next/font`, the font may not be inlined in the HTML and will cause FOUT (Flash of Unstyled Text) — the logo briefly appears in a fallback font before the correct one loads.

**Why it happens:**
- Correct font not yet identified
- Using inline style override instead of next/font system
- Google Fonts fonts not available via `next/font/google` if they're display/variable fonts only available as imports

**Consequences:**
- Logo looks obviously wrong to competition judges who know the original
- FOUT causes visible flash on first load

**Prevention:**

Step 1 — Identify the font: Inspect `dne.org.br` or the DNE app. Common rounded display fonts include Nunito, Poppins, Rounded Mplus, or a custom SVG logo. If the logo is an SVG on the DNE website, extract the SVG path directly instead of trying to replicate with text.

Step 2 — Load via next/font (preferred for Google Fonts):
```tsx
// layout.tsx
import { Nunito } from "next/font/google"
const nunito = Nunito({ subsets: ["latin"], variable: "--font-dne-logo" })
```

Step 3 — Load via localFont for custom fonts not on Google:
```tsx
import localFont from "next/font/local"
const dneFont = localFont({
  src: "./fonts/dne-rounded.woff2",
  variable: "--font-dne-logo",
})
```

Step 4 — Register in @theme (Tailwind v4):
```css
@theme {
  --font-dne-logo: var(--font-dne-logo);
}
```

**Alternative (recommended):** Replace the text logo entirely with an SVG extracted from the official DNE website. SVG logos are immune to font loading issues and are always pixel-perfect.

**Detection:**
- Compare logo rendering side-by-side with original screenshot at 2x zoom
- Check if font changes between initial paint and settled state (FOUT)

**Phase:** Asset / typography phase

---

### Pitfall 4: Tailwind v4 Renamed Scale Values Breaking Visual Fidelity

**What goes wrong:**
Tailwind v4 renamed shadow, radius, and blur scale values compared to v3. Code written assuming v3 semantics silently renders wrong sizes. This is especially dangerous for border-radius on cards and shadows.

Key renames (HIGH confidence — official docs):
| v3 class | v4 class | Effect if confused |
|----------|----------|--------------------|
| `shadow-sm` | `shadow-xs` | Shadow too large |
| `shadow` (bare) | `shadow-sm` | Shadow too large |
| `rounded-sm` | `rounded-xs` | Corners too round |
| `blur-sm` | `blur-xs` | Blur too strong |
| `ring` (bare) | `ring-3` | Ring too thin |
| `outline-none` | `outline-hidden` | May leak outline |

The current code uses `rounded-xl`, `rounded-2xl`, `rounded-[40px]` — these are fine. But `shadow-sm` on the white cards renders as a shadow-xs equivalent in v3, which may be smaller than intended.

**Why it happens:**
v4 inserted new steps at the small end of each scale, shifting everything up. Developers migrating from v3 tutorials or using AI-generated code get v3 naming.

**Consequences:**
- Card shadows differ from original
- Border radius subtly wrong
- Invisible at first glance, obvious in side-by-side comparison

**Prevention:**
Always verify visual output in browser against original screenshot. When a shadow or radius "looks slightly off", check if the v4 equivalent differs from what was intended.

**Detection:**
- Side-by-side diff with reference screenshot using browser devtools overlay
- Check for `shadow-sm` — in v4, this is a *small* shadow, not the default shadow

**Phase:** Visual fidelity / spacing phase

---

### Pitfall 5: Mobile Simulation — Fixed Height Breaks on Desktop

**What goes wrong:**
The current code uses `h-screen md:h-[850px]` for the card wrapper. On mobile (`h-screen`), if the browser chrome (address bar, bottom navigation) is taller than expected, `100vh` is taller than the visible area, causing overflow. On iOS Safari, `100vh` is the viewport *without* the bottom bar, causing the bottom footer buttons to hide under it.

On desktop in the `md:h-[850px]` mode, if the viewport is shorter than 850px + padding, the card gets cut off with `overflow-hidden`.

**Why it happens:**
`100vh` on mobile does not account for browser chrome on iOS/Android. The card is also taller on some devices due to safe areas.

**Consequences:**
- Footer buttons hidden on iOS Safari during demo
- Card gets clipped on 768px-width desktop
- Layout shift when scrolling on mobile (address bar collapses)

**Prevention:**
Use `dvh` (dynamic viewport height) instead of `vh` for the mobile case:
```tsx
<div className="h-[100dvh] md:h-[850px]">
```

For iOS safe areas, add padding-bottom that accounts for the home indicator:
```css
padding-bottom: env(safe-area-inset-bottom, 0px);
```
Note: `env(safe-area-inset-*)` only works when the page has `viewport-fit=cover` in the viewport meta tag. Without this, the values are always `0`. This is only relevant for the "real" mobile display, not the desktop simulation.

For the competition (likely on desktop with Chrome DevTools), `md:h-[850px]` with overflow-hidden is acceptable, but test at the actual display resolution.

**Detection:**
- Test with Chrome DevTools device emulation for iPhone 14 Pro
- Check if footer buttons are visible in iPhone Safari emulation
- Test at the competition's exact screen resolution

**Phase:** Layout / mobile-first phase

---

### Pitfall 6: Color Accuracy — Background Green May Be Wrong

**What goes wrong:**
The current code uses `#8CD6BF` as the DNE mint green background. The PROJECT.md itself flags this as potentially wrong ("pode não ser a cor exata"). Color matching from screenshots is notoriously unreliable because:

1. Screenshot gamma/color profile varies by device (sRGB vs Display P3)
2. JPEG compression shifts colors, especially in gradients
3. macOS screenshots captured from a phone photo will have double color profile processing
4. The original app may use a gradient, not a flat color

Tailwind v4 uses OKLCH internally — this means `bg-[#8CD6BF]` gets converted to OKLCH for rendering, which is correct. However, if you eyedropper a color from a screenshot with a wrong color profile, the hex value will be off.

**Why it happens:**
Color extraction from screenshots is affected by the capture device's color profile, JPEG compression artifacts, and the renderer's gamma.

**Consequences:**
- Background is noticeably different from original
- Competition judges notice immediately since it's the most prominent element

**Prevention:**
1. Inspect the DNE website (`dne.org.br`) or APK with a color picker on a calibrated display
2. Use the browser's built-in eyedropper in DevTools color picker (more accurate than screenshot tools)
3. If the original is a gradient, define it explicitly: `background: linear-gradient(to bottom, #8CD6BF, #86C5AF)`
4. Cross-check with a second person on a different display

**Detection:**
- Open original screenshot and your clone side by side in browser
- Use DevTools eyedropper on the original screenshot (drag it to the browser)
- Check if there is a subtle gradient in the original (look for lighter top vs darker bottom)

**Phase:** Visual fidelity / color phase

---

## Moderate Pitfalls

---

### Pitfall 7: Tailwind v4 @import Order Requirement

**What goes wrong:**
In Tailwind v4, `@import` statements must come *before* `@import "tailwindcss"`. The current `globals.css` has `@import "tailwindcss"` at the top. If you add `@import url("https://fonts.googleapis.com/...")` after it, the build will silently fail to include the font import or throw an error.

**Prevention:**
```css
/* CORRECT order in globals.css */
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@800&display=swap");
@import "tailwindcss";

@theme inline {
  --font-dne-logo: "Nunito", sans-serif;
}
```
Prefer `next/font` over `@import url()` in CSS — it handles ordering automatically.

**Phase:** Typography / font loading phase

---

### Pitfall 8: Tailwind v4 Hover on Touch Devices

**What goes wrong:**
Tailwind v4 changed `hover:` to only apply on devices that support hover (using `@media (hover: hover)`). On mobile emulation in Chrome DevTools, touch events are simulated, so hover styles may not trigger. This affects the Apple Wallet button which has `hover:bg-stone-900`.

**Prevention:**
For a card that should look identical on touch and non-touch, avoid hover-only states for structural styling. If hover is decorative, this change is fine — it actually makes the mobile sim more accurate.

**Phase:** Interaction polish phase

---

### Pitfall 9: SVG Rendering — Globe Icon vs Brazil Map Icon

**What goes wrong:**
The current code uses Lucide's `Globe` icon as a placeholder for the UNE Brasil icon. When replaced with a custom SVG of the Brazil map, the SVG must:
- Use `currentColor` or explicit colors (not relative colors that depend on parent)
- Have the correct viewBox to avoid distortion
- Be properly sized via width/height attributes on the `<svg>` element, not just CSS

SVGs embedded via `@svgr/webpack` (which is already in the project) are rendered inline and inherit CSS color properly. External SVG files loaded via `<img src="*.svg">` do NOT inherit CSS color (can't use `currentColor`).

**Prevention:**
Use `@svgr/webpack` for all SVGs that need color control. The project already has this configured.
```tsx
import UneBrasilIcon from "@/assets/une-brasil.svg"
// Renders as inline SVG, currentColor works
```

**Detection:**
- Does the icon color update when parent text color changes?
- Is the icon perfectly circular/square as expected?
- Does it render with correct aspect ratio (no squish)?

**Phase:** Icon / asset phase

---

### Pitfall 10: QR Code Quiet Zone

**What goes wrong:**
QR codes require a "quiet zone" — white space border around the code — to be scannable. The `qrcode.react` library has an `includeMargin` prop (default `false`) and a `marginSize` prop. Without adequate quiet zone, the QR code may not scan, which is embarrassing in a competition demo.

However, the white card container provides the quiet zone implicitly. If the QR code is flush with the card edge or uses `object-fit: contain` in a tight space, the quiet zone may be visually present but the actual QR module starts too close to the edge.

**Prevention:**
Set `includeMargin={true}` on `QRCodeSVG`, or rely on the `py-1` padding already on the card. Verify by scanning with a phone.

**Phase:** QR code phase

---

## Minor Pitfalls

---

### Pitfall 11: InfoRow Flex Wrapping on Long Text

**What goes wrong:**
The `InfoRow` component uses `flex flex-wrap`. For long institution names like "Faculdade De Informatica e Adminstracao", the label and value may wrap unexpectedly, creating a multi-line entry when the original shows single-line with overflow truncation.

**Prevention:**
Match the original's behavior — if it truncates, use `truncate` or `text-ellipsis overflow-hidden`. If it wraps, ensure the wrapping matches. Check with the longest data values.

**Phase:** Information card phase

---

### Pitfall 12: discord CDN Images May Expire

**What goes wrong:**
Student photos in the DATABASE use Discord CDN URLs (`media.discordapp.net`) with expiring tokens in the query string (`ex=69235467`). These URLs expire and will return 403/404. The Next.js `remotePatterns` config includes this domain, but the images themselves will break after expiry.

**Prevention:**
Move student photos to `/public/photos/` as local assets. Static imports via `import photo from "@/assets/photos/luccas.jpg"` are immune to expiry and faster (no remote fetch).

**Phase:** Data / assets phase

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| QR code replacement | External service dependency | Use qrcode.react as Client Component immediately |
| DNE logo font | Wrong font / FOUT | Find correct font or use SVG logo path |
| UNE icon SVG | Incorrect rendering with img tag | Use @svgr/webpack for inline SVG |
| Photo card sizing | next/image w-full vs fixed width/height conflict | Use fill mode with positioned parent |
| Background color | Screenshot color inaccuracy | Use DevTools eyedropper on official site |
| Apple Wallet badge | `w-[160]` invalid (missing unit) | Fix to `w-[160px]` |
| Mobile height | `h-screen` clips on iOS Safari | Use `h-[100dvh]` |
| Tailwind v4 shadows | v4 scale shifted (shadow-sm is now smaller) | Verify visually, use shadow-md if shadow-sm looks too subtle |
| Font @import order | Must come before @import "tailwindcss" | Always put Google Fonts imports first |
| Long data values | InfoRow wraps unexpectedly | Test with longest institution/course names |

---

## Sources

- Tailwind v4 breaking changes: `https://tailwindcss.com/docs/upgrade-guide` (HIGH confidence, official docs, verified 2026-02-28)
- Next.js font optimization: `https://nextjs.org/docs/app/getting-started/fonts` (HIGH confidence, official docs, version 16.1.6, verified 2026-02-28)
- Next.js Image component: `https://nextjs.org/docs/app/api-reference/components/image` (HIGH confidence, official docs, version 16.1.6, verified 2026-02-28)
- Tailwind v4 color system: `https://tailwindcss.com/docs/colors` (HIGH confidence, official docs, verified 2026-02-28)
- Tailwind v4 font configuration: `https://tailwindcss.com/docs/font-family` (HIGH confidence, official docs, verified 2026-02-28)
- QR code quiet zone requirement: ISO/IEC 18004 standard; qrcode.react docs (MEDIUM confidence — standard is well-known, props from training data + npm README)
- iOS Safari viewport height quirks: Known browser behavior (MEDIUM confidence — widely documented but not fetched from official source this session)
- Discord CDN URL expiry: CDN token expiry pattern visible in URL query params `ex=69235467` (HIGH confidence — visible in current code)
