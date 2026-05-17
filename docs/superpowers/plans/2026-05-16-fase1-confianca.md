# Plano de Implementação — Fase 1: Fundação de Confiança & Conversão

**Spec:** [2026-05-16-oportunidade-hamburgueria-fase1-confianca-design.md](../specs/2026-05-16-oportunidade-hamburgueria-fase1-confianca-design.md)
**Data:** 2026-05-16
**Estimativa total:** ~6-10h de implementação concentrada

---

## Estrutura de arquivos final

```
src/
├── components/
│   ├── AppHeader.vue                  (modificado: logo flip hover-only)
│   ├── AppFooter.vue                  (sem mudança)
│   ├── HeroSection.vue                (modificado: copy nova, sem Unsplash)
│   ├── TrustBand.vue                  (NOVO)
│   ├── HowItWorks.vue                 (NOVO)
│   ├── CatalogSection.vue             (sem mudança)
│   ├── CategoryFilter.vue             (sem mudança)
│   ├── ProductCard.vue                (modificado: badges + chips + modal extraído)
│   ├── ProductDetailModal.vue         (NOVO: extrai modal + ficha técnica)
│   ├── PromotionsSection.vue          (sem mudança)
│   ├── TestimonialsSection.vue        (NOVO: refatora parte do TrustNotices)
│   ├── TransparencySection.vue        (NOVO: refatora resto do TrustNotices)
│   ├── TrustNotices.vue               ❌ DELETADO
│   ├── AboutSection.vue               (sem mudança)
│   ├── CartModal.vue                  (sem mudança)
│   ├── ScrollProgress.vue             (sem mudança)
│   ├── WhatsAppButton.vue             (sem mudança)
│   └── WhatsAppFab.vue                (sem mudança)
├── types/
│   └── index.ts                       (modificado: +3 campos opcionais em Product)
├── data/
│   └── products.ts                    (modificado opcionalmente: preenche specs onde aplicável)
├── App.vue                            (modificado: nova ordem de componentes)
└── index.css                          (modificado: keyframes + utilitários globais para hover do logo)
```

---

## Ordem de execução

As tasks são **sequenciais quando dependem umas das outras**, mas pra cada bloco indico se pode ser feito em paralelo.

```
1 (types)
 ├─ 2 (TrustBand)     ← independente
 ├─ 3 (HowItWorks)    ← independente
 ├─ 4 (ProductDetailModal extraído)
 │   └─ 5 (ProductCard atualizado para usar o modal + badges + chips)
 ├─ 6 (Split TrustNotices em Testimonials + Transparency)
 ├─ 7 (Hero rewrite)
 └─ 8 (AppHeader logo hover-only)
            ↓
         9 (App.vue wiring + delete TrustNotices)
            ↓
        10 (Verificação manual + build)
```

---

## Task 1 — Adicionar campos opcionais ao tipo `Product`

**Arquivo:** [src/types/index.ts](../../../src/types/index.ts)

**Mudança:** adicionar 3 campos opcionais ao final da interface `Product`, **antes do fechamento da chave**.

**Localização:** entre [linha 30](../../../src/types/index.ts#L30) (`badge?: string;`) e a chave de fechamento `}` na linha 31.

**Código a inserir:**

```ts
  /** true = card exibe badge "📷 Foto real" */
  hasRealPhotos?: boolean;

  /** false = desliga badge "🔧 Teste no local". Default tratado como true no componente. */
  testAvailable?: boolean;

  /** Ficha técnica estruturada. Modal só renderiza chaves preenchidas. */
  specs?: {
    dimensions?: string;
    voltage?: '110V' | '220V' | 'Bivolt';
    power?: string;
    capacity?: string;
    brand?: string;
    yearOfManufacture?: string;
  };
```

**Verificação:**
- `npx tsc --noEmit` roda sem erros novos
- `npm run build` continua passando

---

## Task 2 — Criar `TrustBand.vue`

**Arquivo:** [src/components/TrustBand.vue](../../../src/components/TrustBand.vue) (novo)

**Conteúdo completo:**

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Camera, Wrench, Handshake } from 'lucide-vue-next';

const items = [
  { icon: Camera,    title: 'Fotos reais',        subline: 'cada item fotografado por nós' },
  { icon: Wrench,    title: 'Teste presencial',   subline: 'ligado, em Araçatuba' },
  { icon: Handshake, title: 'Negocie direto',     subline: 'pelo WhatsApp, sem atravessador' },
];

const visible = ref(false);
onMounted(() => {
  // Stagger só na primeira renderização
  requestAnimationFrame(() => { visible.value = true; });
});
</script>

