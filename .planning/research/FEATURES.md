# Feature Landscape — DNE Digital Student ID Clone

**Domain:** Mobile UI clone — digital student ID card (carteirinha digital)
**Researched:** 2026-02-28
**Sources:** PROJECT.md analysis, existing codebase (`src/app/[student]/page.tsx`, `src/constants/index.ts`, `src/components/`), PROJECT.md requirements

---

## Visual Anatomy of the Screen

The carteirinha screen is a single-screen mobile app with five distinct vertical sections:

```
┌─────────────────────────┐
│  HEADER                 │  Logo "dne" + UNE icon + hamburger menu
├─────────────────────────┤
│  CARDS ROW              │  [Photo card] [QR code card] — side by side, 50/50
├─────────────────────────┤
│  INFO CARD              │  Student name + 7 labeled data rows
├─────────────────────────┤
│  FOOTER                 │  "Certificado" pill button + Apple Wallet badge
└─────────────────────────┘
```

The entire layout sits on a mint-green background (`#8CD6BF` currently, target ~`#86C5AF`).
On desktop, a dark wrapper (`bg-stone-900`) frames a 400px-max phone frame with rounded corners.

---

## Table Stakes

Features that MUST be present. Without these, it does not resemble DNE.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Mint green background | Primary brand color of DNE app | Low | Current: `#8CD6BF`. Needs verification against original — PROJECT.md suspects it may be slightly off |
| "dne" logo — correct rounded font | Brand identity. The font is a rounded display typeface, not Arial | Medium | Current code uses `Arial`. Must find/match the exact font. Likely a Google Font (Nunito, Rounded variants, or custom) |
| UNE icon — Brazil map circle | Header right-side icon. Current uses `Globe` from Lucide (wrong) | Medium | Must be an SVG circle with Brazil map outline and "UNE" text. Needs custom SVG asset |
| Hamburger menu icon | Header right-side nav trigger | Low | Already present via Lucide `Menu`. Style may need adjustment |
| Photo card (white, rounded) | Left half of cards row. Shows student photo | Low | Already implemented. Proportions and border-radius need fine-tuning |
| QR code card (white, rounded) | Right half of cards row. Shows scannable QR | Low | Implemented but uses external URL (`api.qrserver.com`). Must switch to local generation |
| QR code generated from `codigoCie` | The QR encodes the student's CIE number | Low | Switch to `qrcode` or `react-qr-code` npm library |
| CIE number display below QR | Shows alphanumeric code + copy icon | Low | Already implemented. Font size and icon sizing may need adjustment |
| Info card (white, rounded-2xl) | Container for all student data | Low | Already implemented |
| Student name (bold, medium gray) | First line of info card, larger text | Low | Current: `text-[#555555] font-bold text-lg`. Verify exact color |
| Labeled data rows — 7 fields | `Ins. Ensino`, `Curso`, `Nível de Ensino`, `RG`, `CPF`, `Data de Nasc`, `Validade` | Low | `InfoRow` component exists. Label bold + value normal weight pattern correct |
| "Certificado" pill button — solid blue | CTA button at bottom. Original is filled blue, NOT transparent | Low | Current is transparent with white border. Must change to solid `#1B3A6B` or similar navy blue |
| Apple Wallet badge | Add to Apple Wallet image/button at bottom | Low | Badge PNG already imported. Visual sizing needs adjustment |
| Mobile-first layout (max 390-400px) | Replicates phone screen dimensions | Low | Already `max-w-[400px]`. Verify 390px is tighter match |
| Desktop phone frame wrapper | Dark background simulating a phone on desktop | Low | Already `bg-stone-900` on desktop. Border `border-stone-800` |

---

## Differentiators

