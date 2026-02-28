# Phase 2: Visual Components - Research

**Researched:** 2026-02-28
**Domain:** Next.js 16 component implementation, SVG inline, next/image fill, Tailwind v4 pixel-perfect, font rendering
**Confidence:** HIGH (with noted MEDIUM/LOW items)

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HEAD-01 | Logo "dne" renderizado com fonte rounded display correta (não Arial) | `nunito.variable` + `style={{ fontFamily: 'var(--font-nunito)' }}` + `font-extrabold` já preparado no layout.tsx — trocar `fontFamily: 'Arial'` |
| HEAD-02 | Texto "Documento Nacional do Estudante" ao lado do logo com tamanho e peso corretos | Tailwind arbitrary values `text-[Xpx]` ou escala padrão — verificar tamanho no dne.org.br |
| HEAD-03 | Ícone UNE (círculo com mapa do Brasil e "UNE") como SVG real (substituir Globe do Lucide) | SVGR via `turbopack.rules` já configurado (next.config.ts) + `@svgr/webpack` já instalado — extrair SVG do site dne.org.br via DevTools |
| HEAD-04 | Ícone de menu hamburguer com estilo e cor corretos | Lucide `Menu` já usado — verificar cor/tamanho contra referência |
| CARD-01 | Card branco com border-radius e shadow corretos (lado a lado: foto \| QR) | Pattern `bg-white rounded-xl shadow-sm` já existe — verificar border-radius exato |
| CARD-02 | Foto do estudante com proporção e objeto cover corretos | `next/image fill` + `object-cover` em parent `relative` — documentado |
| CARD-04 | QR code gerado localmente via qrcode.react (já implementado) | CARD-04 já está `Complete` — manter como está |
| CARD-05 | Label "Nº da CIE" + código exibido abaixo do QR | Já implementado no código atual — verificar tipografia exata |
| INFO-01 | Card branco com border-radius, shadow e padding corretos | `bg-white rounded-2xl p-5 shadow-sm` já existe — validar medidas |
| INFO-02 | Nome do estudante em bold com tamanho e cor corretos | `text-[#555555] font-bold text-lg` já existe — confirmar cor exata |
| INFO-03 | 5 campos exatos: Ins. Ensino, Curso, CPF, Data de Nasc, Validade | Já implementados via `InfoRow` — verificar labels e ordem |
| INFO-04 | Remover campos "Nível de Ensino" e "RG" (não aparecem no app original) | Já removidos na Phase 1 (DATA-01, DATA-03) |
| INFO-05 | Pattern visual: label bold + valor cinza `#5C5C5C` → `gray-500` | `InfoRow` já implementa este pattern corretamente |
| FOOT-01 | Botão "✓ Certificado" como pill azul sólido (`#1B3A6B`) | Trocar `border border-white/40 backdrop-blur-sm` por `bg-dne-navy` — Tailwind `rounded-full bg-dne-navy` |
| FOOT-02 | Botão "Adicionar à Carteira da Apple" com badge Apple Wallet visualmente correto | `Apple-Wallet.svg` já existe em `/assets/` — usar como SVG component via SVGR |
</phase_requirements>

---

## Summary

A Phase 2 é predominantemente de **implementação cirúrgica**, não de arquitetura nova. O estado atual da codebase já tem ~70% dos componentes implementados com classes Tailwind corretas. Os problemas são pontuais: a fonte Nunito está carregada mas não aplicada (usa Arial inline), o ícone UNE é um Globe do Lucide, a foto não usa `fill` mode, e o botão Certificado é transparente com borda em vez de pill azul sólido.

O bloqueador principal da fase é o plano 02-01 (spike humano): extrair o SVG do ícone UNE de `dne.org.br` via DevTools, confirmar a cor mint exata com eyedropper, e identificar o peso da fonte do logo. Isso requer ação humana e não pode ser automatizado. **Todos os demais planos dependem do resultado deste spike**, mas podem ser implementados com valores provisórios e atualizados após.

