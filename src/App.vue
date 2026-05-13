<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import ScrollProgress from './components/ScrollProgress.vue';
import HeroSection from './components/HeroSection.vue';
import CategoryFilter from './components/CategoryFilter.vue';
import CatalogSection from './components/CatalogSection.vue';
import PromotionsSection from './components/PromotionsSection.vue';
import TrustNotices from './components/TrustNotices.vue';
import AboutSection from './components/AboutSection.vue';
import CartModal from './components/CartModal.vue';
import AppFooter from './components/AppFooter.vue';
import WhatsAppFab from './components/WhatsAppFab.vue';
import WhatsAppButton from './components/WhatsAppButton.vue';

import { useCart } from './composables/useCart';
import { products, categories, testimonials, promotions } from './data/products';
import type { Product, ProductCategory } from './types';
import { openWhatsApp, generateBatchInterestMessage } from './utils/whatsapp';

const activeCategory = ref<ProductCategory>('all');
const cartOpen = ref(false);
const { items, total, count, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

function handleAddToList(product: Product) {
  addToCart(product, 1);
  cartOpen.value = true;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function openGeneralWhatsApp() {
  openWhatsApp(
    'Olá! Vi a página de equipamentos da hamburgueria e gostaria de consultar disponibilidade, fotos e valores.',
  );
}

function openPackageWhatsApp() {
  openWhatsApp(
    'Olá! Tenho interesse em montar um pacote com vários equipamentos. Pode me enviar a lista atualizada com valores e condições para compra em conjunto?',
  );
}

function handleFinishOrder(name: string) {
  if (items.value.length === 0) return;
  openWhatsApp(generateBatchInterestMessage(items.value, name));
  clearCart();
  cartOpen.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-coal text-ice overflow-x-hidden">
    <ScrollProgress />
    <AppHeader
      :cart-item-count="count"
      @cart-click="cartOpen = true"
      @whatsapp-click="openGeneralWhatsApp"
    />

    <main>
      <HeroSection
        @view-catalog="scrollTo('equipamentos')"
        @whatsapp="openGeneralWhatsApp"
      />

      <section
        class="sticky top-[68px] z-20 bg-coal/95 backdrop-blur-md border-b border-cheese/10 py-3"
      >
        <div class="max-w-7xl mx-auto px-4 overflow-x-auto">
          <CategoryFilter
            :categories="categories"
            :active-category="activeCategory"
            @change="(c) => (activeCategory = c)"
          />
        </div>
      </section>

      <CatalogSection
        :products="products"
        :active-category="activeCategory"
        @add-to-list="handleAddToList"
      />

      <PromotionsSection
        :promotions="promotions"
        @whatsapp-package="openPackageWhatsApp"
      />

      <TrustNotices :testimonials="testimonials" />

      <AboutSection />

      <!-- CTA final -->
      <section
        id="contato"
        class="py-24 bg-gradient-to-br from-coal via-burger-dark to-coal text-center px-4"
      >
        <h2 class="text-3xl md:text-5xl font-bold text-ice font-heading mb-4">
          Equipamentos comerciais com
          <span class="text-white">preço de oportunidade</span>
        </h2>
        <p class="text-lg text-white max-w-2xl mx-auto mb-8 leading-relaxed">
          Fale agora pelo WhatsApp, consulte disponibilidade e negocie direto com o vendedor.
        </p>
        <WhatsAppButton
          size="lg"
          label="Negociar agora"
          subtitle="Resposta rápida no WhatsApp"
          @click="openGeneralWhatsApp"
        />
      </section>

      <AppFooter />
    </main>

    <CartModal
      :open="cartOpen"
      :items="items"
      :total="total"
      @close="cartOpen = false"
      @remove="removeFromCart"
      @update-quantity="updateQuantity"
      @finish="handleFinishOrder"
    />

    <WhatsAppFab :hidden="cartOpen" @click="openGeneralWhatsApp" />
  </div>
</template>

