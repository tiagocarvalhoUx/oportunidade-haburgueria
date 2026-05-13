<script setup lang="ts">
import WhatsAppIcon from './icons/WhatsAppIcon.vue';

withDefaults(
  defineProps<{
    label: string;
    subtitle?: string;
    size?: 'sm' | 'md' | 'lg';
    block?: boolean;
    showOnline?: boolean;
    disabled?: boolean;
  }>(),
  {
    size: 'md',
    block: false,
    showOnline: true,
    disabled: false,
  },
);

defineEmits<{ (e: 'click', ev: MouseEvent): void }>();
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :class="['wa-btn', `wa-btn--${size}`, { 'wa-btn--block': block }]"
    :aria-label="`${label}${subtitle ? ' — ' + subtitle : ''} (abre WhatsApp)`"
    @click="(ev) => $emit('click', ev)"
  >
    <span class="wa-btn__icon-wrap">
      <WhatsAppIcon class="wa-btn__icon" />
      <span v-if="showOnline" class="wa-btn__online" aria-hidden="true"></span>
    </span>

    <span class="wa-btn__labels">
      <span class="wa-btn__title">{{ label }}</span>
      <span v-if="subtitle" class="wa-btn__subtitle">{{ subtitle }}</span>
    </span>

    <span class="wa-btn__shine" aria-hidden="true"></span>
  </button>
</template>

<style scoped>
.wa-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  border-radius: 12px;
  font-weight: 800;
  white-space: nowrap;
  color: #ffffff;
  background: linear-gradient(135deg, #25d366 0%, #1ebe5b 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 14px 30px -12px rgba(37, 211, 102, 0.85),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  transition:
    transform 0.2s ease,
    box-shadow 0.25s ease,
    background-color 0.2s ease;
}

.wa-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.3) 0%, transparent 40%);
  opacity: 0.7;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
}

.wa-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 22px 44px -14px rgba(37, 211, 102, 1),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.wa-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.wa-btn:focus-visible {
  outline: 3px solid rgba(255, 214, 10, 0.85);
  outline-offset: 3px;
}

.wa-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Sizes */
.wa-btn--sm {
  padding: 0.5rem 0.95rem;
  min-height: 40px;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.wa-btn--sm .wa-btn__icon {
  width: 18px;
  height: 18px;
}

.wa-btn--sm .wa-btn__title {
  font-size: 0.85rem;
}

.wa-btn--sm .wa-btn__subtitle {
  font-size: 0.6rem;
}

.wa-btn--md {
  padding: 0.75rem 1.1rem;
  min-height: 52px;
  font-size: 0.95rem;
}

.wa-btn--md .wa-btn__icon {
  width: 22px;
  height: 22px;
}

.wa-btn--lg {
  padding: 1rem 1.6rem;
  min-height: 62px;
  font-size: 1.05rem;
  border-radius: 14px;
  gap: 0.85rem;
}

.wa-btn--lg .wa-btn__icon {
  width: 28px;
  height: 28px;
}

.wa-btn--lg .wa-btn__title {
  font-size: 1.1rem;
}

.wa-btn--lg .wa-btn__subtitle {
  font-size: 0.72rem;
}

.wa-btn--block {
  width: 100%;
  display: flex;
}

/* Labels */
.wa-btn__labels {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.05;
  text-align: left;
}

.wa-btn__title {
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.wa-btn__subtitle {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.85;
  margin-top: 3px;
}

/* Icon + online dot */
.wa-btn__icon-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.wa-btn__icon {
  transition: transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1);
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.25));
}

.wa-btn:hover:not(:disabled) .wa-btn__icon {
  transform: translateX(2px) scale(1.08);
}

.wa-btn__online {
  position: absolute;
  top: -2px;
  right: -3px;
  width: 9px;
  height: 9px;
  border-radius: 9999px;
  background: #34ff9c;
  border: 2px solid #1ebe5b;
  animation: waBtnPulse 2s ease-out infinite;
}

@keyframes waBtnPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 255, 156, 0.65);
  }
  70% {
    box-shadow: 0 0 0 7px rgba(52, 255, 156, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 255, 156, 0);
  }
}

/* Shine sweep */
.wa-btn__shine {
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    100deg,
    transparent 0%,
    rgba(255, 255, 255, 0.38) 50%,
    transparent 100%
  );
  transform: skewX(-20deg);
  pointer-events: none;
  z-index: -1;
}

.wa-btn:hover:not(:disabled) .wa-btn__shine {
  animation: waBtnShine 0.9s ease-out;
}

@keyframes waBtnShine {
  0% {
    left: -75%;
  }
  100% {
    left: 125%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wa-btn,
  .wa-btn__icon,
  .wa-btn__online,
  .wa-btn__shine {
    animation: none !important;
    transition: none !important;
  }
}
</style>