O stack técnico está completo: `@svgr/webpack` já está instalado como dependência, Tailwind v4 com tokens DNE já definido, Nunito já carregada via `next/font/google` com variável CSS. A configuração do `next.config.ts` precisa apenas de um bloco `turbopack.rules` para habilitar importação de SVG como componente React — essa é a única mudança de configuração necessária nesta fase.

**Primary recommendation:** Implementar os 5 planos em ordem — 02-01 (spike humano bloqueante), depois 02-02 a 02-05 aplicando as fixes pontuais com padrões já verificados da codebase.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@svgr/webpack` | 8.1.0 (já instalado) | Importar SVG como React component | Única forma de usar SVG customizável (fill, size) inline; já configurado como dep |
| `next/image` (fill mode) | built-in Next.js 16 | Foto com object-cover sem dimensões fixas | Otimização automática + evita layout shift com `position: relative` no parent |
| Tailwind v4 `bg-dne-navy` | já configurado | Cor sólida para botão Certificado | Token já definido como `#1B3A6B` em `@theme inline` |
| Nunito (next/font/google) | já carregado | Fonte rounded para logo "dne" | Variável CSS `--font-nunito` já disponível via `var(--font-nunito)` |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `lucide-react` Menu | já instalado | Ícone hamburguer no header | Manter; o Menu atual já está correto para HEAD-04 |
| SVG inline component | n/a — criar arquivo | Ícone UNE extraído de dne.org.br | Para HEAD-03 — extraído manualmente via DevTools |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SVGR via turbopack.rules | SVG como string inline em `.tsx` | String inline funciona mas é difícil de manter e não herda props SVGProps |
| `next/image fill` para foto | `Image` com width/height fixos | Dimensões fixas causam distorção se aspect ratio da foto for diferente do esperado |
| `@svgr/webpack` loader | `svg-inline-loader` | `svg-inline-loader` retorna string, não component React — não aceita props como `className` |

**Installation:**
```bash
# @svgr/webpack já está instalado. Nenhuma instalação adicional necessária.
# Apenas adicionar turbopack.rules ao next.config.ts
```

---

## Architecture Patterns

### Recommended Project Structure

Phase 2 segue Feature-Sliced Design do CLAUDE.md. Componentes são extraídos do monolith `page.tsx` para `src/components/`:

```
src/
├── app/
│   ├── layout.tsx          # Sem mudanças (Nunito já carregada)
│   ├── globals.css         # Possível update de --color-dne-mint após spike
│   └── [student]/
│       └── page.tsx        # Substituir imports por novos componentes
├── components/
│   ├── card-header.tsx     # 02-02: logo + UNE icon + hamburger
│   ├── photo-card.tsx      # 02-03: foto com fill + border-radius
│   ├── qr-card.tsx         # 02-03: QR existente + label CIE
│   ├── info-card.tsx       # 02-04: nome + 5 InfoRows
│   ├── card-footer.tsx     # 02-05: botão Certificado + Apple Wallet
│   ├── une-icon.tsx        # 02-02: SVG ícone UNE (extraído do site)
│   ├── info-row.tsx        # Já existe — sem mudanças
│   └── apple-wallet.tsx    # Já existe — reutilizar
├── assets/
│   ├── Apple-Wallet.svg    # Já existe
│   └── une-icon.svg        # 02-01: SVG extraído de dne.org.br (spike humano)
└── constants/
    └── index.ts            # Sem mudanças
```

### Pattern 1: Nunito aplicada ao logo (HEAD-01)

**What:** Substituir `style={{ fontFamily: 'Arial, sans-serif' }}` pelo CSS variable `--font-nunito` já disponível.
**When to use:** Apenas no elemento `<h1>dne</h1>` do header — não no body.

```typescript
// Fonte Nunito já carregada em layout.tsx como variable '--font-nunito'
// Em card-header.tsx:

<h1
  className="text-white text-4xl font-extrabold tracking-tighter select-none"
  style={{ fontFamily: 'var(--font-nunito)' }}
>
  dne
</h1>
```

