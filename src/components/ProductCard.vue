<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import {
  Plus,
  MessageCircle,
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
const priceText = computed(() =>
  props.product.price > 0
    ? `R$ ${props.product.price.toFixed(2).replace('.', ',')}`
    : props.product.priceLabel || 'A consultar',
);

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
      'bg-coal/80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-cheese/10 hover:-translate-y-1 duration-300',
      isUnavailable ? 'opacity-70' : '',
    ]"
  >
    <div
      class="relative overflow-hidden h-52 bg-coal cursor-zoom-in"
      @click="openGallery(0)"
    >
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
          class="inline-flex items-center gap-1 bg-coal/90 backdrop-blur text-cheese px-2 py-1 rounded text-[11px] font-semibold border border-cheese/30"
        >
          <Images class="w-3 h-3" />
          {{ gallery.length }} fotos
        </span>
      </div>
    </div>

    <div class="p-5 space-y-3">
      <h3 class="text-lg font-bold text-ice font-heading line-clamp-2">
        {{ product.name }}
      </h3>

      <p class="text-sm text-ice/70 line-clamp-2 leading-relaxed">
        {{ product.description }}
      </p>

      <ul class="space-y-1">
        <li
          v-for="(feature, idx) in product.features.slice(0, 3)"
          :key="idx"
          class="text-xs text-ice/60 flex items-start gap-1.5"
        >
          <span class="text-cheese mt-0.5">•</span>
          <span>{{ feature }}</span>
        </li>
      </ul>

      <div class="flex items-end justify-between pt-1">
        <div>
          <div class="text-xs text-ice/50 uppercase tracking-wide">Valor</div>
          <div class="text-2xl font-bold text-cheese font-heading">{{ priceText }}</div>
        </div>
        <div v-if="product.originalPrice" class="text-sm text-ice/50 line-through">
          R$ {{ product.originalPrice.toFixed(2).replace('.', ',') }}
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-2">
        <button
          @click="$emit('addToList', product)"
          :disabled="isUnavailable"
          class="bg-cheese/15 text-cheese border border-cheese/40 font-semibold py-2 rounded-lg hover:bg-cheese/25 transition-all text-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
        >
          <Plus class="w-4 h-4" />
          Tenho Interesse
        </button>
        <button
          @click="openProductWhatsApp(product)"
          :disabled="isUnavailable"
          class="bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-500 transition-all text-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
        >
          <MessageCircle class="w-4 h-4" />
          WhatsApp
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
          class="absolute top-5 right-5 text-white/80 hover:text-cheese transition-colors p-2.5 bg-coal/70 hover:bg-coal/90 rounded-full backdrop-blur z-30 ring-1 ring-white/10"
          aria-label="Fechar"
        >
          <X class="w-6 h-6" />
        </button>

        <div class="absolute top-5 left-5 z-30 bg-coal/70 backdrop-blur rounded-full px-4 py-2 ring-1 ring-cheese/30">
          <p class="text-white font-heading font-bold text-sm md:text-base leading-tight">
            {{ product.name }}
          </p>
          <p class="text-cheese/80 text-xs">{{ activeIdx + 1 }} de {{ gallery.length }}</p>
        </div>

        <button
          v-if="gallery.length > 1"
          @click="prev"
          class="absolute left-3 md:left-8 z-30 text-white hover:text-cheese transition-all p-3 md:p-4 bg-coal/70 hover:bg-coal/90 rounded-full backdrop-blur ring-1 ring-white/10 hover:scale-110"
          aria-label="Anterior"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>

        <button
          v-if="gallery.length > 1"
          @click="next"
          class="absolute right-3 md:right-8 z-30 text-white hover:text-cheese transition-all p-3 md:p-4 bg-coal/70 hover:bg-coal/90 rounded-full backdrop-blur ring-1 ring-white/10 hover:scale-110"
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
              :alt="`${product.name} — foto ${idx + 1}`"
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
          class="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 bg-coal/70 backdrop-blur rounded-full px-4 py-2.5 ring-1 ring-white/10"
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
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

@media (prefers-reduced-motion: reduce) {
  .carousel-item {
    transition: none;
  }
}
</style>
