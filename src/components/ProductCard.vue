<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus, MessageCircle, CheckCircle2, Clock, XCircle, Images, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
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

const gallery = computed(() => props.product.gallery && props.product.gallery.length > 0
  ? props.product.gallery
  : [props.product.image]);

const galleryOpen = ref(false);
const activeIdx = ref(0);

function openGallery(idx = 0) {
  activeIdx.value = idx;
  galleryOpen.value = true;
}
function next() {
  activeIdx.value = (activeIdx.value + 1) % gallery.value.length;
}
function prev() {
  activeIdx.value = (activeIdx.value - 1 + gallery.value.length) % gallery.value.length;
}
</script>

<template>
  <div
    :class="[
      'bg-coal/80 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-cheese/10 hover:-translate-y-1 duration-300',
      isUnavailable ? 'opacity-70' : '',
    ]"
  >
    <div class="relative overflow-hidden h-52 bg-coal cursor-pointer" @click="openGallery(0)">
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
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

  <!-- Gallery Modal -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="galleryOpen"
        class="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="galleryOpen = false"
      >
        <button
          @click="galleryOpen = false"
          class="absolute top-4 right-4 text-white hover:text-cheese transition-colors p-2 bg-coal/60 rounded-full"
          aria-label="Fechar"
        >
          <X class="w-6 h-6" />
        </button>

        <button
          v-if="gallery.length > 1"
          @click="prev"
          class="absolute left-4 md:left-8 text-white hover:text-cheese transition-colors p-3 bg-coal/60 rounded-full"
          aria-label="Anterior"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>

        <button
          v-if="gallery.length > 1"
          @click="next"
          class="absolute right-4 md:right-8 text-white hover:text-cheese transition-colors p-3 bg-coal/60 rounded-full"
          aria-label="Próxima"
        >
          <ChevronRight class="w-6 h-6" />
        </button>

        <div class="max-w-5xl w-full flex flex-col items-center gap-4">
          <img
            :src="gallery[activeIdx]"
            :alt="`${product.name} — foto ${activeIdx + 1}`"
            class="max-h-[75vh] w-auto rounded-xl shadow-2xl object-contain"
          />
          <div class="text-center">
            <p class="text-white font-bold font-heading">{{ product.name }}</p>
            <p class="text-white/60 text-sm">
              {{ activeIdx + 1 }} / {{ gallery.length }}
            </p>
          </div>

          <div v-if="gallery.length > 1" class="flex gap-2 flex-wrap justify-center max-w-3xl">
            <button
              v-for="(img, idx) in gallery"
              :key="idx"
              @click="activeIdx = idx"
              :class="[
                'w-14 h-14 rounded-lg overflow-hidden border-2 transition-all',
                idx === activeIdx
                  ? 'border-cheese scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100',
              ]"
            >
              <img :src="img" :alt="`thumb ${idx + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
