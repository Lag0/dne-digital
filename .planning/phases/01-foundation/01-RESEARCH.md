# Phase 1: Foundation - Research

**Researched:** 2026-02-28
**Domain:** QR code local generation, Tailwind v4 CSS tokens, next/font/google, mobile viewport units, TypeScript type cleanup
**Confidence:** HIGH

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Sistema de tokens CSS com cores exatas do DNE (mint `#8CD6BF` a confirmar, azul botão `#1B3A6B`) definidos em `@theme` | Tailwind v4 @theme syntax verified — hex values accepted directly |
| FOUND-02 | Fonte rounded display (Nunito ExtraBold ou equivalente) carregada via `next/font/google` para o logo "dne" | next/font/google variable + className approach verified from official docs |
| FOUND-03 | Background da página desktop com fundo escuro (`stone-900`) simulando frame de celular | Existing `bg-stone-900` on `<main>` already correct — no change needed |
| FOUND-04 | Container mobile com `max-width: 390px`, `h-[100dvh]` (corrigindo `h-screen` para iOS Safari) | `dvh` unit verified, fallback pattern documented |
| DATA-01 | DATABASE atualizado para remover campos `nivel` e `rg` de todos os estudantes | Direct type + data edit — no library research needed |
| DATA-02 | Campo `foto` suporta path local (`/photos/nome.jpg`) ou URL externa como fallback | Current field is already `string` type — no change needed for Phase 1 |
| DATA-03 | Campos do tipo `Student` atualizados para refletir apenas os campos visíveis | Remove `nivel`, `rg`, `qrcode` from type and all DATABASE records |
</phase_requirements>

---

## Summary

Phase 1 is a technical foundation cleanup with four concrete tasks: install `qrcode.react` to replace the external `api.qrserver.com` dependency, define DNE brand tokens in the Tailwind v4 `@theme` block, load Nunito via `next/font/google` for the logo element only, and fix the mobile container to use `h-[100dvh]` + correct dimensions. Additionally, the `Student` TypeScript type and `DATABASE` must be cleaned up to remove three fields (`nivel`, `rg`, `qrcode`) that do not appear in the original DNE app.

All research domains have HIGH confidence because the findings come from official documentation verified in this session (Next.js 16.1.6 official docs, Tailwind v4 official docs, qrcode.react v4.2.0 README). There are no speculative claims. The only MEDIUM confidence item is the exact Nunito font weight for the logo — `800` (ExtraBold) is the best candidate but requires visual verification against `dne.org.br` in Phase 2.

The current codebase has `@theme inline` already in `globals.css` (used for Geist font variables), confirming the exact syntax to extend. The `layout.tsx` already shows the `variable` + `className` pattern for fonts. The QR code currently uses `next/image` with an external URL in `data.qrcode` — replacing it requires adding `QRCodeSVG` as a client component and removing the `qrcode` field from the type entirely.

**Primary recommendation:** Install `qrcode.react@^4.2.0`, add `"use client"` wrapper for the QR card section, remove `nivel`/`rg`/`qrcode` from the Student type, define `--color-dne-mint` and `--color-dne-navy` in `@theme`, and load Nunito with `variable: '--font-nunito'` in layout.tsx.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| qrcode.react | 4.2.0 | Local QR code generation as SVG | Eliminates external API dependency; renders inline SVG with no network call |
| next/font/google (Nunito) | built-in (Next.js 16) | Rounded display font for "dne" logo | Self-hosted at build time, zero Google requests in browser, zero FOUT |
| Tailwind v4 `@theme` | 4.x (already installed) | CSS custom property tokens | Single source of truth for brand colors, accessible as utilities and CSS vars |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `h-[100dvh]` (CSS unit) | native browser | Mobile viewport height | Replaces `h-screen` (`100vh`) to fix iOS Safari toolbar clipping |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| qrcode.react `QRCodeSVG` | `react-qr-code` | react-qr-code wraps SVG in a `<div>` — complicates `mix-blend-multiply` styling on the QR card |
| qrcode.react `QRCodeSVG` | `qr-code-styling` | 80 kB bundle size, designed for logo-embedded QR codes — overkill for plain CIE code |
| next/font/google | inline `style={{ fontFamily }}` | Inline style causes FOUT and skips preloading/self-hosting |
| `@theme` CSS tokens | Tailwind `tailwind.config.js` | Tailwind v4 dropped JS config — `@theme` is the only correct approach |

