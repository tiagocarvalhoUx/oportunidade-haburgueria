<script setup lang="ts">
import { computed, ref } from 'vue';
import AppHeader from './components/AppHeader.vue';
import ScrollProgress from './components/ScrollProgress.vue';
import TrustBand from './components/TrustBand.vue';
import HeroSection from './components/HeroSection.vue';
import CategoryFilter from './components/CategoryFilter.vue';
import HowItWorks from './components/HowItWorks.vue';
import CatalogSection from './components/CatalogSection.vue';
import PromotionsSection from './components/PromotionsSection.vue';
import TestimonialsSection from './components/TestimonialsSection.vue';
import AboutSection from './components/AboutSection.vue';
import TransparencySection from './components/TransparencySection.vue';
import CartModal from './components/CartModal.vue';
import AppFooter from './components/AppFooter.vue';
import WhatsAppFab from './components/WhatsAppFab.vue';
import WhatsAppButton from './components/WhatsAppButton.vue';

import { useCart } from './composables/useCart';
import { products, categories, testimonials, promotions } from './data/products';
import type { Product, ProductCategory } from './types';
import { openWhatsApp, generateBatchInterestMessage } from './utils/whatsapp';

const activeCategory = ref<ProductCategory>('all');

const categoryCounts = computed<Record<string, number>>(() => {
  const counts: Record<string, number> = { all: products.length };
  counts.vendidos = products.filter((p) => p.status === 'vendido').length;
  counts.promocoes = products.filter((p) => p.isPromotion || !!p.badge).length;
  for (const p of products) {
    if (p.category && p.category !== 'all') {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
  }
  return counts;
});

function handleCategoryChange(category: ProductCategory) {
  activeCategory.value = category;
  requestAnimationFrame(() => {
    const el = document.getElementById('equipamentos');
    if (!el) return;
    const headerOffset = 140;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}
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

    <TrustBand />

    <main>
      <HeroSection
        @view-catalog="scrollTo('equipamentos')"
        @whatsapp="openGeneralWhatsApp"
      />

      <section
        class="sticky top-16 lg:top-20 z-20 bg-coal/95 backdrop-blur-md border-b border-cheese/10 py-3"
      >
        <CategoryFilter
          :categories="categories"
          :active-category="activeCategory"
          :counts="categoryCounts"
          @change="handleCategoryChange"
        />
      </section>

      <HowItWorks @whatsapp="openGeneralWhatsApp" />

      <CatalogSection
        :products="products"
        :active-category="activeCategory"
        @add-to-list="handleAddToList"
      />

      <PromotionsSection
        :promotions="promotions"
        @whatsapp-package="openPackageWhatsApp"
      />

      <TestimonialsSection :testimonials="testimonials" />

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

      <TransparencySection />

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

