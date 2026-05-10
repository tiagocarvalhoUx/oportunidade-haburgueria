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
        'px-4 md:px-5 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap hover:scale-[1.04]',
        activeCategory === cat.id
          ? 'bg-cheese text-burger-dark shadow-lg shadow-cheese/20'
          : 'bg-burger-dark/80 text-ice/80 hover:bg-burger-dark border border-cheese/20',
      ]"
    >
      {{ cat.label }}
    </button>
  </div>
</template>
