<script setup lang="ts">
import { ref } from 'vue';
import { Menu, X, ListChecks } from 'lucide-vue-next';
import WhatsAppButton from './WhatsAppButton.vue';

defineProps<{ cartItemCount: number }>();
const emit = defineEmits<{
  (e: 'cartClick'): void;
  (e: 'whatsappClick'): void;
}>();

const isOpen = ref(false);
const NAV = [
  { id: 'inicio', label: 'Início' },
  { id: 'equipamentos', label: 'Equipamentos' },
  { id: 'promocoes', label: 'Promoções' },
  { id: 'como-comprar', label: 'Como comprar' },
  { id: 'contato', label: 'Contato' },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  isOpen.value = false;
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 bg-coal/95 backdrop-blur text-ice shadow-lg z-40 border-b border-cheese/10"
  >
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <a
        href="#inicio"
        class="og-logo-link flex items-center gap-3"
        aria-label="Oportunidade Hamburgueria"
      >
        <span class="og-logo-flip">
          <img
            src="/logo.png"
            alt="Oportunidade Hamburgueria"
            class="h-12 md:h-14 w-auto object-contain drop-shadow"
            width="56"
            height="56"
            decoding="async"
          />
        </span>
        <div class="hidden sm:block">
          <h1 class="text-base md:text-lg font-bold text-ice font-heading leading-tight">
            Oportunidade Hamburgueria
          </h1>
          <p class="text-[10px] md:text-[11px] text-white/85 tracking-wide">
            Equipamentos profissionais · Seminovos
          </p>
        </div>
      </a>

      <nav class="hidden md:flex items-center gap-7">
        <button
          v-for="item in NAV"
          :key="item.id"
          @click="scrollTo(item.id)"
          class="text-ice/80 hover:text-white transition-colors font-medium text-sm"
        >
          {{ item.label }}
        </button>
      </nav>

      <div class="flex items-center gap-2 md:gap-3">
        <button
          @click="emit('cartClick')"
          aria-label="Lista de interesse"
          class="relative p-2 hover:bg-burger-dark rounded-lg transition-all hover:scale-105"
        >
          <ListChecks class="w-6 h-6 text-ice" />
          <span
            v-if="cartItemCount > 0"
            class="absolute -top-1 -right-1 bg-cheese text-burger-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ cartItemCount }}
          </span>
        </button>

        <WhatsAppButton
          size="sm"
          label="Negociar"
          subtitle="WhatsApp"
          class="hidden md:inline-flex"
          @click="emit('whatsappClick')"
        />

        <button
          @click="isOpen = !isOpen"
          class="md:hidden p-2 hover:bg-burger-dark rounded-lg transition-colors"
          aria-label="Abrir menu"
        >
          <component :is="isOpen ? X : Menu" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="md:hidden bg-coal/95 backdrop-blur border-t border-cheese/10"
      >
        <div class="px-4 py-4 space-y-3">
          <button
            v-for="item in NAV"
            :key="item.id"
            @click="scrollTo(item.id)"
            class="block w-full text-left py-2 text-ice hover:text-white transition-colors"
          >
            {{ item.label }}
          </button>
          <WhatsAppButton
            size="md"
            label="Negociar agora"
            subtitle="WhatsApp"
            block
            class="mt-2"
            @click="emit('whatsappClick')"
          />
        </div>
      </div>
    </Transition>
  </header>
</template>

<style>
.og-logo-link {
  perspective: 1000px !important;
  display: inline-flex !important;
}
.og-logo-flip {
  display: inline-block !important;
  transform-style: preserve-3d !important;
  animation: ogLogoFlip 4s linear infinite !important;
  will-change: transform;
}
.og-logo-link:hover .og-logo-flip {
  animation-play-state: paused !important;
}
@keyframes ogLogoFlip {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}
</style>
