<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import {
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Images,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next';
import type { Product } from '../types';
import { openProductWhatsApp } from '../utils/whatsapp';
import WhatsAppIcon from './icons/WhatsAppIcon.vue';

const props = defineProps<{ product: Product }>();
defineEmits<{ (e: 'addToList', product: Product): void }>();

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
    props.product.maxPrice > 0,
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

const galleryOpen = ref(false);
const activeIdx = ref(0);

function openGallery(idx = 0) {
  activeIdx.value = idx;
  galleryOpen.value = true;
}
function close() {
  galleryOpen.value = false;
}
function next() {
  activeIdx.value = (activeIdx.value + 1) % gallery.value.length;
}
function prev() {
  activeIdx.value = (activeIdx.value - 1 + gallery.value.length) % gallery.value.length;
}

// Cyclic offset relative to active, so left/right slots wrap around
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

  // Hide far items entirely
  if (abs > 3) {
    return {
      transform: `translateX(${offset > 0 ? 350 : -350}px) rotateY(${offset > 0 ? -55 : 55}deg) translateZ(-500px) scale(0.4)`,
      opacity: 0,
      pointerEvents: 'none' as const,
      zIndex: 0,
    };
  }

  const translateX = offset * 38; // %
  const translateZ = -Math.min(abs, 3) * 140; // px backwards
  const rotateY = offset === 0 ? 0 : offset > 0 ? -38 : 38; // tilt sides
  const scale = 1 - abs * 0.08;
  const opacity = abs === 0 ? 1 : abs === 1 ? 0.85 : abs === 2 ? 0.45 : 0.18;

  return {
    transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity,
    zIndex: 100 - abs,
  };
}

// Drag / swipe support
const dragStartX = ref<number | null>(null);
function onPointerDown(e: PointerEvent) {
  dragStartX.value = e.clientX;
}
function onPointerUp(e: PointerEvent) {
  if (dragStartX.value === null) return;
  const dx = e.clientX - dragStartX.value;
  if (Math.abs(dx) > 50) {
    dx > 0 ? prev() : next();
  }
  dragStartX.value = null;
}

// Keyboard nav
function onKey(e: KeyboardEvent) {
  if (!galleryOpen.value) return;
  if (e.key === 'ArrowRight') next();
  else if (e.key === 'ArrowLeft') prev();
  else if (e.key === 'Escape') close();
}

onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));

// Lock body scroll while open
watch(galleryOpen, (open) => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = open ? 'hidden' : '';
});
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
      @click="openGallery(0)"
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

      <div v-if="product.badge" class="absolute top-3 right-3">
        <span class="bg-fire text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          {{ product.badge }}
        </span>
      </div>

      <div class="absolute bottom-3 left-3 flex gap-2">
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
          @click="$emit('addToList', product)"
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
            <span class="card-cta__subtitle">via WhatsApp</span>
          </span>
        </button>
      </div>
    </div>
  </div>

  <!-- Carousel 3D Modal -->
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
        v-if="galleryOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center carousel-backdrop"
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
          <p class="text-white font-heading font-bold text-sm md:text-base leading-tight">
            {{ product.name }}
          </p>
          <p class="text-cheese/80 text-xs">{{ activeIdx + 1 }} de {{ gallery.length }}</p>
        </div>

        <button
          v-if="gallery.length > 1"
          @click="prev"
          class="absolute left-3 md:left-8 z-[110] text-white hover:text-cheese transition-all p-3 md:p-4 bg-coal/80 hover:bg-coal/95 rounded-full backdrop-blur ring-1 ring-white/10 hover:scale-110"
          aria-label="Anterior"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>

        <button
          v-if="gallery.length > 1"
          @click="next"
          class="absolute right-3 md:right-8 z-[110] text-white hover:text-cheese transition-all p-3 md:p-4 bg-coal/80 hover:bg-coal/95 rounded-full backdrop-blur ring-1 ring-white/10 hover:scale-110"
          aria-label="Próxima"
        >
          <ChevronRight class="w-6 h-6" />
        </button>

        <!-- 3D Stage -->
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
            <div
              v-if="idx !== activeIdx"
              class="absolute inset-0 bg-coal/40 transition-opacity"
            ></div>
          </div>
        </div>

        <!-- Dots indicator -->
        <div
          v-if="gallery.length > 1"
          class="absolute bottom-6 left-1/2 -translate-x-1/2 z-[110] flex gap-2 bg-coal/80 backdrop-blur rounded-full px-4 py-2.5 ring-1 ring-white/10"
        >
          <button
            v-for="(_, idx) in gallery"
            :key="idx"
            @click="activeIdx = idx"
            :class="[
              'h-2 rounded-full transition-all',
              idx === activeIdx ? 'bg-cheese w-6' : 'bg-white/30 hover:bg-white/60 w-2',
            ]"
            :aria-label="`Ir para foto ${idx + 1}`"
          ></button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.carousel-backdrop {
  background: radial-gradient(ellipse at center, rgba(20, 20, 20, 0.85) 0%, rgba(0, 0, 0, 0.97) 100%);
  backdrop-filter: blur(8px);
}