**Por que `font-extrabold` (800):** Nunito é variable font — ExtraBold 800 é o peso mais próximo do logo arredondado do DNE. Confirmar com spike 02-01; se for Black (900), usar `font-black`.

### Pattern 2: next/image fill + object-cover para foto (CARD-02)

**What:** Substituir `Image` com `width`/`height` fixos por `fill` mode com parent `position: relative`.
**When to use:** Foto do estudante — aspect ratio pode variar (retrato vs quadrado).

```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/image (verificado 2026-02-27)
// Em photo-card.tsx:

<div className="bg-white rounded-xl p-1.5 shadow-sm w-1/2 relative">
  {/* Parent DEVE ter position: relative para fill funcionar */}
  <div className="relative w-full h-full rounded-lg overflow-hidden">
    <Image
      src={foto}
      alt="Foto do estudante"
      fill
      sizes="(max-width: 390px) 50vw, 195px"
      className="object-cover"
    />
  </div>
</div>
```

**Regra crítica:** O parent imediato do `Image fill` deve ter `position: relative` E dimensões explícitas (height). Se o parent só tem `w-1/2`, o `fill` não tem container de referência. Solução: parent interno `relative` com `h-full` (herdando altura do card pai que tem `h-[280px]`).

### Pattern 3: SVG como React component via SVGR + Turbopack (HEAD-03)

**What:** Configurar `turbopack.rules` no `next.config.ts` para transformar `*.svg` em componentes React.
**When to use:** Para o ícone UNE e qualquer SVG que precise de props como `className`, `fill`, `size`.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack (verificado 2026-02-27)
// next.config.ts — adicionar bloco turbopack:

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns: [ /* ... existente ... */ ],
  },
};

export default nextConfig;
```

**TypeScript type declaration necessária:**
```typescript
// src/types/svg.d.ts (criar novo arquivo)
declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}
```

**Uso no componente:**
```typescript
// components/card-header.tsx
import UneIcon from '@/assets/une-icon.svg';

// Uso:
<UneIcon className="w-8 h-8" />
```

**ATENÇÃO:** O arquivo `Apple-Wallet.svg` em `src/assets/` já é importado como componente React (`apple-wallet.tsx` usa `forwardRef`). Com SVGR via turbopack, a importação mudaria. Duas opções:
1. Manter `apple-wallet.tsx` como está (SVG inline hardcoded) — sem conflito com turbopack rules
2. Converter para importação SVGR — mais limpo, mas requer rewrite do componente

**Recomendação:** Manter `apple-wallet.tsx` como SVG inline e usar SVGR apenas para o novo `une-icon.svg`. Evita risco de quebrar algo que já funciona.

### Pattern 4: Pill button sólido (FOOT-01)

**What:** Substituir o botão transparente com borda por pill azul sólido `#1B3A6B`.
**When to use:** Botão Certificado no footer.

```typescript
// Source: Tailwind v4 docs — token bg-dne-navy já definido em globals.css
// Em card-footer.tsx:

// ANTES (transparente com borda):
<button className="w-[280px] py-3 rounded-full border border-white/40 text-white ... backdrop-blur-sm">

// DEPOIS (pill sólido):
<button className="w-[280px] py-3 rounded-full bg-dne-navy text-white flex items-center justify-center gap-2 text-sm font-medium">
  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
    <Check size={10} strokeWidth={4} />
  </div>
  Certificado
</button>
```

### Pattern 5: Texto "Documento Nacional do Estudante" (HEAD-02)

**What:** Adicionar o subtítulo ao lado do logo no header.
**When to use:** Linha 2 do bloco logo, ou texto inline em tamanho menor.

```typescript
// Em card-header.tsx — bloco do logo:
<div className="flex flex-col">
  <h1
    className="text-white text-4xl font-extrabold tracking-tighter select-none leading-none"
    style={{ fontFamily: 'var(--font-nunito)' }}
  >
    dne
  </h1>
  <span className="text-white text-[10px] font-medium leading-tight">
    Documento Nacional do Estudante
  </span>
</div>
```

