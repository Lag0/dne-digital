# Architecture Patterns

**Domain:** Pixel-perfect mobile UI clone — DNE student ID card (carteirinha digital)
**Researched:** 2026-02-28
**Confidence:** HIGH — analysis based on existing codebase + Next.js 16 official patterns

## Recommended Architecture

The project is a **static, data-driven display app**: no mutations, no auth, no real-time. One route pattern (`/[student]`) renders a mobile card from a JSON record. The architecture should reflect this simplicity — don't introduce complexity the domain doesn't need.

```
src/
├── app/
│   ├── layout.tsx                  # Root layout — fonts, metadata
│   ├── page.tsx                    # Redirect to first student
│   ├── globals.css                 # Tailwind v4 theme tokens
│   └── [student]/
│       └── page.tsx                # Student card page (RSC, generateStaticParams)
├── features/
│   └── student-card/               # All card UI lives here
│       ├── components/
│       │   ├── PhoneFrame.tsx      # Desktop wrapper that simulates a phone
│       │   ├── CardHeader.tsx      # DNE logo + UNE icon + hamburger menu
│       │   ├── PhotoCard.tsx       # Student photo with white card container
│       │   ├── QrCard.tsx          # QR code + CIE number with copy
│       │   ├── InfoCard.tsx        # Student data fields (name, course, CPF...)
│       │   └── CardFooter.tsx      # Certificado button + Apple Wallet button
│       └── types.ts                # Re-exports Student type from shared
├── shared/
│   ├── components/
│   │   └── InfoRow.tsx             # Label + value pair (used 7+ times)
│   └── lib/
│       └── qr.ts                   # QR code generation utility (wraps qrcode lib)
├── constants/
│   └── index.ts                    # DATABASE, STUDENT_IDS, Student type
└── assets/
    ├── dne-logo.svg                # DNE wordmark SVG (to source from dne.org.br)
    ├── une-icon.svg                # UNE circle with Brazil map
    └── Add_to_Apple_Wallet_badge.png
```

**Key principle:** `features/student-card/` is a self-contained module. The page at `app/[student]/page.tsx` only imports from this feature and from `constants/`. Components within the feature can import from `shared/` but not from each other in a way that creates circular dependencies.

### Component Boundaries

| Component | Responsibility | Receives | Emits |
|-----------|---------------|----------|-------|
| `app/[student]/page.tsx` | Data resolution + page shell | `params.student` | renders `PhoneFrame` |
| `PhoneFrame` | Desktop phone frame wrapper | `children` | layout container only |
| `CardHeader` | DNE logo, UNE icon, hamburger | `none` | `none` (static) |
| `PhotoCard` | Renders student photo | `{ src, alt }` | `none` |
| `QrCard` | QR code + CIE display | `{ codigoCie }` | copy-to-clipboard (client) |
| `InfoCard` | All student data fields | `Student` record | `none` |
| `CardFooter` | Action buttons | `none` | `none` (static buttons) |
| `InfoRow` | Single label+value pair | `{ label, value }` | `none` |

### Data Flow

```
constants/index.ts (DATABASE)
       │
       ▼
app/[student]/page.tsx (RSC — resolves student from DATABASE)
       │
       ├──► PhoneFrame (layout wrapper, no data)
       │         │
       │         ├──► CardHeader (static, no data)
       │         │
       │         ├──► PhotoCard ◄──── data.foto
       │         │
       │         ├──► QrCard ◄──── data.codigoCie (generates QR locally)
       │         │
       │         ├──► InfoCard ◄──── full Student record
       │         │         │
       │         │         └──► InfoRow × 7 (label, value pairs)
       │         │
       │         └──► CardFooter (static buttons)
```

Data flows **top-down only**. The page resolves student data and passes it down. No state hoisting, no context, no stores needed. `QrCard` is the only component that may need `"use client"` for the copy-to-clipboard interaction.

### Client vs Server Boundary

| Component | Directive | Reason |
|-----------|-----------|--------|
| `app/[student]/page.tsx` | RSC (default) | Data resolution at build time |
| `PhoneFrame` | RSC | Pure layout, no browser APIs |
| `CardHeader` | RSC | Static markup |
| `PhotoCard` | RSC | `next/image` works in RSC |
| `QrCard` | `"use client"` | Copy-to-clipboard requires `navigator.clipboard` |
| `InfoCard` | RSC | Pure display |
| `CardFooter` | RSC | Buttons are static (no JS handlers needed) |

