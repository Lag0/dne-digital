# Project Research Summary

**Project:** DNE Digital — Student ID Card Clone (Carteirinha Digital)
**Domain:** Pixel-perfect mobile UI clone — static, data-driven display app
**Researched:** 2026-02-28
**Confidence:** HIGH (stack and architecture based on direct codebase analysis + official docs)

## Executive Summary

DNE Digital is a pixel-perfect clone of the DNE student ID mobile app (carteirinha digital). The project is a static, data-driven display app with a single route pattern (`/[student]`) that renders a mobile card from a JSON record. It has no backend, no auth, no real-time — just a faithful visual reproduction of the original. Experts build this type of project with a minimal component hierarchy, static generation at build time (`generateStaticParams`), and zero unnecessary libraries. The existing Next.js 16 + React 19 + Tailwind v4 + pnpm stack is already correct and locked; only one external dependency is missing (`qrcode.react`).

The recommended approach is to refactor the existing monolithic `page.tsx` into 6 feature components (`CardHeader`, `PhotoCard`, `QrCard`, `InfoCard`, `CardFooter`, `PhoneFrame`), define brand tokens in the Tailwind v4 `@theme` block, replace the external QR code API with local generation, and extract the correct rounded font and custom UNE SVG icon from the official DNE website or APK. The build order follows component dependencies: CSS tokens first, then leaf components, then composed sections, then assembly. All components remain Server Components except `QrCard` (clipboard API).

The primary risks are visual fidelity failures visible to competition judges: wrong background color (current `#8CD6BF` unverified), wrong font on the DNE logo (currently Arial), wrong UNE icon (currently a generic Globe), and a broken QR code if the network blocks `api.qrserver.com`. All four risks have clear mitigations. The external QR API dependency is the most dangerous for a live demo and must be eliminated first.

---

## Key Findings

### Recommended Stack

The stack is locked per `PROJECT.md`. Only one new dependency is required. The existing tooling is well-configured: `@svgr/webpack` handles SVG-as-component imports, `next/font/google` handles font optimization, and Tailwind v4 `@theme` handles brand tokens.

**Core technologies:**
- `Next.js 16` + `React 19`: Framework locked, App Router, RSC-first — do not change
- `Tailwind v4`: Utility styling with `@theme inline` for brand tokens — note scale renames vs v3
- `qrcode.react ^4.x`: Only missing dependency — replaces `api.qrserver.com` with local SVG generation
- `next/font/google` (Nunito): Best candidate for the rounded DNE logo font — needs human verification against `dne.org.br`
- `@svgr/webpack ^8.1.0`: Already configured, use for UNE icon SVG import
- `pnpm`: Package manager locked, do not switch

**What NOT to add:** `react-device-preview` (overkill), `qr-code-styling` (80 kB, unnecessary logo support), `react-qr-code` (wraps SVG in div, complicates `mix-blend-multiply` styling).

### Expected Features

The carteirinha is a single-screen layout with five vertical sections: header (DNE logo + UNE icon + hamburger), cards row (photo card + QR card, 50/50), info card (7 data fields), and footer (Certificado button + Apple Wallet badge). See `.planning/research/FEATURES.md` for full visual anatomy and dimension table.

**Must have (table stakes):**
- Correct mint green background — verify exact hex via DevTools eyedropper on `dne.org.br`
- "dne" logo with rounded display font (not Arial) — likely Nunito ExtraBold or a custom SVG path
- UNE icon: custom SVG circle with Brazil map outline, not the generic Lucide Globe
- Local QR code generation from `codigoCie` field — eliminate `api.qrserver.com`
- Solid navy "Certificado" button (`#1B3A6B`) — currently transparent with white border (wrong)
- Photo card and QR card at correct proportions using `next/image` fill mode
- Desktop phone frame: `max-w-[390px]`, dark `stone-900` background, `rounded-[54px]`, `h-[844px]`

