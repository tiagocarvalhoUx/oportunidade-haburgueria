<script setup lang="ts">
import { PackageCheck, BadgePercent, MapPin, MessageSquare } from 'lucide-vue-next';

const notes = [
  { icon: PackageCheck, title: 'Estoque rotativo',         body: 'Confirmamos disponibilidade no momento do contato.' },
  { icon: BadgePercent, title: 'Preço aberto e negociável', body: 'Trabalhamos com transparência de valor.' },
  { icon: MapPin,       title: 'Retirada agendada',         body: 'Horário marcado em Araçatuba/SP.' },
  { icon: MessageSquare, title: 'Reserva pelo WhatsApp',    body: 'Reservas confirmadas via mensagem.' },
];
</script>

<template>
  <section class="bg-burger-dark py-14 border-t border-cheese/10">
    <div class="max-w-5xl mx-auto px-4">
      <h2 class="text-sm font-semibold text-white/65 uppercase tracking-wide text-center mb-6">
        Como trabalhamos
      </h2>
      <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <li
          v-for="(note, idx) in notes"
          :key="idx"
          class="surface-card p-4 flex items-start gap-3"
        >
          <component :is="note.icon" class="w-5 h-5 text-cheese shrink-0 mt-0.5" />
          <div class="leading-snug">
            <p class="font-semibold text-ice text-sm">{{ note.title }}</p>
            <p class="text-white/70 text-xs mt-0.5">{{ note.body }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
