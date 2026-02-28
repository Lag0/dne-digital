# DNE Digital — Clone da Carteirinha de Estudante

## What This Is

Clone pixel-perfect do app DNE (Documento Nacional do Estudante) para competição interna de faculdade. Replica a tela da carteirinha digital do estudante com layout fiel ao original, dados dinâmicos via JSON, e QR code gerado automaticamente. Projeto web mobile-first em Next.js 16.

## Core Value

A carteirinha deve ser visualmente indistinguível do app original DNE — tipografia, cores, espaçamento e componentes idênticos ao screenshot de referência.

## Requirements

### Validated

- ✓ Rota dinâmica por estudante (`/[student]`) — existente
- ✓ Database de estudantes em constants (`DATABASE`) — existente
- ✓ Estrutura base Next.js 16 + Tailwind v4 — existente
- ✓ Componente `InfoRow` para campos de dados — existente
- ✓ Imagem Apple Wallet badge — existente

### Active

- [ ] Background mint verde com cor exata do DNE (#86C5AF ou derivado)
- [ ] Logo DNE com fonte correta (rounded display, similar ao original)
- [ ] Ícone UNE com mapa do Brasil (substituir Globe do Lucide)
- [ ] Menu hamburguer com estilo correto
- [ ] Card foto + QR side-by-side com proporções exatas
- [ ] QR code gerado dinamicamente a partir do codigoCie
- [ ] Card de informações com tipografia e espaçamento corretos
- [ ] Labels em negrito + valores em peso normal (cor cinza)
- [ ] Botão "Certificado" — pill azul sólido com ✓
- [ ] Botão Apple Wallet com visual correto
- [ ] Layout mobile-first (max-width ~390px, full-height)
- [ ] Wrapper desktop com fundo escuro simulando celular

### Out of Scope

- Funcionalidade real do botão Apple Wallet (.pkpass) — complexidade alta, não é o foco da competição
- Autenticação/login — dados são via JSON, não há backend
- Múltiplas telas/navegação — só a tela da carteirinha
- Modo offline/PWA — web simples

## Context

O projeto já tem uma base funcional em Next.js 16 com rota dinâmica `/[student]`, constants com DATABASE de estudantes, e alguns componentes. Porém o visual difere do original em vários aspectos:

**Problemas identificados no código atual:**
- Logo usa Arial genérica em vez da fonte rounded do DNE
- Ícone UNE é `Globe` do Lucide (genérico), deve ser SVG do mapa do Brasil
- Botão Certificado é transparente com borda, original é azul sólido (`#1B3A6B` ou similar)
- QR code vem de URL externa (`api.qrserver.com`), deve ser gerado localmente pela lib
- Background `#8CD6BF` pode não ser a cor exata (foto sugere tom mais suave)
- Espaçamentos e proporções dos cards precisam ajuste

**Assets a buscar:**
- Logo DNE SVG do site oficial (dne.org.br)
- Fonte tipográfica do logo (rounded display)
- Ícone UNE (círculo com mapa do Brasil e "UNE")
- Cores exatas via inspeção do site original

## Constraints

- **Tech Stack**: Next.js 16 + React 19 + Tailwind v4 — não mudar
- **Package Manager**: pnpm (já em uso)
- **Target**: Mobile-first web, não app nativo
- **Referência**: Screenshot do app original fornecido pelo usuário
- **Dados**: Dinâmico via JSON/constants, sem backend

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| QR code via biblioteca (não URL externa) | Confiabilidade + gerado localmente do CIE | — Pending |
| Fonte do logo: buscar via site DNE | Fidelidade ao original exige fonte correta | — Pending |
| SVG do ícone UNE: scrape do site DNE | Necessário para replicar exatamente | — Pending |

---
*Last updated: 2026-02-28 after initialization*
