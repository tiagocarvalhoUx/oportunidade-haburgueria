<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Camera, Wrench, Truck, MessageCircle } from 'lucide-vue-next';

const emit = defineEmits<{ (e: 'whatsapp'): void }>();

const steps = [
  {
    icon: Camera,
    title: 'Você escolhe',
    body: 'Navega o catálogo e chama no WhatsApp pra ver fotos extras e preço.',
  },
  {
    icon: Wrench,
    title: 'Vem testar',
    body: 'Marca um horário, vem até Araçatuba ver o equipamento ligado, em operação.',
  },
  {
    icon: Truck,
    title: 'Combina retirada',
    body: 'Pagamento à vista ou parcelado. Retirada combinada ou frete por sua conta.',
  },
];

const visibleSteps = ref<boolean[]>([false, false, false]);
const root = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!root.value || !('IntersectionObserver' in window)) {
    visibleSteps.value = [true, true, true];
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        steps.forEach((_, i) => setTimeout(() => { visibleSteps.value[i] = true; }, i * 120));
        observer.disconnect();
      }
    },
    { threshold: 0.25 },
  );
  observer.observe(root.value);
});
</script>

<template>
  <section ref="root" id="como-comprar" class="bg-coal py-20">
    <div class="max-w-7xl mx-auto px-4">
      <header class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-ice font-heading mb-3">
          Como funciona a <span class="text-cheese">compra</span>
        </h2>
        <p class="text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
          Sem mistério. Três passos pra você levar o equipamento certo, sem surpresa.
        </p>
      </header>

      <ol class="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-10">
        <li
          v-for="(step, idx) in steps"
          :key="idx"
          :class="[
            'relative bg-burger-dark/40 border border-cheese/15 rounded-2xl p-6 transition-all duration-500',
            visibleSteps[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ]"
        >
          <div class="flex items-start gap-4">
            <span class="font-heading font-bold text-cheese text-5xl leading-none shrink-0">
              {{ idx + 1 }}
            </span>
            <div>
              <div class="flex items-center gap-2 mb-2">
                <component :is="step.icon" class="w-5 h-5 text-fire" />
                <h3 class="font-bold text-ice text-lg font-heading">{{ step.title }}</h3>
              </div>
              <p class="text-white/85 leading-relaxed">{{ step.body }}</p>
            </div>
          </div>
        </li>
      </ol>

      <div class="text-center">
        <button
          @click="emit('whatsapp')"
          class="inline-flex items-center gap-2 text-cheese hover:text-white transition-colors font-semibold text-base underline underline-offset-4 decoration-cheese/30 hover:decoration-cheese"
        >
          <MessageCircle class="w-4 h-4" />
          Tirou dúvida? Chama no WhatsApp
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  li { transition: none !important; opacity: 1 !important; transform: none !important; }
}
</style>