<template>
  <aside
    class="bg-gradient-to-r from-burger-dark via-coal/95 to-burger-dark border-y border-cheese/15"
    aria-label="Garantias da loja"
  >
    <ul
      class="max-w-7xl mx-auto px-4 py-3 flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory md:overflow-visible"
    >
      <li
        v-for="(item, idx) in items"
        :key="idx"
        :style="{ transitionDelay: `${idx * 75}ms` }"
        :class="[
          'flex items-center gap-3 snap-start shrink-0 md:shrink min-w-[80%] md:min-w-0 transition-all duration-500',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        ]"
      >
        <component :is="item.icon" class="w-[18px] h-[18px] text-cheese shrink-0" />
        <div class="leading-tight">
          <p class="font-bold text-ice text-sm">{{ item.title }}</p>
          <p class="text-[11px] text-white/70">{{ item.subline }}</p>
        </div>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  li { transition: none !important; }
}
</style>
```

**Verificação:**
- Import isolado no `App.vue` (próxima task fará o wiring). Por ora, validar visualmente abrindo o componente em isolamento via `npm run dev`.

---

## Task 3 — Criar `HowItWorks.vue`

**Arquivo:** [src/components/HowItWorks.vue](../../../src/components/HowItWorks.vue) (novo)

**Conteúdo completo:**

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Camera, Wrench, Truck, MessageCircle } from 'lucide-vue-next';

const emit = defineEmits<{ (e: 'whatsapp'): void }>();

const steps = [
  {
    icon: Camera,
    title: 'Você escolhe',
    body: 'Navega o catálogo e chama no WhatsApp pra ver fotos extras e preço.',
  },
  {
    icon: Wrench,
    title: 'Vem testar',
    body: 'Marca um horário, vem até Araçatuba ver o equipamento ligado, em operação.',
  },
  {
    icon: Truck,
    title: 'Combina retirada',
    body: 'Pagamento à vista ou parcelado. Retirada combinada ou frete por sua conta.',
  },
];

const visibleSteps = ref<boolean[]>([false, false, false]);
const root = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!root.value || !('IntersectionObserver' in window)) {
    visibleSteps.value = [true, true, true];
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        steps.forEach((_, i) => setTimeout(() => { visibleSteps.value[i] = true; }, i * 120));
        observer.disconnect();
      }
    },
    { threshold: 0.25 },
  );
  observer.observe(root.value);
});
</script>

<template>
  <section ref="root" id="como-comprar" class="bg-coal py-20">
    <div class="max-w-7xl mx-auto px-4">
      <header class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-ice font-heading mb-3">
          Como funciona a <span class="text-cheese">compra</span>
        </h2>
        <p class="text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
          Sem mistério. Três passos pra você levar o equipamento certo, sem surpresa.
        </p>
      </header>

      <ol class="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-10">
        <li
          v-for="(step, idx) in steps"
          :key="idx"
          :class="[
            'relative bg-burger-dark/40 border border-cheese/15 rounded-2xl p-6 transition-all duration-500',
            visibleSteps[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ]"
        >
          <div class="flex items-start gap-4">
            <span class="font-heading font-bold text-cheese text-5xl leading-none shrink-0">
              {{ idx + 1 }}
            </span>
            <div>
              <div class="flex items-center gap-2 mb-2">
                <component :is="step.icon" class="w-5 h-5 text-fire" />
                <h3 class="font-bold text-ice text-lg font-heading">{{ step.title }}</h3>
              </div>
              <p class="text-white/85 leading-relaxed">{{ step.body }}</p>
            </div>
          </div>
        </li>
      </ol>

      <div class="text-center">
        <button
          @click="emit('whatsapp')"
          class="inline-flex items-center gap-2 text-cheese hover:text-white transition-colors font-semibold text-base underline underline-offset-4 decoration-cheese/30 hover:decoration-cheese"
        >
          <MessageCircle class="w-4 h-4" />
          Tirou dúvida? Chama no WhatsApp
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  li { transition: none !important; opacity: 1 !important; transform: none !important; }
}
</style>
```

**Verificação:**
- Componente compila isoladamente. Wiring no `App.vue` na Task 9.

---

## Task 4 — Criar `ProductDetailModal.vue` (extrair modal do ProductCard)

**Arquivo:** [src/components/ProductDetailModal.vue](../../../src/components/ProductDetailModal.vue) (novo)

**Origem do código:** mover blocos das linhas [287-380](../../../src/components/ProductCard.vue#L287-L380) (template do modal) e [383-635](../../../src/components/ProductCard.vue#L383-L635) (styles) do `ProductCard.vue`, mais a lógica de gallery/keyboard/pointer.

**Conteúdo completo:**

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { X, ChevronLeft, ChevronRight, Wrench, Plus } from 'lucide-vue-next';
import type { Product } from '../types';
import { openProductWhatsApp } from '../utils/whatsapp';
import WhatsAppIcon from './icons/WhatsAppIcon.vue';

const props = defineProps<{ product: Product; open: boolean }>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'addToList', product: Product): void;
}>();

const gallery = computed(() =>
  props.product.gallery && props.product.gallery.length > 0
    ? props.product.gallery
    : [props.product.image],
);

const activeIdx = ref(0);

watch(
  () => props.open,
  (open) => {
    if (open) activeIdx.value = 0;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = open ? 'hidden' : '';
    }
  },
);

function close() { emit('close'); }
function next() { activeIdx.value = (activeIdx.value + 1) % gallery.value.length; }
function prev() {
  activeIdx.value = (activeIdx.value - 1 + gallery.value.length) % gallery.value.length;
}

function relativeOffset(idx: number) {
  const n = gallery.value.length;
  let diff = idx - activeIdx.value;
  if (diff > n / 2) diff -= n;
  if (diff < -n / 2) diff += n;
  return diff;
}

function itemStyle(idx: number) {
  const offset = relativeOffset(idx);
  const abs = Math.abs(offset);
  if (abs > 3) {
    return {
      transform: `translateX(${offset > 0 ? 350 : -350}px) rotateY(${offset > 0 ? -55 : 55}deg) translateZ(-500px) scale(0.4)`,
      opacity: 0,
      pointerEvents: 'none' as const,
      zIndex: 0,
    };
  }
  const translateX = offset * 38;
  const translateZ = -Math.min(abs, 3) * 140;
  const rotateY = offset === 0 ? 0 : offset > 0 ? -38 : 38;
  const scale = 1 - abs * 0.08;
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.85 : abs === 2 ? 0.45 : 0.18;
  return {
    transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity,
    zIndex: 100 - abs,
  };
}