**Installation:**

```bash
pnpm add qrcode.react
```

No other new packages needed. `next/font/google` and Tailwind v4 are already installed.

---

## Architecture Patterns

### Recommended Project Structure

No structural changes to the source tree in Phase 1. All changes are within existing files:

```
src/
├── app/
│   ├── layout.tsx          # ADD Nunito font variable
│   ├── globals.css         # ADD @theme color + font tokens
│   └── [student]/
│       └── page.tsx        # REPLACE Image QR with QRCodeSVG (inline or extracted component)
├── constants/
│   └── index.ts            # REMOVE nivel, rg, qrcode from Student type + DATABASE
└── (no new files required)
```

For the QR replacement, keep it inline in `page.tsx` for Phase 1 (component extraction is Phase 2+ work). A `"use client"` wrapper is needed only if clipboard interaction is added — in Phase 1, QRCodeSVG renders server-side from a Server Component because it is pure SVG output with no browser APIs.

**Important:** `QRCodeSVG` from `qrcode.react` does NOT require `"use client"` for rendering alone. It only needs `"use client"` if you add `onClick` clipboard handlers. Phase 1 does NOT include clipboard interaction (that is Phase 3/CARD-06) — so the QR card section remains a Server Component in Phase 1.

### Pattern 1: QRCodeSVG in Server Component

**What:** Replace `<Image src={data.qrcode}>` with `<QRCodeSVG value={data.codigoCie}>` directly in the RSC page.
**When to use:** Phase 1 — pure rendering, no client interaction needed yet.

```typescript
// Source: https://github.com/zpao/qrcode.react/blob/main/README.md
import { QRCodeSVG } from 'qrcode.react';

// Inside the RSC page component (no "use client" needed for render-only):
<QRCodeSVG
  value={data.codigoCie}
  size={160}
  bgColor="#FFFFFF"
  fgColor="#000000"
  level="M"
  marginSize={1}
  className="w-[95%] mix-blend-multiply"
/>
```

### Pattern 2: Tailwind v4 @theme Token Definition

**What:** Define brand color tokens and font token in `globals.css` `@theme inline` block.
**When to use:** All brand colors and the Nunito font CSS variable.

```css
/* Source: https://tailwindcss.com/docs/theme */
/* globals.css — extend the existing @theme inline block */

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  /* DNE Brand tokens — ADD THESE */
  --color-dne-mint: #8CD6BF;     /* Mint background — verify exact hex in Phase 2 */
  --color-dne-navy: #1B3A6B;     /* Certificado button, UNE icon */
}
```

Once defined, usage in JSX: `className="bg-dne-mint"` and `className="bg-dne-navy"`.

### Pattern 3: next/font/google Nunito — Variable Approach

**What:** Load Nunito as a CSS variable in `layout.tsx`, apply the variable class to the logo `<h1>` only.
**When to use:** When a font is needed on a specific element, not the entire body.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/font
// layout.tsx — add Nunito alongside existing Geist fonts

import { Geist, Geist_Mono, Nunito } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
  // Nunito IS a variable font on Google Fonts — no weight array needed
  // To target ExtraBold specifically when applying: use font-weight: 800
});

// Apply variable to html or body to make CSS var available:
<body className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased`}>
```

```css
/* globals.css — add to @theme inline block */
@theme inline {
  /* ... existing tokens ... */
  --font-nunito: var(--font-nunito);   /* expose for Tailwind font-nunito utility */
}
```

