<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { X } from 'lucide-vue-next';

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

      <svg
        class="wa-fab__icon"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.495-1.318.13-.302.245-.66.245-1.005 0-.057 0-.115-.014-.158-.1-.172-2.378-1.39-2.71-1.39zm-2.92 7.063h-.014c-1.69-.014-3.353-.515-4.78-1.404l-3.413.99.946-3.31a8.673 8.673 0 0 1-1.575-5.013c.014-4.83 3.94-8.756 8.83-8.756 2.395 0 4.624.93 6.314 2.62a8.792 8.792 0 0 1 2.617 6.207c-.014 4.83-3.94 8.755-8.844 8.755v-.09zm7.485-16.27c-1.96-1.978-4.604-3.066-7.515-3.066-6.026 0-10.93 4.904-10.94 10.93a10.96 10.96 0 0 0 1.474 5.514L5 26.94l5.667-1.49a10.7 10.7 0 0 0 5.222 1.318h.007c6.026 0 10.93-4.904 10.945-10.93 0-2.91-1.13-5.654-3.166-7.62v-.22z"
        />
      </svg>
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