const dragStartX = ref<number | null>(null);
function onPointerDown(e: PointerEvent) { dragStartX.value = e.clientX; }
function onPointerUp(e: PointerEvent) {
  if (dragStartX.value === null) return;
  const dx = e.clientX - dragStartX.value;
  if (Math.abs(dx) > 50) dx > 0 ? prev() : next();
  dragStartX.value = null;
}

function onKey(e: KeyboardEvent) {
  if (!props.open) return;
  if (e.key === 'ArrowRight') next();
  else if (e.key === 'ArrowLeft') prev();
  else if (e.key === 'Escape') close();
}
onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));

const hasPriceRange = computed(
  () =>
    typeof props.product.minPrice === 'number' &&
    typeof props.product.maxPrice === 'number' &&
    props.product.maxPrice! > 0,
);

function formatBRL(value: number) {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const priceText = computed(() => {
  if (hasPriceRange.value) {
    return `${formatBRL(props.product.minPrice!)} – ${formatBRL(props.product.maxPrice!)}`;
  }
  return props.product.price > 0
    ? `R$ ${props.product.price.toFixed(2).replace('.', ',')}`
    : props.product.priceLabel || 'A consultar';
});

const specsRows = computed(() => {
  const s = props.product.specs;
  if (!s) return [];
  const map: Array<[string, string | undefined]> = [
    ['Marca', s.brand],
    ['Voltagem', s.voltage],
    ['Capacidade', s.capacity],
    ['Potência', s.power],
    ['Dimensões', s.dimensions],
    ['Ano', s.yearOfManufacture],
  ];
  return map.filter(([, v]) => !!v) as Array<[string, string]>;
});

const hasFichaTecnica = computed(() => specsRows.value.length > 0 || !!props.product.condition);
const showTestLine = computed(() => props.product.testAvailable !== false);
const isUnavailable = computed(() => props.product.status === 'vendido');
const titleId = computed(() => `product-modal-title-${props.product.id}`);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex items-center justify-center carousel-backdrop overflow-y-auto"
        role="dialog"
        :aria-labelledby="titleId"
        @click.self="close"
      >
        <button
          @click="close"
          class="absolute top-5 right-5 text-white/80 hover:text-cheese transition-colors p-2.5 bg-coal/80 hover:bg-coal/95 rounded-full backdrop-blur z-[110] ring-1 ring-cheese/40 shadow-lg"
          aria-label="Fechar"
        >
          <X class="w-6 h-6" />
        </button>

        <div class="absolute top-5 left-5 z-[110] bg-coal/80 backdrop-blur rounded-full px-4 py-2 ring-1 ring-cheese/30 max-w-[60vw]">
          <p :id="titleId" class="text-white font-heading font-bold text-sm md:text-base leading-tight">
            {{ product.name }}
          </p>
          <p class="text-cheese/80 text-xs">{{ activeIdx + 1 }} de {{ gallery.length }}</p>
        </div>

        <div class="w-full max-w-5xl flex flex-col items-center gap-6 py-24 px-4">
          <button
            v-if="gallery.length > 1"
            @click="prev"
            class="hidden md:flex absolute left-3 md:left-8 top-1/3 z-[110] text-white hover:text-cheese transition-all p-3 md:p-4 bg-coal/80 hover:bg-coal/95 rounded-full backdrop-blur ring-1 ring-white/10 hover:scale-110"
            aria-label="Anterior"
          >
            <ChevronLeft class="w-6 h-6" />
          </button>
          <button
            v-if="gallery.length > 1"
            @click="next"
            class="hidden md:flex absolute right-3 md:right-8 top-1/3 z-[110] text-white hover:text-cheese transition-all p-3 md:p-4 bg-coal/80 hover:bg-coal/95 rounded-full backdrop-blur ring-1 ring-white/10 hover:scale-110"
            aria-label="Próxima"
          >
            <ChevronRight class="w-6 h-6" />
          </button>

          <div
            class="carousel-stage select-none"
            @pointerdown="onPointerDown"
            @pointerup="onPointerUp"
          >
            <div
              v-for="(img, idx) in gallery"
              :key="idx"
              class="carousel-item"
              :style="itemStyle(idx)"
              @click="activeIdx = idx"
            >
              <img
                :src="img"
                :alt="`${product.name} - foto ${idx + 1}`"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
              <div v-if="idx !== activeIdx" class="absolute inset-0 bg-coal/40"></div>
            </div>
          </div>

          <div
            class="w-full bg-burger-dark/85 border border-cheese/20 rounded-2xl p-6 md:p-8 space-y-5 detail-slide-up"
          >
            <header v-if="hasFichaTecnica" class="space-y-3">
              <h3 class="text-lg font-heading font-bold text-ice">Ficha técnica</h3>
              <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div v-for="[label, value] in specsRows" :key="label" class="flex justify-between gap-3 border-b border-white/5 pb-1.5">
                  <dt class="text-white/65">{{ label }}</dt>
                  <dd class="text-ice font-semibold text-right">{{ value }}</dd>
                </div>
                <div v-if="product.condition" class="flex justify-between gap-3 border-b border-white/5 pb-1.5">
                  <dt class="text-white/65">Estado</dt>
                  <dd class="text-ice font-semibold text-right">{{ product.condition }}</dd>
                </div>
              </dl>
            </header>

            <p class="text-white leading-relaxed">{{ product.description }}</p>

            <div class="flex items-end justify-between flex-wrap gap-3 pt-2">
              <div>
                <p class="text-xs text-white/65 uppercase tracking-wide">Valor</p>
                <p class="text-3xl font-bold text-cheese font-heading">{{ priceText }}</p>
              </div>
              <p v-if="product.originalPrice && !hasPriceRange" class="text-sm text-ice/50 line-through">
                R$ {{ product.originalPrice.toFixed(2).replace('.', ',') }}
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                @click="emit('addToList', product); close()"
                :disabled="isUnavailable"
                class="card-cta card-cta--secondary"
              >
                <Plus class="w-[18px] h-[18px] shrink-0 card-cta__icon" />
                <span class="card-cta__labels">
                  <span class="card-cta__title">Separar</span>
                  <span class="card-cta__subtitle">montar combo</span>
                </span>
              </button>
              <button
                @click="openProductWhatsApp(product)"
                :disabled="isUnavailable"
                class="card-cta card-cta--primary"
              >
                <span class="card-cta__icon-wrap">
                  <WhatsAppIcon class="w-[20px] h-[20px] card-cta__icon" />
                  <span class="card-cta__online" aria-hidden="true"></span>
                </span>
                <span class="card-cta__labels">
                  <span class="card-cta__title">Negociar</span>
                  <span class="card-cta__subtitle">ver e negociar</span>
                </span>
              </button>
            </div>

            <p v-if="showTestLine" class="flex items-center gap-2 text-sm text-cheese/85 pt-1">
              <Wrench class="w-4 h-4 shrink-0" />
              Disponível pra teste presencial em Araçatuba antes da compra.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.carousel-backdrop {
  background: radial-gradient(ellipse at center, rgba(20, 20, 20, 0.92) 0%, rgba(0, 0, 0, 0.98) 100%);
  backdrop-filter: blur(8px);
}
.carousel-stage {
  position: relative;
  width: min(90vw, 800px);
  height: min(55vh, 480px);
  perspective: 1600px;
  perspective-origin: center center;
  transform-style: preserve-3d;
  cursor: grab;
}
.carousel-stage:active { cursor: grabbing; }
.carousel-item {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  transition:
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  transform-style: preserve-3d;
  cursor: pointer;
  box-shadow:
    0 30px 70px -20px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(255, 214, 10, 0.08);
  background: #0d0d0d;
}
.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  padding: 14px;
  user-select: none;
  -webkit-user-drag: none;
}
.detail-slide-up {
  animation: detail-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes detail-rise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .carousel-item, .detail-slide-up { transition: none !important; animation: none !important; }
}
</style>
```

**Notas importantes:**
- As classes `.card-cta`, `.card-cta--secondary`, `.card-cta--primary`, `.card-cta__labels`, `.card-cta__title`, etc. **dependem do estilo em `ProductCard.vue`**. Quando ProductCard for atualizado (Task 5), as classes serão movidas pro escopo global em `src/index.css` para que tanto Card quanto Modal usem.

**Verificação:**
- Compilação isolada do componente (sem usar ainda) com `npx tsc --noEmit`
- Sem warnings de import

---

## Task 5 — Atualizar `ProductCard.vue` (usar modal extraído + badges + chips + sublabel)

**Arquivo:** [src/components/ProductCard.vue](../../../src/components/ProductCard.vue)

### 5a. Remover seções movidas pro modal

**Remover do `<script setup>`** (linhas 60-148 atuais):
- `gallery`, `galleryOpen`, `activeIdx` (substituir conforme abaixo)
- Funções `openGallery`, `close`, `next`, `prev`, `relativeOffset`, `itemStyle`
- `dragStartX`, `onPointerDown`, `onPointerUp`
- `onKey`, `onMounted/onUnmounted` desses keys
- `watch(galleryOpen, ...)`

**Substituir por:**

```ts
const detailOpen = ref(false);
function openDetail() { detailOpen.value = true; }
const gallery = computed(() =>
  props.product.gallery && props.product.gallery.length > 0
    ? props.product.gallery
    : [props.product.image],
);
```

**Atualizar imports do `<script setup>`:**

```ts
import { computed, ref } from 'vue';
import {
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Images,
  Camera,
  Wrench,
} from 'lucide-vue-next';
import type { Product } from '../types';
import { openProductWhatsApp } from '../utils/whatsapp';
import WhatsAppIcon from './icons/WhatsAppIcon.vue';
import ProductDetailModal from './ProductDetailModal.vue';
```

### 5b. Atualizar template — adicionar badges e chips

**Linha 159-160:** trocar `@click="openGallery(0)"` por `@click="openDetail"`.

**Linha 188-193 (badge promocional no canto superior direito):** envolver com wrapper que empilha o "Teste no local" abaixo:

```html
<div class="absolute top-3 right-3 flex flex-col items-end gap-1.5">
  <span v-if="product.badge" class="bg-fire text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
    {{ product.badge }}
  </span>
  <span
    v-if="product.testAvailable !== false"
    class="inline-flex items-center gap-1 bg-coal/70 text-ice px-2.5 py-1 rounded-full text-[10px] font-semibold border border-ice/20 backdrop-blur badge-test-pulse"
  >
    <Wrench class="w-3 h-3" />
    Teste no local
  </span>
