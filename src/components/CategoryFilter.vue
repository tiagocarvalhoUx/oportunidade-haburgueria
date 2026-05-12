<script setup lang="ts">
import type { ProductCategory } from '../types';

defineProps<{
  categories: Array<{ id: string; label: string }>;
  activeCategory: ProductCategory;
}>();

defineEmits<{ (e: 'change', category: ProductCategory): void }>();
</script>

<template>
  <div class="flex flex-nowrap md:flex-wrap gap-2 md:gap-3 justify-start md:justify-center">
    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="$emit('change', cat.id as ProductCategory)"
      :class="[
        'px-4 md:px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap',
        activeCategory === cat.id
          ? 'bg-white text-burger-dark shadow-lg shadow-black/20'
          : 'bg-burger-dark/80 text-white hover:bg-white/10 border border-white/15 hover:border-cheese/50',
      ]"
    >
      {{ cat.label }}
    </button>
  </div>
</template>
