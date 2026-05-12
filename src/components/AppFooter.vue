<script setup lang="ts">
import { MapPin, Phone, Clock, Instagram, MessageCircle, Store } from 'lucide-vue-next';
import { WHATSAPP_NUMBER } from '../utils/whatsapp';

const year = new Date().getFullYear();

const contactInfo = [
  { icon: MapPin, label: 'Localização', value: 'Araçatuba, SP' },
  { icon: Phone, label: 'WhatsApp', value: '(18) 98114-2927' },
  { icon: Clock, label: 'Atendimento', value: 'Seg-Sáb: 9h às 19h' },
];

const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}`;
</script>

<template>
  <footer class="bg-burger-dark text-ice border-t border-cheese/10">
    <div class="max-w-7xl mx-auto px-4 py-14">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div
              class="grid h-10 w-10 place-items-center rounded-lg bg-cheese/15 text-cheese ring-1 ring-cheese/25"
            >
              <Store class="h-5 w-5" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-ice font-heading">Liquidação de Hamburgueria</h3>
              <p class="text-xs text-white/80">Equipamentos e móveis comerciais</p>
            </div>
          </div>
          <p class="text-white text-base leading-relaxed">
            Equipamentos comerciais usados e seminovos com preços de oportunidade. Negocie direto
            pelo WhatsApp.
          </p>
          <p class="text-sm text-white/70 mt-3 italic">
            * Itens sujeitos à disponibilidade.
          </p>
        </div>

        <div>
          <h4 class="text-base font-bold text-ice font-heading mb-4">Contato</h4>
          <ul class="space-y-3">
            <li
              v-for="(info, idx) in contactInfo"
              :key="idx"
              class="flex items-start gap-3"
            >
              <div class="p-2 bg-cheese/10 rounded-lg">
                <component :is="info.icon" class="w-4 h-4 text-cheese" />
              </div>
              <div>
                <p class="text-xs font-semibold text-white/60 uppercase">{{ info.label }}</p>
                <p class="text-base text-white mt-0.5">{{ info.value }}</p>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-base font-bold text-ice font-heading mb-4">Redes</h4>
          <div class="flex gap-3">
            <a
              :href="whatsappLink"
              target="_blank"
              rel="noopener"
              aria-label="WhatsApp"
              class="p-3 bg-coal rounded-full text-ice hover:bg-whatsapp hover:text-burger-dark transition-colors"
            >
              <MessageCircle class="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              class="p-3 bg-coal rounded-full text-ice hover:bg-cheese hover:text-burger-dark transition-colors"
            >
              <Instagram class="w-5 h-5" />
            </a>
          </div>
          <p class="text-sm text-white/70 mt-5 leading-relaxed">
            Receba fotos, vídeos e medidas dos equipamentos pelo WhatsApp.
          </p>
        </div>
      </div>

      <div
        class="flex flex-col md:flex-row items-center justify-between gap-3 pt-6 border-t border-cheese/10 text-xs text-white/60"
      >
        <p>© {{ year }} Liquidação de Hamburgueria. Todos os direitos reservados.</p>
        <p>Itens usados/seminovos · Valores negociáveis · Retirada combinada</p>
      </div>
    </div>
  </footer>
</template>