**Should have (high fidelity differentiators):**
- Copy-to-clipboard on CIE number (`navigator.clipboard` in `QrCard` client component)
- Fake status bar (code is already commented out — re-enable for desktop polish)
- `mix-blend-multiply` on QR code (already applied, verify no transparency artifacts)
- Dynamic QR quiet zone via `includeMargin={true}` or card padding

**Defer (out of scope per PROJECT.md):**
- Real Apple Wallet `.pkpass` generation — static badge only
- Authentication or login screen
- Multiple screens or navigation
- PWA, offline mode, dark mode, animated QR scanning

### Architecture Approach

The project follows a Feature-Sliced Design with a single feature module (`student-card`). The page resolves student data from `constants/index.ts` and passes it down to leaf components — top-down data flow only, no state management, no context, no stores. All components are RSC by default; only `QrCard` requires `"use client"` for the clipboard interaction. Static generation via `generateStaticParams` + `dynamicParams = false` builds all student pages at compile time with zero runtime server cost. See `.planning/research/ARCHITECTURE.md` for the full component tree and build order.

**Major components:**
1. `PhoneFrame` — desktop wrapper that simulates a phone (max-w-[390px], rounded corners, dark background)
2. `CardHeader` — DNE logo text + UNE SVG icon + hamburger menu (RSC, static)
3. `PhotoCard` — student photo via `next/image` fill mode with positioned parent container
4. `QrCard` — local QR code (`QRCodeSVG`) + CIE number + copy-to-clipboard (client component)
5. `InfoCard` + `InfoRow` — 7 labeled data fields, existing `InfoRow` component is already correct
6. `CardFooter` — solid navy Certificado button + Apple Wallet badge

**Key patterns:**
- CSS brand tokens in `globals.css` `@theme inline` block (`--color-dne-mint`, `--color-dne-navy`, `--width-phone`, `--height-phone`, `--radius-phone`)
- SVG imports via `@svgr/webpack` for the UNE icon and optionally the DNE logo
- `generateStaticParams` + `dynamicParams = false` for static page generation

### Critical Pitfalls

1. **External QR API dependency** — `api.qrserver.com` will fail on school networks during competition demo. Replace immediately with `qrcode.react` (`QRCodeSVG` client component). Do not proceed to other phases until this is fixed.

2. **`next/image` fill vs fixed dimensions conflict** — the current Apple Wallet badge uses `w-[160]` (invalid Tailwind, missing unit). Photo card uses `width={440} height={550}` with `className="w-full h-full"` causing CLS. Fix: use `fill` mode with positioned parent for photo, use `width={160} height={46}` matching CSS for the badge.

3. **Wrong font for DNE logo** — Arial is obvious to competition judges. Must identify the correct rounded font (Nunito ExtraBold is the best guess). If the DNE site uses an SVG logo, extract the path instead — immune to font loading issues and always pixel-perfect.

4. **Color inaccuracy from screenshot** — `#8CD6BF` was extracted from a screenshot and is flagged as potentially wrong in `PROJECT.md`. Use Chrome DevTools eyedropper directly on `dne.org.br` (calibrated display) to get the exact value. This is the most prominent element in the design.

5. **Tailwind v4 scale renames** — `shadow-sm` in v4 is smaller than `shadow-sm` in v3. `rounded-sm` is now `rounded-xs`. The current code uses `rounded-xl`/`rounded-2xl` (fine), but any new shadow additions must use v4 scale values.

---

## Implications for Roadmap

Based on research, the project has clear component dependencies that dictate phase order. The key constraint is that visual accuracy depends on external asset verification (color, font, SVG icons) that must be done by a human with access to `dne.org.br`. This creates a dependency: asset extraction first, then visual implementation.

### Phase 1: Foundation — Tokens, Structure, QR Fix

**Rationale:** The QR code external dependency is a critical demo risk and must be eliminated immediately. CSS tokens establish the design system before any visual work begins. Refactoring `page.tsx` into the component structure prevents rework in all later phases.

