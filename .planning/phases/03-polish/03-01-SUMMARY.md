---
phase: 03-polish
plan: "01"
subsystem: ui
tags: [react, next-image, client-component, fallback, photo]

requires:
  - phase: 02-visual-components
    provides: PhotoCard RSC com fill mode estabelecido

provides:
  - PhotoCard Client Component com fallback local-para-CDN via onError
  - Estrategia src=/photos/{student}.jpeg + fallbackSrc=data.foto para todos os estudantes

affects: [03-02, qualquer plano que use PhotoCard]

tech-stack:
  added: []
  patterns:
    - "Client Component com useState para rastrear src de imagem mutavel"
    - "Guard anti-loop em onError: if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc)"
    - "Template literal para path local padrao: /photos/${student}.jpeg"

key-files:
  created: []
  modified:
    - src/components/photo-card.tsx
    - src/app/[student]/page.tsx

key-decisions:
  - "PhotoCard convertido para Client Component para suportar onError handler"
  - "Guard anti-loop obrigatorio: sem ele, fallbackSrc tambem poderia falhar em loop infinito"
  - "src=/photos/{student}.jpeg como path local padrao — nenhum arquivo existe la, garantindo fallback para todos os estudantes atuais"

patterns-established:
  - "Imagem com fallback: useState(src) + onError com guard anti-loop"
  - "Path local como tentativa primaria, CDN como fallback — permite adicionar fotos locais no futuro sem mudar logica"

requirements-completed:
  - CARD-03

duration: 1min
completed: 2026-02-28
---

# Phase 03 Plan 01: PhotoCard fallback local → CDN Summary

**PhotoCard convertido para Client Component com useState + onError guard anti-loop, implementando fallback transparente de path local para URL CDN via CARD-03**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-28T19:30:30Z
- **Completed:** 2026-02-28T19:31:19Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- PhotoCard convertido de RSC puro para Client Component com `'use client'`
- Interface `PhotoCardProps` expandida com `fallbackSrc: string`
- Guard anti-loop `if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc)` previne re-render infinito
- Call site em `page.tsx` atualizado para passar `src="/photos/${student}.jpeg"` e `fallbackSrc={data.foto}`
- Build TypeScript compilado sem erros (Turbopack + SSG para 4 estudantes)

## Task Commits

Cada tarefa commitada atomicamente:

1. **Task T1: Converter PhotoCard para Client Component com onError fallback** - `c9d3c0f` (feat)
2. **Task T2: Atualizar call site de PhotoCard em page.tsx** - `cb25acc` (feat)

## Files Created/Modified

- `src/components/photo-card.tsx` - Convertido para Client Component com useState, fallbackSrc prop, e onError guard
- `src/app/[student]/page.tsx` - Call site atualizado com src local e fallbackSrc CDN

## Decisions Made

- PhotoCard precisava de `'use client'` porque `onError` e um event handler — nao pode ser passado em RSC
- Guard `if (imgSrc !== fallbackSrc)` e obrigatorio: sem ele, se `fallbackSrc` tambem falhasse (ex: URL CDN temporariamente indisponivel), o componente entraria em loop infinito de setState
- Path `/photos/${student}.jpeg` escolhido como convencao padrao — nenhum arquivo existe atualmente nessa pasta, garantindo que todos os 4 estudantes usam o fallback CDN; permite adicionar fotos locais no futuro apenas colocando o arquivo na pasta correta

## Deviations from Plan

None - plano executado exatamente como escrito.

## Issues Encountered

None - build passou na primeira tentativa sem erros TypeScript ou warnings relevantes.

## User Setup Required

None - nenhuma configuracao de servico externo necessaria.

## Next Phase Readiness

- PhotoCard com fallback funcional, todos os 4 estudantes recebem foto (local ou CDN)
- Logica extensivel: adicionar `/public/photos/luccas.jpeg` no futuro eliminaria automaticamente o fallback para esse estudante
- Pronto para continuacao dos demais planos da fase 03-polish

## Self-Check: PASSED

- FOUND: src/components/photo-card.tsx
- FOUND: src/app/[student]/page.tsx
- FOUND: .planning/phases/03-polish/03-01-SUMMARY.md
- FOUND commit: c9d3c0f (T1)
- FOUND commit: cb25acc (T2)
- FOUND commit: d391cf0 (docs metadata)

---
*Phase: 03-polish*
*Completed: 2026-02-28*
