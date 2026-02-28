---
phase: 02-visual-components
plan: "02-03"
subsystem: ui

tags: [next-image, fill-mode, qrcode-react, RSC, component-extraction]

# Dependency graph
requires:
  - phase: 02-01
    provides: SVG/WebP infra e dependencias de imagem configuradas

provides:
  - PhotoCard com next/image fill + object-cover (sem distorcao)
  - QrCard com QRCodeSVG + label CIE + icone Copy visual
  - page.tsx limpo de logica inline de cards

affects: [03-clipboard, 03-apple-wallet]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "next/image fill requer parent com position:relative e dimensoes explicitas (h-full herda do container)"
    - "QrCard RSC puro — Copy icone visual apenas, clipboard em Phase 3"
    - "sizes prop em fill mode para otimizacao de imagem (195px = metade de 390px)"

key-files:
  created:
    - src/components/photo-card.tsx
    - src/components/qr-card.tsx
  modified:
    - src/app/[student]/page.tsx

key-decisions:
  - "PhotoCard usa fill em vez de width=440 height=550 — elimina distorcao de proporcao da foto"
  - "Inner div com relative + h-full + overflow-hidden para fill funcionar dentro de container h-[280px]"
  - "QrCard RSC puro sem use client — Copy e placeholder visual, interatividade em Phase 3 (CARD-06)"
  - "sizes=195px no Image fill para otimizacao de imagem correta (metade da largura do card)"

patterns-established:
  - "next/image fill: parent externo relativo, inner div com relative + h-full + overflow-hidden"
  - "Card RSC: logica de display apenas, sem estado ou eventos do browser"

requirements-completed: [CARD-01, CARD-02, CARD-04, CARD-05]

# Metrics
duration: 2min
completed: 2026-02-28
---

# Phase 02 Plan 03: PhotoCard e QrCard Summary

**PhotoCard com next/image fill mode eliminando distorcao de foto, QrCard com QRCodeSVG + label CIE extraidos para componentes RSC, page.tsx sem logica inline de cards**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-28T18:55:30Z
- **Completed:** 2026-02-28T18:57:22Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- PhotoCard criado com next/image fill + object-cover — elimina distorcao por width/height fixos
- QrCard criado como RSC puro com QRCodeSVG, label "No da CIE" e icone Copy visual
- page.tsx atualizado para usar PhotoCard e QrCard — bloco inline removido, imports desnecessarios limpos

## Task Commits

1. **Task 02-03-T1: Criar PhotoCard com next/image fill + object-cover** - `18b7d6e` (feat)
2. **Task 02-03-T2: Criar QrCard e integrar ambos os cards em page.tsx** - `87b1736` (feat)

## Files Created/Modified

- `src/components/photo-card.tsx` - Card da foto com next/image fill mode, inner div position:relative + h-full
- `src/components/qr-card.tsx` - Card QR code com QRCodeSVG + label CIE + icone Copy visual (RSC puro)
- `src/app/[student]/page.tsx` - Remove bloco inline de cards, usa PhotoCard e QrCard, limpa imports

## Decisions Made

- PhotoCard usa `fill` em vez de `width=440 height=550` — os valores fixos causavam distorcao da foto (retrato 440x550 nao respeita o container 280px de altura)
- Inner div com `relative`, `h-full` e `overflow-hidden` — requisitos para next/image fill funcionar corretamente dentro do container pai `h-[280px]`
- `sizes="195px"` no Image fill — metade dos 390px do viewport do card, informa o browser para otimizacao de imagem
- QrCard como RSC puro sem "use client" — o icone Copy e visual apenas nesta fase, clipboard interativo vira em Phase 3 (CARD-06)

## Deviations from Plan

### Desvio de contexto (nao e bug)

**page.tsx ja tinha sido modificado por planos anteriores (02-02, 02-04, 02-05)**
- **Found during:** Task 02-03-T2
- **Issue:** O arquivo page.tsx ja tinha CardHeader e CardFooter (02-02/02-05), e nao tinha mais Globe/Menu/AppleWalletImage diretamente (extraidos para componentes). O plano 02-03 foi escrito antes dos outros planos serem executados.
- **Fix:** Adaptacao automatica — removidos apenas imports QRCodeSVG, Copy e Image (nao mais usados), adicionados imports PhotoCard e QrCard. Estrutura do arquivo respeitada.
- **Files modified:** src/app/[student]/page.tsx
- **Verification:** pnpm build passou sem erros
- **Committed in:** 87b1736 (Task T2 commit)

---

**Total deviations:** 1 adaptacao de contexto (nao e bug — planos executados fora de ordem)
**Impact on plan:** Adaptacao necessaria e correta. Nenhum scope creep.

## Issues Encountered

- Linter (Biome) modificava page.tsx durante as edicoes causando race condition no tool de Edit — resolvido usando escrita direta via bash cat para garantir atomicidade

## Next Phase Readiness

- PhotoCard e QrCard prontos para uso em fase 3
- QrCard tem Copy como placeholder visual — Phase 3 adiciona clipboard interativo (CARD-06 com "use client")
- page.tsx completamente refatorado para componentes — sem logica inline de cards

---
*Phase: 02-visual-components*
*Completed: 2026-02-28*
