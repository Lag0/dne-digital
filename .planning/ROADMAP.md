# Roadmap: DNE Digital

## Overview

Clone pixel-perfect da carteirinha estudantil DNE em 3 fases. A base Next.js 16 ja existe; o trabalho e substituir dependencias externas frageis, definir o sistema de design correto, implementar todos os componentes visuais com fidelidade ao original, e polir interacoes para demo. Fases ordenadas por risco: o QR code externo e eliminado antes de qualquer trabalho visual comecar.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Tokens CSS, model de dados limpo, QR local e frame mobile correto (completed 2026-02-28)
- [ ] **Phase 2: Visual Components** - Todos os componentes pixel-perfect (header, cards, footer)
- [ ] **Phase 3: Polish** - Clipboard, fallback de foto local, correcao de bugs

## Phase Details

### Phase 1: Foundation
**Goal**: A aplicacao tem a base tecnica correta para suportar implementacao visual fiel — dependencia externa de QR eliminada, tokens de design definidos, estrutura de dados limpa
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, DATA-01, DATA-02, DATA-03
**Success Criteria** (what must be TRUE):
  1. Ao carregar qualquer rota `/[student]`, o QR code aparece mesmo sem acesso a internet
  2. A pagina renderiza com fundo mint DNE e container mobile de 390px em desktop
  3. A tipagem `Student` reflete apenas os campos visiveis no app original (sem `nivel`, `rg`)
  4. Os tokens CSS `--color-dne-mint`, `--color-dne-navy` estao definidos em `@theme inline`
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Instalar qrcode.react, limpar Student type/DATABASE, substituir QR atomicamente
- [x] 01-02-PLAN.md — Definir tokens CSS DNE em @theme inline, carregar Nunito via next/font/google
- [ ] 01-03-PLAN.md — Corrigir container mobile (390px, h-[100dvh], 844px), bug w-[160px]

### Phase 2: Visual Components
**Goal**: A carteirinha e visualmente indistinguivel do app original DNE — todos os componentes implementados com tipografia, cores, espacamentos e proporcoes corretos
**Depends on**: Phase 1
**Requirements**: HEAD-01, HEAD-02, HEAD-03, HEAD-04, CARD-01, CARD-02, CARD-04, CARD-05, INFO-01, INFO-02, INFO-03, INFO-04, INFO-05, FOOT-01, FOOT-02
**Success Criteria** (what must be TRUE):
  1. O logo "dne" usa fonte rounded display (Nunito ExtraBold ou confirmada via dne.org.br) — sem Arial
  2. O icone UNE exibe o circulo com mapa do Brasil como SVG real (sem Globe do Lucide)
  3. O card foto+QR aparece lado a lado com proporcoes corretas e QR gerado do codigoCie
  4. O card de informacoes exibe exatamente os 5 campos do app original com label bold + valor cinza
  5. O botao Certificado e pill azul solido (#1B3A6B), nao transparente com borda
**Plans**: TBD

Plans:
- [ ] 02-01: Extrair assets (cor mint exata, fonte logo, SVG icone UNE) de dne.org.br e configurar next/font
- [ ] 02-02: Implementar CardHeader (logo + icone UNE + hamburguer)
- [ ] 02-03: Implementar PhotoCard e QrCard com proporcoes corretas (next/image fill mode)
- [ ] 02-04: Implementar InfoCard com 5 campos corretos e pattern label bold + valor cinza
- [ ] 02-05: Implementar CardFooter (botao Certificado solid + badge Apple Wallet)

### Phase 3: Polish
**Goal**: A carteirinha funciona sem falhas em demo — foto nao depende de CDN externo, clipboard funciona, classes Tailwind invalidas corrigidas
**Depends on**: Phase 2
**Requirements**: CARD-03, CARD-06, FOOT-03
**Success Criteria** (what must be TRUE):
  1. Clicar no icone Copy ao lado do codigo CIE copia o codigo e exibe feedback visual de confirmacao
  2. A foto do estudante carrega de `/public/photos/` localmente; se ausente, cai para URL externa sem erro
  3. O badge Apple Wallet renderiza com largura correta (w-[160px], sem Tailwind class invalida)
**Plans**: TBD

Plans:
- [ ] 03-01: Migrar fotos para /public/photos/ e implementar fallback de foto (local -> URL externa)
- [ ] 03-02: Adicionar copy-to-clipboard no QrCard (navigator.clipboard, feedback visual), corrigir w-[160] -> w-[160px]

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete   | 2026-02-28 |
| 2. Visual Components | 0/5 | Not started | - |
| 3. Polish | 0/2 | Not started | - |
