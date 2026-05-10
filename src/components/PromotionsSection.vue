<script setup lang="ts">
import { Package, MessageCircle, Search, Phone, FileText, Handshake } from 'lucide-vue-next';
import type { Promotion } from '../types';

defineProps<{ promotions: Promotion[] }>();
defineEmits<{ (e: 'whatsappPackage'): void }>();

const STEPS = [
  {
    icon: Search,
    title: 'Escolha o equipamento',
    description: 'Veja fotos, descrição, estado e valor de cada item.',
  },
  {
    icon: Phone,
    title: 'Chame no WhatsApp',
    description: 'Clique no botão do produto desejado para falar direto com o vendedor.',
  },
  {
    icon: FileText,
    title: 'Tire suas dúvidas',
    description: 'Solicite mais fotos, vídeo, medidas e informações técnicas.',
  },
  {
    icon: Handshake,
    title: 'Combine pagamento e retirada',
    description: 'Negocie forma de pagamento, reserva e retirada do equipamento.',
  },
];
</script>

<template>
  <section
    id="promocoes"
    class="py-20 bg-gradient-to-b from-coal to-burger-dark relative overflow-hidden"
  >
    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <div class="text-center mb-14">
        <h2 class="text-4xl md:text-5xl font-bold text-ice font-heading mb-3">
          Condições <span class="text-fire">Especiais</span>
        </h2>
        <p class="text-lg text-ice/70 max-w-2xl mx-auto">
          Quem leva mais de um item, fecha melhor. Consulte negociação direto pelo WhatsApp.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <div
          v-for="promo in promotions"
          :key="promo.id"
          class="bg-coal/60 border border-cheese/20 rounded-lg p-6 transition-all hover:-translate-y-1 hover:border-cheese/40"
        >
          <div
            class="inline-flex items-center gap-2 bg-fire/15 border border-fire/30 rounded-full px-3 py-1 mb-4"
          >
            <span class="text-xs font-bold text-fire uppercase tracking-wide">
              {{ promo.badge }}
            </span>
          </div>
          <h3 class="text-xl font-bold text-ice font-heading mb-2">{{ promo.title }}</h3>
          <p class="text-ice/70 text-sm leading-relaxed">{{ promo.description }}</p>
        </div>
      </div>

      <div
        class="bg-gradient-to-r from-cheese via-fire to-cheese rounded-lg p-8 md:p-12 text-center relative overflow-hidden"
      >
        <div class="relative z-10">
          <div class="flex items-center justify-center gap-3 mb-4">
            <Package class="w-6 h-6 text-burger-dark" />
            <span class="text-burger-dark font-bold uppercase tracking-wider text-sm">
              Oferta de pacote
            </span>
          </div>
          <h3 class="text-2xl md:text-4xl font-bold text-burger-dark font-heading mb-3">
            Quer Montar uma Hamburgueria?
          </h3>
          <p class="text-burger-dark/80 mb-6 text-base md:text-lg max-w-2xl mx-auto">
            Leve vários equipamentos em um só pacote. Temos itens essenciais para quem deseja
            montar ou ampliar uma lanchonete, hamburgueria, trailer, delivery ou cozinha
            comercial. Consulte condições especiais para compra de múltiplos itens.
          </p>
          <button
            @click="$emit('whatsappPackage')"
            class="bg-coal text-cheese px-7 py-3 rounded-lg font-bold hover:bg-coal/90 transition-all inline-flex items-center gap-2 hover:scale-[1.02]"
          >
            <MessageCircle class="w-4 h-4" />
            Negociar Pacote pelo WhatsApp
          </button>
        </div>
      </div>
    </div>
  </section>

  <section id="como-comprar" class="py-20 bg-coal">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-14">
        <h2 class="text-4xl md:text-5xl font-bold text-ice font-heading mb-3">
          Como <span class="text-cheese">Comprar</span>
        </h2>
        <p class="text-lg text-ice/70 max-w-2xl mx-auto">
          Processo simples e direto. Sem intermediários, sem burocracia.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(step, idx) in STEPS"
          :key="idx"
          class="bg-coal/60 border border-cheese/20 rounded-lg p-6 relative"
        >
          <div
            class="absolute -top-4 -left-4 bg-cheese text-burger-dark w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
          >
            {{ idx + 1 }}
          </div>
          <component :is="step.icon" class="w-7 h-7 text-cheese mb-4" />
          <h4 class="text-lg font-bold text-ice font-heading mb-2">{{ step.title }}</h4>
          <p class="text-sm text-ice/70 leading-relaxed">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
