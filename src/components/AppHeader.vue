<script setup lang="ts">
import { ref } from 'vue';
import { Menu, X, ListChecks } from 'lucide-vue-next';
import WhatsAppButton from './WhatsAppButton.vue';
import WhatsAppIcon from './icons/WhatsAppIcon.vue';

defineProps<{ cartItemCount: number }>();
const emit = defineEmits<{
  (e: 'cartClick'): void;
  (e: 'whatsappClick'): void;
}>();

const isOpen = ref(false);
const NAV = [
  { id: 'inicio', label: 'Início' },
  { id: 'equipamentos', label: 'Equipamentos' },
  { id: 'promocoes', label: 'Promoções' },
  { id: 'como-comprar', label: 'Como comprar' },
  { id: 'contato', label: 'Contato' },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  isOpen.value = false;
}
</script>

<template>
  <header
    class="fixed left-0 right-0 top-0 z-40 border-b border-cheese/10 bg-coal/[0.92] text-ice shadow-[0_10px_30px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl header-shell"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:h-[68px] sm:px-5 lg:h-20 lg:gap-4">
      <!-- LOGO — Hierarquia visual dominante -->
      <a
        href="#inicio"
        class="og-logo-link group mr-auto flex min-w-0 items-center gap-2.5 rounded-lg pr-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cheese sm:gap-3"
        aria-label="Oportunidade Hamburgueria — Página inicial"
        @click="isOpen = false"
      >
        <span class="og-logo-flip-hover shrink-0">
          <img
            src="/logo.png"
            alt=""
            class="h-11 w-auto object-contain sm:h-[52px] lg:h-14"
            width="48"
            height="48"
            decoding="async"
          />
        </span>
        <div class="hidden md:block min-w-0">
          <p class="text-[10px] lg:text-[11px] uppercase tracking-[0.18em] text-cheese/85 font-semibold leading-tight">
            Oportunidade
          </p>
          <h1 class="text-sm lg:text-base font-bold text-ice font-heading leading-tight truncate">
            Hamburgueria · Seminovos
          </h1>
        </div>
      </a>

      <!-- Nav inline — desktop only -->
      <nav class="hidden lg:flex items-center gap-7" aria-label="Navegação principal">
        <button
          v-for="item in NAV"
          :key="item.id"
          @click="scrollTo(item.id)"
          class="text-ice/75 hover:text-white transition-colors font-medium text-sm relative after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-cheese after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
        >
          {{ item.label }}
        </button>
      </nav>

      <!-- Ações à direita — agrupadas (lei de proximidade) -->
      <div class="flex shrink-0 items-center gap-2">
        <!-- Cart — ghost button com affordance clara -->
        <button
          @click="emit('cartClick')"
          aria-label="Lista de interesse"
          class="icon-btn relative"
        >
          <ListChecks class="w-[22px] h-[22px]" />
          <span
            v-if="cartItemCount > 0"
            class="absolute top-1 right-1 bg-cheese text-burger-dark text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center ring-2 ring-coal pointer-events-none"
            :aria-label="`${cartItemCount} itens na lista`"
          >
            {{ cartItemCount > 9 ? '9+' : cartItemCount }}
          </span>
        </button>

        <!-- WhatsApp button — só em lg+ (mobile/tablet tem FAB + CTA no Hero) -->
        <button
          type="button"
          class="mobile-wa-btn lg:hidden"
          aria-label="Negociar pelo WhatsApp"
          @click="emit('whatsappClick'); isOpen = false"
        >
          <WhatsAppIcon class="h-4 w-4 shrink-0" />
          <span>Whats</span>
        </button>
        <div class="ml-1 hidden lg:block">
          <WhatsAppButton
            size="sm"
            label="Negociar"
            subtitle="WhatsApp"
            @click="emit('whatsappClick')"
          />
        </div>

        <!-- Menu hamburger — visível abaixo de lg -->
        <button
          @click="isOpen = !isOpen"
          class="icon-btn lg:hidden"
          :aria-label="isOpen ? 'Fechar menu' : 'Abrir menu de navegação'"
          :aria-expanded="isOpen"
          aria-controls="mobile-nav"
        >
          <component :is="isOpen ? X : Menu" class="w-[22px] h-[22px]" />
        </button>
      </div>
    </div>

    <!-- Menu mobile / tablet -->
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        id="mobile-nav"
        class="lg:hidden border-t border-cheese/10 bg-coal/98 shadow-2xl shadow-black/40 backdrop-blur"
      >
        <div class="space-y-1 px-3 py-3">
          <button
            v-for="item in NAV"
            :key="item.id"
            @click="scrollTo(item.id)"
            class="flex min-h-12 w-full items-center rounded-lg px-3 text-left text-sm font-semibold text-ice/[0.88] transition-colors hover:bg-burger-dark/70 hover:text-white active:bg-cheese/10"
          >
            {{ item.label }}
          </button>
          <div class="pt-2">
            <WhatsAppButton
              size="md"
              label="Negociar agora"
              subtitle="WhatsApp"
              block
              @click="emit('whatsappClick'); isOpen = false"
            />
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style>
/* === Logo 3D com flip contínuo — header, footer e hero compartilham via style global === */
.og-logo-link {
  display: inline-flex !important;
  align-items: center;
}

