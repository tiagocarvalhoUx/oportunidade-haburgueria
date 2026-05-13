<script setup lang="ts">
import { ArrowDown, Tag, Truck, ShieldCheck, Handshake } from 'lucide-vue-next';
import WhatsAppButton from './WhatsAppButton.vue';

defineEmits<{
  (e: 'viewCatalog'): void;
  (e: 'whatsapp'): void;
}>();

const seals = [
  { icon: Tag, label: 'Itens selecionados' },
  { icon: Handshake, label: 'Venda direta' },
  { icon: ShieldCheck, label: 'Negociação rápida' },
  { icon: Truck, label: 'Retirada combinada' },
];
</script>

<template>
  <div
    id="inicio"
    class="min-h-screen bg-gradient-to-b from-coal via-burger-dark to-coal pt-20 relative overflow-hidden"
  >
    <div class="max-w-7xl mx-auto px-4 py-20 relative z-10">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6 animate-slide-up">
          <div class="inline-flex items-center gap-2 bg-cheese/10 border border-cheese/30 px-4 py-2 rounded-full">
            <Tag class="w-4 h-4 text-cheese" />
            <span class="text-white font-semibold text-sm">
              Liquidação total com preços de oportunidade
            </span>
          </div>

          <h1 class="text-4xl md:text-6xl font-bold text-ice leading-tight font-heading">
            Equipamentos de hamburgueria à venda com
            <span class="text-white">negociação direta</span>
          </h1>

          <p class="text-lg md:text-xl text-white leading-relaxed max-w-2xl">
            Geladeira, freezer, chapa, balcão, fritadeira e outros itens comerciais prontos
            para uso. Consulte valores, fotos e disponibilidade direto pelo WhatsApp.
          </p>

          <div class="grid grid-cols-2 gap-3 pt-2">
            <div
              v-for="(seal, idx) in seals"
              :key="idx"
              class="flex items-center gap-2 bg-burger-dark/75 border border-white/10 rounded-lg px-4 py-3 shadow-lg shadow-black/15"
            >
              <component :is="seal.icon" class="w-4 h-4 text-cheese" />
              <span class="text-white text-sm font-semibold">{{ seal.label }}</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <WhatsAppButton
              size="md"
              label="Ver preço"
              subtitle="resposta no WhatsApp"
              @click="$emit('whatsapp')"
            />
            <button
              @click="$emit('viewCatalog')"
              class="btn-secondary"
            >
              Ver equipamentos
            </button>
          </div>
        </div>

        <div class="relative animate-slide-up">
          <img
            src="https://images.unsplash.com/photo-1589010588553-46e8e7c21788?w=700&h=560&fit=crop"
            alt="Equipamentos comerciais de hamburgueria"
            class="relative rounded-xl shadow-2xl object-cover w-full h-96 border border-cheese/15"
          />
          <div
            class="absolute -bottom-4 -left-4 bg-coal rounded-lg p-4 shadow-lg border border-cheese/30 animate-bounce-soft"
          >
            <div class="text-center">
              <div class="text-2xl font-bold text-cheese font-heading">12+</div>
              <div class="text-sm text-white">itens disponíveis</div>
            </div>
          </div>
          <div
            class="absolute -top-4 -right-4 bg-coal rounded-lg p-4 shadow-lg border border-fire/30 animate-bounce-soft-delay"
          >
            <div class="text-center">
              <div class="text-base font-bold text-fire">VENDA RÁPIDA</div>
              <div class="text-sm text-white">valores negociáveis</div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-16">
        <ArrowDown class="w-6 h-6 text-cheese animate-bounce" />
      </div>
    </div>
  </div>
</template>