</div>
```

**Linha 195-208 (badges inferiores: condition + contador de fotos):** adicionar badge "Foto real" no início:

```html
<div class="absolute bottom-3 left-3 flex flex-wrap gap-2">
  <span
    v-if="product.hasRealPhotos"
    class="inline-flex items-center gap-1 bg-coal/90 backdrop-blur text-green-300 px-2 py-1 rounded text-[11px] font-semibold border border-green-500/40"
  >
    <Camera class="w-3 h-3" />
    Foto real
  </span>
  <span
    class="bg-coal/90 backdrop-blur text-ice px-2 py-1 rounded text-[11px] font-semibold border border-cheese/20"
  >
    {{ product.condition }}
  </span>
  <span
    v-if="gallery.length > 1"
    class="inline-flex items-center gap-1 bg-coal/90 backdrop-blur text-white px-2 py-1 rounded text-[11px] font-semibold border border-cheese/30"
  >
    <Images class="w-3 h-3" />
    {{ gallery.length }} fotos
  </span>
</div>
```

### 5c. Adicionar chips de specs entre features e price

Após o bloco `<ul>` de features (linha 229), antes do bloco de preço (linha 231):

```html
<div v-if="product.specs" class="flex flex-wrap gap-1.5">
  <span
    v-if="product.specs.voltage"
    class="bg-white/5 border border-cheese/15 rounded px-2 py-1 text-[11px] text-ice/85"
  >
    {{ product.specs.voltage }}
  </span>
  <span
    v-if="product.specs.capacity"
    class="bg-white/5 border border-cheese/15 rounded px-2 py-1 text-[11px] text-ice/85"
  >
    {{ product.specs.capacity }}
  </span>
  <span
    v-if="product.specs.dimensions"
    class="bg-white/5 border border-cheese/15 rounded px-2 py-1 text-[11px] text-ice/85"
  >
    {{ product.specs.dimensions }}
  </span>
