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
        class="modal-shell carousel-backdrop"
        role="dialog"
        :aria-labelledby="titleId"
        @click.self="close"
      >
        <header class="modal-topbar" @click.stop>
          <div class="modal-topbar__title min-w-0">
            <p :id="titleId" class="text-white font-heading font-bold text-sm sm:text-base leading-tight truncate">
              {{ product.name }}
            </p>
            <p class="text-cheese/85 text-[11px] sm:text-xs font-semibold tracking-wide">
              Foto {{ activeIdx + 1 }} de {{ gallery.length }}
            </p>
          </div>
          <button
            @click="close"
            class="modal-close"
            aria-label="Fechar"
          >
            <X class="w-5 h-5" />
          </button>
        </header>

        <div class="modal-body" @click.self="close">
          <div class="modal-stage-wrap">
            <button
              v-if="gallery.length > 1"
              @click="prev"
              class="modal-arrow modal-arrow--prev"
              aria-label="Foto anterior"
            >
              <ChevronLeft class="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              v-if="gallery.length > 1"
              @click="next"
              class="modal-arrow modal-arrow--next"
              aria-label="Próxima foto"
            >
              <ChevronRight class="w-5 h-5 sm:w-6 sm:h-6" />
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
          </div>

          <div
            v-if="gallery.length > 1"
            class="modal-dots"
            role="tablist"
            aria-label="Selecionar foto"
          >
            <button
              v-for="(_, idx) in gallery"
              :key="idx"
              type="button"
              class="modal-dot"
              :class="{ 'modal-dot--active': idx === activeIdx }"
              :aria-label="`Foto ${idx + 1}`"
              :aria-selected="idx === activeIdx"
              @click="activeIdx = idx"
            />
          </div>

          <div
            class="modal-info detail-slide-up"
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
.modal-shell {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.carousel-backdrop {
  background: radial-gradient(ellipse at center, rgba(20, 20, 20, 0.92) 0%, rgba(0, 0, 0, 0.98) 100%);
  backdrop-filter: blur(8px);
}

.modal-topbar {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  padding-top: max(0.75rem, env(safe-area-inset-top));
  background: linear-gradient(180deg, rgba(11, 13, 14, 0.95) 0%, rgba(11, 13, 14, 0.72) 100%);
  border-bottom: 1px solid rgba(214, 168, 79, 0.18);
  backdrop-filter: blur(10px);
  z-index: 5;
}

@media (min-width: 640px) {
  .modal-topbar {
    padding: 1rem 1.5rem;
  }
}

.modal-topbar__title {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1 1 auto;
}

.modal-close {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(214, 168, 79, 0.3);
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
}

.modal-close:hover {
  background: rgba(214, 168, 79, 0.15);
  color: #ffd60a;
}

.modal-close:active {
  transform: scale(0.94);
}

.modal-body {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1rem 2rem;
  padding-bottom: max(2rem, env(safe-area-inset-bottom));
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

@media (min-width: 768px) {
  .modal-body {
    padding: 2rem 1.5rem 2.5rem;
    gap: 1.5rem;
  }
}

.modal-stage-wrap {
  position: relative;
  width: 100%;
  max-width: 64rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-stage {
  position: relative;
  width: min(92vw, 760px);
  height: min(50vh, 460px);
  perspective: 1600px;
  perspective-origin: center center;
  transform-style: preserve-3d;
  cursor: grab;
}

@media (min-width: 768px) {
  .carousel-stage {
    height: min(58vh, 520px);
  }
}

.modal-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  color: rgba(255, 255, 255, 0.95);
  background: rgba(11, 13, 14, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.55);
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

@media (min-width: 768px) {
  .modal-arrow {
    width: 52px;
    height: 52px;
  }
}

.modal-arrow:hover {
  color: #ffd60a;
  background: rgba(11, 13, 14, 0.95);
  transform: translateY(-50%) scale(1.06);
}

.modal-arrow:active {
  transform: translateY(-50%) scale(0.96);
}

.modal-arrow--prev {
  left: 0.5rem;
}

.modal-arrow--next {
  right: 0.5rem;
}

@media (min-width: 768px) {
  .modal-arrow--prev {
    left: 1.25rem;
  }
  .modal-arrow--next {
    right: 1.25rem;
  }
}

.modal-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  flex-wrap: wrap;
  max-width: min(92vw, 760px);
}

.modal-dot {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.25);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease, width 0.3s ease;
}

.modal-dot:hover {
  background: rgba(255, 255, 255, 0.55);
}

.modal-dot--active {
  background: #d6a84f;
  width: 22px;
}

.modal-info {
  width: 100%;
  max-width: 64rem;
  background: rgba(11, 13, 14, 0.85);
  border: 1px solid rgba(214, 168, 79, 0.2);
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .modal-info {
    padding: 2rem;
  }
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