```typescript
// In page.tsx logo element — apply className directly:
<h1 className={`${nunito.variable} text-white text-4xl font-extrabold tracking-tighter select-none`}
    style={{ fontFamily: 'var(--font-nunito)' }}>
  dne
</h1>
```

**Simpler alternative** (recommended for Phase 1 — no globals.css font token needed):
```typescript
// Import nunito in the page file directly (font is preloaded for this route only)
import { Nunito } from 'next/font/google';

const nunito = Nunito({ subsets: ['latin'], display: 'swap' });

// In JSX:
<h1 className={`${nunito.className} text-white text-4xl font-extrabold tracking-tighter`}>
  dne
</h1>
```

The simpler approach (direct `className` on the element) is correct for Phase 1 since Nunito is only used on the logo. The variable approach is needed only if Tailwind utilities like `font-nunito` are required.

### Pattern 4: h-[100dvh] with Fallback

**What:** Replace `h-screen` with `h-[100dvh]` plus a CSS fallback for browsers that don't support `dvh`.
**When to use:** Mobile container to prevent iOS Safari address bar clipping.

```typescript
// In page.tsx mobile container div:
// BEFORE:
<div className="w-full max-w-[400px] bg-[#8CD6BF] h-screen md:h-[850px] ...">

// AFTER (two approaches):

// Option A: Tailwind arbitrary value — supported in modern browsers
// Note: Most modern browsers (iOS Safari 15.4+, Chrome 108+) support dvh
// The fallback is the browser's existing behavior (100vh = lvh)
<div className="w-full max-w-[390px] bg-dne-mint h-[100dvh] md:h-[844px] ...">

// Option B: CSS fallback via style prop (belt-and-suspenders)
<div
  className="w-full max-w-[390px] bg-dne-mint md:h-[844px] ..."
  style={{ height: '100vh', height: '100dvh' } as React.CSSProperties}>
```

**Recommendation: Option A** (Tailwind arbitrary value) is sufficient. iOS Safari 15.4+ (released 2022) supports `dvh`. The competition demo hardware will certainly support it. No explicit fallback needed for this project.

### Pattern 5: Student Type Cleanup

**What:** Remove `nivel`, `rg`, `qrcode` fields from the `Student` type and `DATABASE`.
**When to use:** Phase 1 — before any component work begins.

```typescript
// Source: src/constants/index.ts — current state
// BEFORE:
export type Student = {
  nome: string;
  instituicao: string;
  curso: string;
  nivel: string;        // REMOVE — not in DNE original
  rg: string;           // REMOVE — not in DNE original
  cpf: string;
  nascimento: string;
  validade: string;
  codigoCie: string;
  foto: string;
  qrcode: string;       // REMOVE — QR now generated from codigoCie locally
};

// AFTER:
export type Student = {
  nome: string;
  instituicao: string;
  curso: string;
  cpf: string;
  nascimento: string;
  validade: string;
  codigoCie: string;
  foto: string;
};
```

Remove `nivel`, `rg`, `qrcode` from both student records in `DATABASE`. Remove `InfoRow` calls for "Nível de Ensino" and "RG" in `page.tsx`.

### Anti-Patterns to Avoid

