# Phase 3: Polish - Research

**Researched:** 2026-02-28
**Domain:** React interactivity (clipboard), Next.js image fallback, Tailwind class correctness
**Confidence:** HIGH

## Summary

Phase 3 has three tightly scoped tasks: add clipboard copy with visual feedback to `QrCard`, implement a local-first photo strategy with external URL fallback in `PhotoCard`, and fix the invalid Tailwind class `w-[160]` to `w-[160px]` in `CardFooter`. All three are self-contained and low-risk.

The clipboard task requires converting `QrCard` from a pure RSC to a Client Component (`"use client"`) because `navigator.clipboard` is a browser API and `onClick` handlers cannot exist in Server Components. The photo fallback task requires keeping `PhotoCard` as an RSC but adding an `onError` handler via a thin Client Component wrapper — `onError` on `next/image` also requires "use client" to serialize the callback. The Tailwind fix is a one-line mechanical correction with zero architectural impact.

No new dependencies are needed for any task. The React Compiler (`reactCompiler: true` in `next.config.ts`) is active; Client Components are fully supported by it.

**Primary recommendation:** Convert `QrCard` and `PhotoCard` to Client Components (or use a thin `"use client"` wrapper for PhotoCard) — no new libraries needed, use native `navigator.clipboard` and `onError` callbacks directly.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CARD-03 | Sistema de foto local (`/public/photos/`) com fallback para URL externa (CDN) | `next/image` `onError` callback replaces `src` on failure; requires "use client" to serialize callback; `remotePatterns` in `next.config.ts` must cover the fallback CDN domain |
| CARD-06 | Botao copiar (icone Copy) que copia o codigo CIE para clipboard com feedback visual | `navigator.clipboard.writeText()` in an `onClick` handler; `useState` for `isCopied` flag; timeout to reset state; requires "use client" |
| FOOT-03 | Corrigir bug `w-[160]` → `w-[160px]` na imagem do Apple Wallet badge | Tailwind v4 arbitrary values require CSS units — `w-[160]` is invalid (unitless), `w-[160px]` is valid; one-line fix in `card-footer.tsx` |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React (useState, useCallback) | 19.2.0 (already installed) | Client state for clipboard feedback and photo fallback | Native React, no extra install |
| navigator.clipboard | Web API (no install) | Write text to clipboard | Built-in browser API, no polyfill needed for modern targets |
| next/image (onError) | Next.js 16.0.3 (already installed) | Detect image load failure and swap src | Official API, avoids custom img elements |
| lucide-react (Copy, Check) | 0.554.0 (already installed) | Icon for copy button states | Already used in QrCard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| setTimeout | Web API | Reset `isCopied` state after ~2s | Simple feedback auto-dismiss |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| navigator.clipboard | document.execCommand('copy') | execCommand is deprecated; clipboard API is the standard |
| onError swap src | Custom `<img>` tag | Loses next/image optimization; more boilerplate |
| useState timeout | react-use `useCopyToClipboard` | Extra dependency for trivial logic; not justified |

**Installation:**
```bash
# No new packages needed — all dependencies already present
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── qr-card.tsx         # Convert to "use client", add clipboard logic
│   ├── photo-card.tsx      # Add onError fallback (requires "use client")
│   └── card-footer.tsx     # Fix w-[160] -> w-[160px] (no structural change)
└── constants/
    └── index.ts            # foto field already supports both local path and URL
```

### Pattern 1: Copy-to-Clipboard with Visual Feedback
**What:** `QrCard` becomes a Client Component. `useState<boolean>` tracks the `isCopied` state. On click, `navigator.clipboard.writeText(codigoCie)` runs, sets `isCopied = true`, and a `setTimeout` resets it after 2000ms. The `Copy` icon swaps to `Check` icon while `isCopied` is true.
**When to use:** Any interactive element that copies text.
**Example:**
```typescript
// Source: https://github.com/vercel/next.js/blob/v16.0.3/docs/01-app/03-api-reference/01-directives/use-client.mdx
'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface QrCardProps {
  codigoCie: string
}

/**
 * Card do QR code com clipboard interativo.
 * CARD-06: copia codigoCie e exibe feedback visual por 2s.
 */
export const QrCard = ({ codigoCie }: QrCardProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codigoCie)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl py-1 shadow-sm w-1/2 flex flex-col items-center justify-center text-center relative">
      <QRCodeSVG
        value={codigoCie}
        size={160}
        bgColor="#FFFFFF"
        fgColor="#000000"
        level="M"
        marginSize={1}
        className="w-[95%] mix-blend-multiply"
      />
      <div className="mt-2 flex flex-col items-center">
        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
          Nº da CIE
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-stone-800 font-bold text-sm"
          aria-label="Copiar código CIE"
        >
          {codigoCie}
          {isCopied
            ? <Check size={12} className="text-green-500 ml-1" />
            : <Copy size={12} className="text-gray-400 ml-1" />
          }
        </button>
      </div>
    </div>
  )
}
```