Minimizing `"use client"` boundaries is the correct approach here. The entire card can be server-rendered except `QrCard`'s copy button.

## Patterns to Follow

### Pattern 1: generateStaticParams for All Students

**What:** Export `generateStaticParams()` from `app/[student]/page.tsx` returning all known student slugs.

**When:** Always — this project has a finite, known set of students in `DATABASE`. There is no reason to use dynamic server-rendering.

**Why:** Builds all student pages as static HTML at compile time. Zero server cost at runtime. `notFound()` handles unknown slugs gracefully.

```typescript
// app/[student]/page.tsx
export const generateStaticParams = () =>
  STUDENT_IDS.map((student) => ({ student }));

export const dynamicParams = false; // 404 for unknown slugs without server lookup
```

**Confidence:** HIGH — existing code already uses this pattern correctly.

### Pattern 2: Phone Frame as Layout Wrapper

**What:** A `PhoneFrame` component that provides the `max-w-[390px]` container with the dark background on desktop and full-screen on mobile.

**When:** Always — the distinction between "mobile view" (full-screen) and "desktop view" (phone-in-dark-bg) lives entirely in this one component via responsive classes.

**Why:** Isolates all frame styling in one place. The card components inside never need to know about the phone frame context.

```typescript
// features/student-card/components/PhoneFrame.tsx
export const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen bg-stone-900 flex items-center justify-center p-0 md:p-8">
    <div className="
      w-full max-w-[390px]
      bg-[#86C5AF]
      h-screen md:h-[844px]
      md:rounded-[54px]
      overflow-hidden
      flex flex-col
      shadow-2xl
      md:border-[10px] border-stone-900
      relative
    ">
      {children}
    </div>
  </main>
);
```

The `max-w-[390px]` matches the iPhone 14 viewport width — the reference device for the DNE app screenshot.

### Pattern 3: Local QR Code Generation

**What:** Generate QR codes using `qrcode` (or `react-qr-code`) library at render time instead of fetching from `api.qrserver.com`.

**When:** Always — external URL dependency is a reliability risk and requires network at build/render time.

**Why:** The QR value is `codigoCie` — a short string. Local generation is instantaneous, works offline, and produces a clean SVG (no CORS, no loading states).

```typescript
// shared/lib/qr.ts — server-side generation
import QRCode from "qrcode";

export const generateQrDataUrl = async (text: string): Promise<string> => {
  return QRCode.toDataURL(text, { margin: 0, width: 200 });
};
```

Alternatively, use `react-qr-code` which renders an inline SVG on the client — simpler if you prefer not to make `generateStaticParams` async for QR generation.

### Pattern 4: Tailwind v4 CSS Custom Properties for Brand Tokens

**What:** Define DNE brand colors and dimensions as CSS custom properties in `globals.css` using Tailwind v4's `@theme` block.

**When:** Any time a brand-specific value appears in more than one component.

**Why:** Single source of truth. When the exact `#86C5AF` green is confirmed from the DNE source, it updates everywhere from one line.

```css
/* globals.css */
@theme inline {
  --color-dne-mint: #86C5AF;      /* background green */
  --color-dne-navy: #1B3A6B;      /* certificate button blue */
  --color-dne-text-label: #5c5c5c; /* info row label color */
  --color-dne-text-value: #9ca3af; /* info row value color */

  --radius-phone: 54px;            /* phone frame border radius */
  --width-phone: 390px;            /* phone frame max width */
  --height-phone: 844px;           /* phone frame height on desktop */
}
```

**Confidence:** HIGH — Tailwind v4 `@theme` is the canonical way to extend the design system.

### Pattern 5: SVG Assets via SVGR

**What:** Import SVG files as React components using `@svgr/webpack` (already configured in `package.json`).

**When:** For the DNE logo and UNE icon — both need precise color control via `fill`/`stroke` props that static `<img>` tags cannot provide.

**Why:** SVG-as-component allows `className` and `style` overrides. The UNE icon needs its internal colors controllable for dark/light variants if needed.

```typescript
import DneLogo from "@/assets/dne-logo.svg";
import UneIcon from "@/assets/une-icon.svg";

// Usage in CardHeader:
<DneLogo className="h-10 w-auto text-white" />
<UneIcon className="h-8 w-8" />
```