**Nota:** O tamanho exato (`text-[10px]`, `text-[11px]`, `text-xs`) requer verificação visual contra screenshot do app. Usar `text-[10px]` como ponto de partida.

### Anti-Patterns to Avoid

- **`style={{ fontFamily: 'Arial' }}`:** Não usar Arial inline — usar `var(--font-nunito)`. Nenhum import adicional necessário — variável já disponível via layout.tsx.
- **`Image` com `width`/`height` fixos para foto:**  Causa distorção. Usar `fill` + parent `relative` com altura definida pelo container.
- **Criar novo `@theme` block sem `inline`:** Token update de cor mint deve ir no bloco `@theme inline {}` existente — não criar segundo bloco.
- **Adicionar SVGR via webpack() override:** Em Next.js 16 com Turbopack como bundler padrão, `webpack()` não é executado no dev. Usar `turbopack.rules` conforme documentação oficial.
- **Usar `<img>` direto para fotos externas:** Requer domínio em `remotePatterns`. `media.discordapp.net` já está configurado em `next.config.ts` — usar `next/image`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SVG como React component | Converter SVG manualmente para TSX hardcoded | SVGR via `turbopack.rules` | SVGR normaliza ids, viewBox, aplica svgo, injeta props SVGProps — manual é trabalhoso e frágil |
| Foto com crop automático | Calcular aspect ratio manualmente + CSS padding-top hack | `next/image fill + object-cover` | next/image lida com srcset, lazy loading, blur placeholder — padding hack não tem esses benefícios |
| Fonte rounded customizada | `@font-face` manual com woff2 | `next/font/google` (Nunito já carregada) | Já funcionando — apenas trocar `fontFamily: 'Arial'` |

**Key insight:** Todos os problemas visuais da Phase 2 têm soluções já na codebase ou em configuração de 3 linhas. Não há necessidade de novos packages.

---

## Common Pitfalls

### Pitfall 1: `next/image fill` sem height no parent

**What goes wrong:** `<Image fill>` dentro de div sem altura explícita colapsa para 0px — imagem invisível.
**Why it happens:** `fill` usa `position: absolute` — precisa de container `position: relative` com dimensões.
**How to avoid:** O card foto tem `h-[280px]` no container externo. O inner div do `Image fill` precisa herdar: `<div className="relative w-full h-full">`.
**Warning signs:** Imagem não aparece mas sem console error; inspecionar no DevTools mostra `height: 0`.

### Pitfall 2: SVGR quebra importação de Apple-Wallet.svg

**What goes wrong:** Depois de adicionar `turbopack.rules` para `*.svg`, o import em `apple-wallet.tsx` muda de comportamento — mas como o arquivo já usa SVG inline (não importa do arquivo), **não há conflito**.
**Why it happens:** `apple-wallet.tsx` tem o SVG embutido como JSX, não usa `import` de arquivo `.svg`. O turbopack rule só afeta imports como `import Logo from './logo.svg'`.
**How to avoid:** Não alterar `apple-wallet.tsx`. Usar SVGR apenas para `une-icon.svg` novo.
**Warning signs:** Se `apple-wallet.tsx` fosse alterado para usar `import AppleWallet from '@/assets/Apple-Wallet.svg'`, o componente ficaria diferente — manter como está.

### Pitfall 3: TypeScript erro ao importar SVG

**What goes wrong:** `import UneIcon from '@/assets/une-icon.svg'` causa erro TypeScript: "Cannot find module '*.svg'".
**Why it happens:** TypeScript não sabe o tipo de módulos `.svg` por default.
**How to avoid:** Criar `src/types/svg.d.ts` com `declare module '*.svg'` antes de usar o import.
**Warning signs:** Erro de compilação TypeScript durante `pnpm build`.

### Pitfall 4: Cor mint incorreta visualmente

