# Fase 1 — Fundação de Confiança & Conversão

**Projeto:** Oportunidade Hamburgueria (catálogo de equipamentos seminovos, Araçatuba/SP)
**Data:** 2026-05-16
**Status:** Design aprovado, aguardando plano de implementação
**Escopo:** Fase 1 de 4 (decomposição em sub-projetos)

---

## 1. Contexto

Single-page app Vue 3 + Vite + Tailwind que serve como catálogo de equipamentos usados/seminovos de hamburgueria. Vendas 100% via WhatsApp — sem checkout, sem pagamento online. Logo da marca recém-aplicado ("Oportunidade Hamburgueria"). Operação em Araçatuba/SP.

### Diagnóstico que motiva o redesign

| Sintoma | Evidência | Impacto |
|---|---|---|
| Site usa foto stock no Hero | [HeroSection.vue:72](../../../src/components/HeroSection.vue#L72) puxa imagem do Unsplash | Contradiz a oferta de "fotos reais", quebra confiança em < 2s |
| Trust section vende defensivamente | [TrustNotices.vue:7-14](../../../src/components/TrustNotices.vue#L7-L14) lista 6 avisos negativos ("podem apresentar marcas de uso", "recomenda-se visitar") | Pede desculpa antecipada em vez de afirmar diferencial |
| Maior diferencial não é visível no catálogo | Cards não comunicam "fotos reais" nem "teste presencial" | Cliente entra no WhatsApp só pra perguntar "tá funcionando?" |
| Modelo de dados não suporta ficha técnica | [types/index.ts:14-31](../../../src/types/index.ts#L14-L31) — `features: string[]` solto, sem campos estruturados | Comparação/filtro impossível, ficha técnica desorganizada |

### Objetivo da Fase 1

Subir conversão (mais leads via WhatsApp) atacando a **fricção #1 identificada pelo dono**: dúvida sobre estado/funcionamento do equipamento. Os ativos disponíveis são **fotos reais** e **teste presencial em Araçatuba**. Fase 1 transforma esses dois ativos em sinais visuais consistentes em toda a página.

### Público-alvo

Misto: empreendedor abrindo a 1ª hamburgueria (precisa orientação, prova social) **+** dono experiente trocando equipamento (precisa ficha técnica, fotos reais, velocidade de browse). Design serve os dois sem priorizar um.

---

## 2. Princípios

1. **YAGNI** — zero refatoração que não sirva à conversão de Fase 1
2. **Não-breaking** — produtos atuais continuam renderizando sem editar dados
3. **Isolamento** — cada novo componente é independente, testável visualmente isolado, API mínima
4. **Honestidade** — vazio é melhor que mentira (fallback texto-only > foto stock)
5. **Afirmação > defesa** — toda copy de trust em tom positivo, nunca pedindo desculpa

---

## 3. Escopo

### Inclui (Fase 1)

1. Hero reescrito (copy, layout, remoção da foto stock)
2. ProductCard com novos badges (`Foto real`, `Teste no local`) + chips de specs primárias
3. Nova seção `HowItWorks` (3 passos: Escolhe → Testa → Leva)
4. Novo `TrustBand` persistente abaixo do Header
5. Modal de detalhe extraído pra `ProductDetailModal.vue` com ficha técnica
6. Refatoração de `TrustNotices` em `TestimonialsSection` + `TransparencySection`
7. Micro-interações pontuais (stagger no TrustBand/HowItWorks, pulse no badge "Teste no local", flip do logo só no hover)
8. Campos opcionais no tipo `Product`: `hasRealPhotos`, `testAvailable`, `specs`

### Não inclui (deferido)

| Item | Fase |
|---|---|
| Navegação dupla por jornada (newbie / experiente) | 2 |
| Pacotes "Monte sua hamburgueria" | 2 |
| Filtros melhorados (preço, estado) | 2 |
| Lista de interesse refinada (mensagem WhatsApp pronta) | 2 |
| Página por produto (rota própria) | 3 |
| Comparador lado a lado | 3 |
| Mini-blog SEO | 4 |
| Admin via Supabase | 4 |
| FAQ section | descartado (Fase 1 substitui pelo HowItWorks + cards detalhados) |

---

## 4. Arquitetura

### Mapa de componentes

| Arquivo | Tipo | Linhas (estimado) |
|---|---|---|
| `src/components/TrustBand.vue` | Novo | ~60 |
| `src/components/HowItWorks.vue` | Novo | ~110 |
| `src/components/ProductDetailModal.vue` | Novo (extrai do ProductCard) | ~250 |
| `src/components/TestimonialsSection.vue` | Novo (refatora TrustNotices) | ~80 |
| `src/components/TransparencySection.vue` | Novo (refatora TrustNotices) | ~70 |
| `src/components/HeroSection.vue` | Modificado | ~140 (era 101) |
| `src/components/ProductCard.vue` | Modificado (modal extraído, badges adicionados) | ~280 (era 635) |
| `src/components/AppHeader.vue` | Modificado (flip do logo só no hover) | ajuste pequeno |
| `src/components/TrustNotices.vue` | **Deletado** | — |
| `src/App.vue` | Modificado (insere TrustBand, HowItWorks; troca TrustNotices) | ajustes pequenos |
| `src/types/index.ts` | Modificado (+3 campos opcionais em Product) | +12 |
| `src/data/products.ts` | Modificado gradualmente (preenche specs onde houver) | sem mudança estrutural |

### Ordem dos componentes em `App.vue`

```
<ScrollProgress />
<AppHeader />
<TrustBand />                             ← NOVO
<main>
  <HeroSection />                         ← MODIFICADO
  <section sticky><CategoryFilter /></section>
  <HowItWorks />                          ← NOVO
  <CatalogSection />                       (usa ProductCard modificado + ProductDetailModal)
  <PromotionsSection />
  <TestimonialsSection />                 ← NOVO (substitui TrustNotices)
  <AboutSection />
  <section id="contato">...CTA final...</section>
  <TransparencySection />                 ← NOVO (substitui TrustNotices)
  <AppFooter />
</main>
<CartModal />
<WhatsAppFab />
```

### Fluxo de dados

Sem mudanças no fluxo. Dados continuam em memória via [src/data/products.ts](../../../src/data/products.ts). Composable [useCart](../../../src/composables/useCart.ts) mantido sem alteração. Sem backend nesta fase.

### Tipo `Product` — adições

```ts
// src/types/index.ts
export interface Product {
  // ...campos existentes intactos...

  /** true = card exibe badge "📷 Foto real" */
  hasRealPhotos?: boolean;

  /** false = desliga badge "🔧 Teste no local". Default tratado como true no componente. */
  testAvailable?: boolean;

  /** Ficha técnica estruturada. Modal só renderiza chaves preenchidas. */
  specs?: {
    dimensions?: string;          // "60 × 60 × 180 cm"
    voltage?: '110V' | '220V' | 'Bivolt';
    power?: string;               // "280W"
    capacity?: string;            // "120 L"
    brand?: string;               // "Consul"
    yearOfManufacture?: string;   // "2019"
  };
}
```

Produtos sem esses campos seguem renderizando. Componentes consumidores fazem render condicional (sem dois caminhos de código).

---

## 5. Especificações por componente

### 5.1 — `HeroSection.vue` (modificado)

**Sai:**
- Imagem Unsplash em [linha 72](../../../src/components/HeroSection.vue#L72)
- Badges decorativos "12+ itens" e "VENDA RÁPIDA" em [linhas 77-91](../../../src/components/HeroSection.vue#L77-L91)
- Os 4 selos genéricos atuais (`Itens selecionados`, `Venda direta`, `Negociação rápida`, `Retirada combinada`)
- Animação `bounce-soft` (sai junto com os badges)

**Entra:**

| Elemento | Conteúdo |
|---|---|
| Pill superior | `📍 Araçatuba/SP · Equipamentos seminovos` |
| H1 | `Veja, teste, leve.` (quebra) `**Sem surpresa.**` |
| Sub-parágrafo | `Catálogo de equipamentos seminovos com **fotos reais** de cada item. Venha até Araçatuba ver o equipamento ligado, em operação, antes de fechar negócio.` |
| 3 trust points (substitui 4 selos) | `📷 Fotos reais — Cada item fotografado por nós` <br> `🔧 Teste presencial — Ligamos pra você ver funcionando` <br> `🤝 Negociação direta — Sem atravessador, valor justo` |
| CTA primary | `Falar com vendedor` / `Resposta rápida` |
| CTA secondary | `Ver equipamentos →` (scroll #equipamentos) |
| Coluna direita | Mosaico/colagem de 3-4 imagens do próprio catálogo (`products.filter(p => p.hasRealPhotos).slice(0,4).map(p => p.image)`). Overlay sutil: *"Fotos reais do estoque atual"* |

**Fallback da coluna direita:** se houver < 3 produtos com `hasRealPhotos === true`, layout cai pra **uma coluna** centralizada (sem imagem). Vazio > foto stock.

**Mobile:** 1 coluna; mosaico vira carrossel snap-x horizontal compacto OU desaparece se < 3 imagens.

**Animações:** mantém `animate-slide-up` na entrada. ArrowDown mantida mas com amplitude reduzida.

---

### 5.2 — `TrustBand.vue` (novo)

**Posição:** entre `AppHeader` e `<main>` em [App.vue:84](../../../src/App.vue#L84).

**Comportamento:** **não-sticky**. Rola com a página. (Sticky duplicaria com o `CategoryFilter` que já é sticky e poluiria z-index.)

**Estrutura:**

```
┌────────────────────────────────────────────────────────┐
│ 📷 Fotos reais   🔧 Teste presencial   🤝 Negocie direto │
│ cada item nosso  ligado, em Araçatuba  pelo WhatsApp     │
└────────────────────────────────────────────────────────┘
```

- Fundo: `bg-gradient-to-r from-burger-dark via-coal/95 to-burger-dark`
- Bordas: `border-y border-cheese/15`
- Desktop: 3 colunas igual largura
- Mobile: scroll horizontal `snap-x snap-mandatory` (não stack)
- Altura: ~52px desktop, ~56px mobile
- Cada item: ícone `text-cheese w-[18px]` + label `font-bold text-ice` + subline `text-[11px] text-white/70`

**Props:** nenhuma. Copy interna fechada.

**Animação:** fade-in stagger 75ms entre items, **apenas na primeira renderização** via IntersectionObserver. Depois disso, estático. Respeita `prefers-reduced-motion`.

---

### 5.3 — `HowItWorks.vue` (novo)

**Posição:** entre `CategoryFilter` (sticky) e `CatalogSection` em `App.vue`.

**Estrutura — 3 cards horizontais com timeline visual:**

| # | Ícone | Título | Descrição |
|---|---|---|---|
| ① | 📷 (`Camera`) | Você escolhe | Navega o catálogo e chama no WhatsApp pra ver fotos extras e preço. |
| ② | 🔧 (`Wrench`) | Vem testar | Marca um horário, vem até Araçatuba ver o equipamento ligado, em operação. |
| ③ | 🚚 (`Truck`) | Combina retirada | Pagamento à vista ou parcelado. Retirada combinada ou frete por sua conta. |

**Visual:**
- Cada card: número grande em `font-heading text-cheese text-5xl` no topo, ícone `text-fire`, título `font-bold text-ice`, descrição `text-white/85`
- Conector entre cards no desktop: `border-top dashed cheese/20` ligando topos dos números
- Mobile: stack vertical, conector vira `border-left dashed cheese/20`
- Background da seção: `bg-coal` (mantém ritmo dark)

**CTA no final da seção:** *"Tirou dúvida? Chama no WhatsApp"* — botão secundário sutil, emite click que chama `openGeneralWhatsApp()` do App.vue.

**Props:** nenhuma. Texto interno fechado.

**Animações:** cascata 120ms de delay entre passos quando entram no viewport (IntersectionObserver). Respeita `prefers-reduced-motion`.

---

### 5.4 — `ProductCard.vue` (modificado)

**Adições:**

#### Badge "📷 Foto real"

- **Localização:** dentro do bloco de badges inferiores da imagem ([linha 195-208](../../../src/components/ProductCard.vue#L195-L208))
- **Condição:** `v-if="product.hasRealPhotos"`
- **Visual:**
  ```html
  <span class="inline-flex items-center gap-1 bg-coal/90 backdrop-blur text-green-300
               px-2 py-1 rounded text-[11px] font-semibold border border-green-500/40">
    <Camera class="w-3 h-3" />
    Foto real
  </span>
  ```

#### Badge "🔧 Teste no local"

- **Localização:** na fileira superior direita, abaixo do `product.badge` se existir ([linha 188-193](../../../src/components/ProductCard.vue#L188-L193))
- **Condição:** `v-if="product.testAvailable !== false"` (default true)
- **Visual:** outline em vez de fill, mais sutil que o badge de status:
  ```html
  <span class="inline-flex items-center gap-1 bg-coal/70 text-ice px-2.5 py-1 rounded-full
               text-[10px] font-semibold border border-ice/20 backdrop-blur">
    <Wrench class="w-3 h-3" />
    Teste no local
  </span>
  ```
- **Animação:** pulse muito sutil (`scale 1 → 1.02 → 1`, 3s infinito) — única animação recorrente da Fase 1. Respeita `prefers-reduced-motion`.

#### Chips de specs primárias

- **Localização:** entre a lista `features` e o bloco de preço
- **Condição:** `v-if="product.specs"`
- **Conteúdo:** até 3 specs primárias em ordem fixa: `voltage`, `capacity`, `dimensions`. Renderiza só as que existirem.
- **Visual:** chips inline `bg-white/5 border border-cheese/15 rounded px-2 py-1 text-[11px] text-ice/85`. Não-clicáveis.

#### Sublabel do CTA "Negociar"

- Muda de `via WhatsApp` para `ver e negociar` ([linha 281](../../../src/components/ProductCard.vue#L281))

**Refatoração:**

- O modal de galeria 3D atual ([linhas 287-380](../../../src/components/ProductCard.vue#L287-L380)) **é extraído** pra `ProductDetailModal.vue` (ver 5.5)
- O estado `galleryOpen`, `activeIdx`, funções `openGallery`, `close`, `next`, `prev`, `relativeOffset`, `itemStyle`, `onPointerDown`, `onPointerUp`, `onKey` e o watch de `galleryOpen` são todos **movidos** pro `ProductDetailModal.vue`
- ProductCard fica com: prop `product`, emit `addToList`, computed de status/preço/gallery, ref `detailOpen`, função `openDetail`. Render do modal vira `<ProductDetailModal :product="product" :open="detailOpen" @close="detailOpen = false" />`

---

### 5.5 — `ProductDetailModal.vue` (novo)

**API:**

```ts
defineProps<{ product: Product; open: boolean }>();
defineEmits<{ (e: 'close'): void }>();
```

**Estrutura:**

```
┌──────────────────────────────────────────────────────────┐
│ [Header] Nome do produto · "3 de 5"           [×]        │
├──────────────────────────────────────────────────────────┤
│            Carrossel 3D (mantém como está hoje)          │
├──────────────────────────────────────────────────────────┤
│ ╔══════════════════════════════════════════════════════╗ │
│ ║  Ficha técnica                                       ║ │
│ ║  Marca: Consul     · Voltagem: Bivolt                ║ │
│ ║  Capacidade: 120 L · Potência: 280W                  ║ │
│ ║  Dimensões: 60 × 60 × 180 cm                        ║ │
│ ║  Ano: 2019         · Estado: Seminovo (= condition) ║ │
│ ╚══════════════════════════════════════════════════════╝ │
│ Descrição completa (product.description)                 │
│ [ + Adicionar à lista ] [ 💬 Falar no WhatsApp ]         │
│ 🔧 Disponível pra teste presencial em Araçatuba          │
└──────────────────────────────────────────────────────────┘
```

**Ficha técnica:**
- Grid 2 colunas no desktop, 1 coluna no mobile
- Renderiza apenas chaves presentes em `product.specs`. Não exibe linha vazia.
- `condition` (string existente) entra como linha "Estado: {condition}"
- Se `product.specs` ausente E `condition` ausente, ficha técnica não renderiza

**CTAs:** mesmos do card (`Separar` + `Negociar`), mais visíveis. Reutilizar as classes `card-cta`, `card-cta--secondary`, `card-cta--primary` do ProductCard (mover essas regras pra estilo global em `src/index.css` ou manter scoped duplicado — decisão fica pro plano de implementação).

**Reforço final:** linha discreta `🔧 Disponível pra teste presencial em Araçatuba` se `product.testAvailable !== false`.

**Comportamento:**
- Esc, click backdrop, X — fecham (emit `close`)
- Body scroll lock (mantém lógica atual)
- `role="dialog"`, `aria-labelledby` apontando pro título
- Teleport para `body`

**Animações:**
- Carrossel 3D — mantém transições atuais
- Slide-up do bloco de ficha técnica quando modal abre (efeito empurrar de baixo)
- `prefers-reduced-motion: reduce` → transições viram instantâneas

---

### 5.6 — `TestimonialsSection.vue` (novo, refatora parte do TrustNotices)

**Posição:** entre `PromotionsSection` e `AboutSection`.

**Props:** `testimonials: Testimonial[]` (mantém API atual do TrustNotices).

**Visual:**
- Mantém o card visual atual ([TrustNotices.vue:38-50](../../../src/components/TrustNotices.vue#L38-L50)) — funciona bem
- Heading muda: *"Avisos importantes"* → *"Quem já comprou conta"*
- Subtitle: *"Depoimentos reais de clientes que vieram, testaram e levaram."*
- Grid 3 colunas desktop, stack mobile

**Sem animação recorrente.** Stagger fade-in no mount (uma vez).

---

### 5.7 — `TransparencySection.vue` (novo, refatora resto do TrustNotices)

**Posição:** após o CTA final (`section#contato`) e antes do `AppFooter`.

**Conteúdo (4 afirmações afirmativas — reescritas):**

| Antes | Depois |
|---|---|
| "Todos os itens estão sujeitos à disponibilidade." | "Estoque rotativo — confirmamos disponibilidade no momento do contato." |
| "Os valores podem ser negociados." | "Trabalhamos com preço aberto e negociável." |
| "A retirada deve ser combinada previamente." | "Retirada agendada com horário marcado em Araçatuba/SP." |
| "Reserva somente mediante acordo com o vendedor." | "Reservas confirmadas via WhatsApp." |

**Removidos:**
- ❌ "Produtos usados podem apresentar marcas de uso." — honestidade vai no `product.condition` de cada item
- ❌ "Recomenda-se visitar ou solicitar vídeos antes da compra." — convite ativo já está em `HowItWorks` ("Vem testar")

**Visual:** grid 2x2, `surface-card` sutil, ícone + label + subline. Padding reduzido. Sem heading gigante (já estamos no fim da página).

**Props:** nenhuma. Conteúdo interno fechado.

---

### 5.8 — `AppHeader.vue` (modificado — flip do logo)

A animação `animate-flip-y` que aplicamos no logo em rodada anterior **roda continuamente** hoje. Em contexto profissional de seminovos, isso vira ruído visual.

**Mudança:** remover `animate-flip-y` do span do logo. Adicionar flip 360° apenas no `:hover` do link pai. Easter egg mantido, ruído eliminado.

**Implementação:**
```html
<span class="inline-block transition-transform duration-700"
      style="transform-style: preserve-3d;">
```
No CSS global:
```css
.logo-link:hover .logo-flip { transform: rotateY(360deg); }
```

(O bloco de keyframes/animation atual em `tailwind.config.js` pode ser mantido pra reuso futuro, ou removido se sair limpo. Decisão fica no plano.)

---

## 6. Micro-interactions — princípio rege

> Animação só onde **comunica** (estado, resposta, próxima ação). Zero animação **decorativa**.

| Adicionado | Onde | Por quê |
|---|---|---|
| Fade-in stagger 75ms | TrustBand (3 itens, mount) | "Essas três promessas estão chegando" |
| Cascata 120ms | HowItWorks (3 passos, viewport enter) | Comunica sequência temporal |
| Slide-up | Bloco de ficha técnica no modal | "Tem mais conteúdo aqui" |
| Pulse sutil 1 → 1.02 → 1 (3s) | Badge "Teste no local" no ProductCard | Único loop infinito — vale porque é a alavanca de conversão #1 |

| Removido | Motivo |
|---|---|
| `animate-bounce-soft` nos badges decorativos do Hero | Badges saíram (Seção 2) |
| `animate-flip-y` contínuo do logo | Vira hover-only |
| `animate-bounce` da ArrowDown | Mantida, mas amplitude reduzida |

| Mantido | Onde |
|---|---|
| `animate-slide-up` no Hero | Entrada do bloco de texto |
| Carrossel 3D no modal | Protagonista do detalhe |
| Hover do card (`-translate-y-1`) | Feedback de interação |
| Pulse verde no botão WhatsApp | Sinal de "online/responde rápido" |
| Shine no CTA primário | Mantido (rever se ficar exagerado no contexto novo) |

**Performance:** animações apenas em `transform` e `opacity`. `will-change` somente em itens com stagger/cascata. Sem `requestAnimationFrame` em loop.

**Acessibilidade:** toda animação respeita `prefers-reduced-motion: reduce`.

---

## 7. Verificação (como saber que ficou bom)

Sem suite de testes automatizados de UI no projeto hoje. Verificação é manual:

### Checklist visual

- [ ] Hero não exibe imagem do Unsplash (DevTools Network → nenhuma request pra `images.unsplash.com` no carregamento inicial)
- [ ] Hero exibe 4 fotos reais OU layout cai pra texto-only sem foto stock
- [ ] TrustBand visível imediatamente após o Header em todas as larguras de tela
- [ ] HowItWorks aparece entre CategoryFilter e CatalogSection
- [ ] Card de produto com `hasRealPhotos: true` mostra badge "📷 Foto real"
- [ ] Card de produto com `testAvailable: undefined` mostra badge "🔧 Teste no local"
- [ ] Card de produto com `testAvailable: false` NÃO mostra o badge
- [ ] Chips de specs aparecem nos cards com `specs` preenchido
- [ ] Modal de detalhe abre ao clicar na imagem do card
- [ ] Modal exibe ficha técnica com colunas em duas linhas no desktop
- [ ] TestimonialsSection aparece entre Promotions e About
- [ ] TransparencySection aparece após o CTA final
- [ ] `TrustNotices.vue` foi deletado e não há import órfão
- [ ] Logo no header não gira mais continuamente; gira no hover

### Checklist técnico

- [ ] Produtos antigos sem `hasRealPhotos`/`testAvailable`/`specs` continuam renderizando (default behavior: sem badge "Foto real", com badge "Teste no local", sem chips de specs)
- [ ] `prefers-reduced-motion: reduce` no DevTools desliga: pulse do badge, stagger do TrustBand, cascata do HowItWorks
- [ ] Lighthouse: nenhuma regressão de Performance/Accessibility em relação ao baseline atual
- [ ] Build de produção (`npm run build`) sem warnings novos
- [ ] Type-check (`tsc --noEmit`) sem erros novos

### Critério de sucesso de negócio (post-deploy)

Sem analytics formal hoje. Sinal qualitativo:
- Quantidade de mensagens "tá funcionando?" / "tem garantia?" no WhatsApp **diminui** nas duas semanas seguintes
- Quantidade de visitas presenciais agendadas **aumenta**

---

## 8. Riscos e mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Não há fotos reais suficientes no estoque pra montar o mosaico do Hero | Média | Fallback texto-only documentado em 5.1 |
| Refatoração do ProductCard quebra interações sutis do carrossel 3D | Média | Plano de implementação extrai modal preservando 100% da lógica atual (sem reescrever, só mover) |
| Pulse no badge "Teste no local" vira tique visual com muitos cards na tela | Baixa | Pulse é leve (1 → 1.02), 3s, sem mudança de cor. Se ficar irritante na prática, remover é mudança de 1 linha de CSS |
| Cliente vê "Teste no local" e marca visita, mas a infra/horário do vendedor não comporta volume | Média | Diagnóstico do dono confirmou que esse é o modelo. Se virar gargalo, badge vira `testAvailable: true` opt-in por produto em vez de default |
| Linguagem afirmativa em TransparencySection pode esconder limitações legítimas | Baixa | Cada `product.condition` carrega a honestidade item-a-item. Avisos genéricos saem porque não comunicam nada útil. |

---

## 9. Próximos passos

1. **Usuário revisa este spec** e dá ok ou pede ajuste
2. **Plano de implementação** detalha cada task em pedaços de 2-5 minutos com paths, código e verificação (skill `writing-plans`)
3. **Implementação** segue o plano (skill `subagent-driven-development` ou execução inline)
4. **Validação** no localhost + deploy preview antes do merge
5. **Medição qualitativa** nas 2 semanas após o deploy decide se Fase 2 é prioridade

---

**Aprovação necessária antes do plano:** o usuário deve confirmar que este spec representa fielmente o que ele quer construir antes que o plano de implementação seja escrito.
