<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Camera, Wrench, Handshake } from 'lucide-vue-next';

const items = [
  { icon: Camera,    title: 'Fotos reais',        subline: 'cada item fotografado por nós' },
  { icon: Wrench,    title: 'Teste presencial',   subline: 'ligado, em Araçatuba' },
  { icon: Handshake, title: 'Negocie direto',     subline: 'pelo WhatsApp, sem atravessador' },
];

const visible = ref(false);
onMounted(() => {
  requestAnimationFrame(() => { visible.value = true; });
});
</script>

<template>
  <aside
    class="bg-gradient-to-r from-burger-dark via-coal/95 to-burger-dark border-y border-cheese/15"
    aria-label="Garantias da loja"
  >
    <ul
      class="max-w-7xl mx-auto px-4 py-3 flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory md:overflow-visible"
    >
      <li
        v-for="(item, idx) in items"
        :key="idx"
        :style="{ transitionDelay: `${idx * 75}ms` }"
        :class="[
          'flex items-center gap-3 snap-start shrink-0 md:shrink min-w-[80%] md:min-w-0 transition-all duration-500',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        ]"
      >
        <component :is="item.icon" class="w-[18px] h-[18px] text-cheese shrink-0" />
        <div class="leading-tight">
          <p class="font-bold text-ice text-sm">{{ item.title }}</p>
          <p class="text-[11px] text-white/70">{{ item.subline }}</p>
        </div>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  li { transition: none !important; }
}
</style>