**What goes wrong:** `#8CD6BF` pode não ser o hex exato do app original — carteirinha fica com tom ligeiramente diferente.
**Why it happens:** O valor foi estimado na Phase 1 — a confirmação requer eyedropper em dne.org.br.
**How to avoid:** Spike 02-01 confirma o hex exato. Por ser um token CSS (`--color-dne-mint`), atualizar é uma edição de 1 linha em `globals.css`.
**Warning signs:** Comparação lado a lado com screenshot do app mostra tom diferente.

### Pitfall 5: SVG ícone UNE com ids duplicados causando conflito

**What goes wrong:** SVGs do site podem ter `id` attributes genéricos (ex: `id="a"`, `id="b"`). Se usado múltiplas vezes na página, ids conflitam e gradient/clip-path quebra.
**Why it happens:** SVGs exportados sem sanitização de ids.
**How to avoid:** SVGR com `@svgr/webpack` por padrão substitui ids por valores únicos (usando `uniquifyIDs: true` implícito). Verificar na extração se o SVG tem `<defs>` com gradientes — se sim, confirmar que SVGR resolve.
**Warning signs:** Ícone UNE renderiza correto isolado mas distorce quando há múltiplos na página (raro — apenas 1 no header).

### Pitfall 6: `reactCompiler: true` e componentes com side effects

**What goes wrong:** React Compiler (já ativo em `next.config.ts`) pode otimizar agressivamente componentes que têm side effects implícitos.
**Why it happens:** React Compiler assume que componentes são puros.
**How to avoid:** Os componentes da Phase 2 são todos render-only (sem state, sem effects) — nenhum problema esperado. Monitorar se algum componente "pisca" ou não re-renderiza.
**Warning signs:** Dados do estudante aparecem corretos no HTML mas não no DOM visual.

---

## Code Examples

Verified patterns from official sources:

### SVG turbopack.rules — Configuração completa

```typescript
// Source: https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack (2026-02-27)
// next.config.ts — versão completa atualizada:

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "media.discordapp.net" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
  },
};

export default nextConfig;
```

### TypeScript SVG declaration

```typescript
// Source: SVGR docs + Next.js TypeScript conventions
// src/types/svg.d.ts (arquivo novo):

declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}
```

### next/image fill + object-cover — Pattern completo

```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/image (v16.1.6, 2026-02-27)
// photo-card.tsx:

import Image from 'next/image';

interface PhotoCardProps {
  src: string;
  alt: string;
}

export const PhotoCard = ({ src, alt }: PhotoCardProps) => (
  <div className="bg-white rounded-xl p-1.5 shadow-sm w-1/2 relative">
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="195px"
        className="object-cover"
      />
    </div>
  </div>
);
```

### CardHeader — Template completo (HEAD-01 a HEAD-04)

```typescript
// card-header.tsx (RSC — sem "use client"):
import { Menu } from 'lucide-react';
import UneIcon from '@/assets/une-icon.svg'; // extraído no spike 02-01

export const CardHeader = () => (
  <header className="px-3 pt-2 pb-4 flex justify-between items-center">
    <div className="flex flex-col">
      <h1
        className="text-white text-4xl font-extrabold tracking-tighter select-none leading-none"
        style={{ fontFamily: 'var(--font-nunito)' }}
      >
        dne
      </h1>
      <span className="text-white text-[10px] font-medium leading-tight">
        Documento Nacional do Estudante
      </span>
    </div>

    <div className="flex items-center gap-4">
      {/* Ícone UNE: círculo branco com SVG do mapa Brasil */}
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
        <UneIcon className="w-7 h-7" />
      </div>
      <Menu className="text-white" size={28} strokeWidth={2} />
    </div>
  </header>
);
```

### CardFooter — Botão sólido (FOOT-01)

