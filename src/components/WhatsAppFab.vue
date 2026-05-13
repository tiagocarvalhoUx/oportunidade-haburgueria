<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { X } from 'lucide-vue-next';
import WhatsAppIcon from './icons/WhatsAppIcon.vue';

const props = defineProps<{ hidden?: boolean }>();
defineEmits<{ (e: 'click'): void }>();

const NUDGE_KEY = 'ogs_wa_nudge_dismissed';
const showNudge = ref(false);
let nudgeTimer: number | undefined;

onMounted(() => {
  if (typeof window === 'undefined') return;
  if (window.localStorage.getItem(NUDGE_KEY) === '1') return;
  nudgeTimer = window.setTimeout(() => {
    if (!props.hidden) showNudge.value = true;
  }, 4500);
});

onUnmounted(() => {
  if (nudgeTimer) window.clearTimeout(nudgeTimer);
});

function dismissNudge(e: Event) {
  e.stopPropagation();
  showNudge.value = false;
  try {
    window.localStorage.setItem(NUDGE_KEY, '1');
  } catch {
    /* localStorage may be blocked; ignore */
  }
}

function handleClick() {
  showNudge.value = false;
  try {
    window.localStorage.setItem(NUDGE_KEY, '1');
  } catch {
    /* ignore */
  }
}
</script>

<template>
  <div
    v-show="!hidden"
    class="wa-fab-root"
    :class="{ 'wa-fab-root--nudging': showNudge }"
  >
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showNudge"
        class="wa-fab-nudge"
        role="status"
        aria-live="polite"
      >
        <p class="wa-fab-nudge__title">Tire suas dúvidas agora</p>
        <p class="wa-fab-nudge__text">
          Resposta rápida pelo WhatsApp — fotos, valores e disponibilidade.
        </p>
        <button
          type="button"
          class="wa-fab-nudge__close"
          aria-label="Dispensar mensagem"
          @click="dismissNudge"
        >
          <X class="w-3.5 h-3.5" />
        </button>
        <span class="wa-fab-nudge__tail" aria-hidden="true" />
      </div>
    </Transition>

    <button
      type="button"
      class="wa-fab"
      aria-label="Conversar pelo WhatsApp"
      @click="handleClick(); $emit('click')"
    >
      <span class="wa-fab__ring" aria-hidden="true" />
      <span class="wa-fab__ring wa-fab__ring--delay" aria-hidden="true" />

      <WhatsAppIcon class="wa-fab__icon" />
    </button>

    <span class="wa-fab__label">Fale com a gente</span>
  </div>
</template>

<style scoped>
.wa-fab-root {
  position: fixed;
  right: 1.25rem;
  bottom: max(1.5rem, env(safe-area-inset-bottom));
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .wa-fab-root {
    right: 1.75rem;
    bottom: max(1.75rem, env(safe-area-inset-bottom));
  }
}

.wa-fab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 9999px;
  background: #25d366;
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 14px 28px -6px rgba(37, 211, 102, 0.55),
    0 6px 14px -4px rgba(0, 0, 0, 0.35);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
  outline: none;
  order: 2;
}

@media (min-width: 768px) {
  .wa-fab {
    width: 64px;
    height: 64px;
  }
}

.wa-fab:hover {
  background: #1ebe5b;
  transform: translateY(-2px) scale(1.04);
  box-shadow:
    0 18px 36px -6px rgba(37, 211, 102, 0.7),
    0 10px 20px -6px rgba(0, 0, 0, 0.4);
}

.wa-fab:active {
  transform: translateY(0) scale(0.96);
}

.wa-fab:focus-visible {
  box-shadow:
    0 0 0 4px rgba(37, 211, 102, 0.35),
    0 14px 28px -6px rgba(37, 211, 102, 0.6);
}

.wa-fab__icon {
  width: 30px;
  height: 30px;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.25));
}

.wa-fab__ring {
  position: absolute;
  inset: -2px;
  border-radius: 9999px;
  background: rgba(37, 211, 102, 0.55);
  z-index: 1;
  animation: waPulse 2.4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
  pointer-events: none;
}

.wa-fab__ring--delay {
  animation-delay: 1.2s;
}

@keyframes waPulse {
  0% {
    transform: scale(1);
    opacity: 0.55;
  }
  80% {
    opacity: 0;
  }
  100% {
    transform: scale(1.9);
    opacity: 0;
  }
}

.wa-fab__label {
  display: none;
  order: 1;
  background: rgba(13, 13, 13, 0.92);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 214, 10, 0.25);
  backdrop-filter: blur(6px);
  white-space: nowrap;
  opacity: 0;
  transform: translateX(8px);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
  pointer-events: none;
}

@media (min-width: 768px) and (hover: hover) {
  .wa-fab-root {
    display: inline-flex;
  }
  .wa-fab-root .wa-fab__label {
    display: inline-block;
  }
  .wa-fab-root:hover .wa-fab__label,
  .wa-fab:focus-visible ~ .wa-fab__label {
    opacity: 1;
    transform: translateX(0);
  }
}

.wa-fab-nudge {
  position: absolute;
  bottom: calc(100% + 14px);
  right: 0;
  width: min(78vw, 260px);
  background: #ffffff;
  color: #1a1a1a;
  border-radius: 14px;
  padding: 0.85rem 2rem 0.85rem 0.95rem;
  box-shadow:
    0 18px 40px -10px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(37, 211, 102, 0.25);
  font-family: inherit;
}

.wa-fab-nudge__title {
  font-weight: 700;
  font-size: 0.9rem;
  color: #075e54;
  line-height: 1.2;
  margin-bottom: 2px;
}

.wa-fab-nudge__text {
  font-size: 0.78rem;
  color: #4a4a4a;
  line-height: 1.35;
}

.wa-fab-nudge__close {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 9999px;
  background: rgba(0, 0, 0, 0.06);
  color: #555;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.wa-fab-nudge__close:hover {
  background: rgba(0, 0, 0, 0.12);
}

.wa-fab-nudge__tail {
  position: absolute;
  bottom: -6px;
  right: 22px;
  width: 14px;
  height: 14px;
  background: #ffffff;
  transform: rotate(45deg);
  box-shadow: 1px 1px 0 0 rgba(37, 211, 102, 0.25);
}

@media (prefers-reduced-motion: reduce) {
  .wa-fab,
  .wa-fab__label {
    transition: none;
  }
  .wa-fab__ring {
    animation: none;
    opacity: 0;
  }
}
</style>