Requires `next.config` SVGR setup — verify against current `@svgr/webpack` 8.x config API.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Everything in One File

**What:** Keeping all UI sections in a single `page.tsx` (current state).

**Why bad:** The file becomes 150+ lines of JSX with no clear boundaries. Hard to iterate on individual card sections. Makes it impossible to add per-section loading states or streaming if needed later.

**Instead:** Split into the 6 feature components above. `page.tsx` becomes ~30 lines of composition.

### Anti-Pattern 2: External QR Code API

**What:** `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=...` (current state).

**Why bad:** Network dependency during `next build` (if used in RSC at build time). Breaks in offline dev. CORS risk on client. Creates external dependency on a third-party free service.

**Instead:** `qrcode` npm package for server-side generation, or `react-qr-code` for client-side SVG.

### Anti-Pattern 3: Inline Font Family Overrides

**What:** `style={{ fontFamily: "Arial, sans-serif" }}` on the DNE logo (current state).

**Why bad:** Defeats the purpose of Tailwind's `@theme` font system. Will be overridden differently across components as the project grows.

**Instead:** Source the correct font via `next/font/google` (e.g., Nunito or Rounded Mplus) or host as a local font. Define as `--font-dne-logo` in `@theme`.

### Anti-Pattern 4: Using `<div>` as Button

**What:** Wrapping Apple Wallet image in a `<div>` with `aria-label` instead of a semantic `<button>`.

**Why bad:** Not keyboard-navigable. Fails basic accessibility. Screen readers won't announce it as interactive.

**Instead:** Use `<button type="button">` or `<a>` (if it links anywhere). The Apple Wallet badge image goes inside as a child.

### Anti-Pattern 5: Hardcoded px Dimensions in className

**What:** `w-[160]` (missing unit, current state in Apple Wallet image) — this is a Tailwind bug that produces no CSS.

**Why bad:** Silent failure — the class compiles to nothing. The image width is undefined.

**Instead:** `w-[160px]` or use the responsive sizing approach tied to `--width-phone` token.

## Scalability Considerations

This project is intentionally scoped: 2-5 students, one screen, no backend. Scalability concerns are about maintainability for the competition, not production scale.

| Concern | Current (2-5 students) | If expanded (50+ students) |
|---------|----------------------|--------------------------|
| Student data | `constants/index.ts` (fine) | Move to JSON files or CMS, keep `generateStaticParams` |
| Build time | Negligible | Still fast — static pages are cheap |
| Photos | External URLs (Discord CDN — fragile) | `/public/photos/[student].jpg` or proper CDN |
| QR codes | External API (fragile) | Local lib — no change needed |
| Add new student | Edit `constants/index.ts` | Same pattern, possibly a form |

The `constants/index.ts` pattern is correct for competition scope. No over-engineering needed.

## Build Order (Phase Dependencies)

Components have the following dependency chain — build in this order:

```
1. CSS tokens (globals.css @theme)
   ↓
2. shared/components/InfoRow (no deps)
   ↓
3. features/student-card/components/InfoCard (depends on InfoRow)
   ↓
4. features/student-card/components/PhotoCard (depends on next/image only)
5. features/student-card/components/QrCard (depends on qrcode lib)
   ↓ (parallel with InfoCard)
6. features/student-card/components/CardHeader (depends on SVG assets)
7. features/student-card/components/CardFooter (depends on Apple Wallet asset)
   ↓ (parallel)
8. features/student-card/components/PhoneFrame (pure layout, no data deps)
   ↓
9. app/[student]/page.tsx (composes all of the above)
```

Start with tokens and `InfoRow`, then build the two data-heavy cards (Photo + QR, Info), then the static sections (Header, Footer), then assemble in PhoneFrame, finally wire in the page.

## Sources

- Codebase analysis: `/Users/brunolago/Developer/dne-digital/src/` (direct inspection, HIGH confidence)
- Next.js 16 App Router: `generateStaticParams`, RSC defaults, `dynamicParams = false` — HIGH confidence (official patterns, stable since Next.js 13)
- Tailwind v4 `@theme` inline: HIGH confidence — documented in Tailwind v4 beta/stable release notes
- `@svgr/webpack` 8.x: already listed in `package.json` — HIGH confidence it's available
- `qrcode` npm: HIGH confidence — stable library, no breaking changes expected
- Component boundary reasoning: architectural analysis from existing code patterns — HIGH confidence
