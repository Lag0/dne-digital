# Requirements: DNE Digital

**Defined:** 2026-02-28
**Core Value:** A carteirinha deve ser visualmente indistinguível do app original DNE — tipografia, cores, espaçamento e componentes idênticos ao screenshot de referência

## v1 Requirements

Requirements for initial release (pixel-perfect clone).

### Foundation

- [x] **FOUND-01**: Sistema de tokens CSS com cores exatas do DNE (mint `#8CD6BF` a confirmar, azul botão `#1B3A6B`) definidos em `@theme`
- [x] **FOUND-02**: Fonte rounded display (Nunito ExtraBold ou equivalente) carregada via `next/font/google` para o logo "dne"
- [x] **FOUND-03**: Background da página desktop com fundo escuro (`stone-900`) simulando frame de celular
- [x] **FOUND-04**: Container mobile com `max-width: 390px`, `h-[100dvh]` (corrigindo `h-screen` para iOS Safari)

### Header

- [ ] **HEAD-01**: Logo "dne" renderizado com fonte rounded display correta (não Arial)
- [ ] **HEAD-02**: Texto "Documento Nacional do Estudante" ao lado do logo com tamanho e peso corretos
- [ ] **HEAD-03**: Ícone UNE (círculo com mapa do Brasil e "UNE") como SVG real (substituir Globe do Lucide)
- [ ] **HEAD-04**: Ícone de menu hamburguer com estilo e cor corretos

### Card Foto + QR

- [ ] **CARD-01**: Card branco com border-radius e shadow corretos (lado a lado: foto | QR)
- [ ] **CARD-02**: Foto do estudante com proporção e objeto `cover` corretos
- [ ] **CARD-03**: Sistema de foto local (`/public/photos/`) com fallback para URL externa (CDN)
- [x] **CARD-04**: QR code gerado localmente via `qrcode.react` a partir do `codigoCie` (substituir `api.qrserver.com`)
- [ ] **CARD-05**: Label "Nº da CIE" + código exibido abaixo do QR
- [ ] **CARD-06**: Botão copiar (ícone Copy) que copia o código CIE para clipboard com feedback visual

### Card Informações

- [ ] **INFO-01**: Card branco com border-radius, shadow e padding corretos
- [ ] **INFO-02**: Nome do estudante em bold com tamanho e cor corretos
- [ ] **INFO-03**: 5 campos exatos da foto de referência: Ins. Ensino, Curso, CPF, Data de Nasc, Validade
- [ ] **INFO-04**: Remover campos "Nível de Ensino" e "RG" (não aparecem no app original)
- [ ] **INFO-05**: Pattern visual: label em bold + valor em peso normal, cor cinza `#5C5C5C` → `gray-500`

### Footer Buttons

- [ ] **FOOT-01**: Botão "✓ Certificado" como pill azul sólido (`#1B3A6B`) — substituir versão transparente atual
- [ ] **FOOT-02**: Botão "Adicionar à Carteira da Apple" com badge Apple Wallet visualmente correto
- [ ] **FOOT-03**: Corrigir bug `w-[160]` → `w-[160px]` na imagem do Apple Wallet badge

### Dados

- [x] **DATA-01**: DATABASE atualizado para remover campos `nivel` e `rg` de todos os estudantes
- [x] **DATA-02**: Campo `foto` suporta path local (`/photos/nome.jpg`) ou URL externa como fallback
- [x] **DATA-03**: Campos do tipo `Student` atualizados para refletir apenas os campos visíveis

## v2 Requirements

Deferred to future release.

### Extras

- **EXT-01**: Animação de entrada da carteirinha ao carregar
- **EXT-02**: Tema escuro (modo noturno)
- **EXT-03**: Compartilhamento via link/QR
- **EXT-04**: PWA offline

## Out of Scope

| Feature | Reason |
|---------|--------|
| Apple Wallet .pkpass funcional | Complexidade alta (certificado Apple Developer necessário), não é o foco |
| Autenticação/login | Dados são via JSON estático, sem backend necessário |
| Múltiplas telas/navegação | Apenas a tela da carteirinha no escopo |
| Backend/API | Projeto estático com `generateStaticParams` |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| DATA-01 | Phase 1 | Complete |
| DATA-02 | Phase 1 | Complete |
| DATA-03 | Phase 1 | Complete |
| HEAD-01 | Phase 2 | Pending |
| HEAD-02 | Phase 2 | Pending |
| HEAD-03 | Phase 2 | Pending |
| HEAD-04 | Phase 2 | Pending |
| CARD-01 | Phase 2 | Pending |
| CARD-02 | Phase 2 | Pending |
| CARD-04 | Phase 2 | Complete |
| CARD-05 | Phase 2 | Pending |
| INFO-01 | Phase 2 | Pending |
| INFO-02 | Phase 2 | Pending |
| INFO-03 | Phase 2 | Pending |
| INFO-04 | Phase 2 | Pending |
| INFO-05 | Phase 2 | Pending |
| FOOT-01 | Phase 2 | Pending |
| FOOT-02 | Phase 2 | Pending |
| CARD-03 | Phase 3 | Pending |
| CARD-06 | Phase 3 | Pending |
| FOOT-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0

---
*Requirements defined: 2026-02-28*
*Last updated: 2026-02-28 — FOUND-01 e FOUND-02 marcados como Complete apos 01-02-PLAN*