**Delivers:** A working local QR code, the component skeleton (PhoneFrame + empty sections), CSS brand token definitions in `@theme inline`, and the `generateStaticParams` pattern confirmed.

**Addresses:** Table stakes — local QR code, phone frame structure, `dynamicParams = false`.

**Avoids:** Pitfall 2 (external QR API), Anti-Pattern 1 (monolithic page.tsx), Anti-Pattern 5 (invalid `w-[160]` Tailwind class).

**Research flag:** Standard patterns — no additional research needed. `qrcode.react` API is straightforward.

### Phase 2: Asset Extraction — Color, Font, SVG Icons

**Rationale:** Visual fidelity depends on having the correct brand assets. This is a human-action-gated phase — requires someone to open `dne.org.br` and the DNE app on a calibrated display, run DevTools eyedropper, identify the font, and extract the UNE SVG. This cannot be automated.

**Delivers:** Confirmed exact hex for the mint green background, identified font loaded via `next/font/google`, extracted UNE icon SVG ready for `@svgr/webpack` import, and optionally the DNE logo as SVG path.

**Addresses:** Table stakes — correct background color, correct logo font, correct UNE icon.

**Avoids:** Pitfall 3 (wrong font/FOUT), Pitfall 6 (color inaccuracy from screenshot), Anti-Pattern 3 (inline font family override).

**Research flag:** Needs human action — cannot be resolved by code generation. Must verify against `dne.org.br`. Font may be proprietary (use `next/font/local` with extracted `.woff2` from APK if not on Google Fonts).

### Phase 3: Visual Fidelity — Component Implementation

**Rationale:** With tokens and assets confirmed, implement all 6 components to pixel-perfect spec. This is the core implementation phase. Photo card uses `next/image` fill mode, QrCard is a client component, InfoCard uses the existing InfoRow, CardFooter gets the solid navy Certificado button.

**Delivers:** Fully implemented student card matching the DNE original, all 6 components complete, correct Certificado button color (`#1B3A6B`), photo card with correct proportions, info card with all 7 data rows.

**Addresses:** All table stakes features. Also addresses: Anti-Pattern 4 (`<div>` as button), Anti-Pattern 5 (invalid Tailwind unit), Pitfall 1 (next/image sizing).

**Avoids:** Pitfall 4 (Tailwind v4 shadow scale — verify shadows visually before finalizing).

**Research flag:** Standard patterns — component implementation follows architecture research. No additional research needed.

### Phase 4: Polish — Microinteractions and Cross-Device Testing

**Rationale:** Once visually correct on the happy path, harden for demo conditions. Copy-to-clipboard interaction, mobile height with `dvh`, status bar, Discord CDN photo migration to local assets.

**Delivers:** Copy-to-clipboard on CIE number, mobile layout fixed for iOS Safari (`h-[100dvh]`), student photos moved to `/public/photos/` (eliminates Discord CDN expiry risk), status bar re-enabled as decorative element.

**Addresses:** Differentiator features — clipboard interaction, photo fallback, mobile fidelity.

**Avoids:** Pitfall 5 (mobile height clips on iOS), Pitfall 12 (Discord CDN URL expiry), Pitfall 10 (QR quiet zone — verify scannable).

**Research flag:** Standard patterns — `navigator.clipboard`, `dvh`, local asset migration are all well-documented.

### Phase Ordering Rationale