.og-logo-flip-hover {
  display: inline-block !important;
  position: relative;
  perspective: 900px;
  filter:
    drop-shadow(0 2px 3px rgba(0, 0, 0, 0.55))
    drop-shadow(0 0 14px rgba(255, 140, 50, 0.22));
  transition: filter 0.4s ease;
}

/* Halo sutil atrás do logo — dá presença sem "embaçar" */
.og-logo-flip-hover::before {
  content: '';
  position: absolute;
  inset: -18%;
  border-radius: 9999px;
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 168, 60, 0.32) 0%, rgba(255, 140, 50, 0.12) 40%, transparent 70%);
  z-index: -1;
  pointer-events: none;
  filter: blur(6px);
}

.og-logo-flip-hover img {
  display: block;
  /* Gira 2x no load — depois fica estático até hover */
  animation: og-logo-spin 2s ease-in-out 1 both !important;
  transform-origin: center center;
  transform-style: preserve-3d;
  will-change: transform;
  -webkit-backface-visibility: visible;
  backface-visibility: visible;
  filter: contrast(1.08) saturate(1.12);
  image-rendering: -webkit-optimize-contrast;
}

/* Hover: troca p/ animação com nome diferente → força restart (mesmo keyframe, gira 2x de novo) */
.og-logo-flip-hover:hover img,
.og-logo-link:hover .og-logo-flip-hover img,
.og-logo-link:focus-visible .og-logo-flip-hover img {
  animation: og-logo-spin-hover 2s ease-in-out 1 both !important;
}

/* Mobile: mantém o flip 3D, apenas ajusta sombras e contraste para o logo não parecer fosco em telas pequenas */
@media (max-width: 767px) {
  .og-logo-flip-hover {
    filter:
      drop-shadow(0 2px 4px rgba(0, 0, 0, 0.7))
      drop-shadow(0 0 10px rgba(255, 168, 60, 0.28));
    perspective: 700px;
  }
  .og-logo-flip-hover::before {
    inset: -14%;
    filter: blur(5px);
  }
  .og-logo-flip-hover img {
    filter: contrast(1.12) saturate(1.18) brightness(1.04);
  }
}

/* Mesmo keyframe usado pelo load e pelo hover — nomes diferentes só p/ forçar restart */
@keyframes og-logo-spin {
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(720deg); }   /* 2 voltas dentro do tempo total */
}
@keyframes og-logo-spin-hover {
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(720deg); }
}

/* Hover: realça sombras (efeito complementar ao flip) */
.og-logo-link:hover .og-logo-flip-hover,
.og-logo-link:focus-visible .og-logo-flip-hover,
.og-logo-flip-hover:hover {
  filter:
    drop-shadow(0 5px 6px rgba(0, 0, 0, 0.6))
    drop-shadow(0 14px 26px rgba(0, 0, 0, 0.45))
    drop-shadow(0 0 32px rgba(255, 170, 70, 0.45));
}

@media (prefers-reduced-motion: reduce) {
  .og-logo-flip-hover img {
    animation: none !important;
  }
}

.icon-btn {
  position: relative;
  display: inline-flex;
  min-width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: rgba(244, 239, 229, 0.88);
  border: 1px solid rgba(214, 168, 79, 0.14);
  background: rgba(255, 255, 255, 0.045);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  touch-action: manipulation;
}

.icon-btn:hover {
  color: #fff;
  border-color: rgba(214, 168, 79, 0.35);
  background: rgba(214, 168, 79, 0.1);
}

.icon-btn:active,
.mobile-wa-btn:active {
  transform: scale(0.97);
}

.mobile-wa-btn {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 12px;
  padding: 0 0.72rem;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 850;
  line-height: 1;
  background: linear-gradient(135deg, #25d366 0%, #16b957 100%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 12px 24px -14px rgba(37, 211, 102, 0.95),
    inset 0 1px 0 rgba(255, 255, 255, 0.26);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.16);
  touch-action: manipulation;
}

.mobile-wa-btn:hover {
  background: linear-gradient(135deg, #2ee174 0%, #1ebe5b 100%);
}

@media (max-width: 359px) {
  .mobile-wa-btn {
    width: 44px;
    padding: 0;
  }

  .mobile-wa-btn span {
    display: none;
  }
}
</style>