</div>
```

### 5d. Alterar sublabel do CTA Negociar

**Linha 281:** trocar `<span class="card-cta__subtitle">via WhatsApp</span>` por `<span class="card-cta__subtitle">ver e negociar</span>`.

### 5e. Substituir modal inline por componente

**Apagar todo o bloco `<Teleport to="body">...</Teleport>` (linhas 287-380).**

**Adicionar no lugar:**

```html
<ProductDetailModal
  :product="product"
  :open="detailOpen"
  @close="detailOpen = false"
  @add-to-list="$emit('addToList', $event)"
/>
```

### 5f. Mover classes `.card-cta*` pro `src/index.css`

Cortar todo o bloco `.card-cta { ... }` até `@media (prefers-reduced-motion: reduce) { .card-cta, .card-cta__icon, ... }` (linhas ~448-635) do `<style scoped>` do ProductCard.

Colar em [src/index.css](../../../src/index.css) **ao final do arquivo**, removendo o atributo `scoped` (CSS global).

### 5g. Remover do `<style scoped>` o que sobrou

Manter apenas:

```css
.product-thumb-bg { /* mantém como está */ }
.product-thumb-fg { /* mantém como está */ }

/* Pulse do badge "Teste no local" */
.badge-test-pulse {
  animation: badge-test-pulse 3s ease-in-out infinite;
  will-change: transform;
}
@keyframes badge-test-pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.02); }
}
@media (prefers-reduced-motion: reduce) {
  .badge-test-pulse { animation: none; }
}
```

(Os estilos do carrossel `.carousel-backdrop`, `.carousel-stage`, `.carousel-item` foram movidos pro `ProductDetailModal.vue` na Task 4.)

**Verificação:**
- Card renderiza com fotos, badges (status, teste, foto real, condition), chips de specs, CTAs corretos
- Clique no card abre o modal extraído
- Esc / clique no backdrop / botão X fecham o modal
- Tamanho do arquivo: de 635 → ~280 linhas
- `npx tsc --noEmit` sem erros

---

## Task 6 — Dividir `TrustNotices.vue` em `TestimonialsSection` + `TransparencySection`

### 6a. Criar `TestimonialsSection.vue`

**Arquivo:** [src/components/TestimonialsSection.vue](../../../src/components/TestimonialsSection.vue) (novo)

```vue
<script setup lang="ts">
import { Quote } from 'lucide-vue-next';
import type { Testimonial } from '../types';

defineProps<{ testimonials: Testimonial[] }>();
</script>

<template>
  <section id="depoimentos" class="bg-coal py-20">
    <div class="max-w-7xl mx-auto px-4">
      <header class="text-center mb-12">
        <div class="inline-flex items-center gap-2 bg-cheese/10 border border-cheese/30 px-4 py-2 rounded-full mb-4">
          <Quote class="w-4 h-4 text-cheese" />
          <span class="text-white font-semibold text-sm uppercase tracking-wide">
            Quem já comprou
          </span>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-ice font-heading mb-3">
          Depoimentos <span class="text-cheese">reais</span>
        </h2>
        <p class="text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
          Clientes que vieram, testaram e levaram.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <article
          v-for="t in testimonials.slice(0, 3)"
          :key="t.id"
          class="surface-card p-6 transition-all hover:-translate-y-1 hover:border-cheese/35"
        >
          <Quote class="w-6 h-6 text-cheese mb-4" />
          <p class="text-white text-base leading-relaxed mb-4">"{{ t.text }}"</p>
          <div class="pt-4 border-t border-cheese/10">
            <div class="text-xs font-semibold text-cheese uppercase">{{ t.author }}</div>
            <div v-if="t.role" class="text-xs text-ice/50 mt-1">{{ t.role }}</div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