Features that increase fidelity beyond minimum viable clone.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Fake status bar | Increases mobile realism — time, signal, battery icons | Low | Code exists but is commented out. Consider enabling for desktop frame |
| Dynamic QR code — real data | QR encodes actual CIE, scannable and verifiable-looking | Low | Requires local QR lib but low effort |
| Copy-to-clipboard on CIE number | Matches app behavior — tap the copy icon and copy CIE | Low | `Copy` icon from Lucide already present. Needs `onClick` + client component |
| Subtle card shadow (`shadow-sm`) | Depth cues match the original's card elevation | Low | Already present. Verify shadow intensity |
| Photo aspect ratio preservation | Correct portrait crop (student photos are portrait format) | Low | `object-cover` + correct aspect ratio on container |
| `mix-blend-multiply` on QR | QR blends cleanly with white card background | Low | Already applied in code |
| Smooth font antialiasing | `antialiased` class on body for crisp text | Low | Already applied in `layout.tsx` |
| Per-student URL routing | `/{slug}` pattern for shareable IDs | Low | Already implemented via `[student]` dynamic route |

---

## Anti-Features

Features to explicitly NOT build for this competition project.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Real Apple Wallet `.pkpass` generation | High complexity, requires Apple certificates, backend. Out of scope per PROJECT.md | Static badge image only, non-functional click |
| Authentication / login screen | No backend, not the focus. Adds complexity with zero visual value | Static JSON/constants as data source |
| Multiple screens / navigation | Only the carteirinha screen matters. Other screens dilute effort | Single route `/{student}` |
| Animated QR scanning effect | Adds complexity, not in original static view | Static QR code only |
| PWA / offline mode | Web simple. Not required per PROJECT.md | Standard Next.js web app |
| Real-time data fetching | No backend exists. JSON constants are sufficient | Static `DATABASE` constants |
| Dark mode | DNE app is light-only. Adding dark mode wastes time | Light mode only |

---

## Feature Dependencies

```
QR code lib (npm)
  → QR card component (replaces external URL)
    → Dynamic data from codigoCie field

Custom UNE SVG asset
  → Header component (replaces Globe icon)

Correct rounded font (Google Fonts or custom)
  → Logo "dne" text rendering
  → Must load in layout.tsx

Solid blue "Certificado" button
  → Requires: knowing exact color (#1B3A6B or similar dark navy)
  → If click needed: requires "use client" + copy interaction

InfoRow component (exists)
  → Info card (exists)
    → Student data (exists in DATABASE constants)
```

---

## Color Palette

Extracted from codebase and PROJECT.md analysis:

| Element | Color | Confidence | Notes |
|---------|-------|------------|-------|
| Background (mint green) | `#8CD6BF` (current) / `#86C5AF` (target) | MEDIUM | PROJECT.md suspects current may be slightly off. Needs screenshot comparison |
| Desktop wrapper | `#1C1917` (stone-900) | HIGH | Tailwind stone-900 |
| Phone frame border | `#292524` (stone-800) | HIGH | Tailwind stone-800 |
| Card background | `#FFFFFF` | HIGH | Pure white for all cards |
| Student name text | `#555555` | HIGH | Current in code, likely correct |
| Info label text (bold) | `#5C5C5C` | HIGH | Current in InfoRow component |
| Info value text (normal) | Tailwind `gray-500` ≈ `#6B7280` | HIGH | Current in InfoRow component |
| CIE label text | Tailwind `gray-500` ≈ `#6B7280` | HIGH | Current in code |
| CIE value text | Tailwind `stone-800` ≈ `#292524` | HIGH | Current in code |
| Certificado button | `#1B3A6B` (target) | MEDIUM | Current is transparent. PROJECT.md specifies this dark navy blue |
| UNE icon circle fill | `#FFFFFF` (white circle) | HIGH | Current code has white rounded-full bg |
| UNE globe/map icon | `#005C9E` (dark blue) | HIGH | Explicit hex in current code |

---

## Typography Patterns

