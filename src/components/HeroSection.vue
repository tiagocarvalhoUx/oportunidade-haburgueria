<script setup lang="ts">
import { Camera, Wrench, Handshake, MapPin, ShoppingBag, Flame } from 'lucide-vue-next';
import WhatsAppButton from './WhatsAppButton.vue';
import heroKitchenView from '../image/logo/hero-kitchen_view.png';

defineEmits<{
  (e: 'viewCatalog'): void;
  (e: 'whatsapp'): void;
}>();

const trustPoints = [
  { icon: Camera, title: 'Fotos reais', subline: 'no catálogo' },
  { icon: Wrench, title: 'Teste presencial', subline: 'ligado, em Araçatuba' },
  { icon: Handshake, title: 'Negocie direto', subline: 'sem atravessador' },
];

</script>

<template>
  <section
    id="inicio"
    class="relative overflow-hidden bg-gradient-to-b from-coal via-burger-dark to-coal pt-24 pb-14 md:pt-28 md:pb-24"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-fire/10 blur-[120px]"
    ></div>
    <div
      aria-hidden="true"
      class="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-cheese/10 blur-[100px]"
    ></div>

    <div class="relative z-10 mx-auto max-w-7xl px-4">
      <div class="grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
        <div class="animate-slide-up space-y-5 text-center md:space-y-7 md:text-left">
          <div
            class="inline-flex items-center gap-1.5 rounded-full border border-cheese/30 bg-cheese/10 px-3 py-1.5"
          >
            <MapPin class="h-3.5 w-3.5 text-cheese" />
            <span class="text-xs font-semibold tracking-wide text-white">
              Araçatuba/SP · Seminovos
            </span>
          </div>

          <h1
            class="font-heading text-[2.25rem] font-bold leading-[1.05] text-ice sm:text-5xl md:text-6xl lg:text-[4.25rem]"
          >
            Veja, teste, leve.
            <span class="block text-cheese">Sem surpresa.</span>
          </h1>

          <p class="mx-auto max-w-xl text-base leading-relaxed text-white/85 md:mx-0 md:text-lg">
            Equipamentos seminovos com <strong class="text-white">fotos reais</strong>.
            Vem testar ligado em Araçatuba antes de levar.
          </p>

          <ul
            class="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0 md:pb-0 hide-scrollbar"
          >
            <li
              v-for="point in trustPoints"
              :key="point.title"
              class="flex min-w-[72%] shrink-0 snap-start items-center gap-2.5 rounded-xl border border-cheese/15 bg-burger-dark/70 px-3 py-2.5 sm:min-w-[200px] md:min-w-0"
            >
              <component :is="point.icon" class="h-4 w-4 shrink-0 text-cheese md:h-5 md:w-5" />
              <div class="text-left leading-tight">
                <p class="text-sm font-bold text-white">{{ point.title }}</p>
                <p class="text-[11px] text-white/65">{{ point.subline }}</p>
              </div>
            </li>
          </ul>

          <div class="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-center md:justify-start">
            <WhatsAppButton
              size="md"
              label="Falar com vendedor"
              subtitle="resposta rápida no WhatsApp"
              @click="$emit('whatsapp')"
            />
            <button
              @click="$emit('viewCatalog')"
              class="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag class="h-4 w-4" />
              Ver equipamentos
            </button>
          </div>
        </div>

        <div class="relative mt-4 animate-slide-up md:mt-0">
          <div
            class="hero-burger-panel relative overflow-hidden rounded-2xl border border-cheese/20 shadow-2xl"
          >
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,168,79,0.20),transparent_36%),linear-gradient(180deg,rgba(11,13,14,0.18),rgba(11,13,14,0.86))]"></div>

            <div class="hero-kitchen-frame">
              <img
                :src="heroKitchenView"
                alt="Vista da cozinha da hamburgueria com equipamentos profissionais"
                loading="eager"
                decoding="async"
                class="hero-kitchen-img"
              />
              <div class="hero-kitchen-fade" aria-hidden="true"></div>
            </div>

            <div class="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-cheese/35 bg-coal/85 px-3 py-1.5 shadow-lg backdrop-blur">
              <Flame class="h-3.5 w-3.5 text-cheese" />
              <span class="text-[11px] font-extrabold uppercase tracking-wide text-white">
                Linha hamburgueria
              </span>
            </div>

            <div class="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-xl border border-cheese/25 bg-coal/88 px-3 py-2 backdrop-blur">
              <span class="og-logo-flip-hover hero-logo-main shrink-0">
                <img
                  src="/logo.png"
                  alt="Oportunidade Hamburgueria"
                  class="h-11 w-auto object-contain"
                  width="44"
                  height="44"
                  decoding="async"
                />
              </span>
              <p class="text-xs leading-snug text-white/90">
                <strong class="text-white">Confira</strong> nosso catálogo abaixo —
                fotos reais em cada item.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hero-burger-panel {
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(0deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    #101213;
  background-size: 34px 34px;
}

.hero-logo-main {
  filter:
    drop-shadow(0 3px 4px rgba(0, 0, 0, 0.65))
    drop-shadow(0 0 18px rgba(214, 168, 79, 0.2));
}

.hero-kitchen-frame {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 0%, rgba(214, 168, 79, 0.18) 0%, transparent 55%),
    linear-gradient(180deg, #101213 0%, #0b0d0e 100%);
  padding: 12px;
}

@media (min-width: 768px) {
  .hero-kitchen-frame {
    padding: 18px;
  }
}

.hero-kitchen-img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 12px;
}

.hero-kitchen-fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 35%;
  pointer-events: none;
  background: linear-gradient(to top, rgba(11, 13, 14, 0.55) 0%, transparent 100%);
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}
</style>
