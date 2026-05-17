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
    cls: 'bg-green-500/20 text-green-400 border-green-500/40',
  },
  reservado: {
    label: 'Reservado',
    icon: Clock,
    cls: 'bg-cheese/20 text-cheese border-cheese/40',
  },
  vendido: {
    label: 'Vendido',
    icon: XCircle,
    cls: 'bg-ketchup/20 text-ketchup border-ketchup/40',
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
  <div
    :class="[
      'surface-card overflow-hidden group hover:-translate-y-1 duration-300 hover:border-cheese/25',
      isUnavailable ? 'opacity-70' : '',
    ]"
  >
    <div
      class="relative overflow-hidden aspect-square cursor-zoom-in product-thumb-bg"
      @click="openDetail"
    >
      <img
        :src="product.image"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-55 saturate-125"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-coal/40 via-coal/10 to-coal/70"></div>
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
        decoding="async"
        class="relative w-full h-full object-contain p-2 group-hover:scale-[1.04] transition-transform duration-500 product-thumb-fg"
      />

      <div
        :class="[
          'absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur',
          status.cls,
        ]"
      >
        <component :is="status.icon" class="w-3.5 h-3.5" />
        {{ status.label }}
      </div>

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
    </div>

    <div class="p-6 space-y-4">
      <h3 class="text-lg font-bold text-ice font-heading line-clamp-2">
        {{ product.name }}
      </h3>

      <p class="text-base text-white line-clamp-2 leading-relaxed">
        {{ product.description }}
      </p>

      <ul class="space-y-2">
        <li
          v-for="(feature, idx) in product.features.slice(0, 3)"
          :key="idx"
          class="text-sm text-ice/85 flex items-start gap-2 leading-snug"
        >
          <span class="text-white mt-0.5">•</span>
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

      <div
        v-if="hasPriceRange"
        class="pt-1 p-3 rounded-lg border border-cheese/25 bg-cheese/[0.06]"
      >
        <p class="text-[11px] text-ice/70 uppercase tracking-wide font-semibold mb-1">
          Faixa de preço
        </p>
        <div class="text-2xl font-bold text-cheese font-heading leading-tight">
          {{ priceText }}
        </div>
        <p class="text-[11px] text-ice/55 mt-1">Negociável conforme condição</p>
      </div>

      <div v-else class="flex items-end justify-between pt-1">
        <div>
          <div class="text-sm text-white uppercase tracking-wide">Valor</div>
          <div class="text-2xl font-bold text-cheese font-heading">{{ priceText }}</div>
        </div>
        <div v-if="product.originalPrice" class="text-sm text-ice/50 line-through">
          R$ {{ product.originalPrice.toFixed(2).replace('.', ',') }}
        </div>
      </div>

      <div class="grid grid-cols-[0.85fr_1.25fr] gap-2.5 pt-3">
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
.product-thumb-bg {
  background:
    radial-gradient(circle at 50% 35%, rgba(255, 214, 10, 0.06) 0%, transparent 60%),
    linear-gradient(180deg, #161616 0%, #0b0b0b 100%);
}

.product-thumb-fg {
  filter: drop-shadow(0 14px 18px rgba(0, 0, 0, 0.55))
    drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4));
}

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
</style>