```typescript
// card-footer.tsx:
import { Check } from 'lucide-react';
import Image from 'next/image';
import AppleWalletImage from '@/assets/Add_to_Apple_Wallet_badge.png';

export const CardFooter = () => (
  <div className="mt-auto px-3 pb-8 w-full flex flex-col gap-4 items-center">
    {/* FOOT-01: pill azul sólido */}
    <button className="w-[280px] py-3 rounded-full bg-dne-navy text-white flex items-center justify-center gap-2 text-sm font-medium">
      <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center">
        <Check size={10} strokeWidth={4} />
      </div>
      Certificado
    </button>

    {/* FOOT-02: Apple Wallet badge */}
    <div
      className="h-[46px] rounded-lg transition-colors hover:bg-stone-900 shadow-lg relative overflow-hidden p-0"
      aria-label="Adicionar à Carteira da Apple"
    >
      <Image
        src={AppleWalletImage}
        alt="Apple Wallet"
        width={220}
        height={35}
        className="w-[160px] h-[46px]"
      />
    </div>
  </div>
);
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `style={{ fontFamily: 'Arial' }}` | `style={{ fontFamily: 'var(--font-nunito)' }}` | Phase 2 | Logo usa fonte rounded correta |
| `<Globe>` do Lucide | SVG inline `une-icon.svg` via SVGR | Phase 2 | Ícone UNE correto com mapa Brasil |
| `Image width/height fixos` para foto | `Image fill + object-cover` | Phase 2 | Foto sem distorção para qualquer aspect ratio |
| `border border-white/40 backdrop-blur-sm` | `bg-dne-navy rounded-full` | Phase 2 | Botão Certificado como pill sólido azul |
| `webpack()` override para SVG | `turbopack.rules` | Next.js 15.3+ | Compatível com Turbopack default bundler |

**Deprecated/outdated:**
- `webpack()` override em `next.config.ts` para loaders SVG: Não funciona em Next.js 16 com Turbopack como bundler padrão. Usar `turbopack.rules`.
- `experimental.turbo`: Renomeado para `turbopack` em Next.js 15.3 (removido em 16).

---

## Open Questions

1. **Cor mint exata do app DNE**
   - What we know: Placeholder atual é `#8CD6BF`; pode não ser o hex exato
   - What's unclear: Valor exato — requer eyedropper em `dne.org.br` com display calibrado
   - Recommendation: Spike 02-01 confirma. Token CSS permite update em 1 linha. Não bloqueia outros planos.

2. **Peso da fonte Nunito no logo ("dne")**
   - What we know: Nunito tem ExtraBold (800) e Black (900); `font-extrabold` é candidato principal
   - What's unclear: Se o app original usa 800 ou 900 — requer comparação visual
   - Recommendation: Implementar com `font-extrabold` (800). Ajustar para `font-black` (900) após spike se necessário.

3. **SVG do ícone UNE — disponível em dne.org.br?**
   - What we know: O app usa um círculo com mapa do Brasil + texto "UNE" (não um globe genérico); `dne.org.br` estava inacessível durante a pesquisa (ECONNREFUSED)
   - What's unclear: Se o SVG está acessível no source do site ou apenas como asset no app mobile
   - Recommendation: Plano 02-01 é o spike para resolver. Fallback: criar SVG simplificado manualmente com círculo azul + texto "UNE" se asset não for encontrado.

4. **Tamanho exato do texto "Documento Nacional do Estudante" (HEAD-02)**
   - What we know: É texto pequeno ao lado/abaixo do logo
   - What's unclear: `text-[10px]` vs `text-xs` (12px) — verificar contra screenshot
   - Recommendation: Usar `text-[10px]` como ponto de partida. Ajustar visualmente.

5. **`dev` script usa Turbopack por padrão?**
   - What we know: Next.js 16 habilitou Turbopack como default bundler para `next dev`
   - What's unclear: O `package.json` atual tem `"dev": "next dev"` sem flag `--turbopack` — verificar se é necessária flag ou se já é padrão
   - Recommendation: Plano 02-01 valida com `pnpm dev` se SVGR funciona. Se não funcionar, adicionar `--turbopack` explícito.

