<script setup lang="ts">
import { ref } from 'vue';
import { Menu, X, ListChecks, MessageCircle, Store } from 'lucide-vue-next';

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
      <div class="flex items-center gap-3">
        <div
          class="grid h-10 w-10 place-items-center rounded-lg bg-cheese/15 text-cheese ring-1 ring-cheese/25"
        >
          <Store class="h-5 w-5" />
        </div>
        <div>
          <h1 class="text-base md:text-lg font-bold text-ice font-heading leading-tight">
            Liquidação de Hamburgueria
          </h1>
          <p class="text-[10px] md:text-[11px] text-white/85 tracking-wide">
            Equipamentos e móveis comerciais
          </p>
        </div>
      </div>

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

        <button
          @click="emit('whatsappClick')"
          class="btn-primary hidden px-5 py-2.5 text-sm md:flex"
        >
          <MessageCircle class="w-4 h-4" />
          Negociar no WhatsApp
        </button>

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
          <button
            @click="emit('whatsappClick')"
            class="btn-primary mt-2 w-full px-4 py-3"
          >
            Negociar no WhatsApp
          </button>
        </div>
      </div>
    </Transition>
  </header>
</template>
