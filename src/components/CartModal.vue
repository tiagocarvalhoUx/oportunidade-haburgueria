<script setup lang="ts">
import { ref } from 'vue';
import { X, Plus, Minus, MessageCircle, Trash2, ListChecks } from 'lucide-vue-next';
import type { CartItem } from '../types';

defineProps<{
  open: boolean;
  items: CartItem[];
  total: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'remove', productId: string): void;
  (e: 'updateQuantity', productId: string, quantity: number): void;
  (e: 'finish', name: string): void;
}>();

const customerName = ref('');

function priceText(price: number, label?: string) {
  return price > 0 ? `R$ ${price.toFixed(2)}` : label || 'A consultar';
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 bg-black/60 backdrop-blur z-40"
      @click="emit('close')"
    ></div>
  </Transition>

  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <aside
      v-if="open"
      class="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-coal shadow-2xl z-50 flex flex-col border-l border-cheese/15"
    >
      <div class="bg-gradient-to-r from-cheese to-fire p-5 text-burger-dark flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold font-heading">Lista de interesse</h2>
          <p class="text-sm opacity-80">Monte um pacote e negocie direto pelo WhatsApp</p>
        </div>
        <button
          @click="emit('close')"
          class="p-1.5 hover:bg-coal/20 rounded-lg transition-colors"
          aria-label="Fechar"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-5 space-y-3">
        <div
          v-if="items.length === 0"
          class="flex flex-col items-center justify-center h-full text-center"
        >
          <ListChecks class="w-12 h-12 text-white/50 mb-4" />
          <p class="text-white font-semibold">Sua lista está vazia</p>
          <p class="text-white/70 text-sm mt-1">
            Clique em "Separar item" nos equipamentos que você quer negociar.
          </p>
        </div>

        <div
          v-for="item in items"
          :key="item.product.id"
          class="bg-burger-dark/70 rounded-lg p-4 border border-cheese/20"
        >
          <div class="flex gap-3">
            <img
              :src="item.product.image"
              :alt="item.product.name"
              class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h3 class="text-ice font-semibold text-sm leading-tight">
                {{ item.product.name }}
              </h3>
              <p class="text-ice/50 text-xs mt-1">{{ item.product.condition }}</p>
              <p class="text-cheese font-bold mt-1 text-sm">
                {{ priceText(item.product.price, item.product.priceLabel) }}
              </p>
            </div>
            <button
              @click="emit('remove', item.product.id)"
              class="text-ice/40 hover:text-ketchup transition-colors h-fit"
              aria-label="Remover"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center gap-2 bg-burger-dark rounded-lg p-1">
              <button
                @click="emit('updateQuantity', item.product.id, item.quantity - 1)"
                class="p-1 hover:bg-cheese/20 rounded transition-colors"
              >
                <Minus class="w-3.5 h-3.5 text-ice" />
              </button>
              <span class="text-ice font-bold w-6 text-center text-sm">{{ item.quantity }}</span>
              <button
                @click="emit('updateQuantity', item.product.id, item.quantity + 1)"
                class="p-1 hover:bg-cheese/20 rounded transition-colors"
              >
                <Plus class="w-3.5 h-3.5 text-ice" />
              </button>
            </div>
            <p
              v-if="item.product.price > 0"
              class="text-cheese font-bold text-sm"
            >
              R$ {{ (item.product.price * item.quantity).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="items.length > 0" class="border-t border-cheese/20 p-5 space-y-4">
        <div>
          <label class="text-ice/70 text-xs font-semibold block mb-1.5 uppercase">
            Seu nome (opcional)
          </label>
          <input
            v-model="customerName"
            type="text"
            placeholder="Ex: João Silva"
            class="w-full bg-burger-dark/70 border border-cheese/20 rounded-lg px-3 py-2 text-ice text-sm placeholder-ice/30 focus:outline-none focus:border-cheese transition-colors"
          />
        </div>

        <div class="bg-burger-dark/70 rounded-lg p-4 border border-cheese/30">
          <div class="flex justify-between items-center text-sm mb-2">
            <span class="text-ice/70">Total estimado:</span>
            <span class="text-cheese text-lg font-bold">R$ {{ total.toFixed(2) }}</span>
          </div>
          <p class="text-xs text-ice/50">
            * Valor sujeito a negociação. Itens "a consultar" não estão somados.
          </p>
        </div>

        <button
          @click="emit('finish', customerName)"
          class="btn-primary w-full py-3"
        >
          <MessageCircle class="w-5 h-5" />
          Enviar lista no WhatsApp
        </button>

        <button
          @click="emit('close')"
          class="btn-secondary w-full py-2.5 text-sm"
        >
          Continuar olhando
        </button>
      </div>
    </aside>
  </Transition>
</template>