- **`"use client"` on entire page.tsx for QRCodeSVG:** `QRCodeSVG` renders pure SVG and does not require `"use client"` for display-only use. Adding it would unnecessarily disable RSC for the whole page. Only add `"use client"` to a sub-component when clipboard interaction is needed (Phase 3).
- **Inline `style={{ fontFamily: 'Nunito' }}`:** Does not self-host the font, causes FOUT, and bypasses Next.js font optimization. Always use `next/font/google`.
- **Using hex with `@theme` without `inline` keyword:** The existing `globals.css` already uses `@theme inline` correctly. Adding new color tokens must go inside the same `@theme inline` block — do not create a separate `@theme` block without `inline`, as that changes resolution semantics for the existing font variables.
- **Using `includeMargin` on QRCodeSVG:** Deprecated in v4 — use `marginSize` (integer number of modules) instead.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| QR code generation | Custom canvas drawing, SVG path calculation | `qrcode.react` `QRCodeSVG` | Reed-Solomon error correction, quiet zone, version negotiation are non-trivial; qrcode.react handles all edge cases |
| Font self-hosting | Manual `@font-face` with local woff2 | `next/font/google` | next/font handles preloading, fallback font metrics, CLS prevention, and zero-request self-hosting |
| Viewport height detection | JS `window.innerHeight` measurement + resize listener | `h-[100dvh]` CSS unit | Native CSS unit, no JS, no layout shift, handles browser chrome reflow automatically |

**Key insight:** All three problems look simple but have browser-compatibility edge cases. The libraries/CSS units handle them correctly and add zero maintenance burden.

---

## Common Pitfalls

### Pitfall 1: QRCodeSVG Rendering Inside a Server Component

**What goes wrong:** Developer adds `"use client"` to `page.tsx` to use `QRCodeSVG`, losing all RSC benefits for the entire page.
**Why it happens:** Misreading the qrcode.react docs — the library is for React but `QRCodeSVG` itself is a pure render component that does not use browser APIs during rendering.
**How to avoid:** Import `QRCodeSVG` directly in the Server Component. Only wrap in a Client Component if you need `onClick` or `navigator.clipboard`.
**Warning signs:** If TypeScript or the Next.js compiler throws an error about `QRCodeSVG` in an RSC, investigate whether the library itself has internal `use client` — if it does, it will cascade naturally. Test empirically during implementation.

### Pitfall 2: Wrong Container Dimensions

**What goes wrong:** Using `max-w-[400px]` instead of `max-w-[390px]` and `h-[850px]` instead of `h-[844px]` for the desktop phone frame.
**Why it happens:** The current code uses non-standard dimensions. 390px × 844px is the iPhone 14 logical resolution — the correct spec for the DNE phone frame.
**How to avoid:** Use `max-w-[390px]` and `md:h-[844px]` exactly. These are the verified iPhone 14 screen dimensions used in the reference app.
**Warning signs:** Phone frame looks slightly too wide or too tall compared to reference screenshots.

### Pitfall 3: Tailwind v4 @theme inline vs @theme (without inline)

**What goes wrong:** Adding new `@theme` block without `inline` keyword, which changes how CSS variable references are resolved.
**Why it happens:** The existing file has `@theme inline` — if a developer adds a new `@theme {}` block (without `inline`) for new tokens, the resolution semantics differ for CSS variable references.
**How to avoid:** Add all new tokens to the **existing** `@theme inline {}` block in `globals.css`. Do not create a second `@theme` block.
**Warning signs:** Tailwind utility classes like `bg-dne-mint` compile but show wrong or missing colors at runtime.

### Pitfall 4: Nunito Not a Variable Font Edge Case

**What goes wrong:** Calling `Nunito({})` without `subsets` causes a Next.js warning; calling without `weight` on a non-variable font causes a build error.
**Why it happens:** Google Fonts Nunito IS a variable font (confirmed by Google Fonts listing), so `weight` is optional. But `subsets: ['latin']` is always required by Next.js for Google Fonts.
**How to avoid:** Always include `subsets: ['latin']` in the Nunito config. Omit `weight` since it is a variable font.
**Warning signs:** `warn - next/font/google: no subsets specified` warning in dev console.

### Pitfall 5: DATA-03 TypeScript Cascade

**What goes wrong:** Removing `qrcode` from the `Student` type causes TypeScript errors in `page.tsx` where `data.qrcode` is still referenced as the QR `src`.
**Why it happens:** The type change and the JSX change must happen atomically — they are tightly coupled.
**How to avoid:** Do both changes in the same task: remove fields from type, remove fields from DATABASE records, AND replace `<Image src={data.qrcode}>` with `<QRCodeSVG value={data.codigoCie}>` in one commit.
**Warning signs:** TypeScript compile error `Property 'qrcode' does not exist on type 'Student'`.