### Pattern 2: next/image with Local-First Fallback
**What:** `PhotoCard` receives both `src` (local `/public/photos/{id}.jpeg`) and `fallbackSrc` (current CDN URL). `onError` swaps `src` to `fallbackSrc` if the local file is missing. Requires `"use client"` because `onError` is a serialized callback.
**When to use:** Images that may exist locally (for demo resilience) but need external fallback.
**Example:**
```typescript
// Source: https://github.com/vercel/next.js/blob/v16.0.3/docs/01-app/03-api-reference/02-components/image.mdx
'use client'

import Image from 'next/image'
import { useState } from 'react'

interface PhotoCardProps {
  src: string        // local path e.g. /photos/luccas.jpeg
  fallbackSrc: string // external URL
  alt: string
}

/**
 * Card da foto com fallback: tenta local primeiro, cai para CDN se ausente.
 * CARD-03: suporta /public/photos/ com fallback gracioso.
 */
export const PhotoCard = ({ src, fallbackSrc, alt }: PhotoCardProps) => {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <div className="bg-white rounded-xl p-1.5 shadow-sm w-1/2 relative">
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="195px"
          className="object-cover"
          onError={() => setImgSrc(fallbackSrc)}
        />
      </div>
    </div>
  )
}
```

### Pattern 3: Fix Tailwind Arbitrary Value Unit
**What:** In `card-footer.tsx`, change `className="w-[160px] h-[46px]"` — the current code already has `w-[160px]` in the className but the bug reported is in the Tailwind class. Looking at the actual file: `className="w-[160px] h-[46px]"` — this IS already correct in the current state. However, the `width={220}` intrinsic and the container `div` have no explicit width constraint. The FOOT-03 requirement tracks the original bug `w-[160]` which was reported in the roadmap; it has since been partially addressed but should be verified.
**When to use:** Tailwind v4 arbitrary values always require CSS units for length values.

### Anti-Patterns to Avoid
- **`"use client"` on page.tsx**: Do not convert the page to a client component; only convert the leaf components that need interactivity (`QrCard`, `PhotoCard`).
- **Custom `<img>` fallback**: Do not replace `next/image` with a raw `<img>` tag to avoid the `onError` constraint — next/image provides optimization benefits.
- **Swallowing clipboard errors**: If `navigator.clipboard.writeText` rejects (e.g., permissions denied), the error must not be silent.
- **Double-firing onError**: Set a guard to prevent infinite fallback loops (e.g., if fallbackSrc also fails, do not loop — stop after one fallback).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Clipboard write | Custom execCommand wrapper | `navigator.clipboard.writeText()` | execCommand deprecated; clipboard API is standard and Promise-based |
| Image fallback | Custom `<img>` with error handling | `next/image` `onError` | Preserves optimization pipeline; cleaner integration |
| Copy feedback | External toast library | Local `useState` + timeout | Zero-dependency, sufficient for this use case |

**Key insight:** All three requirements in Phase 3 are solved by native browser/React APIs. No new packages are needed.

## Common Pitfalls

### Pitfall 1: onError Requires "use client"
**What goes wrong:** Adding `onError` to `next/image` in an RSC causes a build/runtime error: "Event handlers cannot be passed to Client Component props."
**Why it happens:** `onError` is a function prop; functions cannot be serialized across the server/client boundary.
**How to avoid:** Add `"use client"` directive at the top of `photo-card.tsx` (or create a thin `PhotoCardInteractive` wrapper).
**Warning signs:** Next.js build error mentioning "Event handlers" or "not serializable".

### Pitfall 2: navigator.clipboard Requires HTTPS or localhost
**What goes wrong:** `navigator.clipboard.writeText` throws or returns undefined in insecure contexts (HTTP, non-localhost).
**Why it happens:** Clipboard API is restricted to secure contexts by the browser.
**How to avoid:** In dev (`localhost`) this works fine. For production, ensure HTTPS. Add a try/catch around the clipboard call.
**Warning signs:** TypeError or undefined in non-secure dev contexts.

### Pitfall 3: next/image remotePatterns for Fallback CDN
**What goes wrong:** If fallback URL is from `media.discordapp.net` and that domain is not in `remotePatterns`, next/image will throw a configuration error.
**Why it happens:** Next.js blocks external image domains not explicitly allowed.
**How to avoid:** `next.config.ts` already has `media.discordapp.net` in `remotePatterns` — verify this covers the actual fallback domains in DATABASE.
**Warning signs:** Next.js error "hostname ... is not configured under images in your next.config".

### Pitfall 4: PhotoCard Props Interface Change
**What goes wrong:** Changing `PhotoCard` props from `{ src, alt }` to `{ src, fallbackSrc, alt }` requires updating the call site in `page.tsx`.
**Why it happens:** The caller must now pass both `src` (local path) and `fallbackSrc` (original CDN URL) separately.
**How to avoid:** Update `page.tsx` to pass `src="/photos/{student}.jpeg"` and `fallbackSrc={data.foto}`. Also add the actual photo files to `public/photos/` or accept that fallback fires immediately if files aren't present (valid behavior per CARD-03).
**Warning signs:** TypeScript error at call site if prop is missing.

