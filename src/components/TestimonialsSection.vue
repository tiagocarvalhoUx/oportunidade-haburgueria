<script setup lang="ts">
import { Quote } from 'lucide-vue-next';
import type { Testimonial } from '../types';

defineProps<{ testimonials: Testimonial[] }>();
</script>

<template>
  <section id="depoimentos" class="bg-coal py-20">
    <div class="max-w-7xl mx-auto px-4">
      <header class="text-center mb-12">
        <div class="inline-flex items-center gap-2 bg-cheese/10 border border-cheese/30 px-4 py-2 rounded-full mb-4">
          <Quote class="w-4 h-4 text-cheese" />
          <span class="text-white font-semibold text-sm uppercase tracking-wide">
            Quem já comprou
          </span>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-ice font-heading mb-3">
          Depoimentos <span class="text-cheese">reais</span>
        </h2>
        <p class="text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
          Clientes que vieram, testaram e levaram.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <article
          v-for="t in testimonials.slice(0, 3)"
          :key="t.id"
          class="surface-card p-6 transition-all hover:-translate-y-1 hover:border-cheese/35"
        >
          <Quote class="w-6 h-6 text-cheese mb-4" />
          <p class="text-white text-base leading-relaxed mb-4">"{{ t.text }}"</p>
          <div class="pt-4 border-t border-cheese/10">
            <div class="text-xs font-semibold text-cheese uppercase">{{ t.author }}</div>
            <div v-if="t.role" class="text-xs text-ice/50 mt-1">{{ t.role }}</div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