```

### 6b. Criar `TransparencySection.vue`

**Arquivo:** [src/components/TransparencySection.vue](../../../src/components/TransparencySection.vue) (novo)

```vue
<script setup lang="ts">
import { PackageCheck, BadgePercent, MapPin, MessageSquare } from 'lucide-vue-next';

const notes = [
  { icon: PackageCheck, title: 'Estoque rotativo',         body: 'Confirmamos disponibilidade no momento do contato.' },
  { icon: BadgePercent, title: 'Preço aberto e negociável', body: 'Trabalhamos com transparência de valor.' },
  { icon: MapPin,       title: 'Retirada agendada',         body: 'Horário marcado em Araçatuba/SP.' },
  { icon: MessageSquare, title: 'Reserva pelo WhatsApp',    body: 'Reservas confirmadas via mensagem.' },
];
</script>

<template>
  <section class="bg-burger-dark py-14 border-t border-cheese/10">
    <div class="max-w-5xl mx-auto px-4">
      <h2 class="text-sm font-semibold text-white/65 uppercase tracking-wide text-center mb-6">
        Como trabalhamos
      </h2>
      <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <li
          v-for="(note, idx) in notes"
          :key="idx"
          class="surface-card p-4 flex items-start gap-3"
        >
          <component :is="note.icon" class="w-5 h-5 text-cheese shrink-0 mt-0.5" />
          <div class="leading-snug">
            <p class="font-semibold text-ice text-sm">{{ note.title }}</p>
            <p class="text-white/70 text-xs mt-0.5">{{ note.body }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
```

**Verificação:**
- Ambos compilam isolados
- TrustNotices.vue **ainda não deletar** (será na Task 9 quando App.vue trocar o import)

---

## Task 7 — Reescrever `HeroSection.vue`

**Arquivo:** [src/components/HeroSection.vue](../../../src/components/HeroSection.vue) (substitui inteiro)

**Conteúdo completo (substituição total do arquivo):**

```vue
<script setup lang="ts">
import { computed } from 'vue';
import { ArrowDown, Camera, Wrench, Handshake, MapPin } from 'lucide-vue-next';
import WhatsAppButton from './WhatsAppButton.vue';
import { products } from '../data/products';

defineEmits<{
  (e: 'viewCatalog'): void;
  (e: 'whatsapp'): void;
}>();

const trustPoints = [
  { icon: Camera,    title: 'Fotos reais',       subline: 'cada item fotografado por nós' },
  { icon: Wrench,    title: 'Teste presencial',  subline: 'ligado, em Araçatuba' },
  { icon: Handshake, title: 'Negocie direto',    subline: 'sem atravessador, valor justo' },
];

// Mosaico: produtos com fotos reais. Fallback se < 3 disponíveis.
const realPhotoProducts = computed(() =>
  products.filter((p) => p.hasRealPhotos).slice(0, 4),
);
const showMosaic = computed(() => realPhotoProducts.value.length >= 3);
</script>

<template>
  <section
    id="inicio"
    class="min-h-screen bg-gradient-to-b from-coal via-burger-dark to-coal pt-20 relative overflow-hidden"
  >
    <div class="max-w-7xl mx-auto px-4 py-16 md:py-20 relative z-10">
      <div
        :class="[
          'grid gap-10 md:gap-12 items-center',
          showMosaic ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-3xl mx-auto text-center',
        ]"
      >
        <div class="space-y-6 animate-slide-up">
          <div class="inline-flex items-center gap-2 bg-cheese/10 border border-cheese/30 px-4 py-2 rounded-full">
            <MapPin class="w-4 h-4 text-cheese" />
            <span class="text-white font-semibold text-sm">
              Araçatuba/SP · Equipamentos seminovos
            </span>
          </div>

          <h1 class="text-4xl md:text-6xl font-bold text-ice leading-[1.05] font-heading">
            Veja, teste, leve.
            <br />
            <span class="text-cheese">Sem surpresa.</span>
          </h1>

          <p class="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto md:mx-0">
            Catálogo de equipamentos seminovos com <strong class="text-white">fotos reais</strong>
            de cada item. Venha até Araçatuba ver o equipamento ligado, em operação, antes
            de fechar negócio.
          </p>

          <ul
            :class="[
              'grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2',
              !showMosaic ? 'max-w-2xl mx-auto' : '',
            ]"
          >
            <li
              v-for="(point, idx) in trustPoints"
              :key="idx"
              class="flex items-start gap-2.5 bg-burger-dark/70 border border-white/10 rounded-lg px-3.5 py-3"
            >
              <component :is="point.icon" class="w-5 h-5 text-cheese shrink-0 mt-0.5" />
              <div class="leading-tight text-left">
                <p class="text-white text-sm font-bold">{{ point.title }}</p>
                <p class="text-white/70 text-[11px] mt-0.5">{{ point.subline }}</p>
              </div>
            </li>
          </ul>

          <div
            :class="[
              'flex flex-col sm:flex-row gap-3 pt-4',
              !showMosaic ? 'justify-center' : '',
            ]"
          >
            <WhatsAppButton
              size="md"
              label="Falar com vendedor"
              subtitle="resposta rápida"
              @click="$emit('whatsapp')"
            />
            <button
              @click="$emit('viewCatalog')"
              class="btn-secondary"
            >
              Ver equipamentos →
            </button>
          </div>
        </div>

        <div v-if="showMosaic" class="relative animate-slide-up">
          <div class="grid grid-cols-2 gap-3 relative">
            <img
              v-for="(p, idx) in realPhotoProducts"
              :key="p.id"
              :src="p.image"
              :alt="`Foto real: ${p.name}`"
              loading="lazy"
              decoding="async"
              :class="[
                'rounded-xl shadow-2xl object-cover border border-cheese/15 aspect-square hover:scale-[1.02] transition-transform duration-500',
                idx === 0 || idx === 3 ? 'translate-y-3' : '',
              ]"
            />
          </div>
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-coal/95 border border-cheese/30 rounded-full px-4 py-2 shadow-lg backdrop-blur">
            <p class="text-xs text-white/85 font-semibold">
              📷 Fotos reais do estoque atual
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-14">
        <ArrowDown class="w-5 h-5 text-cheese/70 animate-bounce" />
      </div>
    </div>
  </section>
