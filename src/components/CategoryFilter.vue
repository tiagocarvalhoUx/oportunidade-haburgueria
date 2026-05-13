<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import type { ProductCategory } from '../types';

const props = defineProps<{
  categories: Array<{ id: string; label: string }>;
  activeCategory: ProductCategory;
  counts?: Record<string, number>;
}>();

const emit = defineEmits<{ (e: 'change', category: ProductCategory): void }>();

const scroller = ref<HTMLElement | null>(null);
const chipRefs = ref<Record<string, HTMLElement | null>>({});

function setChipRef(id: string, el: Element | unknown) {
  chipRefs.value[id] = (el as HTMLElement) || null;
}

function countOf(id: string): number {
  return props.counts?.[id] ?? 0;
}

function isDisabled(id: string): boolean {
  if (id === 'all') return false;
  if (!props.counts) return false;
  return countOf(id) === 0;
}

function handleClick(id: string) {
  if (isDisabled(id)) return;
  emit('change', id as ProductCategory);
}

watch(
  () => props.activeCategory,
  async (id) => {
    await nextTick();
    const chip = chipRefs.value[id];
    const container = scroller.value;
    if (!chip || !container) return;
    const isHorizontalScroll = container.scrollWidth > container.clientWidth + 4;
    if (!isHorizontalScroll) return;
    const chipRect = chip.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const offset =
      chip.offsetLeft - container.clientWidth / 2 + chipRect.width / 2;
    container.scrollTo({ left: offset, behavior: 'smooth' });
    void containerRect;
  },
  { immediate: true },
);
</script>

<template>
  <div class="cat-wrap">
    <div
      ref="scroller"
      class="cat-scroll"
      role="tablist"
      aria-label="Filtro de categorias"
    >
      <button
        v-for="cat in categories"
        :key="cat.id"
        :ref="(el) => setChipRef(cat.id, el)"
        type="button"
        :disabled="isDisabled(cat.id)"
        :aria-pressed="activeCategory === cat.id"
        :aria-label="
          isDisabled(cat.id)
            ? `${cat.label} — sem itens disponíveis`
            : `${cat.label}, ${countOf(cat.id)} ${
                countOf(cat.id) === 1 ? 'item' : 'itens'
              }`
        "
        :title="
          isDisabled(cat.id) ? 'Sem itens nesta categoria no momento' : undefined
        "
        @click="handleClick(cat.id)"
        :class="[
          'cat-chip',
          activeCategory === cat.id ? 'cat-chip--active' : '',
          isDisabled(cat.id) ? 'cat-chip--disabled' : '',
        ]"
      >
        <span class="cat-chip__label">{{ cat.label }}</span>
        <span
          v-if="counts"
          class="cat-chip__count"
          aria-hidden="true"
        >
          {{ countOf(cat.id) }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.cat-wrap {
  position: relative;
  width: 100%;
}

/* Fade edges on mobile — hint of more content */
.cat-wrap::before,
.cat-wrap::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 28px;
  pointer-events: none;
  z-index: 2;
}

.cat-wrap::before {
  left: 0;
  background: linear-gradient(to right, #0d0d0d 0%, rgba(13, 13, 13, 0) 100%);
}

.cat-wrap::after {
  right: 0;
  background: linear-gradient(to left, #0d0d0d 0%, rgba(13, 13, 13, 0) 100%);
}

.cat-scroll {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  padding: 0.25rem 1.25rem;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x proximity;
  scroll-padding-inline: 1.25rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.cat-scroll::-webkit-scrollbar {
  display: none;
}

/* Tablet up — fits in one row, centered, no scroll */
@media (min-width: 768px) {
  .cat-wrap::before,
  .cat-wrap::after {
    display: none;
  }
  .cat-scroll {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.65rem;
    padding: 0.25rem 1rem;
    overflow: visible;
    scroll-snap-type: none;
    max-width: 80rem;
    margin: 0 auto;
  }
}

.cat-chip {
  scroll-snap-align: center;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 0.95rem;
  min-height: 44px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.85rem;
  white-space: nowrap;
  background: rgba(30, 26, 23, 0.8);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  flex: 0 0 auto;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.15s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
}

@media (min-width: 768px) {
  .cat-chip {
    padding: 0.55rem 1.05rem;
    font-size: 0.875rem;
  }
}

.cat-chip:hover:not(.cat-chip--disabled):not(.cat-chip--active) {
  background: rgba(214, 168, 79, 0.12);
  border-color: rgba(214, 168, 79, 0.5);
  color: #ffffff;
  transform: translateY(-1px);
}

.cat-chip:active:not(.cat-chip--disabled) {
  transform: scale(0.96);
}

.cat-chip:focus-visible {
  outline: 2px solid #d6a84f;
  outline-offset: 2px;
}

.cat-chip__label {
  line-height: 1;
}

.cat-chip__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 20px;
  padding: 0 0.4rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 1;
}

.cat-chip--active {
  background: linear-gradient(135deg, #fff 0%, #f4efe5 100%);
  color: #1e1a17;
  border-color: rgba(255, 255, 255, 0.95);
  box-shadow:
    0 10px 24px -10px rgba(0, 0, 0, 0.75),
    0 0 0 3px rgba(214, 168, 79, 0.18);
  transform: translateY(-1px);
}

.cat-chip--active .cat-chip__count {
  background: rgba(214, 168, 79, 0.22);
  color: #1e1a17;
}

.cat-chip--disabled {
  opacity: 0.38;
  cursor: not-allowed;
  background: rgba(30, 26, 23, 0.4);
  color: rgba(255, 255, 255, 0.55);
}

.cat-chip--disabled .cat-chip__count {
  background: rgba(255, 255, 255, 0.05);
}

@media (prefers-reduced-motion: reduce) {
  .cat-chip {
    transition: none;
  }
  .cat-scroll {
    scroll-behavior: auto;
  }
}
</style>
