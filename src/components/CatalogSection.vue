<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowDownAZ, Search, SearchX } from 'lucide-vue-next';
import type { Product, ProductCategory } from '../types';
import ProductCard from './ProductCard.vue';

const props = defineProps<{
  products: Product[];
  activeCategory: ProductCategory;
}>();

defineEmits<{ (e: 'addToList', product: Product): void }>();

const search = ref('');
const sort = ref<'default' | 'price-asc' | 'price-desc'>('default');

const filtered = computed(() => {
  let list = props.products;

  if (props.activeCategory === 'vendidos') {
    list = list.filter((p) => p.status === 'vendido');
  } else if (props.activeCategory === 'promocoes') {
    list = list.filter((p) => p.isPromotion || !!p.badge);
  } else if (props.activeCategory !== 'all') {
    list = list.filter((p) => p.category === props.activeCategory);
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }

  if (sort.value === 'price-asc') {
    list = [...list].sort((a, b) => a.price - b.price);
  } else if (sort.value === 'price-desc') {
    list = [...list].sort((a, b) => b.price - a.price);
  }

  return list;
});
</script>

<template>
  <section id="equipamentos" class="bg-coal py-24">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-ice font-heading mb-3">
          Catálogo de <span class="text-cheese">equipamentos</span>
        </h2>
        <p class="text-lg text-white max-w-2xl mx-auto leading-relaxed">
          Equipamentos prontos para uso. Consulte disponibilidade, fotos e condições pelo WhatsApp.
        </p>
      </div>

      <div class="flex flex-col md:flex-row gap-3 mb-10 max-w-3xl mx-auto">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ice/40" />
          <input
            v-model="search"
            type="text"
            placeholder="Buscar equipamento..."
            class="w-full bg-burger-dark/80 border border-cheese/20 rounded-lg pl-9 pr-4 py-2.5 text-ice placeholder-ice/30 focus:outline-none focus:border-cheese transition-colors"
          />
        </div>
        <div class="relative">
          <ArrowDownAZ
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ice/40 pointer-events-none"
          />
          <select
            v-model="sort"
            class="bg-burger-dark/80 border border-cheese/20 rounded-lg pl-9 pr-8 py-2.5 text-ice focus:outline-none focus:border-cheese cursor-pointer w-full md:w-auto"
          >
            <option value="default">Ordem padrão</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
          </select>
        </div>
      </div>

      <TransitionGroup
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        enter-active-class="transition duration-300"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <ProductCard
          v-for="product in filtered"
          :key="product.id"
          :product="product"
          @add-to-list="(p) => $emit('addToList', p)"
        />
      </TransitionGroup>

      <div
        v-if="filtered.length === 0"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <SearchX class="w-10 h-10 text-white/70 mb-4" />
        <p class="text-xl text-white">Nenhum equipamento encontrado</p>
        <p class="text-base text-white/70 mt-2">Tente outra categoria ou termo de busca.</p>
      </div>
    </div>
  </section>
</template>

