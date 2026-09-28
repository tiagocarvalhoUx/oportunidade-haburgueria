<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Images,
  Camera,
  Wrench,
  Sparkles,
} from 'lucide-vue-next';
import type { Product } from '../types';
import { openProductWhatsApp } from '../utils/whatsapp';
import WhatsAppIcon from './icons/WhatsAppIcon.vue';
import ProductDetailModal from './ProductDetailModal.vue';

const props = defineProps<{ product: Product }>();
const emit = defineEmits<{ (e: 'addToList', product: Product): void }>();

const STATUS_CONFIG = {
  disponivel: {
    label: 'Disponível',
    icon: CheckCircle2,
    cls: 'bg-green-500/15 text-green-400 border-green-500/30',
  },
  reservado: {
    label: 'Reservado',
    icon: Clock,
    cls: 'bg-cheese/15 text-cheese border-cheese/35',
  },
  vendido: {
    label: 'Vendido',
    icon: XCircle,
    cls: 'bg-ketchup/15 text-ketchup border-ketchup/35',
  },
} as const;

const status = computed(() => STATUS_CONFIG[props.product.status]);
const isUnavailable = computed(() => props.product.status === 'vendido');
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

const gallery = computed(() =>
  props.product.gallery && props.product.gallery.length > 0
    ? props.product.gallery
    : [props.product.image],
);

const detailOpen = ref(false);
function openDetail() { detailOpen.value = true; }
</script>

<template>
  <div :class="['product-card group', isUnavailable ? 'product-card--sold' : '']">
    <div
      class="relative overflow-hidden aspect-square cursor-zoom-in product-thumb-frame"
      @click="openDetail"
    >
      <span class="product-thumb-floor" aria-hidden="true" />

      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
        decoding="async"
        class="relative z-10 block w-full h-full object-contain p-5 sm:p-6 md:p-7 transition-transform duration-500 ease-out group-hover:scale-[1.045] product-thumb-fg"
      />

      <span class="pointer-events-none absolute inset-0 z-[15] product-thumb-vignette" aria-hidden="true" />

      <div
        :class="[
          'absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md',
          status.cls,
        ]"
      >
        <component :is="status.icon" class="w-3.5 h-3.5" />
        {{ status.label }}
      </div>

      <div v-if="product.badge" class="absolute top-3 right-3 z-20 product-ribbon">
        <Sparkles class="w-3 h-3" />
        {{ product.badge }}
      </div>
    </div>

    <div class="p-6 space-y-4">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-wide text-ice/50">
        <span v-if="product.hasRealPhotos" class="inline-flex items-center gap-1 text-green-400/90">
          <Camera class="w-3 h-3" />
          Foto real
        </span>
        <span>{{ product.condition }}</span>
        <span v-if="product.testAvailable !== false" class="inline-flex items-center gap-1 text-cheese/90">
          <Wrench class="w-3 h-3" />
          Teste no local
        </span>
        <span v-if="gallery.length > 1" class="inline-flex items-center gap-1">
          <Images class="w-3 h-3" />
          {{ gallery.length }} fotos
        </span>
      </div>

      <h3 class="text-lg font-bold text-ice font-heading line-clamp-2">
        {{ product.name }}
      </h3>

      <p class="text-base text-white/80 line-clamp-2 leading-relaxed">
        {{ product.description }}
      </p>

      <ul class="space-y-2">
        <li
          v-for="(feature, idx) in product.features.slice(0, 3)"
          :key="idx"
          class="text-sm text-ice/85 flex items-start gap-2 leading-snug"
        >
          <span class="text-cheese mt-0.5">•</span>
          <span>{{ feature }}</span>
        </li>
      </ul>

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

      <div v-if="hasPriceRange" class="price-box">
        <p class="text-[11px] text-ice/60 uppercase tracking-wide font-semibold mb-1">
          Faixa de preço
        </p>
        <div class="text-[1.7rem] leading-none font-extrabold text-cheese font-heading tabular-nums">
          {{ priceText }}
        </div>
        <p class="text-[11px] text-ice/45 mt-1.5">Negociável conforme condição</p>
      </div>

      <div v-else class="flex items-end justify-between pt-3 border-t border-white/[0.06]">
        <div>
          <div class="text-[11px] text-ice/50 uppercase tracking-wide font-semibold">Valor</div>
          <div class="text-[1.7rem] leading-tight font-extrabold text-cheese font-heading tabular-nums">
            {{ priceText }}
          </div>
        </div>
        <div v-if="product.originalPrice" class="text-sm text-ice/40 line-through">
          R$ {{ product.originalPrice.toFixed(2).replace('.', ',') }}
        </div>
      </div>

      <div class="grid grid-cols-[0.85fr_1.25fr] gap-2.5 pt-1">
        <button
          @click="emit('addToList', product)"
          :disabled="isUnavailable"
          class="card-cta card-cta--secondary"
          aria-label="Separar este item para enviar como combo"
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
          aria-label="Negociar este item agora pelo WhatsApp"
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
    </div>
  </div>

  <ProductDetailModal
    :product="product"
    :open="detailOpen"
    @close="detailOpen = false"
    @add-to-list="emit('addToList', $event)"
  />
</template>

<style scoped>
/* === Card container — elevation premium, borda sutil, glow quente no hover === */
.product-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: #1d2021;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 20px 40px -26px rgba(0, 0, 0, 0.65);
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: rgba(214, 168, 79, 0.32);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 30px 56px -24px rgba(0, 0, 0, 0.7),
    0 18px 36px -22px rgba(214, 168, 79, 0.28);
}

.product-card--sold {
  opacity: 0.72;
}

/* === Vitrine da foto — fundo "estúdio" único (sem duplicar a imagem borrada) === */
.product-thumb-frame {
  background:
    radial-gradient(120% 80% at 50% 0%, rgba(214, 168, 79, 0.1) 0%, transparent 60%),
    linear-gradient(180deg, #1c1c1c 0%, #101010 100%);
}

.product-thumb-fg {
  filter: drop-shadow(0 18px 20px rgba(0, 0, 0, 0.5)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

/* Sombra de "piso" sob o produto — dá profundidade mesmo em fotos retrato/paisagem extremas */
.product-thumb-floor {
  position: absolute;
  left: 50%;
  bottom: 9%;
  width: 56%;
  height: 10%;
  transform: translateX(-50%);
  background: radial-gradient(closest-side, rgba(0, 0, 0, 0.5), transparent 75%);
  filter: blur(3px);
  z-index: 1;
  pointer-events: none;
}

/* Vinheta interna sutil — unifica o enquadramento e separa do conteúdo abaixo */
.product-thumb-vignette {
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.04),
    inset 0 -46px 54px -34px rgba(0, 0, 0, 0.55);
}

/* Selo de destaque (DESTAQUE / NEGOCIÁVEL) — chip dourado premium */
.product-ribbon {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.65rem;
  border-radius: 9999px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #241c05;
  background: linear-gradient(135deg, #ffe8a3 0%, #d6a84f 55%, #b9812f 100%);
  box-shadow:
    0 8px 18px -6px rgba(214, 168, 79, 0.65),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

/* Bloco de preço — leve realce dourado, sem competir com o CTA */
.price-box {
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(214, 168, 79, 0.25);
  background: linear-gradient(180deg, rgba(214, 168, 79, 0.09) 0%, rgba(214, 168, 79, 0.02) 100%);
}

@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-thumb-fg {
    transition: none !important;
  }
}
</style>