</template>
```

**Notas:**
- Mosaico responsivo: se mobile e <3 fotos reais, layout cai pra single-column centralizado
- Removidos: Unsplash, badges decorativos "12+ itens" e "VENDA RÁPIDA", os 4 selos antigos
- Amplitude do `animate-bounce` reduzida implicitamente pela cor/tamanho menor

**Verificação:**
- Hero renderiza com mosaico se houver ≥ 3 produtos com `hasRealPhotos`, ou texto-only caso contrário
- DevTools Network: nenhuma request pra `images.unsplash.com`
- Mobile: layout em 1 coluna, CTAs empilhados

---

## Task 8 — `AppHeader.vue`: logo flip só no hover

**Arquivo:** [src/components/AppHeader.vue](../../../src/components/AppHeader.vue)

### 8a. Localizar o span com o logo (linha 33)

Substituir:
```html
<span class="og-logo-flip">
```
por:
```html
<span class="og-logo-flip-hover">
```

### 8b. Atualizar CSS em [src/index.css](../../../src/index.css)

Localizar o bloco `.og-logo-link { ... }` ... `@keyframes ogLogoFlip { ... }` (adicionado em rodada anterior).

Substituir todo o bloco por:

```css
.og-logo-link {
  perspective: 1000px !important;
  display: inline-flex !important;
}
.og-logo-flip-hover {
  display: inline-block !important;
  transform-style: preserve-3d !important;
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
.og-logo-link:hover .og-logo-flip-hover,
.og-logo-link:focus-visible .og-logo-flip-hover {
  transform: rotateY(360deg);
}
@media (prefers-reduced-motion: reduce) {
  .og-logo-flip-hover { transition: none; }
  .og-logo-link:hover .og-logo-flip-hover { transform: none; }
}
```

Remover `animate-flip-y` do bloco `animation` e `keyframes` em [tailwind.config.js](../../../tailwind.config.js) se não estiver sendo usado em outro lugar.

### 8c. Repetir no `AppFooter.vue`

Mesma troca de classe `.og-logo-flip` → `.og-logo-flip-hover` em [AppFooter.vue:22](../../../src/components/AppFooter.vue#L22).

**Verificação:**
- Logo no header e footer não gira sozinho. Passou o mouse, gira 360° uma vez. Tirou, volta neutro.
- `prefers-reduced-motion`: nada gira.

---

## Task 9 — Wiring no `App.vue` + deletar `TrustNotices.vue`

**Arquivo:** [src/App.vue](../../../src/App.vue)

### 9a. Atualizar imports (script setup, linhas 3-13)

```ts
import AppHeader from './components/AppHeader.vue';
import ScrollProgress from './components/ScrollProgress.vue';
import TrustBand from './components/TrustBand.vue';
import HeroSection from './components/HeroSection.vue';
import CategoryFilter from './components/CategoryFilter.vue';
import HowItWorks from './components/HowItWorks.vue';
import CatalogSection from './components/CatalogSection.vue';
import PromotionsSection from './components/PromotionsSection.vue';
import TestimonialsSection from './components/TestimonialsSection.vue';
import AboutSection from './components/AboutSection.vue';
import TransparencySection from './components/TransparencySection.vue';
import CartModal from './components/CartModal.vue';
import AppFooter from './components/AppFooter.vue';
import WhatsAppFab from './components/WhatsAppFab.vue';
import WhatsAppButton from './components/WhatsAppButton.vue';
```

Remover: `import TrustNotices from './components/TrustNotices.vue';`

### 9b. Atualizar template

Substituir o bloco entre `<AppHeader />` e `</main>` por:

```html
<AppHeader
  :cart-item-count="count"
  @cart-click="cartOpen = true"
  @whatsapp-click="openGeneralWhatsApp"
/>

<TrustBand />

<main>
  <HeroSection
    @view-catalog="scrollTo('equipamentos')"
    @whatsapp="openGeneralWhatsApp"
  />

  <section
    class="sticky top-[68px] z-20 bg-coal/95 backdrop-blur-md border-b border-cheese/10 py-3"
  >
    <CategoryFilter
      :categories="categories"
      :active-category="activeCategory"
      :counts="categoryCounts"
      @change="handleCategoryChange"
    />
  </section>

  <HowItWorks @whatsapp="openGeneralWhatsApp" />

  <CatalogSection
    :products="products"
    :active-category="activeCategory"
    @add-to-list="handleAddToList"
  />

  <PromotionsSection
    :promotions="promotions"
    @whatsapp-package="openPackageWhatsApp"
  />

  <TestimonialsSection :testimonials="testimonials" />

  <AboutSection />

  <section
    id="contato"
    class="py-24 bg-gradient-to-br from-coal via-burger-dark to-coal text-center px-4"
  >
    <h2 class="text-3xl md:text-5xl font-bold text-ice font-heading mb-4">
      Equipamentos comerciais com
      <span class="text-white">preço de oportunidade</span>
    </h2>
    <p class="text-lg text-white max-w-2xl mx-auto mb-8 leading-relaxed">
      Fale agora pelo WhatsApp, consulte disponibilidade e negocie direto com o vendedor.
    </p>
    <WhatsAppButton
      size="lg"
      label="Negociar agora"
      subtitle="Resposta rápida no WhatsApp"
      @click="openGeneralWhatsApp"
    />
  </section>

  <TransparencySection />

  <AppFooter />
</main>
```

### 9c. Deletar `TrustNotices.vue`

```powershell
Remove-Item "src\components\TrustNotices.vue"
```

**Verificação:**
- `npm run dev` sobe sem erros de import
- Página renderiza: Header → TrustBand → Hero → Filter → HowItWorks → Catalog → Promotions → Testimonials → About → CTA → Transparency → Footer
- Grep no projeto confirma: 0 referências a `TrustNotices` em todo o `src/`

---

## Task 10 — Verificação final

### 10a. Type-check

```powershell
npx vue-tsc --noEmit
```
Espera: zero erros.

### 10b. Build de produção

```powershell
npm run build
```
Espera: sucesso, sem warnings novos.

### 10c. Checklist visual no localhost (`npm run dev`)

Marcar cada item:

- [ ] **Hero** sem foto Unsplash; mosaico com fotos reais OU layout texto-only
- [ ] **TrustBand** visível logo abaixo do Header em todas as larguras
- [ ] **HowItWorks** aparece após o filtro sticky, com 3 passos animados em cascata
- [ ] **ProductCard** mostra:
  - Badge "📷 Foto real" em produtos com `hasRealPhotos: true`
  - Badge "🔧 Teste no local" em produtos com `testAvailable` undefined ou true
  - Badge ausente em produtos com `testAvailable: false`
  - Chips de specs em produtos com `specs` preenchido
  - CTA "Negociar" com sublabel "ver e negociar"
- [ ] **Modal de detalhe** abre ao clicar no card, mostra ficha técnica, descrição, CTAs duplicados, linha "Disponível pra teste presencial"
- [ ] **TestimonialsSection** visível após Promotions, sem misturar com avisos
- [ ] **TransparencySection** visível antes do Footer, em tom afirmativo
- [ ] **Logo** no header e footer gira só no hover, não em loop
- [ ] **Badge "Teste no local"** pulsa sutilmente (apenas 1.02x)

### 10d. Acessibilidade — reduce motion

- DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`
- Recarregar: stagger TrustBand instantâneo, cascata HowItWorks instantânea, pulse do badge parado, logo sem flip no hover.

### 10e. Mobile

- DevTools → Toggle device (iPhone SE / Pixel 5)
- Verificar:
  - TrustBand vira scroll horizontal (não stack)
  - HowItWorks empilha vertical com conector lateral
  - Hero em 1 coluna; mosaico (se houver) em grid 2x2 compacto

### 10f. Grep de regressão

```powershell
Select-String -Path "src\**\*.vue","src\**\*.ts" -Pattern "TrustNotices|Unsplash|unsplash"
```
Espera: zero matches em código (matches em comentários ou docs são OK).

---

## Pós-implementação

Após a Task 10 passar, **commitar tudo em um único commit** com mensagem:

```
feat: Fase 1 — Trust & Conversion (hero, badges, modal, transparência)

Implementa o spec docs/superpowers/specs/2026-05-16-oportunidade-hamburgueria-fase1-confianca-design.md:
- Hero reescrito sem foto stock, mosaico de fotos reais com fallback
- TrustBand persistente abaixo do Header
- HowItWorks com 3 passos (Escolhe → Testa → Leva)
- ProductCard com badges "Foto real" e "Teste no local" + chips de specs
- ProductDetailModal extraído com ficha técnica
- TrustNotices dividido em TestimonialsSection + TransparencySection
- Logo flip apenas no hover (sem loop contínuo)
- +3 campos opcionais em Product: hasRealPhotos, testAvailable, specs

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

---

## Pontos de atenção durante implementação

1. **Sem reescrever lógica do carrossel 3D:** mover, não reescrever. Cada função (`itemStyle`, `relativeOffset`, `onPointerDown`, etc.) vai pro modal exatamente como está hoje.

2. **`card-cta` no global:** o ProductDetailModal depende disso. **Validar essa migração antes de tocar no ProductCard** — abra um produto e confirme que os botões do modal estão estilizados antes de prosseguir.

3. **Produtos sem `hasRealPhotos`:** o Hero pode ficar em texto-only no primeiro deploy se você ainda não marcou nenhum produto com esse campo. Isso é **intencional** — melhor do que voltar pra Unsplash.

4. **Ordem de tasks importa:** Task 5 depende de Task 4. Task 9 depende de 2, 3, 6, 7, 8. Não pule a sequência.

5. **Não criar arquivos novos além dos especificados.** Se durante a implementação algo parecer pedir um helper ou tipo extra, **pare e questione** se de fato é necessário pra Fase 1.
