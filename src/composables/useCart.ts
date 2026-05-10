import { ref, computed } from 'vue';
import type { CartItem, Product } from '../types';

const items = ref<CartItem[]>([]);

export function useCart() {
  const addToCart = (product: Product, quantity = 1) => {
    const existing = items.value.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.value.push({ product, quantity });
    }
  };

  const removeFromCart = (productId: string) => {
    items.value = items.value.filter((i) => i.product.id !== productId);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = items.value.find((i) => i.product.id === productId);
    if (item) item.quantity = quantity;
  };

  const clearCart = () => {
    items.value = [];
  };

  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  );

  const count = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0),
  );

  return {
    items,
    total,
    count,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