---

## Code Examples

Verified patterns from official sources:

### QRCodeSVG — Complete Usage

```typescript
// Source: https://github.com/zpao/qrcode.react README (verified 2026-02-28)
import { QRCodeSVG } from 'qrcode.react';

// In page.tsx QR card section (RSC, no "use client" needed for Phase 1):
<QRCodeSVG
  value={data.codigoCie}
  size={160}
  bgColor="#FFFFFF"
  fgColor="#000000"
  level="M"
  marginSize={1}
  className="w-[95%] mix-blend-multiply"
/>
```

### Tailwind v4 @theme inline — Extend Existing Block

```css
/* Source: https://tailwindcss.com/docs/theme (verified 2026-02-28) */
/* globals.css — replace entire @theme inline block: */

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  /* DNE brand tokens */
  --color-dne-mint: #8CD6BF;
  --color-dne-navy: #1B3A6B;
  --color-dne-text: #5C5C5C;

  /* Optional: expose Nunito if using via @theme */
  /* --font-nunito: var(--font-nunito); */
}
```

### next/font/google Nunito — Minimal Setup for Single Element

```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/font (verified 2026-02-28)
// Option: load directly in page.tsx for route-scoped preloading

import { Nunito } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  // No weight needed — Nunito is a variable font
});

// Apply to logo element only:
<h1 className={`${nunito.className} text-white text-4xl font-extrabold tracking-tighter select-none`}>
  dne
</h1>
```

### h-[100dvh] Container Fix

```typescript
// Source: MDN Web Docs — dvh unit (verified 2026-02-28)
// In page.tsx main container div:

// BEFORE (broken on iOS Safari):
<div className="w-full max-w-[400px] bg-[#8CD6BF] h-screen md:h-[850px] ...">

// AFTER (correct):
<div className="w-full max-w-[390px] bg-dne-mint h-[100dvh] md:h-[844px] ...">
```

### Student Type — After Cleanup

