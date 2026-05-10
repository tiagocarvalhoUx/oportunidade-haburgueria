<script setup lang="ts">
import { AlertCircle, Info } from 'lucide-vue-next';
import type { Testimonial } from '../types';

defineProps<{ testimonials: Testimonial[] }>();

const TRUST_NOTES = [
  'Todos os itens estão sujeitos à disponibilidade.',
  'Os valores podem ser negociados.',
  'A retirada deve ser combinada previamente.',
  'Produtos usados podem apresentar marcas de uso.',
  'Recomenda-se visitar ou solicitar vídeos antes da compra.',
  'Reserva somente mediante acordo com o vendedor.',
];
</script>

<template>
  <section id="confianca" class="bg-coal py-20">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-14">
        <div
          class="inline-flex items-center gap-2 bg-cheese/10 border border-cheese/30 px-4 py-2 rounded-full mb-4"
        >
          <Info class="w-4 h-4 text-cheese" />
          <span class="text-cheese font-semibold text-sm uppercase tracking-wide">
            Compre com confiança
          </span>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold text-ice font-heading mb-3">
          Avisos <span class="text-cheese">Importantes</span>
        </h2>
        <p class="text-lg text-ice/70 max-w-2xl mx-auto">
          Transparência em primeiro lugar. Leia antes de fechar negócio.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        <div
          v-for="t in testimonials.slice(0, 3)"
          :key="t.id"
          class="bg-coal/60 border border-cheese/20 rounded-lg p-6 transition-all hover:-translate-y-1"
        >
          <AlertCircle class="w-6 h-6 text-fire mb-4" />
          <p class="text-ice/80 text-sm leading-relaxed mb-4">"{{ t.text }}"</p>
          <div class="pt-4 border-t border-cheese/10">
            <div class="text-xs font-semibold text-cheese uppercase">{{ t.author }}</div>
            <div v-if="t.role" class="text-xs text-ice/50 mt-1">{{ t.role }}</div>
          </div>
        </div>
      </div>

      <div class="bg-coal/60 border border-cheese/20 rounded-lg p-6 md:p-8 max-w-4xl mx-auto">
        <h3 class="text-lg font-bold text-cheese font-heading mb-4">
          Antes de comprar, observe:
        </h3>
        <ul class="grid md:grid-cols-2 gap-3">
          <li
            v-for="(note, idx) in TRUST_NOTES"
            :key="idx"
            class="flex items-start gap-2 text-sm text-ice/80"
          >
            <span class="text-cheese mt-0.5">✓</span>
            <span>{{ note }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