- Phase 1 before Phase 3: Component structure must exist before implementing components. QR fix is demo-critical and must be done before any demo.
- Phase 2 before Phase 3: Visual implementation without correct assets will require rework. Asset extraction is a one-time human-gated action that blocks all visual accuracy.
- Phase 4 last: Polish after core implementation. Clipboard and mobile height are important but not demo-breaking on desktop Chrome.
- No backend phases: The architecture is intentionally static. Adding any backend infrastructure would be over-engineering for this competition scope.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Asset Extraction):** Human-gated — cannot be completed without direct access to `dne.org.br` on a calibrated display. Font identification may require APK extraction if proprietary. Plan for a short spike.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** `qrcode.react` API is simple, component structure follows established Next.js App Router patterns, `@theme inline` is official Tailwind v4 documentation.
- **Phase 3 (Visual Fidelity):** Component implementation follows architecture research exactly. All patterns are documented.
- **Phase 4 (Polish):** `navigator.clipboard`, `dvh`, local file migration are all standard web patterns.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Based on direct codebase analysis + official docs for Next.js 16 and Tailwind v4. Only `qrcode.react` version unverified via live npm — check with `pnpm info qrcode.react version` before install |
| Features | HIGH | Derived from `PROJECT.md` (direct spec) and `src/app/[student]/page.tsx` (source of truth). Color values are MEDIUM — exact hex requires human verification |
| Architecture | HIGH | Direct codebase inspection + official Next.js App Router patterns (generateStaticParams, RSC/client boundary, dynamicParams). All patterns are well-documented |
| Pitfalls | HIGH | Critical pitfalls (QR API, next/image sizing, Tailwind v4 scale) verified against official docs. Font and color pitfalls are MEDIUM — specific values require human verification |

**Overall confidence:** HIGH for structural decisions. MEDIUM for exact visual values (colors, fonts) that require human verification against the original.

### Gaps to Address

- **Exact mint green hex:** Current `#8CD6BF` flagged as potentially wrong. Must be verified with DevTools eyedropper on `dne.org.br`. Could be a flat color or a subtle gradient. Handle by making it a `--color-dne-mint` token so it's trivially updated once confirmed.
- **DNE logo font identity:** Nunito ExtraBold is the research best guess (MEDIUM confidence). Requires human inspection via WhatFont extension or DevTools Network tab on `dne.org.br`. Handle by loading Nunito as placeholder, replacing when confirmed. If the site uses an SVG logo, extract path instead.
- **UNE icon SVG source:** Must be extracted from `dne.org.br` (DevTools Elements inspector) or from the DNE APK (`res/drawable/`). The Brazil map circle is a custom SVG, not available from any icon library. Block Phase 3 `CardHeader` implementation on this.
- **`qrcode.react` exact version:** Research cites `^4.0.0` as likely current but could not verify via live npm. Run `pnpm info qrcode.react version` before pinning.

---

## Sources

### Primary (HIGH confidence)
- `/Users/brunolago/Developer/dne-digital/src/app/[student]/page.tsx` — existing implementation, all current colors/dimensions/components
- `/Users/brunolago/Developer/dne-digital/.planning/PROJECT.md` — requirements, identified problems, explicit color candidates
- `https://nextjs.org/docs/app/api-reference/components/image` — next/image fill mode, generateStaticParams, dynamicParams (verified 2026-02-28)
- `https://tailwindcss.com/docs/upgrade-guide` — Tailwind v4 breaking changes, scale renames (verified 2026-02-28)
- `https://tailwindcss.com/docs/font-family` + `https://tailwindcss.com/docs/colors` — @theme inline API (verified 2026-02-28)
- `https://nextjs.org/docs/app/getting-started/fonts` — next/font/google and next/font/local (verified 2026-02-28)

### Secondary (MEDIUM confidence)
- Training knowledge (cutoff August 2025) — `qrcode.react` v4 API, `react-qr-code` comparison, Nunito font identification as DNE logo candidate
- ISO/IEC 18004 — QR code quiet zone requirement (well-known standard, not fetched directly this session)

### Tertiary (LOW confidence)
- Font identification as Nunito — visual analysis of "rounded display sans-serif" description. Requires human verification against original app. May be Nunito Sans, Rounded Mplus 1c, or a proprietary custom font.
- Background color `#86C5AF` (PROJECT.md candidate) vs `#8CD6BF` (current code) — exact value unverified without live access to `dne.org.br`

---
*Research completed: 2026-02-28*
*Ready for roadmap: yes*