---

## Spike 02-01: Protocolo de Extração de Assets (HUMANO)

Esta seção documenta o que o humano precisa fazer no spike 02-01.

### Checklist de Extração

```
[ ] 1. Abrir dne.org.br no Chrome/Firefox com DevTools
[ ] 2. Encontrar a cor de fundo mint: Inspect > computed color no container principal
        → Eyedropper ou "Copy as hex" no color picker DevTools
        → Registrar: _______ (substituir #8CD6BF no token se diferente)

[ ] 3. Identificar fonte do logo "dne":
        → DevTools > Elements > logo element > Computed > font-family
        → Confirmar peso: font-weight value
        → Registrar: família _______ peso _______

[ ] 4. Encontrar ícone UNE (círculo com mapa Brasil):
        → DevTools > Elements > buscar `<svg>` próximo ao header
        → Ou: Network tab > filter "svg" > copiar URL do asset
        → Ou: DevTools > Sources > encontrar SVG como asset
        → Salvar como: src/assets/une-icon.svg

[ ] 5. Confirmar visual:
        → Comparar bg-dne-navy (#1B3A6B) no botão — parece correto?
        → O ícone hamburguer (Menu do Lucide) tem aparência correta?
```

### Fallback para SVG UNE (se não encontrado)

Se o SVG do ícone UNE não puder ser extraído do site, criar SVG simplificado:

```svg
<!-- src/assets/une-icon.svg — fallback simplificado -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="16" fill="#1B3A6B"/>
  <text x="16" y="21" text-anchor="middle" fill="white" font-size="10" font-weight="bold">UNE</text>
</svg>
```

---

## Sources

### Primary (HIGH confidence)

- `https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack` — Turbopack rules, `@svgr/webpack` configuração confirmada como suportada, versão 16.1.6 (verificado 2026-02-27)
- `https://nextjs.org/docs/app/api-reference/components/image` — fill prop, object-fit, parent position: relative requirement, sizes attribute (v16.1.6, 2026-02-27)
- `/Users/brunolago/Developer/dne-digital/src/app/[student]/page.tsx` — Estado atual dos componentes (leitura direta, 2026-02-28)
- `/Users/brunolago/Developer/dne-digital/src/app/globals.css` — Tokens CSS confirmados: `--color-dne-mint`, `--color-dne-navy`, `--font-nunito` (leitura direta, 2026-02-28)
- `/Users/brunolago/Developer/dne-digital/src/app/layout.tsx` — Nunito carregada com `variable: "--font-nunito"` confirmado (leitura direta, 2026-02-28)
- `/Users/brunolago/Developer/dne-digital/package.json` — `@svgr/webpack@^8.1.0` já como dependência (leitura direta, 2026-02-28)

### Secondary (MEDIUM confidence)

- `https://webmentory.dev/articles/resolving-the-react-next-js-16-svg-import-problem-with-turbopack/` — Confirma que `turbopack.rules` é o approach correto (Next.js 16, Turbopack default)
- `https://react-svgr.com/docs/next/` — Configuração SVGR; documentação não cobre Next.js 16 explicitamente, mas padrão webpack config verificado independentemente no turbopack docs

### Tertiary (LOW confidence)

- Peso de fonte Nunito no logo DNE — inferido de análise visual; requer confirmação humana em spike 02-01
- Cor mint exata `#8CD6BF` — valor herdado da Phase 1 como placeholder; requer eyedropper em dne.org.br
- Tamanho do subtítulo HEAD-02 (`text-[10px]`) — estimativa visual; requer ajuste após comparação com app original

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `@svgr/webpack` confirmado como suportado na docs oficiais Next.js 16 turbopack; `next/image fill` verificado na doc oficial
- Architecture: HIGH — patterns derivados da codebase existente + docs oficiais; sem especulação
- Pitfalls: HIGH — todos os pitfalls derivados da leitura direta do código existente e docs oficiais

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (stack estável)