| Element | Font | Weight | Size | Color | Notes |
|---------|------|--------|------|-------|-------|
| Logo "dne" | Rounded display (NOT Arial) | Extra Bold / Black | `text-4xl` (~36px) | White | Must find correct font. Likely Nunito Black or similar rounded Google Font |
| Header icons | — | — | 20-28px | White / Blue | Menu=28px, Globe=20px |
| Info labels | System sans | Bold (700) | `text-[13px]` | `#5C5C5C` | `font-bold` |
| Info values | System sans | Normal (400) | `text-[13px]` | `gray-500` | `font-normal tracking-tight` |
| Student name | System sans | Bold (700) | `text-lg` (~18px) | `#555555` | Leading line of info card |
| CIE label | System sans | Medium (500) | `text-[10px]` | `gray-500` | Uppercase, letter-spaced |
| CIE value | System sans | Bold (700) | `text-sm` (~14px) | `stone-800` | |
| Certificado button | System sans | Medium (500) | `text-sm` (~14px) | White | |

---

## Layout Dimensions

Extracted from code:

| Component | Dimensions | Notes |
|-----------|------------|-------|
| Phone frame | `max-w-[400px]`, full-screen height on mobile | Target may be 390px to match iPhone standard |
| Desktop phone height | `md:h-[850px]` | Simulates tall phone |
| Desktop border radius | `md:rounded-[40px]` | Phone corner rounding |
| Cards row height | `h-[280px]` | Fixed height for photo + QR row |
| Photo card | `w-1/2` of cards row, `p-1.5`, `rounded-xl` | 50% width minus gap |
| QR card | `w-1/2` of cards row, `py-1`, `rounded-xl` | 50% width minus gap |
| Info card | `mx-3`, `mt-3`, `p-5`, `rounded-2xl` | Horizontal margin 12px |
| Cards row padding | `px-3 py-2`, `gap-3` | 12px horizontal, 8px vertical, 12px gap |
| Footer padding | `px-3 pb-8` | Bottom-heavy padding |
| Certificado button width | `w-[280px]` | Fixed 280px, not full-width |

---

## Microinteractions

| Interaction | Status | Notes |
|-------------|--------|-------|
| Copy CIE to clipboard | Not implemented (icon is visual only) | Low effort to add: onClick + navigator.clipboard + toast or icon swap |
| Apple Wallet button hover | `hover:bg-stone-900` on wrapper | Basic hover, likely sufficient |
| No page transitions | N/A | Single page, no navigation needed |
| No loading states | N/A | Static data, instant render |
| Status bar visibility | Commented out | Decorative, re-enable as static display for desktop |

---

## MVP Recommendation

Prioritize in this order:

1. **Correct background color** — verify exact hex from screenshot reference
2. **Solid "Certificado" button** — change from transparent to `#1B3A6B` filled
3. **Local QR code generation** — replace external URL with `react-qr-code` or `qrcode.react`
4. **"dne" logo font** — find rounded Google Font, load in layout.tsx
5. **UNE icon SVG** — custom SVG circle with Brazil map outline
6. **Typography fine-tuning** — verify spacings, font sizes match screenshot exactly

Defer (low visual impact for competition):
- Copy-to-clipboard interaction — icon is already visible, click can be added later
- Fake status bar — commented out, not critical for pixel-perfect card look
- Real Apple Wallet functionality — explicitly out of scope

---

## Sources

- `/Users/brunolago/Developer/dne-digital/.planning/PROJECT.md` — requirements, identified problems, color candidates (HIGH confidence — direct project spec)
- `/Users/brunolago/Developer/dne-digital/src/app/[student]/page.tsx` — existing implementation, all current colors/sizes (HIGH confidence — source of truth for current state)
- `/Users/brunolago/Developer/dne-digital/src/constants/index.ts` — student data schema (HIGH confidence)
- `/Users/brunolago/Developer/dne-digital/src/components/info-row.tsx` — label/value typography pattern (HIGH confidence)
- Note: dne.org.br was not accessible during research (WebFetch blocked). Color verification against the real app screenshot is required. Confidence on exact color values is MEDIUM until screenshot comparison is done.
