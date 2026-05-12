<script setup lang="ts">
import { Tag, Handshake, Building2, MessageSquare } from 'lucide-vue-next';

const cards = [
  {
    icon: Tag,
    title: 'Preços de Oportunidade',
    description:
      'Equipamentos comerciais com valores abaixo do custo de novos. Prontos para uso, sem perder qualidade.',
    color: 'text-cheese',
  },
  {
    icon: Handshake,
    title: 'Venda Direta',
    description:
      'Negociação simples, rápida e sem intermediários. Você fala direto com o vendedor.',
    color: 'text-fire',
  },
  {
    icon: Building2,
    title: 'Para Comércio Alimentício',
    description:
      'Ideal para lanchonetes, hamburguerias, bares, pizzarias e cozinhas industriais.',
    color: 'text-cheese',
  },
  {
    icon: MessageSquare,
    title: 'Consulta pelo WhatsApp',
    description:
      'Tire dúvidas, peça fotos e combine a retirada diretamente com o vendedor.',
    color: 'text-fire',
  },
];
</script>

<template>
  <section id="sobre" class="bg-burger-dark py-24 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <div class="text-center mb-14">
        <h2 class="text-4xl md:text-5xl font-bold text-ice font-heading mb-4">
          Por que vale <span class="text-cheese">comprar aqui?</span>
        </h2>
        <p class="text-lg text-white max-w-3xl mx-auto leading-relaxed">
          Liquidação completa de uma hamburgueria. Equipamentos comerciais selecionados, com
          preço abaixo do mercado, prontos para começar uma operação ou ampliar a sua. Monte
          sua estrutura comercial gastando menos.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(card, idx) in cards"
          :key="idx"
          class="feature-card text-center group"
        >
          <div class="flex justify-center mb-5">
            <div
              class="p-3.5 bg-cheese/15 rounded-full group-hover:bg-cheese/25 transition-colors"
            >
              <component :is="card.icon" :class="['w-7 h-7', card.color]" />
            </div>
          </div>
          <h4 class="text-lg font-bold text-burger-dark font-heading mb-3">{{ card.title }}</h4>
          <p class="text-base text-coal leading-relaxed">{{ card.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