.carousel-stage {
  position: relative;
  width: min(90vw, 800px);
  height: min(70vh, 560px);
  perspective: 1600px;
  perspective-origin: center center;
  transform-style: preserve-3d;
  cursor: grab;
}

.carousel-stage:active {
  cursor: grabbing;
}

.carousel-item {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
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

.product-thumb-bg {
  background:
    radial-gradient(circle at 50% 35%, rgba(255, 214, 10, 0.06) 0%, transparent 60%),
    linear-gradient(180deg, #161616 0%, #0b0b0b 100%);
}

.product-thumb-fg {
  filter: drop-shadow(0 14px 18px rgba(0, 0, 0, 0.55))
    drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4));
}

@media (prefers-reduced-motion: reduce) {
  .carousel-item {
    transition: none;
  }
}

/* Card CTAs */
.card-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.6rem 0.85rem;
  min-height: 52px;
  border-radius: 10px;
  font-weight: 700;
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.card-cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.card-cta:focus-visible {
  outline: 2px solid #ffd60a;
  outline-offset: 2px;
}

.card-cta__labels {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.05;
  text-align: left;
}

.card-cta__title {
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.card-cta__subtitle {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-top: 2px;
}

.card-cta__icon {
  transition: transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.card-cta:hover .card-cta__icon {
  transform: translateX(2px) scale(1.08);
}

.card-cta:active {
  transform: scale(0.97);
}

/* Secondary */
.card-cta--secondary {
  background: rgba(255, 255, 255, 0.04);
  color: #f4efe5;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.card-cta--secondary:hover {
  background: rgba(214, 168, 79, 0.08);
  border-color: rgba(214, 168, 79, 0.45);
  color: #fff;
}

.card-cta--secondary .card-cta__subtitle {
  color: #d6a84f;
  opacity: 0.85;
}

/* Primary (WhatsApp) */
.card-cta--primary {
  background: linear-gradient(135deg, #25d366 0%, #1ebe5b 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 10px 22px -10px rgba(37, 211, 102, 0.85),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.18);
}

.card-cta--primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.28) 0%, transparent 35%);
  opacity: 0.7;
  z-index: -1;
  pointer-events: none;
}

.card-cta--primary::after {
  content: '';
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    100deg,
    transparent 0%,
    rgba(255, 255, 255, 0.35) 50%,
    transparent 100%
  );
  transform: skewX(-20deg);
  pointer-events: none;
  z-index: -1;
}

.card-cta--primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 16px 32px -10px rgba(37, 211, 102, 1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.card-cta--primary:hover::after {
  animation: ctaShine 0.85s ease-out;
}

@keyframes ctaShine {
  0% {
    left: -75%;
  }
  100% {
    left: 125%;
  }
}

.card-cta__icon-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.card-cta__online {
  position: absolute;
  top: -1px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: #34ff9c;
  border: 2px solid #1ebe5b;
  box-shadow: 0 0 0 0 rgba(52, 255, 156, 0.6);
  animation: ctaPulse 2s ease-out infinite;
}

@keyframes ctaPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 255, 156, 0.65);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(52, 255, 156, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 255, 156, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-cta,
  .card-cta__icon,
  .card-cta--primary::after,
  .card-cta__online {
    animation: none !important;
    transition: none !important;
  }
}
</style>