```typescript
// src/constants/index.ts

export interface Student {
  nome: string;
  instituicao: string;
  curso: string;
  cpf: string;
  nascimento: string;
  validade: string;
  codigoCie: string;
  foto: string;
}

export const DATABASE: Record<string, Student> = {
  luccas: {
    nome: "Luccas Salvagni Queiroz Santos",
    instituicao: "Faculdade De Informatica e Administracao",
    curso: "Ciência da Computação",
    cpf: "05369802254",
    nascimento: "03/11/2000",
    validade: "31/03/2026",
    codigoCie: "09ZB5S",
    foto: "https://media.discordapp.net/...",
  },
  joao: {
    nome: "João Pedro Militão da Silva",
    instituicao: "Mackenzie",
    curso: "Direito",
    cpf: "39456076806",
    nascimento: "12/10/2002",
    validade: "31/04/2026",
    codigoCie: "10XC8T",
    foto: "https://media.discordapp.net/...",
  },
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `api.qrserver.com` external URL | `qrcode.react` `QRCodeSVG` local | Phase 1 | Eliminates demo-breaking network dependency |
| `h-screen` (100vh) | `h-[100dvh]` | Phase 1 | Fixes iOS Safari toolbar clipping |
| `max-w-[400px]` + `h-[850px]` | `max-w-[390px]` + `h-[844px]` | Phase 1 | Correct iPhone 14 logical resolution dimensions |
| `style={{ fontFamily: 'Arial' }}` | `next/font/google` Nunito | Phase 1 | Correct rounded font, zero FOUT, self-hosted |
| Inline Tailwind color `bg-[#8CD6BF]` | `bg-dne-mint` via `@theme` token | Phase 1 | Single source of truth, easy to update when exact hex confirmed |
| `tailwind.config.js` theme extend | `@theme inline {}` in CSS | Tailwind v4 | Breaking change — JS config dropped in v4 |

**Deprecated/outdated:**
- `includeMargin` prop on `QRCodeSVG`: Deprecated in qrcode.react v4 — use `marginSize` (integer number of quiet-zone modules) instead.
- Tailwind v3 `tailwind.config.js` theme extension: Not applicable in v4 — all theme customization is in `@theme {}` CSS directive.

---

## Open Questions

1. **Exact mint green hex color**
   - What we know: Current code uses `#8CD6BF`; `PROJECT.md` flags it as potentially wrong; candidate `#86C5AF` also mentioned
   - What's unclear: The exact value requires eyedropper measurement on `dne.org.br` on a calibrated display — cannot be determined programmatically
   - Recommendation: Proceed with `#8CD6BF` as placeholder in `--color-dne-mint` token. The token architecture means updating to the verified hex in Phase 2 is a one-line change.

2. **Nunito weight for "dne" logo**
   - What we know: Nunito is a variable font; `font-extrabold` (800) is the best visual candidate for the rounded bold logo style
   - What's unclear: Whether the DNE app uses ExtraBold (800) or Black (900) — requires visual comparison with `dne.org.br`
   - Recommendation: Use `font-extrabold` (800) in Phase 1. Adjust in Phase 2 when font identity is confirmed.

3. **QRCodeSVG as Server Component — compatibility**
   - What we know: `QRCodeSVG` is a pure render component with no obvious browser API usage
   - What's unclear: Whether the library internally marks itself with `"use client"` in its package exports
   - Recommendation: Test empirically during Phase 1 implementation. If Next.js throws an error about RSC/client boundary, extract into a minimal `QrCode.tsx` Client Component. This is a 5-minute fix if needed.

---

## Sources

### Primary (HIGH confidence)
- `https://nextjs.org/docs/app/api-reference/components/font` — next/font API, variable option, className vs style, Tailwind v4 integration (verified 2026-02-28, version 16.1.6)
- `https://nextjs.org/docs/app/getting-started/fonts` — Google font setup, multiple fonts pattern (verified 2026-02-28)
- `https://tailwindcss.com/docs/theme` — @theme syntax, `inline` keyword semantics, hex values in @theme (verified 2026-02-28)
- `https://github.com/zpao/qrcode.react README` — QRCodeSVG named import, props (value, size, bgColor, fgColor, level, marginSize), deprecation of includeMargin (verified 2026-02-28)
- `/Users/brunolago/Developer/dne-digital/src/app/globals.css` — Existing @theme inline block (direct codebase read)
- `/Users/brunolago/Developer/dne-digital/src/app/layout.tsx` — Existing font variable pattern (direct codebase read)
- `/Users/brunolago/Developer/dne-digital/src/constants/index.ts` — Current Student type and DATABASE (direct codebase read)
- `pnpm info qrcode.react version` → `4.2.0` (live npm query, 2026-02-28)

### Secondary (MEDIUM confidence)
- `https://developer.mozilla.org/docs/Web/CSS/length#dynamic_viewport` — dvh unit definition, iOS Safari behavior, `100dvh` vs `100vh` difference (WebFetch, 2026-02-28)
- iPhone 14 logical resolution (390px × 844px) — widely documented standard; consistent with existing reference screenshots

### Tertiary (LOW confidence)
- Nunito font weight 800 for logo — visual analysis based on "rounded display ExtraBold" description. Requires human verification.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — qrcode.react v4.2.0 verified on live npm; next/font and Tailwind v4 verified in official docs
- Architecture: HIGH — patterns derived from existing codebase + official Next.js docs; no speculative patterns
- Pitfalls: HIGH — all pitfalls derived from reading actual code (existing type issues, wrong dimensions, existing incorrect `@theme` usage risk)

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (stable libraries — 30 days)
