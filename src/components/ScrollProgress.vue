<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const progress = ref(0);

function update() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
}

let raf = 0;
function onScroll() {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(update);
}

onMounted(() => {
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', update, { passive: true });
});

onUnmounted(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', update);
});
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 h-[3px] z-[70] pointer-events-none"
    aria-hidden="true"
  >
    <div
      class="h-full bg-gradient-to-r from-cheese via-fire to-cheese transition-[width] duration-150 ease-out"
      :style="{ width: progress + '%' }"
    ></div>
  </div>
</template>
