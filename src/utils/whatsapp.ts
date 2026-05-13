import { CartItem, Product } from '../types/index';

export const WHATSAPP_NUMBER = '5518981142927';

function formatPrice(product: Product): string {
  if (
    typeof product.minPrice === 'number' &&
    typeof product.maxPrice === 'number' &&
    product.maxPrice > 0
  ) {
    const fmt = (v: number) =>
      `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    return `${fmt(product.minPrice)} a ${fmt(product.maxPrice)} (negociável)`;
  }
  if (product.price > 0) return `R$ ${product.price.toFixed(2)}`;
  return product.priceLabel || 'A consultar';
}

export function generateProductInterestMessage(product: Product): string {
  return [
    'Olá, tenho interesse no equipamento abaixo:',
    '',
    `Produto: ${product.name}`,
    `Valor: ${formatPrice(product)}`,
    `Estado: ${product.condition}`,
    '',
    'Ainda está disponível? Gostaria de mais fotos e informações.',
  ].join('\n');
}

export function generateBatchInterestMessage(items: CartItem[], customerName?: string): string {
  const lines = items
    .map((item) => {
      const price = item.product.price > 0
        ? `R$ ${(item.product.price * item.quantity).toFixed(2)}`
        : item.product.priceLabel || 'A consultar';
      return `• ${item.quantity}x ${item.product.name} - ${price} (${item.product.condition})`;
    })
    .join('\n');

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const totalLine = total > 0
    ? `\nTotal estimado: R$ ${total.toFixed(2)} (sujeito a negociação)`
    : '\nValores a consultar.';

  let msg = 'Olá! Tenho interesse nos seguintes equipamentos:\n\n';
  msg += lines;
  msg += totalLine + '\n\n';
  if (customerName) msg += `Nome: ${customerName}\n`;
  msg += 'Pode confirmar disponibilidade e melhor condição? Tenho interesse em fechar pacote.';
  return msg;
}

export function generateGenericMessage(text: string): string {
  return text;
}

export function openWhatsApp(message: string): void {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export function openProductWhatsApp(product: Product): void {
  openWhatsApp(generateProductInterestMessage(product));
}

export function openGenericWhatsApp(text: string): void {
  openWhatsApp(text);
}