### Pitfall 5: Infinite onError Loop
**What goes wrong:** If `fallbackSrc` also fails (e.g., CDN URL is expired), `onError` fires again with `imgSrc` already set to `fallbackSrc`, potentially triggering re-renders.
**Why it happens:** React state update → re-render → image fails again → state update loop.
**How to avoid:** Guard the `onError` handler: only call `setImgSrc(fallbackSrc)` if `imgSrc !== fallbackSrc`.
**Warning signs:** Infinite re-render loop in browser DevTools.

### Pitfall 6: w-[160] vs w-[160px] — Verify Current State
**What goes wrong:** The roadmap documents `w-[160]` as the bug. The current `card-footer.tsx` already uses `w-[160px]` in className. However, the intrinsic `width={220}` on the `<Image>` component may be inconsistent.
**Why it happens:** The fix may have been applied partially. Need to verify visual correctness.
**How to avoid:** Audit `card-footer.tsx` completely: ensure `width={220}` on `<Image>` is consistent with `w-[160px]` in className. The `className` width overrides the intrinsic `width` prop visually, but both should be coherent.
**Warning signs:** Image appears stretched or the wrong size.

## Code Examples

Verified patterns from official sources:

### next/image onError with fallback
```typescript
// Source: https://github.com/vercel/next.js/blob/v16.0.3/docs/01-app/03-api-reference/02-components/image.mdx
'use client'
import Image from 'next/image'
import { useState } from 'react'

const ImageWithFallback = ({ src, fallbackSrc, alt, ...rest }) => {
  const [imgSrc, setImgSrc] = useState(src)
  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc)
      }}
    />
  )
}
```

### navigator.clipboard with async/await
```typescript
// Source: MDN Web Docs (Clipboard API — browser standard)
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  } catch {
    // clipboard write failed — silent in this context
  }
}
```

### Tailwind v4 arbitrary value with units
```html
<!-- WRONG: unitless — Tailwind v4 does not infer px -->
<div class="w-[160]">...</div>

<!-- CORRECT: explicit unit required -->
<div class="w-[160px]">...</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `document.execCommand('copy')` | `navigator.clipboard.writeText()` | ~2018 | Promise-based, no DOM focus required |
| `<img onError>` with raw HTML | `next/image` `onError` | Next.js App Router | Keeps image optimization pipeline |
| Unitless Tailwind arbitrary `w-[160]` | `w-[160px]` | Tailwind v1+ | Arbitrary values always require units |

**Deprecated/outdated:**
- `document.execCommand('copy')`: Deprecated in all modern browsers; unreliable and requires focused input element.

## Open Questions

1. **Are photo files already at `/public/photos/{student}.jpeg`?**
   - What we know: `public/` has `hebert.jpeg` and `richards.jpeg` directly (not in a `photos/` subfolder). `DATABASE` has keys `luccas`, `joao`, `julia`, `richard`.
   - What's unclear: No `/public/photos/` directory exists yet. The `hebert.jpeg` and `richards.jpeg` might map to existing students but naming is inconsistent.
   - Recommendation: Plan 03-01 should create `/public/photos/` dir and copy/rename existing jpegs into it using the DATABASE keys as filenames (`luccas.jpeg`, `joao.jpeg`, `julia.jpeg`, `richard.jpeg`). The fallback to CDN URL will fire for any student without a local file.

2. **Does FOOT-03 require actual work?**
   - What we know: Current `card-footer.tsx` line 29 already has `className="w-[160px] h-[46px]"` — `w-[160px]` appears correct. The roadmap describes the bug as `w-[160]` → `w-[160px]`.
   - What's unclear: This may have been fixed as part of `01-03-PLAN.md` (which mentioned `w-[160px]` in its description). The REQUIREMENTS.md still marks FOOT-03 as pending.
   - Recommendation: Plan 03-02 should verify the rendered output visually and mark FOOT-03 complete if already fixed. If the badge still renders incorrectly (e.g., due to the `width={220}` intrinsic), adjust to make `width` and `className` consistent.

## Sources

### Primary (HIGH confidence)
- `/vercel/next.js/v16.0.3` (Context7) — `next/image` `onError` API, "use client" directive, Client Component patterns
- `https://github.com/vercel/next.js/blob/v16.0.3/docs/01-app/03-api-reference/02-components/image.mdx` — onError, placeholder, blurDataURL
- `https://github.com/vercel/next.js/blob/v16.0.3/docs/01-app/03-api-reference/01-directives/use-client.mdx` — use client requirements

### Secondary (MEDIUM confidence)
- MDN Clipboard API (navigator.clipboard.writeText) — standard browser API, widely supported
- Tailwind v4 arbitrary value syntax — `w-[value]` requires units for length properties

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed, APIs are web standards or documented Next.js features
- Architecture: HIGH — patterns are minimal and well-established (useState, onError, "use client")
- Pitfalls: HIGH — each pitfall is grounded in official API constraints or observed code state

**Research date:** 2026-02-28
**Valid until:** 2026-03-30 (stable APIs, no fast-moving dependencies)
